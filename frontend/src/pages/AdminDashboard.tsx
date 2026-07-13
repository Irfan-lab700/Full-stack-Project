import "./AdminDashboard.css";
import { useState } from "react";


function AdminDashboard() {
  const [selectedFile, setSelectedFile] =useState<File | null>(null);
  const [subject, setSubject] =useState("");

  const [message, setMessage] =useState("");

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file");
      return;
    }

    if (!subject.trim()) {
      setMessage("Please enter subject");
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    const formData = new FormData();

    formData.append(
      "subject",
      subject
    );

    formData.append(
      "file",
      selectedFile
    );

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-document",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data =
        await response.json();

      setMessage(data.message);

      setSelectedFile(null);
      setSubject("");
    } catch {
      setMessage("Upload failed");
    }
  };

  return (
    <div className="admin-container">
      <h2>🛡️ Admin Dashboard</h2>

      <div className="admin-cards">

        <div className="admin-card">
          <h3>Upload Documents</h3>

          <input
            type="text"
            placeholder="Enter Subject"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="file"
            onChange={(e) => {
              if (
                e.target.files &&
                e.target.files.length > 0
              ) {
                setSelectedFile(
                  e.target.files[0]
                );
              }
            }}
          />

          {selectedFile && (
            <p>
              Selected:{" "}
              {selectedFile.name}
            </p>
          )}

          <button
            onClick={handleUpload}
          >
            Upload
          </button>

          <p>{message}</p>
        </div>

        <div className="admin-card">
          <h3>Manage Users</h3>
          <p>
            Control user access and roles.
          </p>
        </div>

        <div className="admin-card">
          <h3>Analytics</h3>
          <p>
            View system insights.
          </p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;