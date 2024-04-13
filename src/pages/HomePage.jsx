import PropTypes from 'prop-types';
import moment from "moment";

function HomePage({ tableInfo, previousTableInfo }) {
  const { data } = tableInfo;
  const { timestamp } = tableInfo;
  const localTime = moment
    .unix(timestamp / 1000)
    .format("MMMM Do YYYY, h:mm:ss a");

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
            data.map((tableInfo) => {
              return (
                <tr key={tableInfo.id}>
                  <td>{tableInfo.rank}</td>
                  <td style={{ textDecoration: "none", color: "inherit" }}>
                    <a
                      href={tableInfo.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tableInfo.symbol}
                    </a>
                  </td>
                  <td className="price">{formatPrice(tableInfo.priceUsd)}</td>
                  <td>{parseFloat(tableInfo.volumeUsd24Hr).toFixed(2)}</td>
                  <td
                    className={
                      tableInfo.changePercent24Hr < 0
                        ? "text-danger"
                        : "text-success"
                    }
                  >
                    {parseFloat(tableInfo.changePercent24Hr).toFixed(2)}
                  </td>

                  <td>EXTRA</td>
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

HomePage.defaultProps = {
  tableInfo: {
    id: 0,
    rank: 1,
    symbol: "",
    name: "",
    priceUsd: "",
    volumeUsd24Hr: "",
    marketCapUsd: "",
    availableSupply: "",
    totalSupply: "",
    changePercent24Hr: "",
    vwap24Hr: "",
    explorer: "",
    timestamp: 0,
  },
  previousTableInfo: {
    id: 0,
    priceUsd: "",
  },
};


export default HomePage;


