import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/rooms/${id}`)
      .then((response) => {
        setRoom(response.data);
      })
      .catch((error) => {
        console.log("Room error:", error);
      });
  }, [id]);

  const handleBooking = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const timeDifference = endDate - startDate;
    const numberOfNights =
      timeDifference / (1000 * 60 * 60 * 24);

    const totalPrice = numberOfNights * room.price;

    const booking = {
      user: {
        id: user.id,
      },
      room: {
        id: Number(id),
      },
      checkIn: checkIn,
      checkOut: checkOut,
      guests: Number(guests),
      totalPrice: totalPrice,
      status: "CONFIRMED",
    };

    axios
      .post("http://localhost:8080/api/bookings", booking)
      .then((response) => {
        console.log("Booking successful:", response.data);

        alert(
          `Booking Confirmed!\n\nStatus: ${response.data.status}\nTotal: ₹${response.data.totalPrice}`
        );

        navigate(`/payment/${response.data.id}`);
      })
      .catch((error) => {
        console.log("Booking error:", error);
        alert("Booking failed!");
      });
  };

  if (!room) {
    return <p>Loading room...</p>;
  }

  let numberOfNights = 0;
  let totalPrice = 0;

  if (checkIn && checkOut && checkOut > checkIn) {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const timeDifference = endDate - startDate;

    numberOfNights =
      timeDifference / (1000 * 60 * 60 * 24);

    totalPrice = numberOfNights * room.price;
  }

  return (
    <div className="booking-page">
      <div className="booking-container">

        <div className="booking-room">
          <img
            src={room.imageUrl}
            alt={room.roomType}
          />

          <div className="booking-room-info">
            <p className="booking-label">LUXORA HOTEL</p>

            <h1>{room.roomType}</h1>

            <p>{room.description}</p>

            <div className="booking-room-details">
              <span>Capacity</span>
              <strong>{room.capacity} Guests</strong>
            </div>

            <div className="booking-room-details">
              <span>Price</span>
              <strong>₹{room.price} / night</strong>
            </div>
          </div>
        </div>

        <div className="booking-form-box">
          <p className="booking-label">YOUR STAY</p>

          <h2>Complete Your Booking</h2>

          <form onSubmit={handleBooking}>

            <div className="booking-input-group">
              <label>Check-in</label>

              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>

            <div className="booking-input-group">
              <label>Check-out</label>

              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>

            <div className="booking-input-group">
              <label>Guests</label>

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

            <div className="booking-summary">

              <div>
                <span>Price per night</span>
                <strong>₹{room.price}</strong>
              </div>

              <div>
                <span>Nights</span>
                <strong>{numberOfNights}</strong>
              </div>

              <div className="booking-total">
                <span>Total</span>
                <strong>₹{totalPrice}</strong>
              </div>

            </div>

            <button
              type="submit"
              className="confirm-booking-button"
            >
              Confirm Booking
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Booking;