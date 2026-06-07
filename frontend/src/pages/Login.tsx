import "./Login.css";
import { useState } from 'react';
import { Link } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <div className = "login-page">
    <div className="login-form">
      <h2>Login to your account</h2>
      <form className = "login-inputs">
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
        <button type = "submit">Login</button>
        <Link to="/register">
        Don't have an account? Register
        </Link>
      </form>
      </div>
      <div className = "login-img">
        <img src = "https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVnaXN0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" alt="login" />
      </div>
      
    </div>
  );
}
export default Login