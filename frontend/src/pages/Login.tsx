import "./Login.css";
import { useState } from 'react';
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleLogin = async (e) => {
e.preventDefault();

const response = await fetch("http://127.0.0.1:8000/Login", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
email,
password,
}),
});

const data = await response.json();

if (data.access_token) {
localStorage.setItem("token", data.access_token);

const profileResponse = await fetch(
  "http://127.0.0.1:8000/profile",
  {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  }
);

const profileData = await profileResponse.json();

console.log("PROFILE DATA:", profileData);

}

console.log("TOKEN:", localStorage.getItem("token"));
console.log("LOGIN DATA:", data);

if (data.success) {
alert("Login successful");
} else {
alert(data.message);
}
};

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
        <button type = "submit" onClick={handleLogin}>Login</button>
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