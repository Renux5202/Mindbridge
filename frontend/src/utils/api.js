// Base API URL for MindBridge
// Checks import.meta.env.VITE_API_URL first (set in production or .env)
// Falls back to empty string in development so Vite proxy handles /api
// or uses localhost:8000 if directly addressed.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
