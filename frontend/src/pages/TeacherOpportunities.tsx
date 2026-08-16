import { useEffect, useState } from "react";
import "./Opportunities.css";
import Navbar from "../pages/Navbar";

type Opportunity = {
  id: number;
  company_name: string;
  role: string;
  skills: string;
  description: string;
  deadline: string;
  status: string;
  apply_link: string;
};

function TeacherOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href = "/login";
  };

  const fetchOpportunities = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/opportunities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const createOpportunity = async () => {
    if (
      !company.trim() ||
      !role.trim() ||
      !skills.trim() ||
      !description.trim() ||
      !deadline ||
      !applyLink.trim()
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/opportunities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company_name: company.trim(),
            role: role.trim(),
            skills: skills.trim(),
            description: description.trim(),
            deadline,
            apply_link: applyLink.trim(),
            status: "Live",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Unable to create opportunity.");
        return;
      }

      setCompany("");
      setRole("");
      setSkills("");
      setDescription("");
      setDeadline("");
      setApplyLink("");

      setMessage("Opportunity posted successfully.");
      fetchOpportunities();
    } catch (error) {
      console.error("Create opportunity error:", error);
      setMessage("Something went wrong.");
    }
  };

  const deleteOpportunity = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/opportunities/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Unable to delete opportunity.");
        return;
      }

      setOpportunities((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("Delete opportunity error:", error);
    }
  };

  return (
    <>
      <Navbar
        username={username}
        onLogout={handleLogout}
      />

      <div className="opportunity-container">
        <div className="opportunity-header">
          <h2>Opportunity Management</h2>
          <p>
            Post internship and placement opportunities for students.
          </p>
        </div>

        <div className="opportunity-form">
          <h3>Create Opportunity</h3>

          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <input
            type="text"
            placeholder="Required Skills (Python, React, ML)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <textarea
            placeholder="Opportunity Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="url"
            placeholder="Application Link"
            value={applyLink}
            onChange={(e) => setApplyLink(e.target.value)}
          />

          <button onClick={createOpportunity}>
            Post Opportunity
          </button>

          {message && (
            <p className="form-message">{message}</p>
          )}
        </div>

        <div className="opportunity-list">
          <h3>Your Opportunities</h3>

          {loading ? (
            <p>Loading opportunities...</p>
          ) : opportunities.length === 0 ? (
            <p>No opportunities posted yet.</p>
          ) : (
            opportunities.map((item) => (
              <div
                className="opportunity-card"
                key={item.id}
              >
                <div className="card-top">
                  <div>
                    <h3>{item.company_name}</h3>
                    <p className="opportunity-role">
                      {item.role}
                    </p>
                  </div>

                  <span className="status-badge">
                    {item.status || "Live"}
                  </span>
                </div>

                <p>
                  <strong>Skills:</strong> {item.skills}
                </p>

                <p>
                  <strong>Deadline:</strong> {item.deadline}
                </p>

                <p className="opportunity-description">
                  {item.description}
                </p>

                {item.apply_link && (
                  <a
                    href={item.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-link"
                  >
                    Application Link
                  </a>
                )}

                <button
                  className="delete-btn"
                  onClick={() => deleteOpportunity(item.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default TeacherOpportunities;