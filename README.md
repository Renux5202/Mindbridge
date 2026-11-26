# MindBridge: A Digital Companion Against Substance Addiction

> An anonymous, non-judgmental AI-powered web companion addressing the psychological roots of substance addiction (stress, loneliness, depression, peer pressure, and cravings).

---

## 🌿 Core Features

1. **Anonymous Onboarding & Privacy Shield**
   - Automatically generates safe, randomized nicknames (e.g. `CalmRiver42`) with **zero personal data collection** (no login, no emails, no phone numbers required).
   - **Persistent "Quick Exit (Esc)" Button**: Instantly redirects to Google via `window.location.replace()`.
   - **"Wipe My Session"**: Instantly purges all local chat histories, mood logs, and habit streaks.

2. **Empathetic AI Companion Chat (`/chat`)**
   - Motivational Interviewing (MI) based conversational engine.
   - Powered by Gemini LLM API (optional via `.env`), with **intelligent local emotional intent fallback** for offline resilience.
   - Intent recognition across `crisis`, `craving`, `peer_pressure`, `stress`, `loneliness`, and `depression`.
   - Automatic **Crisis Support Card** trigger for high-risk messages with one-click dials to verified Indian toll-free helplines.

3. **Urge SOS — Craving Interrupter (`/sos`)**
   - **Box Breathing Visualizer**: 4s Inhale / 4s Hold / 4s Exhale / 4s Hold animated cues.
   - **5-4-3-2-1 Sensory Grounding**: Step-by-step interactive checklist to deactivate racing thoughts.
   - **10-Minute Urge Surf Timer**: Live timer with neurochemical micro-encouragements.

4. **Mood, Trigger & Habit Tracker (`/tracker`)**
   - Daily emotional weather check-ins with private encrypted journal notes.
   - 7-Day Emotional Resilience curve and Top Personal Triggers charts powered by **Recharts** (includes live demo sample data toggle).
   - Daily recovery habit builder with progress tracking.

5. **Counsellor & Rehab Support Bridge (`/help`)**
   - Verified Indian toll-free helplines:
     - **National Drug De-addiction Helpline**: `14446`
     - **Tele-MANAS (24/7 Mental Health)**: `14416`
     - **Vimukthi Mission Helpline (Kerala)**: `14405`
     - **KIRAN Helpline**: `1800-599-0019`
   - Filterable directory of rehabilitation centers (by format and pricing).
   - **Request Anonymous Callback**: Stores secure request in backend SQLite and issues a confirmation token without exposing identity.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite) + Tailwind CSS + Lucide React + Recharts
- **Backend**: Python 3.10+ FastAPI + SQLite + Uvicorn
- **Storage**: Client-side `localStorage` for complete user privacy + local SQLite for anonymous counsellor callback queues

---

## 🚀 How to Run Locally

### 1. Backend Setup (FastAPI)

In your terminal:
```bash
# Navigate to the backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Add your Gemini API Key in .env if you want live Gemini inference
# If omitted, MindBridge runs seamlessly on its built-in compassionate local engine!
cp .env.example .env

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
Backend will be available at: `http://localhost:8000` (API docs at `http://localhost:8000/docs`).

---

### 2. Frontend Setup (React + Vite)

In a new terminal window:
```bash
# Navigate to the frontend directory
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 🎨 Design Philosophy & Color Palette
- Background: `#F7F9F8` (Warm Off-White) / `#121816` (Soothing Dark Mode)
- Primary Sage: `#5C8979`
- Muted Teal: `#3D7879`
- Text: `#212928` (Charcoal) / `#E5EBE8` (Light Charcoal)
- Urge/SOS Accent: `#E26D5C` (Gentle Coral)
