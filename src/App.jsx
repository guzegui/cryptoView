import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";

const testApi = "https://api.coincap.io/v2/assets";
//const testApi = "https://api.blockchain.com/v3/exchange/tickers";

const jsonServer = "http://localhost:3000/users";

/*
npx json-server --watch db.json --port 3000
*/

function App() {
  const [tableInfo, setTableInfo] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState("");

  useEffect(() => {
    const fetchData = () => {
      axios.get(testApi)
        .then((response) => {
          const data = response.data;
          console.log(data);
          setTableInfo(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    // Fetch data initially
    fetchData();

    // Set interval id to 1 second
    const intervalId = setInterval(fetchData, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    axios.get(jsonServer).then((response) => {
      const users = response.data;
      setUsers(users);
    });
  }, []);

  const handleLogin = (formData) => {
    setLoggedIn(formData);
  };

  console.log(`${jsonServer}/${loggedIn.id}`);
  console.log(loggedIn);
  return (
    <div>
      <Navbar loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<HomePage tableInfo={tableInfo}></HomePage>} />
        <Route path="/news" element={<NewsPage></NewsPage>} />
        <Route
          path="/dashboard"
          element={<DashboardPage loggedIn={loggedIn}></DashboardPage>}
        />
        <Route
          path="/signup"
          element={
            <SignUpPage
              loggedIn={loggedIn}
              handleLogin={handleLogin}
            ></SignUpPage>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
