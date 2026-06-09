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
        <img src = "https://images.openai.com/static-rsc-4/v3445sXMczduBjD_-iyrfI1GY63X6-9dz-I4G08CHT0tffJ1fzOBJ8V2RhVcPK4c6XM6rZStRVVFkgJqQjONsLh-KBrncEgrdCD2XLE5rtZPoyN-REmZV44bkMfML-QTFBLQzoEn6Nvhdy423wxdleYteNIQ18irSLR44S9JVLenW8ZighblhZwKUVWeLjCz?purpose=fullsize" alt="login" />
      </div>
      
    </div>
  );
}
export default Login