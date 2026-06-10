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
        <button type = "submit" onClick={async(e) => {
          e.preventDefault();
          const response = await fetch("http://127.0.0.1:8000/Login", {
  method: "POST",
});

const data = await response.json();
console.log(data);}}>Login</button>
        <Link to="/register">
        Don't have an account? Register
        </Link>
      </form>
      </div>
      <div className = "login-img">
        <img src = "https://images.openai.com/static-rsc-4/ZUwf-Vq_6mnMOi62ldwr3ksOndycManfaDJtYppF9vLXXr0vYCCyw8jA8Em71zP5rVX50x-_WKCvVwpQwTwGhB0yeGhUbcWVJi1J4_VdiebSRPsBjpTqK4GgnVtU0IM9aJINHyK_WoNaUx_OlcKDkeMfS8sSBQN1vJfL6WvLKb3EfoKJRtPW3tVZm-4hYQ6c?purpose=inline" alt="login" />
      </div>
      
    </div>
  );
}
export default Login