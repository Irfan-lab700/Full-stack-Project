import "./Navbar.css";
type NavbarProps = {
    username: string;
    onLogout: ()=>void;
}

function Navbar({username,onLogout}:NavbarProps){
    return(
        <nav className="navbar">
            <div className="navbar-logo">
                <h2>My App</h2>
            </div>
            <div className="navbar-user">
                <span>Welcome, {username}</span>
                <button className = "logout-btn" onClick={onLogout}> Logout</button>
            </div>
        </nav>
    )

}
export default Navbar;