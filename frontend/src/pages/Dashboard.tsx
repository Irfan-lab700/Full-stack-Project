import { useEffect, useState } from "react";
import Navbar from "../pages/Navbar";
import Chatbox from "../pages/Chatbox";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import "./Dashboard.css";

type User = {
username: string;
message?: string;
role: string;
};

function Dashboard() {
const [user, setUser] = useState<User | null>(null);
const [isChatOpen, setIsChatOpen] = useState(false);

useEffect(() => {
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
  return;
}

fetch("http://127.0.0.1:8000/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data: User) => {
    if (data.username) {
      setUser(data);
    } else {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  })
  .catch(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

}, []);

const handleLogout = () => {
localStorage.removeItem("token");
window.location.href = "/login";
};

return (
<>
  <Navbar
    username={user?.username || ""}
    onLogout={handleLogout}
  />

  <div className="dashboard-container">
    <div className="dashboard-card">
      <h1>Dashboard</h1>

      {user?.role === "admin" ? (
  <AdminDashboard />
) : (
  <UserDashboard />
)}
    </div>
  </div>

  <button
  className="chatbot-button"
  onClick={() => setIsChatOpen(!isChatOpen)}
>
  💬
</button>
<Chatbox isOpen={isChatOpen} />
</>

);
}

export default Dashboard;
