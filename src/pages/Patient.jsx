import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaUserInjured, FaLock } from "react-icons/fa";
import { isLoggedIn, isAdmin } from "../services/AuthService";
import {
    getAllPatients,
    savePatient,
    deletePatient,
    getPatientById,
    updatePatient
} from "../services/PatientService";

import "../css/Patient.css";

function Patient() {

    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");

    const [patient, setPatient] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
        disease: ""
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadPatients();
    }, []);

    function loadPatients() {
        getAllPatients()
            .then((response) => {
                setPatients(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setPatient({
            ...patient,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (editingId === null) {

            savePatient(patient)
                .then(() => {
                    toast.success("Patient Saved Successfully");
                    resetForm();
                    loadPatients();
                })
                .catch((error) => {
                    console.log(error);
                });

        } else {

            updatePatient(editingId, patient)
                .then(() => {
                    toast.success("Patient Updated Successfully");
                    setEditingId(null);
                    resetForm();
                    loadPatients();
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }

    function handleDelete(id) {

        if (window.confirm("Are you sure you want to delete this patient?")) {

            deletePatient(id)
                .then(() => {
                    toast.success("Patient Deleted Successfully");
                    loadPatients();
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }

    function handleEdit(id) {

        getPatientById(id)
            .then((response) => {
                setPatient(response.data);
                setEditingId(id);
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch((error) => {
                console.log(error);
            });

    }

    function handleCancelEdit() {
        setEditingId(null);
        resetForm();
    }

    function resetForm() {
        setPatient({
            name: "",
            age: "",
            gender: "",
            phone: "",
            address: "",
            disease: ""
        });
    }

    function getInitials(name) {
        if (!name) return "?";
        return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    }

    const filteredPatients = [...patients]
        .sort((a, b) => a.patientId - b.patientId)
        .filter((p) => {
            const term = search.toLowerCase();
            return (
                p.name?.toLowerCase().includes(term) ||
                p.disease?.toLowerCase().includes(term) ||
                p.phone?.toLowerCase().includes(term)
            );
        });

    return (
        <div className="patient-container">

            <div className="patient-page-header">

                <div>
                    <span className="patient-label">PATIENT MANAGEMENT</span>
                    <h1>Patients</h1>
                    <p>Manage patient information, medical details and records.</p>
                </div>

                <div className="patient-count">
                    <span>Total Patients</span>
                    <strong>{patients.length}</strong>
                </div>

            </div>

            {isLoggedIn() ? (
                <form onSubmit={handleSubmit} className="patient-form">
                    <h2>{editingId === null ? "Add Patient" : "Update Patient"}</h2>

                    <div className="form-grid">

                        <div className="form-field">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Aditi Sharma"
                                value={patient.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Age</label>
                            <input
                                type="number"
                                name="age"
                                placeholder="e.g. 34"
                                value={patient.age}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Gender</label>
                            <input
                                type="text"
                                name="gender"
                                placeholder="e.g. Female"
                                value={patient.gender}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="e.g. 9876543210"
                                value={patient.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="e.g. Pune, Maharashtra"
                                value={patient.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>Disease</label>
                            <input
                                type="text"
                                name="disease"
                                placeholder="e.g. Diabetes"
                                value={patient.disease}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {editingId === null ? "Save Patient" : "Update Patient"}
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
                    <p>Log in as admin to add, edit or delete patients.</p>
                </div>
            )}

            <div className="list-section">

                <div className="list-header">
                    <h2>Patient List</h2>

                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search by name, phone or disease..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="patient-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Disease</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredPatients.map((p) => (
                            <tr key={p.patientId}>
                                <td className="id-cell">#{p.patientId}</td>
                                <td>
                                    <div className="name-cell">
                                        <span className="avatar">{getInitials(p.name)}</span>
                                        {p.name}
                                    </div>
                                </td>
                                <td>{p.age}</td>
                                <td>{p.gender}</td>
                                <td>{p.phone}</td>
                                <td><span className="badge">{p.disease}</span></td>
                                <td>
                                    {isLoggedIn() ? (
                                        <div className="action-buttons">
                                            <button className="icon-btn edit" onClick={() => handleEdit(p.patientId)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            {isAdmin() && (
                                                <button className="icon-btn delete" onClick={() => handleDelete(p.patientId)} title="Delete">
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

                        {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan="7">
                                    <div className="empty-state">
                                        <FaUserInjured />
                                        <p>No patients found</p>
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

export default Patient;
