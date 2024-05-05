import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SortIcon from "@mui/icons-material/Sort";

function TickerTable({
  localTime,
  data,
  sortConfig,
  handleClick,
  sortedData,
  testUser,
  loggedInUser,
  isTrading,
  tradeData,
  handleInputChange,
  calculateAmount,
  handleTradeSubmit,
  tradeButtonClick,
  capitalizeFirstLetter,
  addCommasToThousands,
  formatPrice,
}) {
  return (
    <div>
      <p>
        Last updated on {localTime} - Powered by&nbsp;
        <a href="https://coincap.io/" target="_blank" rel="noopener noreferrer">
          coincap.io
        </a>
      </p>
      {!data[0].priceDiff && <p>Waiting for a price change...</p>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleClick("rank")}>
              Rank
              {sortConfig.key === "rank" &&
                sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
              {sortConfig.key === "rank" &&
                sortConfig.direction === "descending" && <ArrowDownwardIcon />}
              {sortConfig.key !== "rank" && <SortIcon />}
            </th>
            <th onClick={() => handleClick("id")}>
              Symbol
              {sortConfig.key === "id" &&
                sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
              {sortConfig.key === "id" &&
                sortConfig.direction === "descending" && <ArrowDownwardIcon />}
              {sortConfig.key !== "id" && <SortIcon />}
            </th>
            <th onClick={() => handleClick("priceUsd")}>
              Price in USD
              {sortConfig.key === "priceUsd" &&
                sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
              {sortConfig.key === "priceUsd" &&
                sortConfig.direction === "descending" && <ArrowDownwardIcon />}
              {sortConfig.key !== "priceUsd" && <SortIcon />}
            </th>
            <th onClick={() => handleClick("volumeUsd24Hr")}>
              Volume
              {sortConfig.key === "volumeUsd24Hr" &&
                sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
              {sortConfig.key === "volumeUsd24Hr" &&
                sortConfig.direction === "descending" && <ArrowDownwardIcon />}
              {sortConfig.key !== "volumeUsd24Hr" && <SortIcon />}
            </th>
            <th onClick={() => handleClick("changePercent24Hr")}>
              % Change in 24h
              {sortConfig.key === "changePercent24Hr" &&
                sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
              {sortConfig.key === "changePercent24Hr" &&
                sortConfig.direction === "descending" && <ArrowDownwardIcon />}
              {sortConfig.key !== "changePercent24Hr" && <SortIcon />}
            </th>

            {data[0].priceDiff && (
              <th onClick={() => handleClick("priceDiff")}>
                Last Price Change in USD
                {sortConfig.key === "priceDiff" &&
                  sortConfig.direction === "ascending" && <ArrowUpwardIcon />}
                {sortConfig.key === "priceDiff" &&
                  sortConfig.direction === "descending" && (
                    <ArrowDownwardIcon />
                  )}
                {sortConfig.key !== "priceDiff" && <SortIcon />}
              </th>
            )}

            {loggedInUser && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData() &&
            sortedData().map((coin) => {
              return (
                <tr key={coin.id}>
                  <td>{coin.rank}</td>
                  <td style={{ textDecoration: "none", color: "inherit" }}>
                    <a
                      href={coin.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {coin.symbol} ({capitalizeFirstLetter(coin.id)})
                    </a>
                  </td>
                  <td className="price">{formatPrice(coin.priceUsd)}</td>
                  <td>
                    {formatPrice(parseFloat(coin.volumeUsd24Hr).toFixed(2))}
                  </td>
                  <td
                    className={
                      coin.changePercent24Hr < 0
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {parseFloat(coin.changePercent24Hr).toFixed(2)} %
                  </td>
                  {coin.priceDiff && (
                    <td
                      className={
                        coin.priceDiff < 0 ? "text-danger" : "text-success"
                      }
                    >
                      {formatPrice(coin.priceDiff.toString())}
                    </td>
                  )}
                  {loggedInUser && (
                    <td>
                      {/* Render trade button or trade form */}
                      {isTrading(coin.id) ? (
                        <form>
                          {/* Dropdown menu for selecting available currencies */}
                          <select
                            name="fromCoin"
                            value={tradeData.fromCoin}
                            onChange={handleInputChange}
                          >
                            {Object.keys(testUser.balance).map(
                              (currency) =>
                                currency !== coin.id && (
                                  <option key={currency} value={currency}>
                                    {capitalizeFirstLetter(currency)}
                                  </option>
                                )
                            )}
                          </select>

                          {/* Display the available balance */}
                          <div>
                            Available Balance:
                            {testUser.balance[tradeData.fromCoin] &&
                              addCommasToThousands(
                                testUser.balance[tradeData.fromCoin]
                              )}
                          </div>

                          {/* Calculate the amount that the available balance would buy */}
                          <div>
                            {capitalizeFirstLetter(coin.name)} Amount:
                            {calculateAmount(
                              tradeData.fromCoin,
                              coin,
                              tradeData.fromCoinAmount
                            )}
                          </div>

                          {/* Input field for the trade amount */}
                          <input
                            type="number"
                            name="fromCoinAmount"
                            value={tradeData.fromCoinAmount}
                            onChange={handleInputChange}
                            placeholder="Trade amount"
                          />
                          <button
                            type="submit"
                            onClick={(e) => handleTradeSubmit(e, coin.id)}
                          >
                            Trade
                          </button>
                        </form>
                      ) : (
                        <button onClick={() => tradeButtonClick(coin.id)}>
                          Trade
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default TickerTable;
