import { useNavigate } from "react-router-dom";
import "./Landing.css";

export const Landing=()=>{
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="navbar">
        <h2>Campus Sync</h2>
      </nav>
      <section className="hero">
        <div className="hero-left">
          <div className="content-box">
            <h1>
              All in One Campus
              <span>Management Platform</span>
            </h1>
            <p>
              Manage assignments, submissions, academic resources
              and get instant answers with an intelligent AI assistant.
            </p>
            <div className="hero-buttons">
              <button
                onClick={() => navigate("/login")}
                className="primary-btn"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="secondary-btn"
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className="image-box">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="students"
            />
          </div>
        </div>
      </section>
      <footer className="footer">
        <p>Simplifying academic management with AI.</p>
        <p className="footer-copy">
          © 2026 Campus Sync. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default Landing;