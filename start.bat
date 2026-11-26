@echo off
echo Starting MindBridge Full-Stack Application...
start "MindBridge Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"
start "MindBridge Frontend (Vite React)" cmd /k "cd frontend && npm run dev"
echo Both servers have been launched!
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
