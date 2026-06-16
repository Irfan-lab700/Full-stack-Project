import { useEffect, useState } from "react";

type User = {
  username: string;
  message?: string;
};

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Dashboard</h1>

        {user ? (
          <>
            <h2>👋 Welcome {user.username}</h2>
            <p>You are successfully logged in</p>
          </>
        ) : (
          <p>Loading user data...</p>
        )}

        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles: {
  container: React.CSSProperties;
  card: React.CSSProperties;
  button: React.CSSProperties;
} = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "300px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Dashboard;