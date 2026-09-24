import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    axios
      .get(`http://localhost:8080/api/bookings/user/${user.id}`)
      .then((response) => {
        console.log("My bookings:", response.data);
        setBookings(response.data);
      })
      .catch((error) => {
        console.log("Booking error:", error);
      });
  }, []);

  const handleCancel = (bookingId) => {
    axios
      .put(`http://localhost:8080/api/bookings/${bookingId}/cancel`)
      .then(() => {
        alert("Booking cancelled successfully!");

        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "CANCELLED" }
              : booking
          )
        );
      })
      .catch((error) => {
        console.log("Cancel error:", error);
        alert("Failed to cancel booking.");
      });
  };

  return (
    <div className="my-bookings-page">

      <div className="my-bookings-header">
        <p>YOUR STAYS</p>
        <h1>My Bookings</h1>
        <span>
          Manage your upcoming and previous stays.
        </span>
      </div>

      <div className="bookings-list">

        {bookings.map((booking) => (

          <div className="booking-card" key={booking.id}>

            <div className="booking-image">
              <img
                src={booking.room.imageUrl}
                alt={booking.room.roomType}
              />
            </div>

            <div className="booking-info">

              <div className="booking-title">

                <div>
                  <p>ROOM {booking.room.roomNumber}</p>

                  <h2>{booking.room.roomType}</h2>
                </div>

                <span
                  className={`booking-status ${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>

              </div>

              <p className="booking-description">
                {booking.room.description}
              </p>

              <div className="booking-details">

                <div>
                  <span>CHECK-IN</span>
                  <strong>{booking.checkIn}</strong>
                </div>

                <div>
                  <span>CHECK-OUT</span>
                  <strong>{booking.checkOut}</strong>
                </div>

                <div>
                  <span>GUESTS</span>
                  <strong>{booking.guests}</strong>
                </div>

                <div>
                  <span>TOTAL</span>
                  <strong>₹{booking.totalPrice}</strong>
                </div>

              </div>

              {booking.status === "CONFIRMED" && (
                <div>
                  <button
                    className="pay-booking-button"
                    onClick={() => navigate(`/payment/${booking.id}`)}
                  >
                    Pay Now
                  </button>

                  <button
                    className="cancel-booking-button"
                    onClick={() => handleCancel(booking.id)}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default MyBookings;