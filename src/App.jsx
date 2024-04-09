import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";

const testApi = "https://api.blockchain.com/v3/exchange/tickers";

function App() {
  const [tableInfo, setTableInfo] = useState([]);

  useEffect(() => {
    axios.get(testApi).then((response) => {
      const tableInfo = response.data;
      setTableInfo(tableInfo);
    });
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage tableInfo={tableInfo}></HomePage>} />
        <Route path="/new" element={<NewsPage></NewsPage>} />
      </Routes>
      
    </div>
  );
}

export default App;
