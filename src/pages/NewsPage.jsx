import { useState, useEffect } from "react";
import axios from "axios";

const url = "https://corsproxy.io/?https://cointelegraph.com/rss";
function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const feed = response.data;
        console.log(feed);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <div>NewsPage</div>;
}

export default NewsPage;
