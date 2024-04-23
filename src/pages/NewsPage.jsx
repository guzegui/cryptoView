import { useState, useEffect } from "react";
import axios from "axios";

const url = "https://corsproxy.io/?https://cointelegraph.com/rss"; // Using the provided URL

function NewsPage() {
  const [news, setNews] = useState([]);

  const fetchFeed = () => {
    axios
      .get(url)
      .then((response) => {
        const feed = response.data;

        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(feed, "text/xml");

        // Convert DOM element to JSON

        //Select all elements with "item" tag from XML, convert into Array and map each item
        const newsItems = Array.from(xmlDoc.querySelectorAll("item")).map(
          (item) => {
            const newItem = {};
            // For each child node of NodeList, check if current node is element node
            item.childNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // If so, add the new item while removing whitespace
                newItem[node.nodeName] = node.textContent.trim();
              }
            });

            // Extract URL and text content from the description field
            const descriptionString = parser.parseFromString(
              newItem.description,
              "text/html"
            );
            const imageElement = descriptionString.querySelector("img");
            // In case there´s no image element, add empty string
            newItem.imageSource = imageElement ? imageElement.src : "";
            newItem.textContent = descriptionString.body.textContent.trim();

            return newItem;
          }
        );

        setNews(newsItems);
        console.log(newsItems);
      })
      .catch((error) => {
        console.error("Error fetching RSS feed:", error);
      });
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleGetMoreNews = () => {
    fetchFeed();
  };

  return (
    <div>
      <button onClick={handleGetMoreNews}>Load More News</button>

      <ul>
        {news.map((item, index) => (
          <li key={index}>
            <h2>{item.title}</h2>
            <p>{item.textContent}</p>
            <p>Category: {item.category}</p>
            <p>Publication Date: {item.pubDate}</p>
            <img src={item.imageSource} alt="News" />
            <a href={item.link} target="_blank" rel="noreferrer">
              Read more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsPage;
