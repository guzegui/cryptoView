import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import HeroCarousel from "./components/HeroCarousel";
import Alert from "react-bootstrap/Alert";
import urlStrings from "../urls.json";

function App() {
  const [tableInfo, setTableInfo] = useState({});
  const [users, setUsers] = useState({});
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser"))
  );
  const [showAlerts, setShowAlerts] = useState(false);
  const [alertInfo, setAlertInfo] = useState({});
  const navigate = useNavigate();

  // Function to compare current data with previous data
  const findPriceChanges = (currentData, tableInfo) => {
    const newChanges = [];

    // Check if currentData is undefined or not an object
    if (!currentData || typeof currentData !== "object") {
      console.error("Invalid data format:", currentData);
      return newChanges;
    }

    if (Object.keys(tableInfo).length === 0) {
      // If previous data is empty, return empty changes array
      return [];
    }
    const coinData = currentData.data;
    const newTimestamp = moment(currentData.timestamp);
    const formattedNewTimestamp = moment(currentData.timestamp).format(
      "HH:mm:ss"
    );
    const prevTimestamp = moment(tableInfo.timestamp);
    const diffTime = newTimestamp.diff(prevTimestamp, "seconds");

    // Convert coin data object into an array

    const currentDataArray = coinData.map((coin) => ({
      id: coin.id,
      priceUsd: coin.priceUsd,
    }));

    currentDataArray.forEach((currentCoin) => {
      const previousCoin = tableInfo.data.find(
        (element) => currentCoin.id === element.id
      );
      if (previousCoin && previousCoin.priceUsd !== currentCoin.priceUsd) {
        const priceDiff =
          parseFloat(currentCoin.priceUsd) - parseFloat(previousCoin.priceUsd);

        newChanges.push({
          id: currentCoin.id,
          priceDiff,
          formattedNewTimestamp,
          diffTime,
        });
      }
    });

    return newChanges;
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const addChangesToTableInfo = (changes, tableInfo, timestamp) => {
    changes.forEach((change) => {
      const index = tableInfo.data.findIndex((coin) => coin.id === change.id);

      // If the coin is found in the tableInfo data array
      if (index !== -1) {
        // Remove the id from the change object
        const { id, ...changeInfo } = change;

        // Update the corresponding entry in the tableInfo data array
        tableInfo.data[index] = {
          ...tableInfo.data[index],
          ...changeInfo,
        };
      }
    });

    // Update the timestamp in tableInfo
    tableInfo.timestamp = timestamp;

    return tableInfo;
  };

  const fetchData = () => {
    axios
      .get(urlStrings.cryptoAPI)
      .then((response) => {
        const data = response.data;

        // If tableInfo is empty, set it to the data from the API response
        if (Object.keys(tableInfo).length === 0) {
          setTableInfo(data);
        } else {
          const newChanges = findPriceChanges(data, tableInfo);

          // Update current data if there are changes
          if (newChanges.length > 0) {
            setTableInfo((prevTableInfo) => {
              const updatedTableInfo = addChangesToTableInfo(
                newChanges,
                {
                  ...prevTableInfo,
                },
                data.timestamp
              );
              return updatedTableInfo;
            });
          } else {
            setTableInfo(data);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Crypto data from API
  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Set interval id to 1 second
    const intervalId = setInterval(fetchData, 1000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [tableInfo]);

  // Load users from jsonserver
  useEffect(() => {
    axios.get(urlStrings.jsonServer).then((response) => {
      const users = response.data;
      setUsers(users);
    });
  }, []);

  function handleLogin(formData, user) {
    if (user == undefined) {
      localStorage.setItem("loggedInUser", JSON.stringify(formData));
      setUser(formData);
    } else {
      axios
        .get(`${urlStrings.jsonServer}/${user.id}`)
        .then((response) => {
          const data = response.data;
          localStorage.setItem("loggedInUser", JSON.stringify(data));
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    localStorage.getItem("loggedInUser");
    navigate(`/`);
  }

  const handleLogOut = () => {
    localStorage.removeItem("loggedInUser");
  };

  function addCommasToThousands(integerPart) {
    // Convert to string if it's a number
    if (typeof integerPart === "number") {
      // Check if it's a floating-point number with more than two decimal places
      const decimalPart = integerPart.toString().split(".")[1];
      if (decimalPart && decimalPart.length > 2) {
        // Round to two decimal places
        integerPart = parseFloat(integerPart.toFixed(2)).toString();
      } else {
        integerPart = integerPart.toString();
      }
    }
    // Regex to add commas for thousands
    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

  const alertMessage = (onClose) => {
    if (alertInfo.type === "noBalance") {
      let messageRendered = "Invalid amount!";
      return (
        <Alert variant="warning" onClose={onClose} dismissible>
          <Alert.Heading>Error</Alert.Heading>
          <p>{messageRendered}</p>
        </Alert>
      );
    }
    if (alertInfo.type === "tickerBalance") {
      let messageRendered = "Insufficient balance!";
      return (
        <Alert variant="warning" onClose={onClose} dismissible>
          <Alert.Heading>Error</Alert.Heading>
          <p>{messageRendered}</p>
        </Alert>
      );
    } else {
      return (
        <Alert variant="danger" onClose={onClose} dismissible>
          <Alert.Heading>Error</Alert.Heading>
          <p>{alertInfo.type}</p>
        </Alert>
      );
    }
  };

  return (
    <div>
      <Navbar
        handleLogOut={handleLogOut}
        users={users}
        handleLogin={handleLogin}
        alertMessage={alertMessage}
        setShowAlerts={setShowAlerts}
        showAlerts={showAlerts}
        setAlertInfo={setAlertInfo}
      />

      <Routes>
        <Route
          path="/ticker"
          element={
            <HomePage
              tableInfo={tableInfo}
              addCommasToThousands={addCommasToThousands}
              user={user}
              formatPrice={formatPrice}
              capitalizeFirstLetter={capitalizeFirstLetter}
              alertMessage={alertMessage}
              setShowAlerts={setShowAlerts}
              showAlerts={showAlerts}
              setAlertInfo={setAlertInfo}
            ></HomePage>
          }
        />
        <Route path="/" element={<HeroCarousel />} />
        <Route path="/news" element={<NewsPage></NewsPage>} />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              user={user}
              setUser={setUser}
              addCommasToThousands={addCommasToThousands}
              tableInfo={tableInfo}
              formatPrice={formatPrice}
              capitalizeFirstLetter={capitalizeFirstLetter}
            ></DashboardPage>
          }
        />
        <Route
          path="/signup"
          element={
            <SignUpPage
              handleLogin={handleLogin}
              users={users}
              alertMessage={alertMessage}
              setShowAlerts={setShowAlerts}
              showAlerts={showAlerts}
              setAlertInfo={setAlertInfo}
            ></SignUpPage>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
