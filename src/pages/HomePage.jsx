import { Link } from "react-router-dom";

function HomePage({ tableInfo }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>Volume</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      {tableInfo.map((tableInfo) => (
            <tr key={tableInfo.symbol}>
              <td>
                {tableInfo.symbol}
              </td>
              <td>{tableInfo.price_24h}</td>
              <td>{tableInfo.volume_24h}</td>
              <td>
                EXTRA
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default HomePage;
