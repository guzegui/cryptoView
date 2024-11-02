import { useState, useEffect } from "react";
import axios from "axios";

function NewsPage() {
  const [news, setNews] = useState([]);

  function parseHtmlEntities(htmlString) {
    return htmlString
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }

  const fetchFeed = () => {
    axios
      .get(
        `${process.env.VITE_SERVER_URL}/${process.env.VITE_NEWS_API}`
      )
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
    <div className="container mt-5">
      <button className="btn btn-primary mb-3" onClick={handleGetMoreNews}>
        Load More News
      </button>
      <ul className="list-group">
        {news.map((item, index) => (
          <li key={index} className="list-group-item">
            <div className="row">
              <div className="col-md-3">
                <img
                  src={item.imageSource}
                  alt="News"
                  className="img-fluid"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
              <div className="col-md-9">
                <h2>{parseHtmlEntities(item.title)}</h2>
                <p>{parseHtmlEntities(item.textContent)}</p>
                <p>Category: {item.category}</p>
                <p>Publication Date: {item.pubDate}</p>
                <a
                  href={item.link}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read more
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsPage;
