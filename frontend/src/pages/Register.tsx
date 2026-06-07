import "./Register.css";
import { useState } from 'react';
import { Link } from "react-router-dom";
function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div className = "register-page">
    <div className="register-form">
      <h2>Create Account</h2>
      <form className = "register-inputs">
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type = "submit">Register</button>
        <Link to="/login">
        Already have an account? Login
        </Link>
      </form>
      </div>
      <div className = "register-img">
        <img src = "https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVnaXN0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="Register" />
      </div>
      
    </div>
  );
}
export default Register