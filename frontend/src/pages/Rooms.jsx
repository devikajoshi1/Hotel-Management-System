import { useEffect, useState } from "react";
import axios from "axios";
import "./Rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/rooms")
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="rooms-page">

      <h1>Our Rooms</h1>
      <p>Choose a room that suits your stay.</p>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div className="room-card" key={room.id}>

            <img
              src={room.imageUrl}
              alt={room.roomType}
            />

            <div className="room-info">
              <h2>{room.roomType}</h2>

              <p>{room.description}</p>

              <p>Capacity: {room.capacity} guests</p>

              <h3>₹{room.price} / night</h3>

              <button>View Details</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Rooms;