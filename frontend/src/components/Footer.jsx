import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            LUXORA
          </Link>

          <p>
            Comfort, elegance and unforgettable stays
            in the heart of the city.
          </p>
        </div>

        <div className="footer-column">
          <p className="footer-label">QUICK LINKS</p>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/rooms">Rooms</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </div>
        </div>

        <div className="footer-column">
          <p className="footer-label">CONTACT</p>

          <p className="footer-contact">
            hello@luxora.com
            <br />
            +91 98765 43210
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © {year} Luxora Hotel. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
