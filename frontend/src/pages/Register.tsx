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
        <button type = "submit" onClick={async(e) => {
          e.preventDefault();
          const response = await fetch("http://127.0.0.1:8000/Register", {
  method: "POST",
});

const data = await response.json();
console.log(data);
        }}>Register </button>

        <Link to="/login">
        Already have an account? Login
        </Link>
      </form>
      </div>
      <div className = "register-img">
        <img src = "https://images.openai.com/static-rsc-4/v3445sXMczduBjD_-iyrfI1GY63X6-9dz-I4G08CHT0tffJ1fzOBJ8V2RhVcPK4c6XM6rZStRVVFkgJqQjONsLh-KBrncEgrdCD2XLE5rtZPoyN-REmZV44bkMfML-QTFBLQzoEn6Nvhdy423wxdleYteNIQ18irSLR44S9JVLenW8ZighblhZwKUVWeLjCz?purpose=fullsize" alt="Register" />
      </div>
      
    </div>
  );
}
export default Register