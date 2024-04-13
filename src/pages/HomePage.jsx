import PropTypes from "prop-types";
import moment from "moment";
import { useState } from "react";

function HomePage({ tableInfo, previousTableInfo }) {
  const { data } = tableInfo;
  const { timestamp } = tableInfo;
  const localTime = moment
    .unix(timestamp / 1000)
    .format("MMMM Do YYYY, h:mm:ss a");
    

  // Sample user data for testing
  const testUser = {
    id: "b450",
    username: "asdfasd",
    email: "asdfasdf",
    password: "asdfasdf",
    balance: {
      dollars: 100,
    },
  };

  function formatPrice(price) {
    // Separate integer and decimal parts
    const [integerPart, decimalPart] = price.split(".");

    // Regex - regular expressions
    // Add commas for thousands: matches positions between groups of three consecutive digits (every thousand) and inserts a comma
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );
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

  // State to manage trade form visibility, trade amount, and selected currency
  const [tradeFormVisible, setTradeFormVisible] = useState(false);
  const [tradeAmount, setTradeAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(
    Object.keys(testUser.balance)[0]
  ); // Initialize with the first currency

  // Function to handle trade form submission
  const handleTradeSubmit = (e) => {
    e.preventDefault();
    // Check if the trade amount is greater than the available balance
    if (parseFloat(tradeAmount) > testUser.balance[selectedCurrency]) {
      alert("You don't have enough balance!");
      return;
    }
    // Perform trade logic here
    console.log("Trade amount:", tradeAmount);
    // Reset trade amount and hide trade form
    setTradeAmount("");
    setTradeFormVisible(false);
  };

  return (
    <div>
      <p>
        Last updated on {localTime} - Powered by&nbsp;
        <a href="https://coincap.io/" target="_blank" rel="noopener noreferrer">
          coincap.io
        </a>
      </p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Symbol</th>
            <th>Price in USD</th>
            <th>Volume</th>
            <th>% Change in 24h</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((coin) => {
              return (
                <tr key={coin.id}>
                  <td>{coin.rank}</td>
                  <td style={{ textDecoration: "none", color: "inherit" }}>
                    <a
                      href={coin.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {coin.symbol}
                    </a>
                  </td>
                  <td className="price">{formatPrice(coin.priceUsd)}</td>
                  <td>{parseFloat(coin.volumeUsd24Hr).toFixed(2)}</td>
                  <td
                    className={
                      coin.changePercent24Hr < 0
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {parseFloat(coin.changePercent24Hr).toFixed(2)}
                  </td>
                  <td>
                    {/* Render trade button or trade form */}
                    {tradeFormVisible ? (
                      <form onSubmit={handleTradeSubmit}>
                        {/* Dropdown menu for selecting available currencies */}
                        <select
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                        >
                          {Object.keys(testUser.balance).map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>

                        {/* Display the available balance */}
                        <div>
                          Available Balance:{" "}
                          {testUser.balance[selectedCurrency]}
                        </div>

                        {/* Calculate the amount of Bitcoin that the available balance would buy */}
                        <div>
                          {coin.name} Amount:{" "}
                          {(
                            testUser.balance[selectedCurrency] /
                            coin.priceUsd
                          ).toFixed(8)}
                        </div>

                        {/* Input field for the trade amount */}
                        <input
                          type="number"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          placeholder="Trade amount"
                        />
                        <button type="submit">Trade</button>
                      </form>
                    ) : (
                      <button onClick={() => setTradeFormVisible(true)}>
                        Trade
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

HomePage.propTypes = {
  tableInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    rank: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    priceUsd: PropTypes.string.isRequired,
    volumeUsd24Hr: PropTypes.string.isRequired,
    marketCapUsd: PropTypes.string.isRequired,
    availableSupply: PropTypes.string.isRequired,
    totalSupply: PropTypes.string.isRequired,
    changePercent24Hr: PropTypes.string.isRequired,
    vwap24Hr: PropTypes.string.isRequired,
    explorer: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  previousTableInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    priceUsd: PropTypes.string.isRequired,
  }).isRequired,
};

export default HomePage;
