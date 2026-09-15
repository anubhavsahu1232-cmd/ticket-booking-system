import axios from "axios";

// Use local backend while running the frontend locally.
// Use Render backend when the frontend is deployed.
const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:8080/api"
    : "https://ticket-booking-system-7652.onrender.com/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Every request automatically gets JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle unauthorized response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        return Promise.reject(error);
    }
);

export default api;
