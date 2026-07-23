import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      <nav className="navbar">
        <h2 className="logo">
          CU Assist
        </h2>

        <div className="nav-buttons">
          <button 
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button 
            className="signup-btn"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>
      </nav>


      <section className="hero">

        <div className="hero-content">

          <h1>
            All in One Campus  
            <span> Management Platform</span>
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
              Create Account
            </button>

          </div>

        </div>


      </section>

      <footer className="footer">
  <p>
    Simplifying academic management with AI.
  </p>

  <p className="footer-copy">
    © 2026 CU Assist. All rights reserved.
  </p>

</footer>


    </div>
  );
}

export default Landing;