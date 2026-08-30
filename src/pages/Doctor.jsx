import "../css/Doctor.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaUserMd, FaLock } from "react-icons/fa";
import { isLoggedIn, isAdmin } from "../services/AuthService";

import {
    getAllDoctors,
    saveDoctor,
    updateDoctor,
    deleteDoctor
} from "../services/DoctorService";

function Doctor() {

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");

    const [doctor, setDoctor] = useState({
        name: "",
        specialization: "",
        phone: "",
        email: ""
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadDoctors();
    }, []);

    function loadDoctors() {
        getAllDoctors()
            .then((response) => {
                setDoctors(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setDoctor({
            ...doctor,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (editingId === null) {

            saveDoctor(doctor)
                .then(() => {
                    toast.success("Doctor Saved Successfully");
                    resetForm();
                    loadDoctors();
                })
                .catch((error) => {
                    console.log(error);
                });

        } else {

            updateDoctor(editingId, doctor)
                .then(() => {
                    toast.success("Doctor Updated Successfully");
                    setEditingId(null);
                    resetForm();
                    loadDoctors();
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }

    function handleEditDoctor(doctorData) {
        setDoctor({
            name: doctorData.name,
            specialization: doctorData.specialization,
            phone: doctorData.phone,
            email: doctorData.email
        });

        setEditingId(doctorData.doctorId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleDeleteDoctor(id) {
        if (window.confirm("Are you sure you want to delete this doctor?")) {

            deleteDoctor(id)
                .then(() => {
                    toast.success("Doctor Deleted Successfully");
                    loadDoctors();
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }

    function handleCancelEdit() {
        setEditingId(null);
        resetForm();
    }

    function resetForm() {
        setDoctor({
            name: "",
            specialization: "",
            phone: "",
            email: ""
        });
    }

    function getInitials(name) {
        if (!name) return "?";
        return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    }

    const filteredDoctors = [...doctors]
        .sort((a, b) => a.doctorId - b.doctorId)
        .filter((d) => {
            const term = search.toLowerCase();
            return (
                d.name?.toLowerCase().includes(term) ||
                d.specialization?.toLowerCase().includes(term)
            );
        });

    return (
        <div className="doctor-container">

            <div className="doctor-page-header">

                <div>
                    <span className="doctor-label">MEDICAL STAFF MANAGEMENT</span>
                    <h1>Doctors</h1>
                    <p>Manage doctors, specializations and contact information.</p>
                </div>

                <div className="doctor-count">
                    <span>Total Doctors</span>
                    <strong>{doctors.length}</strong>
                </div>

            </div>

            {isLoggedIn() ? (
                <form onSubmit={handleSubmit} className="doctor-form">
                    <h2>{editingId === null ? "Add Doctor" : "Update Doctor"}</h2>

                    <div className="form-grid">

                        <div className="form-field">
                            <label>Doctor Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Dr. Rohan Verma"
                                value={doctor.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                placeholder="e.g. Cardiologist"
                                value={doctor.specialization}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="e.g. 9876543210"
                                value={doctor.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="e.g. doctor@hospital.com"
                                value={doctor.email}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {editingId === null ? "Save Doctor" : "Update Doctor"}
                        </button>

                        {editingId !== null && (
                            <button type="button" className="btn-ghost" onClick={handleCancelEdit}>
                                Cancel
                            </button>
                        )}
                    </div>

                </form>
            ) : (
                <div className="login-prompt">
                    <FaLock />
                    <p>Log in as admin to add, edit or delete doctors.</p>
                </div>
            )}

            <div className="list-section">

                <div className="list-header">
                    <h2>Doctor List</h2>

                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search by name or specialization..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="doctor-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Doctor</th>
                            <th>Specialization</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredDoctors.map((d) => (
                            <tr key={d.doctorId}>
                                <td className="id-cell">#{d.doctorId}</td>
                                <td>
                                    <div className="name-cell">
                                        <span className="avatar">{getInitials(d.name)}</span>
                                        {d.name}
                                    </div>
                                </td>
                                <td><span className="badge">{d.specialization}</span></td>
                                <td>{d.phone}</td>
                                <td>{d.email}</td>
                                <td>
                                    {isLoggedIn() ? (
                                        <div className="action-buttons">
                                            <button className="icon-btn edit" onClick={() => handleEditDoctor(d)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            {isAdmin() && (
                                                <button className="icon-btn delete" onClick={() => handleDeleteDoctor(d.doctorId)} title="Delete">
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="view-only-tag">View only</span>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {filteredDoctors.length === 0 && (
                            <tr>
                                <td colSpan="6">
                                    <div className="empty-state">
                                        <FaUserMd />
                                        <p>No doctors found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
}

export default Doctor;
