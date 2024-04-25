import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import CryptoData from "./components/CryptoData";


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
  const navigate = useNavigate();

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
      <CryptoData
        setTableInfo={setTableInfo}
        setPreviousTableInfo={setPreviousTableInfo}
      />
    </div>
  );
}

export default App;
