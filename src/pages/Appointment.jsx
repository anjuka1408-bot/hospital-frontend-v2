import "../css/Appointment.css";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch, FaCalendarCheck, FaLock } from "react-icons/fa";
import { isLoggedIn, isAdmin } from "../services/AuthService";
import { getAllPatients } from "../services/PatientService";
import { getAllDoctors } from "../services/DoctorService";
import {
    getAllAppointments,
    saveAppointment,
    updateAppointment,
    deleteAppointment
} from "../services/AppointmentService";
import { toast } from "react-toastify";

function Appointment() {

    const [appointment, setAppointment] = useState({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        disease: ""
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadPatients();
        loadDoctors();
        loadAppointments();
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

    function loadDoctors() {
        getAllDoctors()
            .then((response) => {
                setDoctors(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function loadAppointments() {
        getAllAppointments()
            .then((response) => {
                setAppointments(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setAppointment({
            ...appointment,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        const appointmentData = {
            appointmentDate: appointment.appointmentDate,
            disease: appointment.disease,
            patient: {
                patientId: appointment.patientId
            },
            doctor: {
                doctorId: appointment.doctorId
            }
        };

        if (editingId === null) {

            saveAppointment(appointmentData)
                .then(() => {
                    toast.success("Appointment Saved Successfully");
                    resetForm();
                    loadAppointments();
                })
                .catch((error) => {
                    console.log(error);
                });

        } else {

            updateAppointment(editingId, appointmentData)
                .then(() => {
                    toast.success("Appointment Updated Successfully");
                    resetForm();
                    setEditingId(null);
                    loadAppointments();
                })
                .catch((error) => {
                    console.log(error);
                });

        }
    }

    function handleEditAppointment(appt) {
        setEditingId(appt.appointmentId);

        setAppointment({
            patientId: appt.patient?.patientId || "",
            doctorId: appt.doctor?.doctorId || "",
            appointmentDate: appt.appointmentDate || "",
            disease: appt.disease || ""
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleDeleteAppointment(id) {
        if (window.confirm("Are you sure you want to delete this appointment?")) {

            deleteAppointment(id)
                .then(() => {
                    toast.success("Appointment Deleted Successfully");
                    loadAppointments();
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
        setAppointment({
            patientId: "",
            doctorId: "",
            appointmentDate: "",
            disease: ""
        });
    }

    const filteredAppointments = [...appointments]
        .sort((a, b) => a.appointmentId - b.appointmentId)
        .filter((a) => {
            const term = search.toLowerCase();
            return (
                a.patient?.name?.toLowerCase().includes(term) ||
                a.doctor?.name?.toLowerCase().includes(term) ||
                a.disease?.toLowerCase().includes(term)
            );
        });

    return (
        <div className="appointment-container">

            <div className="appointment-page-header">

                <div>
                    <span className="appointment-label">APPOINTMENT MANAGEMENT</span>
                    <h1>Appointments</h1>
                    <p>Schedule and manage patient appointments with doctors.</p>
                </div>

                <div className="appointment-count">
                    <span>Total Appointments</span>
                    <strong>{appointments.length}</strong>
                </div>

            </div>

            {isLoggedIn() ? (
                <form className="appointment-form" onSubmit={handleSubmit}>
                    <h2>{editingId === null ? "Add Appointment" : "Update Appointment"}</h2>

                    <div className="form-grid">

                        <div className="form-field">
                            <label>Patient</label>
                            <select name="patientId" value={appointment.patientId} onChange={handleChange} required>
                                <option value="">Select Patient</option>
                                {patients.map((patient) => (
                                    <option key={patient.patientId} value={patient.patientId}>
                                        {patient.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Doctor</label>
                            <select name="doctorId" value={appointment.doctorId} onChange={handleChange} required>
                                <option value="">Select Doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.doctorId} value={doctor.doctorId}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Appointment Date</label>
                            <input
                                type="date"
                                name="appointmentDate"
                                value={appointment.appointmentDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>Disease</label>
                            <input
                                type="text"
                                name="disease"
                                placeholder="e.g. Fever"
                                value={appointment.disease}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {editingId === null ? "Save Appointment" : "Update Appointment"}
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
                    <p>Log in as admin to add, edit or delete appointments.</p>
                </div>
            )}

            <div className="list-section">

                <div className="list-header">
                    <h2>Appointment List</h2>

                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search by patient, doctor or disease..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="appointment-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Disease</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredAppointments.map((a) => (
                            <tr key={a.appointmentId}>
                                <td className="id-cell">#{a.appointmentId}</td>
                                <td>{a.patient?.name}</td>
                                <td>{a.doctor?.name}</td>
                                <td><span className="date-pill">{a.appointmentDate}</span></td>
                                <td><span className="badge">{a.disease}</span></td>
                                <td>
                                    {isLoggedIn() ? (
                                        <div className="action-buttons">
                                            <button className="icon-btn edit" onClick={() => handleEditAppointment(a)} title="Edit">
                                                <FaEdit />
                                            </button>
                                            {isAdmin() && (
                                                <button className="icon-btn delete" onClick={() => handleDeleteAppointment(a.appointmentId)} title="Delete">
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

                        {filteredAppointments.length === 0 && (
                            <tr>
                                <td colSpan="6">
                                    <div className="empty-state">
                                        <FaCalendarCheck />
                                        <p>No appointments found</p>
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

export default Appointment;
