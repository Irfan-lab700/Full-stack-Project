import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      localStorage.setItem("username", data.username);

      if (data.success && data.access_token) {
        localStorage.setItem(
          "token",
          data.access_token
        );

        localStorage.setItem(
          "role",
          data.role
        );

        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login to your account</h2>
        <form className="login-inputs"onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">Login</button>
          <Link to="/register">Don't have an account? Register</Link>
        </form>
      </div>

      <div className="login-img">
        <img
          src="https://images.openai.com/static-rsc-4/ZUwf-Vq_6mnMOi62ldwr3ksOndycManfaDJtYppF9vLXXr0vYCCyw8jA8Em71zP5rVX50x-_WKCvVwpQwTwGhB0yeGhUbcWVJi1J4_VdiebSRPsBjpTqK4GgnVtU0IM9aJINHyK_WoNaUx_OlcKDkeMfS8sSBQN1vJfL6WvLKb3EfoKJRtPW3tVZm-4hYQ6c?purpose=inline"
          alt="login"
        />
      </div>

    </div>
  );
}
export default Login;