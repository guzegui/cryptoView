import { useState } from "react";

function Navbar({ loggedInState, handleLogOut, users }) {
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
      alert("User does not exist");
      return;
    }

    // Check if the password is correct
    if (user.password !== loginFormData.password) {
      alert("Incorrect password");
      return;
    }

    // Handle successful login (e.g., setLoggedInUser)
    // setLoggedInUser(user);

    // Optionally, redirect the user to the dashboard or another page
    // history.push('/dashboard');
  };

  return (
    <nav className="navbar navbar-dark bg-primary mb-3">
      <div className="container">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <a className="navbar-brand" href="/news">
          News
        </a>

        {!localStorage.getItem("loggedInUser") ? (
          <div>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                onClick={toggleDropdown}
              >
                Login
              </button>
              <div
                className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                aria-labelledby="dropdownMenuButton"
              >
                <form className="px-4 py-3" onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label htmlFor="usernameOrEmail">Username or Email</label>
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
                  <button type="submit" className="btn btn-primary">
                    Sign in
                  </button>
                </form>
              </div>
              <a className="navbar-brand" href="/signup">
                Sign Up
              </a>
            </div>
          </div>
        ) : (
          <div>
            <a className="navbar-brand" href="/dashboard">
              Dashboard
            </a>
            <a className="navbar-brand" href="/" onClick={handleLogOut}>
              Log Out
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
