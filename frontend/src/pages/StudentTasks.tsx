
import { useEffect, useRef, useState } from "react";
import "./StudentTasks.css";
import Navbar from "../pages/Navbar";
import { useNavigate } from "react-router-dom";

type Assignment = {
  id: number;
  title: string;
  description: string;
  subject: string;
  deadline: string;
};

type Submission = {
  id: number;
  assignment: string;
  student: string;
  document: string;
  document_id: number;
};

function StudentTasks() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<number | null>(null);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/assignments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/submissions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const selectedAssignmentData = assignments.find(
    (assignment) => assignment.id === selectedAssignment
  );

  const uploadFile = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();

    formData.append("subject", "Assignment Submission");
    formData.append("document_type", "submission");
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

      if (!response.ok) return null;

      const data = await response.json();

      return data.document_id;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !selectedFile) return;

    setMessage("");

    const documentId = await uploadFile();

    if (!documentId) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/submissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assignment_id: selectedAssignment,
            document_id: documentId,
          }),
        }
      );

      if (!response.ok) return;

      await response.json();

      await fetchSubmissions();

      setSelectedFile(null);
      setSelectedAssignment(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage("Assignment submitted successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSubmission = async (
    submissionId: number
  ) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/submissions/${submissionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      fetchSubmissions();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/login");
  };

  const handleSelectAssignment = (id: number) => {
    setSelectedAssignment(id);
    setMessage("");
  };

  return (
    <>
      <Navbar
        username={username}
        onLogout={handleLogout}
      />

      <div className="student-tasks-container">

        <div className="tasks-header">
          <h2>Assignments</h2>
          <p>View assignments and submit your work.</p>
        </div>

        <div className="tasks-grid">

          {/* Available Assignments */}

          <div className="task-card">
            <h3>Available Assignments</h3>

            {assignments.length === 0 ? (
              <p className="empty-text">
                No assignments available
              </p>
            ) : (
              assignments.map((assignment) => (
                <div
                  className={`assignment-card ${
                    selectedAssignment === assignment.id
                      ? "selected-assignment"
                      : ""
                  }`}
                  key={assignment.id}
                >
                  <h4>{assignment.title}</h4>

                  <span className="subject-badge">
                    {assignment.subject}
                  </span>

                  <p>📅 {assignment.deadline}</p>

                  <p>{assignment.description}</p>

                  <button
                    onClick={() =>
                      handleSelectAssignment(assignment.id)
                    }
                  >
                    {selectedAssignment === assignment.id
                      ? "Selected"
                      : "Select Assignment"}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Submit Assignment */}

          <div className="task-card">
            <h3>Submit Assignment</h3>

            {selectedAssignmentData ? (
              <div className="selected-assignment-info">
                <span>Selected Assignment</span>
                <strong>
                  {selectedAssignmentData.title}
                </strong>
                <small>
                  {selectedAssignmentData.subject}
                </small>
              </div>
            ) : (
              <p className="empty-text">
                Select an assignment first.
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                  setMessage("");
                }
              }}
            />

            {selectedFile && (
              <div className="selected-file">
                <span>Selected File</span>
                <strong>{selectedFile.name}</strong>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedAssignment || !selectedFile}
            >
              Submit Assignment
            </button>

            {message && (
              <p className="success-message">
                ✓ {message}
              </p>
            )}
          </div>

          {/* My Submissions */}

          <div className="task-card">
            <h3>My Submissions</h3>

            {submissions.length === 0 ? (
              <p className="empty-text">
                No submissions yet
              </p>
            ) : (
              submissions.map((submission) => (
                <div
                  className="submission-card"
                  key={submission.id}
                >
                  <p>
                    <strong>Assignment</strong>
                    <br />
                    {submission.assignment}
                  </p>

                  <a
                    href={`http://127.0.0.1:8000/documents/view/${submission.document_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Submission
                  </a>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteSubmission(
                        submission.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default StudentTasks;