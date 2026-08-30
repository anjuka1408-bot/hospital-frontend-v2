import { FaHospital, FaUserCircle } from "react-icons/fa";
import "../css/Header.css";

function Header() {
    return (
        <header className="topbar">

            <div className="topbar-left">
                <FaHospital className="topbar-logo" />
                <div>
                    <h1>Hospital Management System</h1>
                    <p>React &bull; Spring Boot &bull; PostgreSQL</p>
                </div>
            </div>

            <div className="topbar-right">
                <FaUserCircle className="topbar-avatar" />
            </div>

        </header>
    );
}

export default Header;
