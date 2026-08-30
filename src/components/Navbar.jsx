import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUserInjured,
    FaUserMd,
    FaCalendarCheck,
    FaHospital,
    FaSignInAlt,
    FaSignOutAlt,
    FaUserShield
} from "react-icons/fa";
import { toast } from "react-toastify";

import { isLoggedIn, getUsername, getRole, logout } from "../services/AuthService";
import "../css/Navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const loggedIn = isLoggedIn();

    const links = [
        { to: "/", icon: <FaHome />, label: "Dashboard", end: true },
        { to: "/patients", icon: <FaUserInjured />, label: "Patients" },
        { to: "/doctors", icon: <FaUserMd />, label: "Doctors" },
        { to: "/appointments", icon: <FaCalendarCheck />, label: "Appointments" }
    ];

    function handleLogout() {
        logout();
        toast.success("Logged out");
        navigate("/");
        window.location.reload();
    }

    return (
        <nav className="sidebar">

            <div className="sidebar-logo">
                <div className="logo-badge">
                    <FaHospital />
                </div>
                <h2>MediCare<span>HMS</span></h2>
            </div>

            <div className="sidebar-menu">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            "nav-link" + (isActive ? " active" : "")
                        }
                    >
                        <span className="nav-icon">{link.icon}</span>
                        <span className="nav-label">{link.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-auth">
                {loggedIn ? (
                    <>
                        <div className="sidebar-user">
                            <FaUserShield />
                            <div>
                                <strong>{getUsername()}</strong>
                                <span>{getRole()}</span>
                            </div>
                        </div>
                        <button className="sidebar-logout-btn" onClick={handleLogout}>
                            <FaSignOutAlt /> <span className="nav-label">Logout</span>
                        </button>
                    </>
                ) : (
                    <NavLink to="/login" className="nav-link login-link">
                        <span className="nav-icon"><FaSignInAlt /></span>
                        <span className="nav-label">Admin Login</span>
                    </NavLink>
                )}
            </div>

            <div className="sidebar-footer">
                <p>Hospital Management System</p>
            </div>

        </nav>
    );
}

export default Navbar;
