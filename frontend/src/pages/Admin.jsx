import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

const emptyRoom = {
  roomNumber: "",
  roomType: "",
  price: "",
  capacity: "",
  description: "",
  imageUrl: "",
  available: true,
};

const Admin = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "ADMIN";
  const userId = user?.id;

  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [activeTab, setActiveTab] = useState("rooms");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [roomForm, setRoomForm] = useState(emptyRoom);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [showRoomForm, setShowRoomForm] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const config = { headers: { "X-User-Id": userId } };

    Promise.all([
      axios.get("http://localhost:8080/api/rooms"),
      axios.get("http://localhost:8080/api/bookings", config),
      axios.get("http://localhost:8080/api/users", config),
      axios.get("http://localhost:8080/api/payments", config),
    ])
      .then(([roomsResponse, bookingsResponse, usersResponse, paymentsResponse]) => {
        setRooms(roomsResponse.data);
        setBookings(bookingsResponse.data);
        setUsers(usersResponse.data);
        setPayments(paymentsResponse.data);
        setError("");
      })
      .catch((error) => {
        console.log("Admin error:", error);
        setError(error.response?.data?.message || "Could not load admin data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAdmin, userId, reloadKey]);

  const reload = () => {
    setReloadKey((key) => key + 1);
  };

  const adminConfig = { headers: { "X-User-Id": userId } };

  // ---------- Rooms ----------

  const handleRoomChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRoomForm({
      ...roomForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openAddRoom = () => {
    setRoomForm(emptyRoom);
    setEditingRoomId(null);
    setShowRoomForm(true);
  };

  const openEditRoom = (room) => {
    setRoomForm({
      roomNumber: room.roomNumber || "",
      roomType: room.roomType || "",
      price: room.price,
      capacity: room.capacity,
      description: room.description || "",
      imageUrl: room.imageUrl || "",
      available: room.available,
    });
    setEditingRoomId(room.id);
    setShowRoomForm(true);
  };

  const closeRoomForm = () => {
    setRoomForm(emptyRoom);
    setEditingRoomId(null);
    setShowRoomForm(false);
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();

    const room = {
      ...roomForm,
      price: Number(roomForm.price),
      capacity: Number(roomForm.capacity),
    };

    const request = editingRoomId
      ? axios.put(`http://localhost:8080/api/rooms/${editingRoomId}`, room, adminConfig)
      : axios.post("http://localhost:8080/api/rooms", room, adminConfig);

    request
      .then(() => {
        alert(editingRoomId ? "Room updated!" : "Room added!");
        closeRoomForm();
        reload();
      })
      .catch((error) => {
        console.log("Room save error:", error);
        alert(error.response?.data?.message || "Could not save room.");
      });
  };

  const toggleAvailability = (room) => {
    axios
      .put(
        `http://localhost:8080/api/rooms/${room.id}`,
        { ...room, available: !room.available },
        adminConfig
      )
      .then(() => {
        reload();
      })
      .catch((error) => {
        console.log("Availability error:", error);
        alert(error.response?.data?.message || "Could not update room.");
      });
  };

  const handleDeleteRoom = (room) => {
    if (!window.confirm(`Delete room ${room.roomNumber}?`)) return;

    axios
      .delete(`http://localhost:8080/api/rooms/${room.id}`, adminConfig)
      .then(() => {
        alert("Room deleted!");
        reload();
      })
      .catch((error) => {
        console.log("Delete error:", error);
        alert(error.response?.data?.message || "Could not delete room.");
      });
  };

    // ---------- Bookings ----------

  const handleCancelBooking = (booking) => {
    if (!window.confirm(`Cancel booking #${booking.id}?`)) return;

    axios
      .put(`http://localhost:8080/api/bookings/${booking.id}/cancel`)
      .then(() => {
        reload();
      })
      .catch((error) => {
        console.log("Cancel error:", error);
        alert(error.response?.data?.message || "Could not cancel booking.");
      });
  };


  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="page-state">
          <h2>Admins only</h2>
          <p>Please log in with an admin account to view this page.</p>
          <Link to="/login" className="page-state-button">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="page-state compact">
          <div className="page-loader"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="page-state error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const activeBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;

  const revenue = payments
    .filter((payment) => payment.paymentStatus === "SUCCESS")
    .reduce((total, payment) => total + payment.amount, 0);

  
  const paymentByBookingId = {};
  payments.forEach((payment) => {
    paymentByBookingId[payment.booking.id] = payment;
  });

  const filteredBookings = bookings
    .filter((booking) => statusFilter === "ALL" || booking.status === statusFilter)
    .sort((a, b) => b.id - a.id);

  return (
    <div className="admin-page">

      <div className="admin-header">
        <p>ADMIN PANEL</p>
        <h1>Dashboard</h1>
        <span>Manage your Luxora hotel.</span>
      </div>

      <div className="admin-cards">

        <div className="admin-card">
          <span>ROOMS</span>
          <strong>{rooms.length}</strong>
          <p>Total rooms</p>
        </div>

        <div className="admin-card">
          <span>BOOKINGS</span>
          <strong>{activeBookings}</strong>
          <p>Confirmed bookings</p>
        </div>

        <div className="admin-card">
          <span>USERS</span>
          <strong>{users.length}</strong>
          <p>Registered users</p>
        </div>

        <div className="admin-card">
          <span>REVENUE</span>
          <strong>₹{revenue.toLocaleString("en-IN")}</strong>
          <p>Payments received</p>
        </div>

      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "rooms" ? "admin-tab active" : "admin-tab"}
          onClick={() => setActiveTab("rooms")}
        >
          Rooms
        </button>

        <button
          className={activeTab === "bookings" ? "admin-tab active" : "admin-tab"}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
      </div>

      {activeTab === "rooms" && (
        <div className="admin-panel">

          <div className="admin-panel-header">
            <div>
              <p className="admin-section-label">MANAGEMENT</p>
              <h2>Rooms</h2>
            </div>

            {!showRoomForm && (
              <button className="admin-primary-button" onClick={openAddRoom}>
                + Add Room
              </button>
            )}
          </div>

          {showRoomForm && (
            <form className="admin-form" onSubmit={handleRoomSubmit}>

              <h3>{editingRoomId ? "Edit Room" : "Add New Room"}</h3>

              <div className="admin-form-grid">

                <div className="admin-field">
                  <label>Room Number</label>
                  <input
                    name="roomNumber"
                    value={roomForm.roomNumber}
                    onChange={handleRoomChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Room Type</label>
                  <input
                    name="roomType"
                    value={roomForm.roomType}
                    onChange={handleRoomChange}
                    placeholder="Deluxe Room"
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Price per night (₹)</label>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={roomForm.price}
                    onChange={handleRoomChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Capacity (guests)</label>
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    value={roomForm.capacity}
                    onChange={handleRoomChange}
                    required
                  />
                </div>

                <div className="admin-field full">
                  <label>Image URL</label>
                  <input
                    name="imageUrl"
                    value={roomForm.imageUrl}
                    onChange={handleRoomChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="admin-field full">
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={roomForm.description}
                    onChange={handleRoomChange}
                  />
                </div>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    name="available"
                    checked={roomForm.available}
                    onChange={handleRoomChange}
                  />
                  Available for booking
                </label>

              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-primary-button">
                  {editingRoomId ? "Save Changes" : "Add Room"}
                </button>

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeRoomForm}
                >
                  Cancel
                </button>
              </div>

            </form>
          )}

          {rooms.length === 0 ? (
            <p className="admin-empty">No rooms yet. Add your first room.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Capacity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>
                        <div className="admin-room-cell">
                          <img src={room.imageUrl} alt={room.roomType} />
                          <div>
                            <strong>{room.roomType}</strong>
                            <span>Room {room.roomNumber}</span>
                          </div>
                        </div>
                      </td>

                      <td>{room.capacity} guests</td>

                      <td>₹{room.price}</td>

                      <td>
                        <span
                          className={
                            room.available
                              ? "admin-badge available"
                              : "admin-badge unavailable"
                          }
                        >
                          {room.available ? "AVAILABLE" : "UNAVAILABLE"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-row-actions">
                          <button onClick={() => openEditRoom(room)}>
                            Edit
                          </button>

                          <button onClick={() => toggleAvailability(room)}>
                            {room.available ? "Disable" : "Enable"}
                          </button>

                          <button
                            className="danger"
                            onClick={() => handleDeleteRoom(room)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

          {activeTab === "bookings" && (
        <div className="admin-panel">

          <div className="admin-panel-header">
            <div>
              <p className="admin-section-label">RESERVATIONS</p>
              <h2>Bookings</h2>
            </div>

            <select
              className="admin-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All bookings</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {filteredBookings.length === 0 ? (
            <p className="admin-empty">No bookings to show.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => {
                    const payment = paymentByBookingId[booking.id];

                    return (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>

                        <td>
                          <strong>{booking.user.name}</strong>
                          <span className="admin-subtext">{booking.user.email}</span>
                        </td>

                        <td>
                          {booking.room.roomType}
                          <span className="admin-subtext">Room {booking.room.roomNumber}</span>
                        </td>

                        <td>
                          {booking.checkIn}
                          <span className="admin-subtext">to {booking.checkOut}</span>
                        </td>

                        <td>₹{booking.totalPrice}</td>

                        <td>
                          <span className={payment ? "admin-badge paid" : "admin-badge unpaid"}>
                            {payment ? payment.paymentMethod : "UNPAID"}
                          </span>
                        </td>

                        <td>
                          <span className={`admin-badge ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>

                        <td>
                          {booking.status === "CONFIRMED" && (
                            <div className="admin-row-actions">
                              <button
                                className="danger"
                                onClick={() => handleCancelBooking(booking)}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}



    </div>
  );
};

export default Admin;
