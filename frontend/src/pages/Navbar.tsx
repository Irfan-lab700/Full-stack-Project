import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

type NavbarProps = {
    username: string;
    onLogout: () => void;
};

function Navbar({ username, onLogout }: NavbarProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const initial = username? username.charAt(0).toUpperCase() :"U";
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h2>Campus<span>Sync</span></h2>
            </div>
            <div className="navbar-right">
                <div
                    className={`navbar-links ${menuOpen ? "mobile-open" : ""}`}>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/tasks">Tasks</Link>
                    <Link to="/notes">Notes</Link>
                    <Link to="/opportunities">Opportunities</Link>
                </div>
                <button className="menu-btn" onClick={() =>setMenuOpen(!menuOpen)}aria-label="Open menu">☰</button>

                <div className="profile-container">
                    <button className="profile-btn" onClick={() => setOpen(!open) }>{initial}</button>
                    {open && (<div className="profile-dropdown">
                        <p>{username}</p>
                         <button onClick={onLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
export default Navbar;
