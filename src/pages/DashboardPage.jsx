import { useEffect } from "react";
import axios from "axios";

function DashboardPage({
  user,
  setUser,
  addCommasToThousands,
  tableInfo,
  formatPrice,
  capitalizeFirstLetter,
}) {
  const id = JSON.parse(localStorage.getItem('loggedInUser'))._id;

  useEffect(() => {
    axios
      .get(
        `${process.env.VITE_SERVER_URL}/${process.env.VITE_DB}/${id}`
      )
      .then((response) => {
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
          const coinTimesValue = coin.priceUsd * value;
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
        return accumulator + value;
      } else {
        return accumulator + parseFloat(value);
      }
    }, 0);
  };
  return (
    <div className="dashboard-container">
      {!user || !user.balance || !currencyData ? (
        <div>Loading...</div>
      ) : (
        <div className="dashboard-content">
          <h1 className="dashboard-title">
            🚀 Welcome to Your Crypto Dashboard 🌟
          </h1>
          <hr className="dashboard-divider" />
          <div className="dashboard-panels">
            <div className="panel">
              <div className="panel-icon">🤓</div>
              <div className="panel-content">
                <h2 className="panel-title">User Information</h2>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">🆔 ID:</span>
                    <span className="info-value">{user._id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">👤 Username:</span>
                    <span className="info-value">{user.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📧 Email:</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🔒 Password:</span>
                    <span className="info-value">{user.password}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">💰 Total Balance:</span>
                    <span className="info-value">
                      $
                      {addCommasToThousands(totalAvailableBalance().toFixed(2))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-icon">📈</div>
              <div className="panel-content">
                <h2 className="panel-title">Currencies</h2>
                <div className="currency-list">
                  {currencyData.map(([key, value]) => (
                    <div key={key} className="currency-item">
                      <span className="currency-label">
                        {capitalizeFirstLetter(key)}:
                      </span>
                      <span className="currency-value">
                        {key !== "dollars" ? (
                          <>
                            {
                              Object.entries(user.balance).find(
                                (element) => element[0] === key
                              )[1]
                            }{" "}
                            = (${formatPrice(value)})
                          </>
                        ) : (
                          `$${addCommasToThousands(value)}`
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
