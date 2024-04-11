import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import SignUpPage from "./pages/SignUpPage";

const testApi = "https://api.blockchain.com/v3/exchange/tickers";
const jsonServer = 'http://localhost:3000/users';

function App() {
  const [tableInfo, setTableInfo] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(testApi).then((response) => {
      const tableInfo = response.data;
      setTableInfo(tableInfo);
      console.log(tableInfo);
    });
  }, []);


  useEffect(() => {
    axios.get(jsonServer).then((response) => {
      const users = response.data;
      setUsers(tableInfo);
      console.log(users);
    });
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage tableInfo={tableInfo}></HomePage>} />
        <Route path="/news" element={<NewsPage></NewsPage>} />
        <Route path="/signup" element={<SignUpPage></SignUpPage>} />
      </Routes>
      
    </div>
  );
}

export default App;
