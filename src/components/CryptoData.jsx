import React, { useState, useEffect } from "react";
import axios from "axios";

function CryptoData({ setTableInfo, setPreviousTableInfo }) {
  const testApi = "https://api.coincap.io/v2/assets";

  function fetchData(coins) {
    axios
      .get(testApi)
      .then((response) => {
        const data = response.data;

        if (coins === undefined) {
          // Extract the id and price from tableInfo previous state
          const prevPrices = data.data.map((element) => ({
            id: element.id,
            priceUsd: element.priceUsd,
          }));
          setPreviousTableInfo(prevPrices);
          setTableInfo(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    // Fetch data initially
    fetchData(undefined);

    // Set interval id to 1 second
    const intervalId = setInterval(fetchData, 1000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []);
}


export default CryptoData;
