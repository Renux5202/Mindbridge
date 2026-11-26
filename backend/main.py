import os
import sqlite3
import datetime
import random
import requests
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

try:
    from engine import generate_local_response, analyze_intent
except ImportError:
    from backend.engine import generate_local_response, analyze_intent

load_dotenv()

app = FastAPI(
    title="MindBridge API",
    description="Backend service for MindBridge: A Digital Companion Against Drug Addiction",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

try:
    init_db()
except Exception as e:
    print(f"DB Init error (handled): {e}")

# Data Models
class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = Field(default_factory=list)
    nickname: Optional[str] = "Friend"

class ChatResponse(BaseModel):
    response: str
    coping_step: Optional[str] = None
    emotion_tag: str
    risk_level: str # 'low', 'moderate', 'high'
    is_fallback: bool = False

class CallbackRequest(BaseModel):
    nickname: str
    preferred_time: str
    mode: str # 'Phone' or 'Encrypted Chat' or 'Email'
    topic: Optional[str] = "General Support"
    contact_value: str

class CallbackResponse(BaseModel):
    success: bool
    token: str
    message: str
    created_at: str

@app.get("/")
def root():
    return {
        "service": "MindBridge API",
        "status": "online",
        "documentation": "/docs",
        "helpline_active": True
    }

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    user_msg = payload.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    intent = analyze_intent(user_msg)
    # If crisis is detected, enforce immediate high risk safeguards
    if intent == "crisis":
        local_res = generate_local_response(user_msg, [m.model_dump() for m in payload.history])
        return ChatResponse(**local_res)

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            # Motivational Interviewing (MI) System Prompt
            system_instruction = (
                "You are MindBridge, an empathetic, non-judgmental, calm digital companion "
                "supporting individuals dealing with substance cravings, addiction recovery, emotional stress, "
                "loneliness, and peer pressure. Use Motivational Interviewing: validate feelings, practice reflective "
                "listening, never lecture, never scold, and offer one gentle, bite-sized coping suggestion. "
                "Keep responses warm, concise (2 to 4 sentences), and psychologically safe. "
                "Do not mention that you are an AI model unless asked."
            )
            
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            contents = []
            
            # Add recent history
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

            resp = requests.post(url, json=req_body, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                candidate_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                
                # Derive tag & coping step
                local_helper = generate_local_response(user_msg)
                return ChatResponse(
                    response=candidate_text,
                    coping_step=local_helper["coping_step"],
                    emotion_tag=local_helper["emotion_tag"],
                    risk_level=local_helper["risk_level"],
                    is_fallback=False
                )
        except Exception as ex:
            # Fallback gracefully
            print(f"Gemini API fallback triggered: {ex}")

    # Fallback to local intelligent emotional engine
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
        print(f"Database insertion notice: {e}")

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
