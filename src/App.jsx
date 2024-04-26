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

const testApi = "https://api.coincap.io/v2/assets";

const jsonServer = "http://localhost:3000/users";

/*
npx json-server --watch db.json --port 3000
*/

function App() {
  const [tableInfo, setTableInfo] = useState({});
  const [previousTableInfo, setPreviousTableInfo] = useState([]);
  const [users, setUsers] = useState({});
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser"))
  );
  const [changes, setChanges] = useState([]);
  const navigate = useNavigate();

  // Function to compare current data with previous data
  // Function to compare current data with previous data
  const findPriceChanges = (currentData) => {
    const newChanges = [];

    // Check if currentData is undefined or not an object
    if (!currentData || typeof currentData !== "object") {
      console.error("Invalid data format:", currentData);
      return newChanges;
    }

    const coinData = currentData.data || []; // Extract coin data from currentData
    const currentTimestamp = currentData.timestamp || Date.now(); // Extract timestamp from currentData or use current time

    if (tableInfo == {}) {
      // If previous data is empty, return empty changes array
      return newChanges;
    }

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
        const timestamp = moment(currentTimestamp).format("HH:mm:ss"); // Format timestamp to include only hour, minute, and second
        newChanges.push({ id: currentCoin.id, priceDiff, timestamp });
      }
    });

    // time difference is between 3 and 5 minutes in dev tools but console.log every 2 seconds

    return newChanges;
  };

  const fetchData = () => {
    axios
      .get(testApi)
      .then((response) => {
        const data = response.data;

        // Compare current data with previous data
        const newChanges = findPriceChanges(data);

        // Update current data
        setTableInfo(data);

        // Update changes state only if there are changes
        if (newChanges.length > 0) {
          setChanges((prevChanges) => [...prevChanges, ...newChanges]);
          console.log("Changes detected:", newChanges);
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
  }, []);

  // Load users from jsonserver
  useEffect(() => {
    axios.get(jsonServer).then((response) => {
      const users = response.data;
      setUsers(users);
    });
  }, []);

  /*
  // Load logged-in user

  const id = localStorage.getItem("loggedInUser").slice(7, 11);

  useEffect(() => {
    axios.get(`${jsonServer}/${id}`).then((response) => {
      const user = response.data;
      console.log(user);
      setUser(user);
    });
  }, []);
*/

  /*
when user is created and logged in in signup, it navigates to HOME page and the user is loaded
it's available in the dashboard
when the user goes back to home page, the user disappears
MAYBE, user needs to be handled in app.jsx



*/

  function handleLogin(formData, user) {
    if (user == undefined) {
      localStorage.setItem("loggedInUser", JSON.stringify(formData));
      setUser(formData);
    } else {
      axios
        .get(`${jsonServer}/${user.id}`)
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

  return (
    <div>
      <Navbar
        handleLogOut={handleLogOut}
        users={users}
        handleLogin={handleLogin}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              tableInfo={tableInfo}
              previousTableInfo={previousTableInfo}
              addCommasToThousands={addCommasToThousands}
              user={user}
              formatPrice={formatPrice}
            ></HomePage>
          }
        />
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
            ></DashboardPage>
          }
        />
        <Route
          path="/signup"
          element={
            <SignUpPage handleLogin={handleLogin} users={users}></SignUpPage>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
