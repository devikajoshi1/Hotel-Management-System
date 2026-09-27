import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./RoomDetails.css";

const RoomDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/rooms/${id}`)
      .then((response) => {
        console.log("Room data:", response.data);

        if (!response.data) {
          setError("notfound");
          return;
        }

        setRoom(response.data);
      })
      .catch((error) => {
        console.log("Room error:", error);
        setError(error.response?.status === 404 ? "notfound" : "failed");
      });
  }, [id]);

  if (error) {
    return (
      <div className="room-details-page">
        <div className="page-state error">
          {error === "notfound" ? (
            <>
              <h2>Room not found</h2>
              <p>This room doesn't exist or may have been removed.</p>
            </>
          ) : (
            <>
              <h2>Something went wrong</h2>
              <p>Could not load this room. Please try again later.</p>
            </>
          )}

          <Link to="/rooms" className="page-state-button">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-details-page">
        <div className="page-state">
          <div className="page-loader"></div>
          <p>Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-details-page">

      <div className="room-details-container">

        <div className="room-details-image">
          <img
            src={room.imageUrl}
            alt={room.roomType}
          />
        </div>

        <div className="room-details-info">

          <p className="room-details-label">LUXORA HOTEL</p>

          <h1>{room.roomType}</h1>

          <p className="room-details-description">
            {room.description}
          </p>

          <div className="room-details-line"></div>

          <div className="room-details-item">
            <span>CAPACITY</span>
            <strong>{room.capacity} Guests</strong>
          </div>

          <div className="room-details-item">
            <span>PRICE</span>
            <strong>₹{room.price} / night</strong>
          </div>

          <button
            className="book-now-button"
            onClick={() => navigate(`/booking/${room.id}`)}
          >
            Book Now
          </button>

        </div>

      </div>

    </div>
  );
};

export default RoomDetails;