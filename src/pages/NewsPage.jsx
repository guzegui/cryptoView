import React from "react";

const FakeNewsPage = () => {
  // Define separate image URLs for different cryptocurrencies
  const imageUrls = [
    "https://via.placeholder.com/500x300?text=Bitcoin",
    "https://via.placeholder.com/500x300?text=Ethereum",
    "https://via.placeholder.com/500x300?text=Cardano",
    "https://via.placeholder.com/500x300?text=Solana",
    // Add more cryptocurrency image URLs as needed
  ];

  // Array of background and text color classes
  const colorStyles = [
    { bg: "bg-primary bg-opacity-10", text: "text-primary" },
    { bg: "bg-success bg-opacity-10", text: "text-success" },
    { bg: "bg-info bg-opacity-10", text: "text-info" },
    { bg: "bg-warning bg-opacity-10", text: "text-warning" },
    { bg: "bg-danger bg-opacity-10", text: "text-danger" },
  ];

  // Function to generate fake news content
  const generateFakeNews = () => {
    const fakeNews = [];
    for (let i = 0; i < 20; i++) {
      const style = colorStyles[i % colorStyles.length];
      fakeNews.push(
        <div className="container mb-4" key={i}>
          <div
            className={`row g-0 align-items-stretch shadow-lg p-3 mb-5 rounded ${style.bg}`}
          >
            <div className="col-md-4 d-flex">
              <img
                src={imageUrls[i % imageUrls.length]}
                alt={`Crypto News ${i + 1}`}
                className="img-fluid rounded-start w-100 align-self-stretch"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="col-md-8">
              <div className="card border-0 h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h2 className={`card-title ${style.text}`}>
                      <a href="#" className="text-decoration-none">
                        Crypto News: Title {i + 1}
                      </a>
                    </h2>
                    <p className={`card-text ${style.text}`}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam faucibus vestibulum felis, vel gravida purus
                      rhoncus a. Curabitur vitae justo quis metus ultrices...
                    </p>
                  </div>
                  <div className="mt-2">
                    <a
                      href="#"
                      className={`btn btn-outline-${style.text.split("-")[1]}`}
                    >
                      Read More
                    </a>
                    <small className={`text-muted`}>Posted 1 hour ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return fakeNews;
  };

  return <div>{generateFakeNews()}</div>;
};

export default FakeNewsPage;
