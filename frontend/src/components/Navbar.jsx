import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        LUXORA
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>
        <Link to="/rooms">Rooms</Link>
        {user && <Link to="/my-bookings">My Bookings</Link>}

        {user ? (
          <>
            <span>Hi, {user.name}</span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

      </div>

    </nav>
  );
};

export default Navbar;