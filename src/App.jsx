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

const jsonServer = "http://localhost:3000/users";

/*
npx json-server --watch db.json --port 3000
*/

function App() {
  const [tableInfo, setTableInfo] = useState([]);
  const [previousTableInfo, setPreviousTableInfo] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInState, setLoggedInState] = useState("");

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

    // Set interval id to 20000 second
    const intervalId = setInterval(fetchData, 20000000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    axios.get(jsonServer).then((response) => {
      const users = response.data;
      setUsers(users);
    });
  }, []);

  const handleLogin = (formData) => {
    setLoggedInState(formData);
    localStorage.getItem('loggedInUser');
    console.log(localStorage.getItem('loggedInUser'))
    console.log(`${jsonServer}/${loggedInState.id}`);
  };

  return (
    <div>
      <Navbar loggedInState={loggedInState} />
      <Routes>
        <Route path="/" element={<HomePage tableInfo={tableInfo} previousTableInfo={previousTableInfo}></HomePage>} />
        <Route path="/news" element={<NewsPage></NewsPage>} />
        <Route
          path="/dashboard"
          element={<DashboardPage></DashboardPage>}
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
