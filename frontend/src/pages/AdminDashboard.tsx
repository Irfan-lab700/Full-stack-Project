import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage academic resources and student activities.</p>
      </div>
      <div className="stats">
        <div className="stat-card">
          <h2>42</h2>
          <span>Total Notes</span>
        </div>
        <div className="stat-card">
          <h2>18</h2>
          <span>Total Assignments</span>
        </div>
        <div className="stat-card">
          <h2>7</h2>
          <span>Total Opportunities</span>
        </div>
      </div>
      <div className="quick-actions">
        <button onClick={() => window.location.href = "/tasks"}>Upload Notes</button>
        <button onClick={() => window.location.href = "/assignments"}>Create Assignment</button>
        <button onClick={() => window.location.href = "/opportunities"}>Post Opportunity</button>
      </div>
    </div>
  );
}

export default AdminDashboard;