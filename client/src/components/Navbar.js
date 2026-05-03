import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, LogOut, User, Plus, Bookmark, LayoutGrid } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <Box size={22} />
          <span>VoxelVault</span>
        </Link>

        <div className="navbar-links">
          <Link to="/gallery" className={`nav-link ${isActive("/gallery") ? "active" : ""}`}>
            <LayoutGrid size={16} />
            Gallery
          </Link>

          {user ? (
            <>
              <Link to="/upload" className={`nav-link ${isActive("/upload") ? "active" : ""}`}>
                <Plus size={16} />
                Upload
              </Link>
              <Link to="/bookmarks" className={`nav-link ${isActive("/bookmarks") ? "active" : ""}`}>
                <Bookmark size={16} />
                Saved
              </Link>
              <Link to={`/profile/${user._id}`} className={`nav-link ${isActive(`/profile/${user._id}`) ? "active" : ""}`}>
                <User size={16} />
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="btn-ghost nav-logout">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>Login</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
