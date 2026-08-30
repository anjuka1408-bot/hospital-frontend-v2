import axios from "axios";

const BASE_URL = "http://localhost:8080/patients";

export const getAllPatients = () => {
    return axios.get(BASE_URL);
};

export const savePatient = (patient) => {
    return axios.post(BASE_URL, patient);
};

export const deletePatient = (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};

export const getPatientById = (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

export const updatePatient = (id, patient) => {
    return axios.put(`${BASE_URL}/${id}`, patient);
};
