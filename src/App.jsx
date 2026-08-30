import "./css/App.css";
import "./services/axiosConfig";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Patient from "./pages/Patient";
import Doctor from "./pages/Doctor";
import Appointment from "./pages/Appointment";
import Login from "./pages/Login";

import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";

function App() {

    return (

        <div className="app-layout">

            <Navbar />

            <div className="main-content">

                <Header />

                <div className="page-content">

                    <Routes>

                        <Route path="/" element={<Home />} />

                        <Route path="/patients" element={<Patient />} />

                        <Route path="/doctors" element={<Doctor />} />

                        <Route path="/appointments" element={<Appointment />} />

                        <Route path="/login" element={<Login />} />

                    </Routes>

                </div>

                <Footer />

            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
            />

        </div>

    );

}

export default App;