import React from "react";

function HeroCarousel() {
  return (
    <div className="container">
      <h2>Carousel Example</h2>
      <div id="myCarousel" className="carousel slide" data-ride="carousel">
        {/* Indicators */}
        <ol className="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
          <li data-target="#myCarousel" data-slide-to="1"></li>
          <li data-target="#myCarousel" data-slide-to="2"></li>
        </ol>

        {/* Wrapper for slides */}
        <div className="carousel-inner">
          <div className="item active">
            <img src="../../public/carousel-imgs/crypto_logos.jpg" alt="Cryptocurrency 1" style={{ width: "100%" }} />
          </div>

          <div className="item">
            <img src="../../public/carousel-imgs/crypto-graph.jpg" alt="Cryptocurrency 2" style={{ width: "100%" }} />
          </div>

          <div className="item">
            <img src="../../public/carousel-imgs/crypto-vignettes.jpg" alt="Cryptocurrency 3" style={{ width: "100%" }} />
          </div>
        </div>

        {/* Left and right controls */}
        <a className="left carousel-control" href="#myCarousel" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#myCarousel" data-slide="next">
          <span className="glyphicon glyphicon-chevron-right"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>
  );
}

export default HeroCarousel;
