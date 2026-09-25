import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentSuccess, setPaymentSuccess] = useState(false);


  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/bookings/${bookingId}`)
      .then((response) => {
        setBooking(response.data);
      })
      .catch((error) => {
        console.log("Booking error:", error);
      });
  }, [bookingId]);

  const handlePayment = (e) => {
    e.preventDefault();

    const payment = {
      booking: {
        id: booking.id,
      },
      amount: booking.totalPrice,
      paymentMethod: paymentMethod,
      paymentStatus: "SUCCESS",
    };

    axios
  .post("http://localhost:8080/api/payments", payment)
  .then((response) => {
    console.log("Payment successful:", response.data);
    setPaymentSuccess(true);
  })
  .catch((error) => {
    console.log("Payment error:", error);
    alert("Payment failed!");
  });
  };

  if (!booking) {
    return <p>Loading payment...</p>;
  }
  if(paymentSuccess){
    return(
      <div className="payment-success-page">

        <div className="payment-success-box">

          <div className="success-icon">

            <p className="payment-label">
              LUXORA HOTEL
            </p>

            <h1>Payment Successful</h1>

            <p>
              Your payment of ₹{booking.totalPrice} was
              completed successfully.
            </p>

          <button
            onClick={()=>
              window.location.href = '/my-bookings'
            }
            className="success-bookings-button"
          >View My Bookings</button>

          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page">

      <div className="payment-container">

        {/* LEFT SIDE */}

        <div className="payment-room">

          <p className="payment-label">
            LUXORA HOTEL
          </p>

          <h1>{booking.room.roomType}</h1>

          <img
            className="payment-room-image"
            src={booking.room.imageUrl}
            alt={booking.room.roomType}
          />

          <p className="payment-description">
            {booking.room.description}
          </p>

          <div className="payment-details">

            <div className="payment-detail">
              <span>CHECK-IN</span>
              <strong>{booking.checkIn}</strong>
            </div>

            <div className="payment-detail">
              <span>CHECK-OUT</span>
              <strong>{booking.checkOut}</strong>
            </div>

            <div className="payment-detail">
              <span>GUESTS</span>
              <strong>{booking.guests}</strong>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="payment-form-box">

          <p className="payment-label">
            SECURE PAYMENT
          </p>

          <h2>Complete Payment</h2>

          <form onSubmit={handlePayment}>

            <div className="payment-input-group">

              <label>Payment Method</label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              >
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
              </select>

            </div>

            <div className="payment-total">

              <span>TOTAL AMOUNT</span>

              <strong>
                ₹{booking.totalPrice}
              </strong>

            </div>

            <button
              type="submit"
              className="pay-now-button"
            >
              Pay Now
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Payment;