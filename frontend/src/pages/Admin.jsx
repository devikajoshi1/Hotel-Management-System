import "./Admin.css";

const Admin = () => {
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
          <strong>0</strong>
          <p>Total rooms</p>
        </div>

        <div className="admin-card">
          <span>BOOKINGS</span>
          <strong>0</strong>
          <p>Total bookings</p>
        </div>

        <div className="admin-card">
          <span>USERS</span>
          <strong>0</strong>
          <p>Registered users</p>
        </div>

      </div>

      <div className="admin-section">

        <div>
          <p className="admin-section-label">MANAGEMENT</p>
          <h2>Hotel Management</h2>
        </div>

        <div className="admin-actions">

          <button>Add Room</button>

          <button>Manage Rooms</button>

          <button>View Bookings</button>

        </div>

      </div>

    </div>
  );
};

export default Admin;