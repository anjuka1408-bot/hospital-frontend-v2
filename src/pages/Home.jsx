import { useEffect, useState } from "react";
import {
    FaUserInjured,
    FaUserMd,
    FaCalendarCheck,
    FaAmbulance,
    FaFileMedicalAlt,
    FaLaptopMedical,
    FaFlask,
    FaPills,
    FaHeartbeat,
    FaBrain,
    FaBone,
    FaBaby,
    FaAllergies,
    FaTooth,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaClock,
    FaQuoteLeft,
    FaEnvelope,
    FaPhone
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { getAllPatients } from "../services/PatientService";
import { getAllDoctors } from "../services/DoctorService";
import { getAllAppointments } from "../services/AppointmentService";
import "../css/Home.css";
import hospitalImage from "../assets/hospital.png";

const malePhotos = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1712215544003-af10130f8eb3?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1645066928295-2506defde470?auto=format&fit=crop&w=400&q=70"
];

const femalePhotos = [
    "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1659353888906-adb3e0041693?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1673865641073-4479f93a7776?auto=format&fit=crop&w=400&q=70",
    "https://images.unsplash.com/photo-1643297654416-05795d62e39c?auto=format&fit=crop&w=400&q=70"
];

const knownMaleNames = ["sumit", "vikas", "rohan", "rahul", "amit", "anil", "sunil", "prakash", "ganesh", "suresh", "ramesh", "mahesh", "vijay", "ajay", "sanjay", "manoj", "dinesh", "arjun", "aditya", "nikhil", "sandeep", "abhishek", "yash", "omkar", "pratik", "akash", "harsh", "rajesh"];
const knownFemaleNames = ["shreeya", "sonali", "priya", "sneha", "anjali", "pooja", "kavita", "neha", "radhika", "aditi", "meera", "swati", "komal", "rupali", "supriya", "madhuri", "manisha", "kirti", "shalini", "asha", "riya", "isha", "tanvi", "vaishnavi"];

function inferGender(fullName) {
    if (!fullName) return "male";
    const first = fullName.replace(/^dr\.?\s*/i, "").trim().split(/\s+/)[0].toLowerCase();
    if (knownMaleNames.includes(first)) return "male";
    if (knownFemaleNames.includes(first)) return "female";
    return /(a|i|ee)$/.test(first) ? "female" : "male";
}

function getDoctorPhoto(fullName, index) {
    const pool = inferGender(fullName) === "female" ? femalePhotos : malePhotos;
    return pool[index % pool.length];
}

const facilities = [
    { icon: <FaAmbulance />, title: "24/7 Emergency Care", desc: "Round-the-clock emergency response with rapid triage and ambulance dispatch." },
    { icon: <FaFileMedicalAlt />, title: "Digital Health Records", desc: "Every patient's history, prescriptions and reports securely stored and instantly accessible." },
    { icon: <FaLaptopMedical />, title: "Online Appointments", desc: "Book, reschedule or cancel appointments with any doctor in just a few clicks." },
    { icon: <FaFlask />, title: "Diagnostic Lab", desc: "In-house pathology and imaging with fast, accurate turnaround times." },
    { icon: <FaPills />, title: "In-House Pharmacy", desc: "Prescriptions filled on-site so patients leave with everything they need." },
    { icon: <FaHeartbeat />, title: "Critical Care Unit", desc: "Advanced ICU monitoring equipment staffed by specialist critical-care teams." }
];

const departments = [
    { icon: <FaHeartbeat />, name: "Cardiology" },
    { icon: <FaBrain />, name: "Neurology" },
    { icon: <FaBone />, name: "Orthopedics" },
    { icon: <FaBaby />, name: "Pediatrics" },
    { icon: <FaAllergies />, name: "Dermatology" },
    { icon: <FaTooth />, name: "Dental Care" }
];

const testimonials = [
    { name: "Priya Kulkarni", text: "The appointment booking took two minutes and the doctor actually had my full history in front of him. Best hospital experience I've had." },
    { name: "Rahul Deshmukh", text: "Emergency staff were fast and calm when it mattered most. Genuinely grateful for the care my father received here." },
    { name: "Sneha Patil", text: "Clean facility, organized records, and doctors who explain things clearly. Highly recommend this hospital to my family." }
];

function Home() {

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [displayPatient, setDisplayPatient] = useState(0);
    const [displayDoctor, setDisplayDoctor] = useState(0);
    const [displayAppointment, setDisplayAppointment] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {

        getAllPatients()
            .then((response) => setPatients(response.data))
            .catch((error) => console.log(error));

        getAllDoctors()
            .then((response) => setDoctors(response.data))
            .catch((error) => console.log(error));

        getAllAppointments()
            .then((response) => setAppointments(response.data))
            .catch((error) => console.log(error));

    }, []);

    useEffect(() => {
        let count = 0;
        const timer = setInterval(() => {
            if (count < patients.length) {
                count++;
                setDisplayPatient(count);
            } else {
                clearInterval(timer);
            }
        }, 40);
        return () => clearInterval(timer);
    }, [patients]);

    useEffect(() => {
        let count = 0;
        const timer = setInterval(() => {
            if (count < doctors.length) {
                count++;
                setDisplayDoctor(count);
            } else {
                clearInterval(timer);
            }
        }, 80);
        return () => clearInterval(timer);
    }, [doctors]);

    useEffect(() => {
        let count = 0;
        const timer = setInterval(() => {
            if (count < appointments.length) {
                count++;
                setDisplayAppointment(count);
            } else {
                clearInterval(timer);
            }
        }, 40);
        return () => clearInterval(timer);
    }, [appointments]);

    function getInitials(name) {
        if (!name) return "?";
        return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    }

    const recentAppointments = [...appointments]
        .sort((a, b) => b.appointmentId - a.appointmentId)
        .slice(0, 5);

    return (
        <div className="home-container">

            {/* HERO SECTION */}
            <div className="welcome-card">

                <h1>🏥 Hospital Management System</h1>

                <p>
                    Welcome to the Hospital Management System.
                    Manage Patients, Doctors and Appointments efficiently
                    from one place.
                </p>

                <div className="hero-buttons">
                    <button className="primary-btn" onClick={() => navigate("/patients")}>
                        View Patients
                    </button>
                    <button className="secondary-btn" onClick={() => navigate("/appointments")}>
                        Book Appointment
                    </button>
                </div>

            </div>

            {/* STATISTICS CARDS */}
            <div className="dashboard">

                <div className="card patient-card" onClick={() => navigate("/patients")}>
                    <FaUserInjured className="icon" />
                    <h2>Patients</h2>
                    <h1>{displayPatient}</h1>
                    <p>Total Patients</p>
                </div>

                <div className="card doctor-card" onClick={() => navigate("/doctors")}>
                    <FaUserMd className="icon" />
                    <h2>Doctors</h2>
                    <h1>{displayDoctor}</h1>
                    <p>Total Doctors</p>
                </div>

                <div className="card appointment-card" onClick={() => navigate("/appointments")}>
                    <FaCalendarCheck className="icon" />
                    <h2>Appointments</h2>
                    <h1>{displayAppointment}</h1>
                    <p>Total Appointments</p>
                </div>

            </div>

            {/* FACILITIES */}
            <div className="section-block">
                <div className="section-heading">
                    <span className="section-tag">WHAT WE OFFER</span>
                    <h2>Our Facilities &amp; Services</h2>
                    <p>Everything a modern hospital needs, built into one connected system.</p>
                </div>

                <div className="facility-grid">
                    {facilities.map((f, i) => (
                        <div className="facility-card" key={i}>
                            <div className="facility-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* DEPARTMENTS */}
            <div className="section-block">
                <div className="section-heading">
                    <span className="section-tag">SPECIALTIES</span>
                    <h2>Our Departments</h2>
                    <p>Specialized care across every major medical discipline.</p>
                </div>

                <div className="department-grid">
                    {departments.map((d, i) => (
                        <div className="department-card" key={i}>
                            <div className="department-icon">{d.icon}</div>
                            <span>{d.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* MEET OUR DOCTORS - LIVE DATA */}
            <div className="section-block">
                <div className="section-heading">
                    <span className="section-tag">FROM THE DATABASE</span>
                    <h2>Meet Our Doctors</h2>
                    <p>Live from your backend &mdash; every doctor listed here is a real record.</p>
                </div>

                <div className="doctor-scroll">
                    {doctors.length === 0 && (
                        <p className="empty-note">No doctors yet &mdash; add one from the Doctors page.</p>
                    )}

                    {doctors.map((doc, i) => (
                        <div className="doctor-showcase-card" key={doc.doctorId}>
                            <img src={getDoctorPhoto(doc.name, i)} alt={doc.name} />
                            <div className="doctor-showcase-body">
                                <h3>{doc.name}</h3>
                                <span className="badge">{doc.specialization}</span>
                                <p><FaPhone /> {doc.phone}</p>
                                <p><FaEnvelope /> {doc.email}</p>
                                <button onClick={() => navigate("/appointments")}>Book Appointment</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RECENT APPOINTMENTS - LIVE DATA */}
            <div className="section-block">
                <div className="section-heading">
                    <span className="section-tag">FROM THE DATABASE</span>
                    <h2>Recent Appointments</h2>
                    <p>The latest activity pulled straight from your appointments table.</p>
                </div>

                <div className="timeline-card">
                    {recentAppointments.length === 0 && (
                        <p className="empty-note">No appointments yet &mdash; schedule one from the Appointments page.</p>
                    )}

                    {recentAppointments.map((a) => (
                        <div className="timeline-row" key={a.appointmentId}>
                            <span className="timeline-avatar">{getInitials(a.patient?.name)}</span>
                            <div className="timeline-info">
                                <strong>{a.patient?.name || "Unknown Patient"}</strong>
                                <span>with {a.doctor?.name || "Unknown Doctor"} &bull; {a.disease}</span>
                            </div>
                            <span className="timeline-date">{a.appointmentDate}</span>
                        </div>
                    ))}

                    <button className="view-all-btn" onClick={() => navigate("/appointments")}>
                        Manage All Appointments &rarr;
                    </button>
                </div>
            </div>

            {/* ABOUT / HOSPITAL SECTION */}
            <div className="about-section">

                <div className="about-image">
                    <img
                        src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&w=800&q=70"
                        alt="Medical professionals at work"
                    />
                </div>

                <div className="about-text">

                    <h2>Why Choose Our Hospital?</h2>

                    <p>
                        Our Hospital Management System provides a modern,
                        secure and efficient way to manage patients,
                        doctors and appointments.

                        We help hospitals simplify their daily workflow,
                        reduce paperwork and improve patient care.
                    </p>

                    <div className="features">
                        <div className="feature">👨‍⚕️ Experienced Doctors</div>
                        <div className="feature">📅 Online Appointments</div>
                        <div className="feature">🩺 Modern Healthcare</div>
                        <div className="feature">🚑 Emergency Support</div>
                    </div>

                </div>

            </div>

            {/* TESTIMONIALS */}
            <div className="section-block">
                <div className="section-heading">
                    <span className="section-tag">PATIENT VOICES</span>
                    <h2>What Our Patients Say</h2>
                </div>

                <div className="testimonial-grid">
                    {testimonials.map((t, i) => (
                        <div className="testimonial-card" key={i}>
                            <FaQuoteLeft className="quote-icon" />
                            <p>{t.text}</p>
                            <div className="testimonial-author">
                                <span className="avatar">{getInitials(t.name)}</span>
                                <strong>{t.name}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EMERGENCY / CONTACT STRIP */}
            <div className="emergency-strip">

                <div className="emergency-item">
                    <FaPhoneAlt />
                    <div>
                        <span>Emergency Hotline</span>
                        <strong>+91 100</strong>
                    </div>
                </div>

                <div className="emergency-item">
                    <FaClock />
                    <div>
                        <span>OPD Hours</span>
                        <strong>Mon &ndash; Sat, 9 AM &ndash; 8 PM</strong>
                    </div>
                </div>

                <div className="emergency-item">
                    <FaMapMarkerAlt />
                    <div>
                        <span>Location</span>
                        <strong>Sinnar, Maharashtra</strong>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Home;
