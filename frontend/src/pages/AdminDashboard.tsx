import "./AdminDashboard.css";
import { useState } from "react";

function AdminDashboard() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  return (
    <div className="admin-container">
      <h2>🛡️ Admin Dashboard</h2>

      <div className="admin-cards">
        <div className="admin-card">
          <h3>Upload Documents</h3>
          <p>Manage PDFs for AI retrieval.</p>
          <input
  type="file"
  onChange={(e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }}
/>
{selectedFile && (
  <p>
    Selected: {selectedFile.name}
  </p>
)}
<button>
  Upload
</button>
        </div>

        <div className="admin-card">
          <h3>Manage Users</h3>
          <p>Control user access and roles.</p>
        </div>

        <div className="admin-card">
          <h3>Analytics</h3>
          <p>View system insights.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;