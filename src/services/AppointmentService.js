import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/appointments";

export const getAllAppointments = () =>
    axios.get(REST_API_BASE_URL);

export const saveAppointment = (appointment) =>
    axios.post(REST_API_BASE_URL, appointment);

export const getAppointmentById = (id) =>
    axios.get(REST_API_BASE_URL + "/" + id);

export const updateAppointment = (id, appointment) =>
    axios.put(REST_API_BASE_URL + "/" + id, appointment);

export const deleteAppointment = (id) =>
    axios.delete(REST_API_BASE_URL + "/" + id);
