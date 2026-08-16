import { useEffect, useState } from "react";
import "./TeacherNotes.css";
import Navbar from "../pages/Navbar";
import { useNavigate } from "react-router-dom";

type DocumentType = {
  id: number;
  filename: string;
  subject: string;
};

function TeacherNotes() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";
  const navigate = useNavigate();

  const fetchDocuments = async () => {
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

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        setMessage("Unable to load notes.");
        return;
      }

      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Unable to connect to server.");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a PDF file.");
      return;
    }

    if (!subject.trim()) {
      setMessage("Please enter a subject.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("subject", subject.trim());
    formData.append("file", selectedFile);

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

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Upload failed.");
        return;
      }

      setMessage("Note uploaded successfully.");
      setSelectedFile(null);
      setSubject("");

      await fetchDocuments();
    } catch {
      setMessage("Unable to upload note.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!token) {
      navigate("/login");
      return;
    }

    setDeletingId(documentId);
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Unable to delete note.");
        return;
      }

      setMessage("Note deleted successfully.");
      await fetchDocuments();
    } catch {
      setMessage("Unable to delete note.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <>
      <Navbar username={username} onLogout={handleLogout} />

      <div className="teacher-notes-container">
        <div className="tasks-header">
          <h2>Manage Notes</h2>
          <p>Upload and manage academic resources for students.</p>
        </div>

        <div className="notes-layout">
          <div className="upload-note-card">
            <h3>Upload New Note</h3>

            <input
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
            />

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) =>
                setSelectedFile(e.target.files?.[0] || null)
              }
              disabled={loading}
            />

            {selectedFile && (
              <p className="selected-file">
                Selected: {selectedFile.name}
              </p>
            )}

            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Note"}
            </button>

            {message && (
              <p className="note-message">{message}</p>
            )}
          </div>

          <div className="uploaded-notes">
            <div className="section-heading">
              <h3>Your Uploaded Notes</h3>
              <span>{documents.length} notes</span>
            </div>

            {documents.length === 0 ? (
              <p className="empty-text">
                No notes uploaded yet.
              </p>
            ) : (
              <div className="notes-grid">
                {documents.map((doc) => (
                  <div className="teacher-note-card" key={doc.id}>
                    <div>
                      <span className="subject-badge">
                        {doc.subject}
                      </span>

                      <h4>{doc.filename}</h4>
                    </div>

                    <button
                      className="delete-note-btn"
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                    >
                      {deletingId === doc.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TeacherNotes;