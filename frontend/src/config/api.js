// Centralized API Base URL configuration
// In production (when served by backend or when VITE_API_URL is set), uses relative path or environment variable.
// In development, defaults to http://localhost:4000
const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.PROD ? "" : "http://localhost:4000");

export default API_BASE_URL;
