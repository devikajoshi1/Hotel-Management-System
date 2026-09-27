import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import "./Rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();

  // guests comes from the home page search, e.g. /rooms?guests=2
  const guests = Number(searchParams.get("guests")) || 0;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/rooms")
      .then((response) => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  }, []);

  const filteredRooms = guests
    ? rooms.filter((room) => room.capacity >= guests)
    : rooms;

  return (
    <div className="rooms-page">

      <h1>Our Rooms</h1>
      <p>Choose a room that suits your stay.</p>

      {guests > 0 && !loading && !error && (
        <div className="rooms-filter">
          Showing rooms for {guests} {guests === 1 ? "guest" : "guests"}
          <Link to="/rooms">Clear filter</Link>
        </div>
      )}

      {loading ? (
        <div className="page-state">
          <div className="page-loader"></div>
          <p>Loading rooms...</p>
        </div>
      ) : error ? (
        <div className="page-state error">
          <h2>Something went wrong</h2>
          <p>Could not load rooms. Please try again later.</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="page-state">
          <h2>No rooms found</h2>

          {guests > 0 ? (
            <>
              <p>We don't have a room for {guests} guests right now.</p>
              <Link to="/rooms" className="page-state-button">
                See All Rooms
              </Link>
            </>
          ) : (
            <p>There are no rooms listed yet. Please check back soon.</p>
          )}
        </div>
      ) : (
        <div className="rooms-grid">
          {filteredRooms.map((room) => (
            <RoomCard room={room} key={room.id} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Rooms;
