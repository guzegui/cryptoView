import PropTypes from "prop-types";
import moment from "moment";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SortIcon from "@mui/icons-material/Sort";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const jsonServer = "http://localhost:3000/users";

function HomePage({
  tableInfo,
  previousTableInfo,
  addCommasToThousands,
  user,
  formatPrice, capitalizeFirstLetter
}) {
  const { data } = tableInfo;
  const { timestamp } = tableInfo;
  const localTime = moment
    .unix(timestamp / 1000)
    .format("MMMM Do YYYY, h:mm:ss a");
  // State to manage trade form visibility, trade amount, and selected currency
  const [tradeFormVisible, setTradeFormVisible] = useState({
    isTrading: false,
    id: "",
  });
  const loggedInUser = user;
  const navigate = useNavigate();

  // Sample user data for testing
  const testUser = loggedInUser
    ? loggedInUser
    : {
        id: "b450",
        username: "asdfasd",
        email: "asdfasdf",
        password: "asdfasdf",
        balance: {
          dollars: 100,
        },
      };

  const [tradeData, setTradeData] = useState({
    fromCoin: Object.keys(testUser.balance)[0],
    toCoin: "",
    availableBalance: Object.values(testUser.balance)[0],
    fromCoinAmount: 0,
    toCoinAmount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "fromCoinAmount" || name === "fromCoin") {
      const toCoin = data.find((element) => element.id === tradeFormVisible.id);

      if (name === "fromCoinAmount") {
        if (value > testUser.balance[tradeData.fromCoin]) {
          alert("You don't have enough balance!");
          setTradeData({
            ...tradeData,
            tradeAmount: value - 1,
          });
          return;
        } else {
          const toCoinAmount = calculateAmount(
            tradeData.fromCoin,
            toCoin,
            value
          );
          setTradeData({
            ...tradeData,
            fromCoinAmount: value,
            toCoinAmount: toCoinAmount,
            toCoin: toCoin.id,
          });
        }
      } else {
        const toCoinAmount = calculateAmount(
          value,
          toCoin,
          tradeData.fromCoinAmount
        );
        setTradeData({
          ...tradeData,
          fromCoin: value,
          toCoinAmount: toCoinAmount,
          toCoin: toCoin.id,
        });
      }
    }
  };

  function tradeButtonClick(coinId) {
    setTradeFormVisible({ isTrading: true, id: coinId });
  }

  function isTrading(coinId) {
    return tradeFormVisible.id === coinId && tradeFormVisible.isTrading;
  }

  function calculateAmount(selectedCurrency, coin, tradeAmount) {
    console.log(tradeAmount);
    console.log(selectedCurrency);
    let conversion;
    if (selectedCurrency === "dollars") {
      conversion = (tradeAmount / coin.priceUsd).toFixed(8);
    } else {
      const currency = data.find((element) => element.id === selectedCurrency);

      /*
        setTradeData({
      ...tradeData,
      [name]: value,
    });
      */
      conversion = ((currency.priceUsd * tradeAmount) / coin.priceUsd).toFixed(
        8
      );
    }
    // setTradeData({
    //   ...tradeData,
    //   toCoinAmount: conversion,
    //   toCoin: coin,
    // });
    return conversion;
  }

  // Function to handle trade form submission
  function handleTradeSubmit(e, coinId) {
    e.preventDefault();
    // Check if the trade amount is greater than the available balance
    if (
      parseFloat(tradeData.fromCoinAmount) >
      testUser.balance[tradeData.fromCoin]
    ) {
      alert("You don't have enough balance!");
      return;
    } else {
      // Throw alert with trading info
      alert(
        `You are trading ${tradeData.fromCoinAmount} ${
          tradeData.fromCoin
        } for ${tradeData.toCoinAmount} ${
          tradeData.toCoin
        }. After this trade, you'll have ${
          testUser.balance[tradeData.fromCoin] - tradeData.fromCoinAmount
        } ${tradeData.fromCoin} and ${
          testUser.balance[tradeData.toCoin] +
          parseFloat(tradeData.toCoinAmount)
        } ${tradeData.toCoin} left`
      );
      if (
        parseFloat(tradeData.fromCoinAmount) ==
        testUser.balance[tradeData.fromCoin]
      ) {
        console.log("You ran out of moolah!!");
        // Create a copy of the user's balance object
        const updatedBalance = { ...testUser.balance };

        // Remove the entry corresponding to the spent currency
        delete updatedBalance[tradeData.fromCoin];

        // Make the Axios request to update the user's balance with the updated balance object
        axios
          .put(`${jsonServer}/${testUser.id}`, {
            ...testUser,
            balance: updatedBalance,
          })
          .then((response) => {
            // Handle success response
            console.log(
              "Currency entry deleted from balance:",
              tradeData.fromCoin
            );
            // Update user in localStorage
            const updatedUser = {
              ...testUser,
              balance: updatedBalance,
            };
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
          })
          .catch((error) => {
            // Handle error
            console.log("Error deleting currency entry:", error);
          });
      } else {
        // Perform trade logic here

        let updatedUser = {};

        // If toCoin exists, then update the value
        if (Object.keys(testUser.balance).some((e) => e == tradeData.toCoin)) {
          updatedUser = {
            ...testUser,
            balance: {
              ...testUser.balance,
              [coinId]:
                testUser.balance[coinId] + parseFloat(tradeData.toCoinAmount),
              [tradeData.fromCoin]:
                testUser.balance[tradeData.fromCoin] - tradeData.fromCoinAmount,
            },
          };
        } else {
          // Otherwise, create new entry and initialize with the toCoinAmount
          updatedUser = {
            ...testUser,
            balance: {
              ...testUser.balance,
              [tradeData.toCoin]: parseFloat(tradeData.toCoinAmount),
              [tradeData.fromCoin]:
                testUser.balance[tradeData.fromCoin] - tradeData.fromCoinAmount,
            },
          };
        }

        axios
          .put(`${jsonServer}/${testUser.id}`, updatedUser)
          .then((response) => {
            // Handle success response
            localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
            console.log(response.data); // Log the response data
          })
          .catch((error) => {
            // Handle error
            console.log(error); // Log the error
          });

        // Reset trade amount and hide trade form
        setTradeData({
          fromCoin: Object.keys(testUser.balance)[0],
          toCoin: "",
          availableBalance: "",
          tradeAmount: "",
        });
      }
    }
    setTradeFormVisible({ isTrading: false, id: "" });
    navigate(`/`);
  }

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleClick = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (sortConfig.key) {
      const sorted = data.sort((a, b) => {
        switch (sortConfig.key) {
          case "rank":
            return sortConfig.direction === "ascending"
              ? a[sortConfig.key] - b[sortConfig.key]
              : b[sortConfig.key] - a[sortConfig.key];
          case "id":
          case "priceUsd":
          case "changePercent24Hr":
          case "volumeUsd24Hr":
          case "priceDiff":
            return sortConfig.direction === "ascending"
              ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
              : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
          default:
            return 0;
        }
      });
      return sorted;
    }
    return data;
  };

  //   useEffect(() => {

  //     setTradeData({
  // ...tradeData,
  // toCoinAmount: (calculateAmount(
  //   tradeData.fromCoin,
  //   tradeFormVisible.id,
  //   tradeData.fromCoinAmount
  // )),
  // toCoin: tradeFormVisible.id,
  // });
  // }, [tableInfo, tradeFormVisible, tradeData]);

  return (
    <div>
      {localTime == "Invalid date" ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>
            Last updated on {localTime} - Powered by&nbsp;
            <a
              href="https://coincap.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              coincap.io
            </a>
          </p>
          <table className="table table-striped">
            <thead>
              <tr>
                <th onClick={() => handleClick("rank")}>
                  Rank
                  {sortConfig.key === "rank" &&
                    sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
                  {sortConfig.key === "rank" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownwardIcon />
                    )}
                  {sortConfig.key !== "rank" && <SortIcon />}
                </th>
                <th onClick={() => handleClick("id")}>
                  Symbol
                  {sortConfig.key === "id" &&
                    sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
                  {sortConfig.key === "id" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownwardIcon />
                    )}
                  {sortConfig.key !== "id" && <SortIcon />}
                </th>
                <th onClick={() => handleClick("priceUsd")}>
                  Price in USD
                  {sortConfig.key === "priceUsd" &&
                    sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
                  {sortConfig.key === "priceUsd" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownwardIcon />
                    )}
                  {sortConfig.key !== "priceUsd" && <SortIcon />}
                </th>
                <th onClick={() => handleClick("volumeUsd24Hr")}>
                  Volume
                  {sortConfig.key === "volumeUsd24Hr" &&
                    sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
                  {sortConfig.key === "volumeUsd24Hr" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownwardIcon />
                    )}
                  {sortConfig.key !== "volumeUsd24Hr" && <SortIcon />}
                </th>
                <th onClick={() => handleClick("changePercent24Hr")}>
                  % Change in 24h
                  {sortConfig.key === "changePercent24Hr" &&
                    sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
                  {sortConfig.key === "changePercent24Hr" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownwardIcon />
                    )}
                  {sortConfig.key !== "changePercent24Hr" && <SortIcon />}
                </th>

                <th onClick={() => handleClick("priceDiff")}>
                  Last Price Change in USD
                  {sortConfig.key === "priceDiff" &&
                    sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
                  {sortConfig.key === "priceDiff" &&
                    sortConfig.direction === "descending" && (
                      <ArrowDownwardIcon />
                    )}
                  {sortConfig.key !== "priceDiff" && <SortIcon />}
                </th>

                {loggedInUser && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sortedData() &&
                sortedData().map((coin) => {
                  return (
                    <tr key={coin.id}>
                      <td>{coin.rank}</td>
                      <td style={{ textDecoration: "none", color: "inherit" }}>
                        <a
                          href={coin.explorer}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {coin.symbol} ({capitalizeFirstLetter(coin.id)})
                        </a>
                      </td>
                      <td className="price">{formatPrice(coin.priceUsd)}</td>
                      <td>
                        {formatPrice(parseFloat(coin.volumeUsd24Hr).toFixed(2))}
                      </td>
                      <td
                        className={
                          coin.changePercent24Hr < 0
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {parseFloat(coin.changePercent24Hr).toFixed(2)} %
                      </td>
                      {!coin.priceDiff ? (
                        <td>N/A</td>
                      ) : (
                        <td
                          className={
                            coin.priceDiff < 0 ? "text-danger" : "text-success"
                          }
                        >
                          {formatPrice(coin.priceDiff.toString())}
                        </td>
                      )}
                      {loggedInUser && (
                        <td>
                          {/* Render trade button or trade form */}
                          {isTrading(coin.id) ? (
                            <form>
                              {/* Dropdown menu for selecting available currencies */}
                              <select
                                name="fromCoin"
                                value={tradeData.fromCoin}
                                onChange={handleInputChange}
                              >
                                {Object.keys(testUser.balance).map(
                                  (currency) =>
                                    currency !== coin.id && (
                                      <option key={currency} value={currency}>
                                        {currency}
                                      </option>
                                    )
                                )}
                              </select>

                              {/* Display the available balance */}
                              <div>
                                Available Balance:
                                {testUser.balance[tradeData.fromCoin] &&
                                  addCommasToThousands(
                                    testUser.balance[tradeData.fromCoin]
                                  )}
                              </div>

                              {/* Calculate the amount that the available balance would buy */}
                              <div>
                                {coin.name} Amount:
                                {calculateAmount(
                                  tradeData.fromCoin,
                                  coin,
                                  tradeData.fromCoinAmount
                                )}
                              </div>

                              {/* Input field for the trade amount */}
                              <input
                                type="number"
                                name="fromCoinAmount"
                                value={tradeData.fromCoinAmount}
                                onChange={handleInputChange}
                                placeholder="Trade amount"
                              />
                              <button
                                type="submit"
                                onClick={(e) => handleTradeSubmit(e, coin.id)}
                              >
                                Trade
                              </button>
                            </form>
                          ) : (
                            <button onClick={() => tradeButtonClick(coin.id)}>
                              Trade
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

HomePage.propTypes = {
  tableInfo: PropTypes.shape({
    id: PropTypes.number,
    rank: PropTypes.number,
    symbol: PropTypes.string,
    name: PropTypes.string,
    priceUsd: PropTypes.string,
    volumeUsd24Hr: PropTypes.string,
    marketCapUsd: PropTypes.string,
    availableSupply: PropTypes.string,
    totalSupply: PropTypes.string,
    changePercent24Hr: PropTypes.string,
    vwap24Hr: PropTypes.string,
    explorer: PropTypes.string,
    timestamp: PropTypes.number,
  }).isRequired,
  previousTableInfo: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      priceUsd: PropTypes.string,
    })
  ).isRequired,
};

export default HomePage;
