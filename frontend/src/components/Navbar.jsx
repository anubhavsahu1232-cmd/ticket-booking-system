import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">

            {/* Logo */}
            <Link
                to="/"
                className="navbar-brand"
            >
                🎟️ TicketBook
            </Link>

            {/* Navigation Links */}
            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/events">
                    Events
                </Link>

                <Link to="/bookings">
                    My Bookings
                </Link>

                {/* Admin link only for ADMIN */}
                {user?.role === "ADMIN" && (
                    <Link to="/admin">
                        Admin
                    </Link>
                )}

                {/* Logged-in user */}
                <span className="navbar-user">
                    Hi, {user?.name}
                </span>

                {/* Logout */}
                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
};

export default Navbar;