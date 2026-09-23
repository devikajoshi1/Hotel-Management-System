import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RoomDetails.css";
import { Link } from "react-router-dom";

const RoomDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [room, setRoom] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/rooms/${id}`)
      .then((response) => {
        console.log("Room data:", response.data);
        setRoom(response.data);
      })
      .catch((error) => {
        console.log("Room error:", error);
      });
  }, [id]);

  if (!room) {
    return <p>Loading room...</p>;
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