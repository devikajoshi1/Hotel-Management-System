import { Link } from "react-router-dom";
import "./RoomCard.css";

const RoomCard = ({ room }) => {
  const isUnavailable = room.available === false;

  return (
    <div className={`room-card ${isUnavailable ? "unavailable" : ""}`}>

      <div className="room-card-image">
        <img src={room.imageUrl} alt={room.roomType} />

        {isUnavailable && (
          <span className="room-card-badge">UNAVAILABLE</span>
        )}
      </div>

      <div className="room-card-info">
        <h3>{room.roomType}</h3>

        <p className="room-card-description">{room.description}</p>

        <p className="room-card-capacity">
          Capacity: {room.capacity} guests
        </p>

        <p className="room-card-price">
          ₹{Number(room.price).toLocaleString("en-IN")} <span>/ night</span>
        </p>

        <Link to={`/rooms/${room.id}`} className="room-card-button">
          View Details
        </Link>
      </div>

    </div>
  );
};

export default RoomCard;
