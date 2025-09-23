import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
});

// Thêm token vào header
api.interceptors.request.use(config => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
