// utils/api.js
import axios from "axios";

const API_BASE_URL = "https://claim-management-system-4.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API ${config.method.toUpperCase()} Request:`, config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log(`API Response (${response.status}):`, response.data);
    return response;
  },
  (error) => {
    // If unauthorized, clear localStorage
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
    console.error('API Error Response:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;