import { useEffect, useState } from "react";
import "./TeacherTasks.css";

type Assignment = {
  id: number;
  title: string;
  description: string;
  subject: string;
  deadline: string;
};

function TeacherTasks() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/assignments"
      );

      const data = await response.json();

      setAssignments(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            subject,
            deadline,
          }),
        }
      );

      await response.json();

      setTitle("");
      setDescription("");
      setSubject("");
      setDeadline("");

      fetchAssignments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="teacher-tasks-container">

      <div className="tasks-header">
        <h2>Assignment Management</h2>
        <p>Create and manage assignments for students</p>
      </div>

      <div className="tasks-grid">

        <div className="task-card">

          <h3>Create Assignment</h3>

          <input
            type="text"
            placeholder="Assignment Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) =>
              setDeadline(e.target.value)
            }
          />

          <textarea
            placeholder="Assignment Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button
            onClick={handleCreateAssignment}
          >
            Create Assignment
          </button>

        </div>

        <div className="task-card">

          <h3>My Assignments</h3>

          {assignments.length === 0 ? (
            <p className="empty-text">
              No assignments created yet
            </p>
          ) : (
            assignments.map((assignment) => (
              <div
                className="assignment-card"
                key={assignment.id}
              >
                <h4>
                  {assignment.title}
                </h4>

                <span className="subject-badge">
                  {assignment.subject}
                </span>

                <p className="deadline">
                  📅 {assignment.deadline}
                </p>

                <p className="description">
                  {assignment.description}
                </p>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default TeacherTasks;