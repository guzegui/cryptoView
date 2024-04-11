function Navbar() {
    return (
      <nav className="navbar navbar-dark bg-primary mb-3">
        <div className="container">
          <a className="navbar-brand" href="/">
        Home
          </a>
          <a className="navbar-brand" href="/news">
          News
        </a>
          <a className="navbar-brand" href="/signup">
          Sign Up
        </a>
        </div>
      </nav>
    );
  }
  
  export default Navbar;
  