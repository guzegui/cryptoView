import PropTypes from "prop-types";
import moment from "moment";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const jsonServer = "http://localhost:3000/users";

function HomePage({ tableInfo, previousTableInfo, addCommasToThousands }) {
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
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
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

  function formatPrice(price) {
    // Separate integer and decimal parts
    const [integerPart, decimalPart] = price.split(".");

    const formattedIntegerPart = addCommasToThousands(integerPart);

    // Separate first two decimals from the rest
    const firstTwoDecimals = decimalPart.slice(0, 2);
    const restDecimals = decimalPart.slice(2);

    // Return formatted price parts as React elements, with reference to custom CSS classes in index.css
    return (
      <span>
        <span className="integer">{formattedIntegerPart}</span>.
        <span className="decimal">{firstTwoDecimals}</span>
        <span className="small-decimal">{restDecimals}</span>
      </span>
    );
  }

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
    } else if (
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
    setTradeFormVisible({ isTrading: false, id: "" });
    navigate(`/`);
  }

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
      <p>
        Last updated on {localTime} - Powered by&nbsp;
        <a href="https://coincap.io/" target="_blank" rel="noopener noreferrer">
          coincap.io
        </a>
      </p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Symbol</th>
            <th>Price in USD</th>
            <th>Volume</th>
            <th>% Change in 24h</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((coin) => {
              return (
                <tr key={coin.id}>
                  <td>{coin.rank}</td>
                  <td style={{ textDecoration: "none", color: "inherit" }}>
                    <a
                      href={coin.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {coin.symbol}
                    </a>
                  </td>
                  <td className="price">{formatPrice(coin.priceUsd)}</td>
                  <td>{parseFloat(coin.volumeUsd24Hr).toFixed(2)}</td>
                  <td
                    className={
                      coin.changePercent24Hr < 0
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {parseFloat(coin.changePercent24Hr).toFixed(2)}
                  </td>
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
                </tr>
              );
            })}
        </tbody>
      </table>
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
