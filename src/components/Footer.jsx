import { FaHeartbeat } from "react-icons/fa";
import "../css/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <p><FaHeartbeat /> &copy; 2026 Hospital Management System</p>
            <p>Developed using React, Spring Boot &amp; PostgreSQL</p>
        </footer>
    );
}

export default Footer;
