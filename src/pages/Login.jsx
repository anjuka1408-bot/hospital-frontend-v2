import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserShield, FaLock } from "react-icons/fa";
import { login, saveSession } from "../services/AuthService";
import "../css/Login.css";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        login(username, password)
            .then((response) => {
                saveSession(response.data);
                toast.success("Logged in successfully");
                navigate("/");
                window.location.reload();
            })
            .catch(() => {
                toast.error("Invalid username or password");
            });
    }

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>

                <div className="login-icon"><FaUserShield /></div>

                <h2>Admin Login</h2>
                <p>Log in to add, edit or delete records.</p>

                <div className="login-field">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                        required
                    />
                </div>

                <div className="login-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button type="submit" className="login-btn">
                    <FaLock /> Log In
                </button>

            </form>
        </div>
    );
}

export default Login;
