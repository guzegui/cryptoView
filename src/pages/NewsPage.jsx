import { useState, useEffect } from "react";
import axios from "axios";

const url = "https://corsproxy.io/?https://cointelegraph.com/rss"; // Using the provided URL

function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const feed = response.data;

        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(feed, "text/xml");

        // Convert DOM to JSON
        const newsItems = Array.from(xmlDoc.querySelectorAll("item")).map(item => {
          const newItem = {};
          item.childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              newItem[node.nodeName] = node.textContent.trim();
            }
          });
          return newItem;
        });

        console.log(newsItems);

        // Display the converted JSON data
        console.log("Parsed RSS feed (as JSON):", JSON.stringify(newsItems, null, 2));
      })
      .catch((error) => {
        console.error("Error fetching RSS feed:", error);
      });
  }, []);

  return <div>NewsPage</div>;
}

export default NewsPage;
