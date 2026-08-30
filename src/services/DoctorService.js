import axios from "axios";

const REST_API_BASE_URL = "https://hospital-backend-8jz6.onrender.com/doctors";

export const getAllDoctors = () => axios.get(REST_API_BASE_URL);

export const saveDoctor = (doctor) => axios.post(REST_API_BASE_URL, doctor);

export const getDoctorById = (doctorId) =>
    axios.get(`${REST_API_BASE_URL}/${doctorId}`);

export const updateDoctor = (doctorId, doctor) =>
    axios.put(`${REST_API_BASE_URL}/${doctorId}`, doctor);

export const deleteDoctor = (doctorId) =>
    axios.delete(`${REST_API_BASE_URL}/${doctorId}`);
