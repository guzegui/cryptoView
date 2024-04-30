import { useState } from "react";

function Navbar({
  handleLogOut,
  users,
  handleLogin,
  alertMessage,
  setShowAlerts,
  showAlerts,
  setAlertInfo,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Check if a user with the provided username or email exists
    const user = users.find(
      (user) =>
        user.username === loginFormData.usernameOrEmail ||
        user.email === loginFormData.usernameOrEmail
    );

    if (!user) {
      setShowAlerts(true);
      setAlertInfo({type: "User does not exist!" });
      setIsDropdownOpen(false);
      return;
    }

    // Check if the password is correct
    if (user.password !== loginFormData.password) {
      setShowAlerts(true);
      setAlertInfo({ type: "Incorrect password!" });
      setIsDropdownOpen(false);
      return;
    }
    handleLogin(undefined, user);
  };

  // navbar navbar-default navbar-static-top

  return (
    <>
      <nav className="navbar navbar-dark bg-dark mb-3">
        <div className="container-fluid" style={{ flex: "" }}>
          <a
            className="navbar-brand"
            href="/"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              className="logo"
              src="/public/cryptoBackground.png"
              alt="logo"
              style={{ marginRight: "10px" }}
            />
            <p style={{ margin: 0 }}>🚀cryptoView🚀</p>
          </a>

          <a className="navbar-brand" href="/ticker">
            Ticker
          </a>
          <a className="navbar-brand" href="/news">
            News
          </a>

          {!localStorage.getItem("loggedInUser") ? (
            <>
              <a className="navbar-brand">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    onClick={toggleDropdown}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      fontSize: "20px",
                    }} // Set font size to 16px
                  >
                    Login
                  </button>
                  <div
                    className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                    aria-labelledby="dropdownMenuButton"
                  >
                    <form className="px-4 py-3" onSubmit={handleLoginSubmit}>
                      <div className="form-group">
                        <label htmlFor="usernameOrEmail">
                          Username or Email
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="usernameOrEmail"
                          name="usernameOrEmail"
                          value={loginFormData.usernameOrEmail}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          value={loginFormData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => handleLoginSubmit}
                      >
                        Sign in
                      </button>
                    </form>
                  </div>
                </div>
              </a>
              <a className="navbar-brand" href="/signup">
                Sign Up
              </a>
            </>
          ) : (
            <>
              <a className="navbar-brand" href="/dashboard">
                Dashboard
              </a>
              <a className="navbar-brand" href="/" onClick={handleLogOut}>
                Log Out
              </a>
            </>
          )}
        </div>
      </nav>
      {showAlerts && alertMessage(() => setShowAlerts(false))}

    </>
  );
}

export default Navbar;
