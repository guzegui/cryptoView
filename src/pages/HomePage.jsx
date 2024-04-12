import { Link } from "react-router-dom";
import moment from "moment";

function HomePage({ tableInfo }) {

  const { data } = tableInfo;
  const { timestamp } = tableInfo;
  const localTime = moment
    .unix(timestamp / 1000)
    .format("MMMM Do YYYY, h:mm:ss a");

  return (
    <div>
    <p>
  Last updated on {localTime} - Powered by&nbsp; 
  <a href="https://coincap.io/" target="_blank" rel="noopener noreferrer">coincap.io</a>
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
          data.map((tableInfo) => (
            <tr key={tableInfo.id}>
              <td>{tableInfo.rank}</td>
              <td style={{ textDecoration: 'none', color: 'inherit' }}>
                <a href={tableInfo.explorer} target="_blank" rel="noopener noreferrer">{tableInfo.symbol}</a>
              </td>
              <td>{parseFloat(tableInfo.priceUsd).toFixed(2)}</td>
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
          ))}
      </tbody>
    </table>


    </div>
  );
}

export default HomePage;
