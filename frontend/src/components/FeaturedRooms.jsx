import "./FeaturedRooms.css";

const FeaturedRooms = () => {
  const rooms = [
    {
      name: "Deluxe Room",
      price: "₹4,500",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
    },
    {
      name: "Luxury Suite",
      price: "₹7,500",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    },
    {
      name: "Executive Room",
      price: "₹6,000",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    },
  ];

  return (
    <section className="featured-rooms">

      <div className="section-heading">
        <p>OUR ROOMS</p>
        <h2>Stay in comfort & style</h2>
      </div>

      <div className="room-grid">

        {rooms.map((room) => (
          <div className="room-card" key={room.name}>

            <img src={room.image} alt={room.name} />

            <div className="room-info">
              <h3>{room.name}</h3>
              <p>From {room.price} / night</p>

              <button>View Room</button>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default FeaturedRooms;