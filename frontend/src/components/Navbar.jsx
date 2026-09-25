import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  // Subscribing to the location re-renders the navbar on every page change,
  // so it picks up the user saved in localStorage right after login.
  useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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