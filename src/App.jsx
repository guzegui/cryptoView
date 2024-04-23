import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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
  const [loggedInState, setLoggedInState] = useState("");
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // Crypto data from API
  useEffect(() => {
    const fetchData = () => {
      axios
        .get(testApi)
        .then((response) => {
          const data = response.data;

          // Extract the id and price from tableInfo previous state
          const prevPrices = data.data.map((element) => ({
            id: element.id,
            priceUsd: element.priceUsd,
          }));
          setPreviousTableInfo(prevPrices);
          setTableInfo(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

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

  const handleLogin = (formData) => {
    localStorage.setItem("loggedInUser", JSON.stringify(formData));
    setUser(formData);
    localStorage.getItem("loggedInUser");
    navigate(`/`);
  };

  const handleLogOut = () => {
    localStorage.removeItem("loggedInUser");
  };

  function addCommasToThousands(integerPart) {
    // Convert to string if it's a number
    if (typeof integerPart === "number") {
      integerPart = integerPart.toString();
    }

    // Regex to add commas for thousands
    return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div>
      <Navbar loggedInState={loggedInState} handleLogOut={handleLogOut} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              tableInfo={tableInfo}
              previousTableInfo={previousTableInfo}
              addCommasToThousands={addCommasToThousands}
              user={user}
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
            ></DashboardPage>
          }
        />
        <Route
          path="/signup"
          element={
            <SignUpPage
              loggedInState={loggedInState}
              handleLogin={handleLogin}
            ></SignUpPage>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
