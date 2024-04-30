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
      <Carousel activeIndex={index} onSelect={handleSelect} data-bs-theme="dark">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/carousel-imgs/crypto_graph.jpg"
            alt="First slide"
            onLoad={handleImageLoad}
            style={{ display: imagesLoaded ? "block" : "none" }}
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/carousel-imgs/crypto_logos.jpg"
            alt="Second slide"
            onLoad={handleImageLoad}
            style={{ display: imagesLoaded ? "block" : "none" }}
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/carousel-imgs/crypto_vignettes.jpg"
            alt="Third slide"
            onLoad={handleImageLoad}
            style={{ display: imagesLoaded ? "block" : "none" }}
          />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HeroCarousel;
