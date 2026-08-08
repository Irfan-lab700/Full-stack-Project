import "./UserDashboard.css";


function UserDashboard() {

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Manage academic resources and assignments.</p>
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
        <button onClick={() => window.location.href = "/notes"}>Access Notes</button>
        <button onClick={() => window.location.href = "/tasks"}>View Assignment</button>
        <button onClick={() => window.location.href = "/opportunities"}>See Opportunity</button>
      </div>
    </div>
  );
}

export default UserDashboard;