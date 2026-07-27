import "./UserDashboard.css";


function UserDashboard() {
  return (
    <div className="user-container">
      <h2>👤 User Dashboard</h2>

      <div className="user-cards">
        

        <div className="user-card">
          <h3>Documents</h3>
          <p>Access uploaded resources.</p>
        </div>

        <div className="user-card">
          <h3>AI Assistant</h3>
          <p>Ask questions from knowledge base.</p>
        </div>

        
        
      </div>
    </div>
  );
}

export default UserDashboard;