import { useState } from "react";
import "./Navbar.css";

type NavbarProps = {
    username: string;
    onLogout: () => void;
};

function Navbar({ username, onLogout }: NavbarProps) {

    const [open, setOpen] = useState(false);

    const initial = username
        ? username.charAt(0).toUpperCase()
        : "U";

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h2>Campus <span>Sync</span></h2>
            </div>
            <div className="navbar-right">
                <div className="navbar-links">
                    <a href="/dashboard">Dashboard</a>
                    <a href="/tasks">Tasks</a>
                    <a href="/notes">Notes</a>
                    <a href="/opportunities">Opportunities</a>
                </div>

                <div className="profile-container">

                    <button
                        className="profile-btn"
                        onClick={() => setOpen(!open)}
                    >
                        {initial}
                    </button>

                    {open && (
                        <div className="profile-dropdown">
                            <p>{username}</p>
                            <button onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;