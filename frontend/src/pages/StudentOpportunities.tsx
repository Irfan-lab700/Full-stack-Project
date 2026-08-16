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

function StudentOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

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

  useEffect(() => {
    const fetchOpportunities = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
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
        console.error(
          "Failed to fetch opportunities:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const liveOpportunities = opportunities.filter(
    (item) => item.status === "Live"
  );

  return (
    <>
      <Navbar
        username={username}
        onLogout={handleLogout}
      />

      <div className="opportunity-container">
        <div className="opportunity-header">
          <h2>Available Opportunities</h2>

          <p>
            Explore internships and placement opportunities.
          </p>
        </div>

        <div className="opportunity-list">
          {loading ? (
            <p className="opportunity-message">
              Loading opportunities...
            </p>
          ) : liveOpportunities.length === 0 ? (
            <p className="opportunity-message">
              No opportunities available currently.
            </p>
          ) : (
            liveOpportunities.map((item) => (
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
                    Live
                  </span>
                </div>

                <div className="opportunity-details">
                  <p>
                    <strong>Required Skills</strong>
                    <span>{item.skills}</span>
                  </p>

                  <p>
                    <strong>Deadline</strong>
                    <span>{item.deadline}</span>
                  </p>
                </div>

                <p className="opportunity-description">
                  {item.description}
                </p>

                {item.apply_link && (
                  <a
                    href={item.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-btn"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default StudentOpportunities;