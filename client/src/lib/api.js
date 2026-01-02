// lib/api.js or utils/api.js
import axios from "axios";

// Function to get the base URL dynamically
const getBaseURL = () => {
  // Check if we're on the client side
  if (typeof window !== "undefined") {
    const origin = window.location.origin;

    // Local development
    if (
      origin.includes("localhost:5173") ||
      origin.includes("127.0.0.1:5173") ||
      origin.includes("localhost:3000") ||
      origin.includes("127.0.0.1:3000")
    ) {
      return "http://localhost:5000";
    }

    // Production
    if (origin.includes("motorparts.netlify.app")) {
      return "https://autotools-am1b.onrender.com";
    }
  }

  // Server-side or fallback to production
  return "https://autotools-am1b.onrender.com";
};

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Log the base URL (only on client side)
if (typeof window !== "undefined") {
  console.log("🚀 API USING:", getBaseURL());
}

export default api;
