// In production on Render or external hosting, points to the live backend URL.
// In local development, falls back to empty string so the Vite proxy handles /api
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mindbridge-backend-hgtn.onrender.com';
