import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
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
        <button onClick={() => navigate("/tasks")}>Upload Notes</button>
        <button onClick={() => navigate("/assignments")}>Create Assignment</button>
        <button onClick={() => navigate("/opportunities")}>Post Opportunity</button>
      </div>
    </div>
  );
}

export default AdminDashboard;