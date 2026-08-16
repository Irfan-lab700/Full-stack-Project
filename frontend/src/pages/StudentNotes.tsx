import { useEffect, useState } from "react";
import "./StudentNotes.css";
import Navbar from "../pages/Navbar";
import { useNavigate } from "react-router-dom";

type DocumentType = {
  id: number;
  filename: string;
  subject: string;
};

function StudentNotes() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "";

  const fetchDocuments = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/documents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setDocuments([]);
        return;
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.log(error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleViewNote = (id: number) => {
    window.open(
      `http://127.0.0.1:8000/documents/view/${id}`,
      "_blank"
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <>
      <Navbar
        username={username}
        onLogout={handleLogout}
      />

      <div className="student-notes-container">
        <div className="notes-header">
          <h2>Available Notes</h2>
          <p>
            Access course notes and study material uploaded by your teachers.
          </p>
        </div>

        {loading ? (
          <div className="notes-empty">
            <p>Loading notes...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="notes-empty">
            <h3>No notes available</h3>
            <p>
              Study material will appear here once your teachers upload it.
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {documents.map((doc) => (
              <div className="student-note-card" key={doc.id}>
                <div className="note-icon">PDF</div>

                <div className="note-content">
                  <span className="note-subject">
                    {doc.subject}
                  </span>

                  <h4>{doc.filename}</h4>

                  <button
                    className="view-note-btn"
                    onClick={() => handleViewNote(doc.id)}
                  >
                    View Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentNotes;