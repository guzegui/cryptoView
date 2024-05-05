import moment from "moment";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TickerTable from "../components/TickerTable";
import urlStrings from "../../urls.json";

function HomePage({
  tableInfo,
  addCommasToThousands,
  user,
  formatPrice,
  capitalizeFirstLetter,
  alertMessage,
  setShowAlerts,
  showAlerts,
  setAlertInfo,
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
          setShowAlerts(true);
          setAlertInfo({ type: "tickerBalance" });
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
    let conversion;
    if (selectedCurrency === "dollars") {
      conversion = (tradeAmount / coin.priceUsd).toFixed(8);
    } else {
      const currency = data.find((element) => element.id === selectedCurrency);
      conversion = ((currency.priceUsd * tradeAmount) / coin.priceUsd).toFixed(
        8
      );
    }

    return conversion;
  }

  const makeTrade = (url, updatedUser) => {
    axios
      .put(url, updatedUser)
      .then(() => {
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  // Function to handle trade form submission
  function handleTradeSubmit(e, coinId) {
    e.preventDefault();
    // Check if the trade amount is greater than the available balance

    if (parseFloat(tradeData.fromCoinAmount) <= 0) {
      setShowAlerts(true);
      setAlertInfo({ type: "noBalance" });
      return;
    }

    if (
      parseFloat(tradeData.fromCoinAmount) ==
      testUser.balance[tradeData.fromCoin]
    ) {
      // Create a copy of the user's balance object
      const updatedBalance = { ...testUser.balance };

      // Remove the entry corresponding to the spent currency
      delete updatedBalance[tradeData.fromCoin];

      // Update user in localStorage
      const updatedUser = {
        ...testUser,
        balance: updatedBalance,
      };

      // Make the Axios request to update the user's balance with the updated balance object
      makeTrade(`${urlStrings.jsonServer}/${testUser.id}`, updatedUser);
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

      makeTrade(`${urlStrings.jsonServer}/${testUser.id}`, updatedUser);

      // Reset trade amount and hide trade form
      setTradeData({
        fromCoin: Object.keys(testUser.balance)[0],
        toCoin: "",
        availableBalance: "",
        tradeAmount: "",
      });
    }

    setTradeFormVisible({ isTrading: false, id: "" });
    navigate(`/ticker`);
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
            return sortConfig.direction === "ascending"
              ? a[sortConfig.key].localeCompare(b[sortConfig.key])
              : b[sortConfig.key].localeCompare(a[sortConfig.key]);
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

  return (
    <div>
      {localTime == "Invalid date" ? (
        <p>Loading...</p>
      ) : (
        <>
          <TickerTable
            localTime={localTime}
            data={data}
            sortConfig={sortConfig}
            handleClick={handleClick}
            sortedData={sortedData}
            testUser={testUser}
            loggedInUser={loggedInUser}
            isTrading={isTrading}
            tradeData={tradeData}
            handleInputChange={handleInputChange}
            calculateAmount={calculateAmount}
            handleTradeSubmit={handleTradeSubmit}
            tradeButtonClick={tradeButtonClick}
            capitalizeFirstLetter={capitalizeFirstLetter}
            formatPrice={formatPrice}
            addCommasToThousands={addCommasToThousands}
            alertMessage={alertMessage}
            setShowAlerts={setShowAlerts}
            showAlerts={showAlerts}
            setAlertInfo={setAlertInfo}
          />
        </>
      )}
    </div>
  );
}

export default HomePage;
