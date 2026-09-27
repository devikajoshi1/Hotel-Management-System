import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingSearch.css";

const BookingSearch = () => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <section className='booking-search'>
      <div className="search-item">
        <label>CHECK IN</label>
        <input
          type='date'
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div className="search-item">
        <label>CHECK OUT</label>
        <input
          type="date"
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

       <div className="search-item">
        <label>GUESTS</label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        >
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
        </select>
      </div>

      <button className="search-button" onClick={handleSearch}>
        Check Availability
      </button>
    </section>
  )
}

export default BookingSearch
