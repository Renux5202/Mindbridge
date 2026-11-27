// Base API URL for MindBridge
// Points to the live Render backend Web Service URL by default.
// In local development, if VITE_API_URL is set or localhost proxy is used, it respects it.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mindbridge-backend-hgtn.onrender.com';
