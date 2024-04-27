import React, { useEffect } from "react";
import axios from "axios";

const jsonServer = "http://localhost:3000/users";

function DashboardPage({
  user,
  setUser,
  addCommasToThousands,
  tableInfo,
  formatPrice, capitalizeFirstLetter
}) {
  const id = localStorage.getItem("loggedInUser").slice(7, 11);

  useEffect(() => {
    axios.get(`${jsonServer}/${id}`).then((response) => {
      const user = response.data;
      setUser(user);
    });
  }, [id, setUser]);

  const getCurrencyData = () => {
    if (!tableInfo.data || !user.balance) return [];

    return Object.entries(user.balance).map(([key, value]) => {
      if (key === "dollars") {
        return [`dollars`, value];
      } else {
        const coin = tableInfo.data.find((element) => element.id === key);
        if (coin) {
          console.log("the coin is " + coin.id);
          console.log(
            "the value is " + value + " which is of type " + typeof value
          );
          const coinTimesValue = coin.priceUsd * value;
          console.log(
            "the product is " +
              coinTimesValue +
              "which is of type " +
              typeof coinTimesValue
          );
          console.log(
            "the value is " +
              coin.priceUsd +
              " which is of type " +
              typeof coin.priceUsd
          );
          return [coin.id, coinTimesValue.toString()];
        } else {
          return null; // if data is not found
        }
      }
    });
  };

  const currencyData = getCurrencyData();

  const totalAvailableBalance = () => {
    if (!currencyData) return "";
    return currencyData.reduce((accumulator, [key, value]) => {
      if (key === "dollars") {
        console.log(
          "Accumulator was " +
            accumulator +
            " and value is " +
            value +
            " which is of type " +
            typeof value
        );
        return accumulator + value;
      } else {
        console.log(
          "Accumulator was " +
            accumulator +
            " and value is " +
            value +
            " which is of type " +
            typeof value
        );
        return accumulator + parseFloat(value);
      }
    }, 0);
  };

  /*
  {currencyData.reduce((accumulator, currentValue) => {
              accumulator + currentValue.x;
            }, 0)}
  
  
  */

  console.log(
    Object.entries(user.balance).find((element) => element[0] === "dollars")
  );

  return (
    <div>
      {!user || !user.balance || !tableInfo.data ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>Id: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Password: {user.password}</p>
          <p>
            Total Balance: $
            {addCommasToThousands(totalAvailableBalance().toFixed(2))}{" "}
          </p>
          <div>
            Currencies:
            {currencyData.map(([key, value]) =>
              key !== "dollars" ? (
                <p key={key}>
                  {capitalizeFirstLetter(key)}:{" "}
                  {
                    Object.entries(user.balance).find(
                      (element) => element[0] === key
                    )[1]
                  }{" "}
                  = (${formatPrice(value)})
                </p>
              ) : (
                <p key={key}>
                  {capitalizeFirstLetter(key)}: ${addCommasToThousands(value)}
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
