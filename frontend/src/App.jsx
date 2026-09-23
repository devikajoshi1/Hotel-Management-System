import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoomDetails from "./pages/RoomDetails";
import Rooms from "./pages/Rooms";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";


const App = () => {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path='/rooms/:id' element={<RoomDetails/>}/>
        <Route path="/booking/:id" element={<Booking/>} />
        <Route path="/my-bookings" element={<MyBookings/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;