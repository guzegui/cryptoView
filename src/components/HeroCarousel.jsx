import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

function HeroCarousel() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // When image loads, set state to true
  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="carousel-container">
      {!imagesLoaded && <p>Loading...</p>}
      <h1>Your Crypto Simulator and News Resource</h1>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        data-bs-theme="dark"
      >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../assets/carousel-imgs/crypto_graph.jpg"
            alt="First slide"
            onLoad={handleImageLoad}
            style={{ display: imagesLoaded ? "block" : "none" }}
          />
          <Carousel.Caption>
            <h3>A real-time cryptocurrency trading interface</h3>
            <p>
              Practice real-time exchanges between the 100 most popular coins.
            </p>
            <a href="/ticker" className="btn btn-primary">
              Go to ticker
            </a>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../assets/carousel-imgs/crypto_logos.jpg"
            alt="Second slide"
            onLoad={handleImageLoad}
            style={{ display: imagesLoaded ? "block" : "none" }}
          />
          <Carousel.Caption>
            <h3>Create an account with dry-run money</h3>
            <p>Track your wallet&apos;s value as prices fluctuates</p>
            <a href="/signup" className="btn btn-primary">
              Sign up
            </a>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../assets/carousel-imgs/crypto_vignettes.jpg"
            alt="Third slide"
            onLoad={handleImageLoad}
            style={{ display: imagesLoaded ? "block" : "none" }}
          />
          <Carousel.Caption>
            <h3>Stay informed of the trends</h3>
            <p>Fetch news from Coin Telegraph&apos; RSS feed.</p>
            <a href="/news" className="btn btn-primary">
              Go to News Page
            </a>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HeroCarousel;
