import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    axios
      .get(`http://localhost:8080/api/bookings/user/${user.id}`)
      .then(async (response) => {
        console.log("My bookings:", response.data);

        const bookingList = response.data;
        setBookings(bookingList);
        setLoading(false);

        const paymentData = {};

        for (const booking of bookingList) {
          try {
            const paymentResponse = await axios.get(
              `http://localhost:8080/api/payments/booking/${booking.id}`
            );

            paymentData[booking.id] = paymentResponse.data;
          } catch {
            console.log(
              `No payment found for booking ${booking.id}`
            );
          }
        }

        setPayments(paymentData);
      })
      .catch((error) => {
        console.log("Booking error:", error);
        setError(true);
        setLoading(false);
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

      {!user ? (
        <div className="page-state">
          <h2>Please log in</h2>
          <p>Log in to see and manage your bookings.</p>
          <Link to="/login" className="page-state-button">
            Login
          </Link>
        </div>
      ) : loading ? (
        <div className="page-state">
          <div className="page-loader"></div>
          <p>Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="page-state error">
          <h2>Something went wrong</h2>
          <p>Could not load your bookings. Please try again later.</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="page-state">
          <h2>No bookings yet</h2>
          <p>You haven't booked a stay with us yet.</p>
          <Link to="/rooms" className="page-state-button">
            Browse Rooms
          </Link>
        </div>
      ) : (
      <div className="bookings-list">

        {bookings.map((booking) => {

          const payment = payments[booking.id];

          const isPaid =
            payment &&
            payment.paymentStatus === "SUCCESS";

          return (
            <div
              className="booking-card"
              key={booking.id}
            >

              <div className="booking-image">

                <img
                  src={booking.room.imageUrl}
                  alt={booking.room.roomType}
                />

              </div>

              <div className="booking-info">

                <div className="booking-title">

                  <div>

                    <p>
                      ROOM {booking.room.roomNumber}
                    </p>

                    <h2>
                      {booking.room.roomType}
                    </h2>

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

                  <div className="booking-actions">

                    {isPaid ? (

                      <span className="paid-booking">
                        ✓ PAID
                      </span>

                    ) : (

                      <button
                        className="pay-booking-button"
                        onClick={() =>
                          navigate(`/payment/${booking.id}`)
                        }
                      >
                        Pay Now
                      </button>

                    )}

                    <button
                      className="cancel-booking-button"
                      onClick={() =>
                        handleCancel(booking.id)
                      }
                    >
                      Cancel Booking
                    </button>

                  </div>

                )}

              </div>

            </div>
          );
        })}

      </div>
      )}

    </div>
  );
};

export default MyBookings;
