import os
import sqlite3
import datetime
import random
import logging
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Try importing google-genai SDK if available
try:
    from google import genai
    from google.genai import types as genai_types
    GENAI_SDK_AVAILABLE = True
except ImportError:
    GENAI_SDK_AVAILABLE = False

try:
    from engine import generate_local_response, analyze_intent, CONVERSATIONAL_INTENTS
except ImportError:
    from backend.engine import generate_local_response, analyze_intent, CONVERSATIONAL_INTENTS

# Load environment variables from backend/.env or root .env
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mindbridge")

# SQLite database setup for Anonymous Callback Requests
DB_PATH = os.path.join(os.path.dirname(__file__), "mindbridge.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS callback_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT UNIQUE NOT NULL,
            nickname TEXT NOT NULL,
            preferred_time TEXT NOT NULL,
            mode TEXT NOT NULL,
            topic TEXT,
            contact_method TEXT NOT NULL,
            contact_value TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
    logger.info("SQLite callback_requests database initialized successfully.")

# Lifespan context manager for robust startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database and tables exist on startup (avoids cold start issues on Render)
    init_db()
    yield

app = FastAPI(
    title="MindBridge API",
    description="Backend service for MindBridge: A Digital Companion Against Drug Addiction",
    version="1.1.0",
    lifespan=lifespan
)

# CORS configuration
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://mindbridgeapp.onrender.com",
    "https://mindbridge-frontend-06mf.onrender.com",
    "https://mindbridge.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    nickname: Optional[str] = "Friend"

class ChatResponse(BaseModel):
    response: str
    coping_step: Optional[str] = None
    emotion_tag: str
    risk_level: str  # 'low', 'moderate', 'high'
    is_fallback: bool = False

class CallbackRequest(BaseModel):
    nickname: str
    preferred_time: str
    mode: str  # 'Phone' or 'Encrypted Chat' or 'Email'
    topic: Optional[str] = "General Support"
    contact_value: str

class CallbackResponse(BaseModel):
    success: bool
    token: str
    message: str
    created_at: str

@app.get("/")
def root():
    gemini_key = os.getenv("GEMINI_API_KEY")
    return {
        "service": "MindBridge API",
        "status": "online",
        "gemini_configured": bool(gemini_key and gemini_key.strip()),
        "gemini_sdk_available": GENAI_SDK_AVAILABLE,
        "model": "gemini-2.5-flash",
        "documentation": "/docs",
        "helpline_active": True
    }

@app.get("/api/health")
def health_check():
    gemini_key = os.getenv("GEMINI_API_KEY")
    return {
        "status": "healthy",
        "gemini_active": bool(gemini_key and gemini_key.strip()),
        "mode": "gemini-live" if (gemini_key and gemini_key.strip()) else "local-intent-engine",
        "database": "sqlite-ready"
    }

@app.get("/api/qa")
def get_curated_qa():
    return {
        "count": len(CONVERSATIONAL_INTENTS),
        "intents": [c["emotion_tag"] for c in CONVERSATIONAL_INTENTS]
    }

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    user_msg = payload.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    intent = analyze_intent(user_msg)
    # If crisis is detected, enforce immediate high-risk safeguards directly
    if intent == "crisis":
        local_res = generate_local_response(user_msg, [m.model_dump() for m in payload.history])
        return ChatResponse(**local_res)

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key and gemini_key.strip():
        # Motivational Interviewing (MI) System Instruction
        system_instruction = (
            "You are MindBridge, an empathetic, non-judgmental, calm digital companion "
            "supporting individuals dealing with substance cravings, addiction recovery, emotional stress, "
            "loneliness, and peer pressure. Use Motivational Interviewing: validate feelings, practice reflective "
            "listening, never lecture, never scold, and offer one gentle, bite-sized coping suggestion. "
            "Keep responses warm, concise (2 to 4 sentences), and psychologically safe. "
            "Do not mention that you are an AI model unless asked."
        )

        # 1. Try modern google-genai SDK if available
        if GENAI_SDK_AVAILABLE:
            try:
                client = genai.Client(api_key=gemini_key.strip())
                
                # Format multi-turn conversation history
                contents = []
                for h in payload.history[-6:]:
                    role = "user" if h.role == "user" else "model"
                    contents.append(
                        genai_types.Content(
                            role=role,
                            parts=[genai_types.Part.from_text(text=h.content)]
                        )
                    )
                contents.append(
                    genai_types.Content(
                        role="user",
                        parts=[genai_types.Part.from_text(text=user_msg)]
                    )
                )

                config = genai_types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                    max_output_tokens=250,
                )

                response = client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=contents,
                    config=config
                )

                if response and response.text:
                    local_helper = generate_local_response(user_msg)
                    return ChatResponse(
                        response=response.text.strip(),
                        coping_step=local_helper["coping_step"],
                        emotion_tag=local_helper["emotion_tag"],
                        risk_level=local_helper["risk_level"],
                        is_fallback=False
                    )
            except Exception as ex:
                logger.error(f"Google GenAI SDK call failed: {ex}")

        # 2. Direct HTTP REST to Gemini 3.8 Flash (with fallback to gemini-flash-latest)
        for model_name in ["gemini-3.8-flash", "gemini-flash-latest"]:
            try:
                import requests
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key.strip()}"
                contents = []
                for h in payload.history[-6:]:
                    contents.append({
                        "role": "user" if h.role == "user" else "model",
                        "parts": [{"text": h.content}]
                    })
                contents.append({
                    "role": "user",
                    "parts": [{"text": user_msg}]
                })

                req_body = {
                    "contents": contents,
                    "systemInstruction": {
                        "parts": [{"text": system_instruction}]
                    },
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 250
                    }
                }

                resp = requests.post(url, json=req_body, timeout=12)
                if resp.status_code == 200:
                    data = resp.json()
                    candidate_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    local_helper = generate_local_response(user_msg)
                    return ChatResponse(
                        response=candidate_text,
                        coping_step=local_helper["coping_step"],
                        emotion_tag=local_helper["emotion_tag"],
                        risk_level=local_helper["risk_level"],
                        is_fallback=False
                    )
                else:
                    logger.error(f"Gemini REST API ({model_name}) returned HTTP {resp.status_code}: {resp.text}")
            except Exception as ex:
                logger.error(f"Gemini REST API error on {model_name}: {ex}")

    # Fallback to smart local emotional engine when key is missing or API call fails
    logger.info("Using local emotional-intent fallback engine.")
    local_res = generate_local_response(user_msg, [m.model_dump() for m in payload.history])
    return ChatResponse(**local_res)

@app.post("/api/callback", response_model=CallbackResponse)
def request_callback(req: CallbackRequest):
    token = f"MB-{datetime.datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO callback_requests (token, nickname, preferred_time, mode, topic, contact_method, contact_value)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (token, req.nickname, req.preferred_time, req.mode, req.topic, req.mode, req.contact_value))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Database insertion notice: {e}")

    return CallbackResponse(
        success=True,
        token=token,
        message="Your confidential callback request has been securely queued. A certified counsellor will connect with you during your chosen window.",
        created_at=now_str
    )

@app.get("/api/helplines")
def get_helplines():
    return {
        "helplines": [
            {
                "name": "National Drug De-addiction Helpline",
                "number": "14446",
                "toll_free": True,
                "timings": "24/7",
                "description": "Ministry of Social Justice and Empowerment, Government of India. Toll-free counseling and rehabilitation support.",
                "type": "National"
            },
            {
                "name": "Tele-MANAS",
                "number": "14416",
                "toll_free": True,
                "timings": "24/7",
                "description": "National Tele Mental Health Programme of India. Comprehensive, 24/7 mental health and psychological crisis counseling across multiple Indian languages.",
                "type": "Mental Health & Crisis"
            },
            {
                "name": "Vimukthi Mission Helpline (Kerala)",
                "number": "14405",
                "toll_free": True,
                "timings": "24/7",
                "description": "State initiative by Govt of Kerala against alcohol and narcotic drug addiction. Free de-addiction and psychological assistance.",
                "type": "De-addiction & Youth"
            },
            {
                "name": "KIRAN Mental Health Helpline",
                "number": "1800-599-0019",
                "toll_free": True,
                "timings": "24/7",
                "description": "Department of Empowerment of Persons with Disabilities. Early screening, first-aid, psychological support and distress management in 13 languages.",
                "type": "Crisis Intervention"
            }
        ],
        "rehab_centres": [
            {
                "id": 1,
                "name": "NIMHANS Centre for Addiction Medicine (CAM)",
                "city": "Bengaluru",
                "type": "In-person & Outpatient",
                "pricing": "Subsidized / Free",
                "contact": "080-26995000",
                "specialties": ["Substance Abuse", "Dual Diagnosis", "Adolescent Care"],
                "verified": True
            },
            {
                "id": 2,
                "name": "National Drug Dependence Treatment Centre (NDDTC) - AIIMS",
                "city": "New Delhi",
                "type": "In-person & Outpatient",
                "pricing": "Free / Govt Supported",
                "contact": "011-26588500",
                "specialties": ["Opioid Substitution", "Clinical Detox", "Family Counseling"],
                "verified": True
            },
            {
                "id": 3,
                "name": "Vandrevala Foundation Helpline",
                "city": "Online / Pan-India",
                "type": "Online",
                "pricing": "Free",
                "contact": "9999 666 555",
                "specialties": ["Emotional Distress", "Addiction Support", "Anxiety & Depression"],
                "verified": True
            },
            {
                "id": 4,
                "name": "Kripa Foundation",
                "city": "Mumbai",
                "type": "In-person",
                "pricing": "Sliding Scale",
                "contact": "022-26405411",
                "specialties": ["Holistic 12-Step", "Yoga Therapy", "Relapse Prevention"],
                "verified": True
            },
            {
                "id": 5,
                "name": "TTK Hospital & De-addiction Centre",
                "city": "Chennai",
                "type": "In-person & Online",
                "pricing": "Subsidized",
                "contact": "044-24912948",
                "specialties": ["Medical Detox", "Psychosocial Rehab", "Family Therapy"],
                "verified": True
            },
            {
                "id": 6,
                "name": "Manas Mental Health & Addiction Clinic",
                "city": "Kolkata",
                "type": "In-person & Online",
                "pricing": "Paid / Subsidized",
                "contact": "033-24641234",
                "specialties": ["Cognitive Behavioral Therapy (CBT)", "Relapse Management"],
                "verified": True
            }
        ]
    }
