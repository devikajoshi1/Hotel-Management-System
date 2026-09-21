import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookingSearch from "../components/BookingSearch";
import FeaturedRooms from "../components/FeaturedRooms";

const Home = () => {
  return (
    <div>
      <Hero />
      <BookingSearch/>
      <FeaturedRooms/>
    </div>
  );
};

export default Home;