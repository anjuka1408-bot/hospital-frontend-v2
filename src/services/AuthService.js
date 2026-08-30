import axios from "axios";

const AUTH_BASE_URL = "http://localhost:8080/auth";

export function login(username, password) {
    return axios.post(`${AUTH_BASE_URL}/login`, { username, password });
}

export function saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getUsername() {
    return localStorage.getItem("username");
}

export function getRole() {
    return localStorage.getItem("role");
}

export function isLoggedIn() {
    return !!getToken();
}

export function isAdmin() {
    return getRole() === "ADMIN";
}
