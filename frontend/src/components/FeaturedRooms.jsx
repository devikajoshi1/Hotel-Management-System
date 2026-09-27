import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoomCard from "./RoomCard";
import "./FeaturedRooms.css";

const FeaturedRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/rooms")
      .then((response) => {
        // show the first 3 rooms that can be booked
        const availableRooms = response.data.filter(
          (room) => room.available !== false
        );
        setRooms(availableRooms.slice(0, 3));
        setLoading(false);
      })
      .catch((error) => {
        console.log("Featured rooms error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="featured-rooms">

      <div className="section-heading">
        <p>OUR ROOMS</p>
        <h2>Stay in comfort & style</h2>
      </div>

      {loading ? (
        <div className="page-state compact">
          <div className="page-loader"></div>
          <p>Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="page-state compact">
          <p>Our rooms will be listed here soon. Please check back later.</p>
        </div>
      ) : (
        <>
          <div className="room-grid">
            {rooms.map((room) => (
              <RoomCard room={room} key={room.id} />
            ))}
          </div>

          <div className="featured-rooms-footer">
            <Link to="/rooms" className="featured-rooms-link">
              View All Rooms
            </Link>
          </div>
        </>
      )}

    </section>
  );
};

export default FeaturedRooms;
