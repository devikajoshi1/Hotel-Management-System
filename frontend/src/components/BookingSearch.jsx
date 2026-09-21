import React from 'react'
import "./BookingSearch.css";
const BookingSearch = () => {
  return (
    <section className='booking-search'>
      <div className="search-item">
        <label>CHECK IN</label>
        <input type='date'/>
      </div>

      <div className="search-item">
        <label>CHECK OUT</label>
        <input type="date" />
      </div>

       <div className="search-item">
        <label>GUESTS</label>
        <select>
          <option>1 Guest</option>
          <option>2 Guests</option>
          <option>3 Guests</option>
          <option>4 Guests</option>
        </select>
      </div>

      <button className="search-button">
        Check Availability
      </button>
    </section>
  )
}

export default BookingSearch
