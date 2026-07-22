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
            AI Powered College 
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


        <div className="hero-image">

          <div className="dashboard-card">

            <h3>
              🤖 AI Assistant
            </h3>

            <p>
              Ask about assignments, deadlines,
              submissions and academic documents.
            </p>

          </div>

        </div>


      </section>



      <section className="features">

        <h2>
          Features
        </h2>


        <div className="feature-grid">


          <div className="feature-card">
            <h3>
              📚 Assignment Management
            </h3>

            <p>
              Teachers can upload assignments
              and students can submit them easily.
            </p>

          </div>



          <div className="feature-card">

            <h3>
              🤖 RAG AI Assistant
            </h3>

            <p>
              Get intelligent answers from uploaded
              academic documents.
            </p>

          </div>



          <div className="feature-card">

            <h3>
              📄 Resume Intelligence
            </h3>

            <p>
              Find students based on skills,
              projects and experience.
            </p>

          </div>


        </div>

      </section>


    </div>
  );
}

export default Landing;