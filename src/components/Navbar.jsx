function Navbar({ loggedInState, handleLogOut}) {

  return (
    <nav className="navbar navbar-dark bg-primary mb-3">
      <div className="container">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <a className="navbar-brand" href="/news">
          News
        </a>

        {!localStorage.getItem('loggedInUser')? (
          <a className="navbar-brand" href="/signup">
            Sign Up
          </a>
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
