import re
import random
from typing import Dict, List, Tuple

# Motivational Interviewing (MI) & Compassionate Local Engine Responses
INTENT_PATTERNS = {
    "crisis": [
        r"\b(suicide|kill myself|end it all|don't want to live|want to die|overdose|harm myself|hanging|jump off|self harm)\b"
    ],
    "craving": [
        r"\b(urge|craving|relapse|slip|want to smoke|want to drink|need a hit|need a dose|trigger(ed)?|tempted|can't resist|craving bad|just once|one sip|one puff)\b"
    ],
    "peer_pressure": [
        r"\b(friends?|peer|party|invited|pressuring|forcing|make fun of me|left out|say no|social circle|hangout)\b"
    ],
    "stress": [
        r"\b(stress(ed)?|exam(s)?|work(place)?|deadlines?|burnout|overwhelm(ed)?|boss|anxious|anxiety|panic|pressure|hectic)\b"
    ],
    "loneliness": [
        r"\b(lone(ly)?|alone|nobody|isolated|no one cares|emptiness|empty|abandoned|no friends|by myself)\b"
    ],
    "depression": [
        r"\b(depress(ed)?|hopeless|sad|down|numb|dark place|giving up|can't get up|crying|worthless)\b"
    ]
}

RESPONSES_DB = {
    "crisis": {
        "emotion_tag": "Crisis Alert",
        "risk_level": "high",
        "replies": [
            "I hear how overwhelming and deeply painful things feel right now. Please know you are not alone in this dark moment, and there is support ready to hold you. Your life has immense value.",
            "I'm truly glad you reached out. When feelings become this heavy, you don't have to carry them by yourself. Please let someone trained and compassionate support you right now."
        ],
        "coping_step": "Pause and connect directly with a compassionate counselor right now. Call Tele-MANAS at 14416 or National Drug Helpline at 14446."
    },
    "craving": {
        "emotion_tag": "Urge / Craving",
        "risk_level": "moderate",
        "replies": [
            "Recognizing this urge takes incredible honesty and courage. Cravings are intense, but they are like ocean waves—they build up, crest, and will naturally subside within 15 to 20 minutes if we surf them.",
            "Thank you for pausing and coming here instead of giving in right away. This urge is uncomfortable, but you have survived 100% of your hardest days so far. Let's ride this wave together.",
            "It is completely natural for old habits to call out when your brain is seeking relief or dopamine. You don't have to fight it with brute force—just delay it by 10 minutes."
        ],
        "coping_step": "Try our 10-Minute Urge Surf or Box Breathing in the Urge SOS tab, or drink a tall glass of cold water right now."
    },
    "peer_pressure": {
        "emotion_tag": "Peer Pressure",
        "risk_level": "moderate",
        "replies": [
            "Navigating social situations when trying to protect your peace and recovery is one of the hardest challenges. True friends will respect your boundaries, even if it feels awkward at first.",
            "Wanting to fit in is a basic human need, so give yourself grace for feeling the pull. But remember the 'why' that made you choose recovery in the first place.",
            "You are allowed to have an exit plan. You don't owe anyone a debate over your well-being."
        ],
        "coping_step": "Use the 'Delay or Pivot' technique: say 'I'm good with my soda right now' or 'I have an early commitment tomorrow morning'."
    },
    "stress": {
        "emotion_tag": "Stress & Overwhelm",
        "risk_level": "low",
        "replies": [
            "It sounds like the demands on you have piled up so high that your mind is searching for a quick escape. That reaction is completely understandable, but substance use only borrows happiness from tomorrow.",
            "When everything feels urgent, our nervous system switches into fight-or-flight. Let's take just 60 seconds to step off the treadmill.",
            "You are carrying a lot right now. Acknowledging that you are stressed is the first powerful step to releasing some of the pressure."
        ],
        "coping_step": "Try the 5-4-3-2-1 Grounding exercise: Name 5 things you can see around you right now and take two slow deep exhales."
    },
    "loneliness": {
        "emotion_tag": "Loneliness",
        "risk_level": "low",
        "replies": [
            "Loneliness can echo so loudly, especially in quiet hours. Even if it feels like nobody understands, the fact that you reached out here shows your resilience and desire for connection.",
            "Isolation often tricks us into believing we are forgotten. But this moment does not define your entire future or your worth.",
            "I'm here with you right now. It takes strength to sit with the quiet rather than numbing it."
        ],
        "coping_step": "Send a simple, low-stakes text to someone you care about ('Hey, saw something that made me think of you!'), or listen to a warm comfort playlist."
    },
    "depression": {
        "emotion_tag": "Low Mood",
        "risk_level": "moderate",
        "replies": [
            "I hear how heavy and drained you feel. On days when just getting through feels exhausting, remember that simply existing and breathing through this moment is enough.",
            "Depression casts a dark lens over everything, making progress feel invisible. Be gentle with yourself today.",
            "You don't have to figure out the whole next month or year right now. Just focus on the next 10 minutes."
        ],
        "coping_step": "Wrap yourself in a warm blanket, drink a sip of water, and allow yourself to rest without guilt."
    },
    "general": {
        "emotion_tag": "Reflection & Support",
        "risk_level": "low",
        "replies": [
            "Thank you for sharing that with me. Recovery and emotional healing are not linear journeys; every single day you choose your health is a quiet victory.",
            "I'm listening. Taking time to process how you feel instead of pushing it down is a profound act of self-care. Tell me a bit more about what's on your mind.",
            "You are moving forward, step by step. What is one small thing that would bring you a tiny bit of comfort today?"
        ],
        "coping_step": "Notice your posture, gently unclench your jaw, drop your shoulders away from your ears, and take one deep breath."
    }
}

def analyze_intent(message: str) -> str:
    msg_clean = message.lower()
    for intent, patterns in INTENT_PATTERNS.items():
        for pat in patterns:
            if re.search(pat, msg_clean):
                return intent
    return "general"

def generate_local_response(message: str, history: List[Dict[str, str]] = None) -> Dict[str, str]:
    intent = analyze_intent(message)
    data = RESPONSES_DB[intent]
    
    reply = random.choice(data["replies"])
    return {
        "response": reply,
        "coping_step": data["coping_step"],
        "emotion_tag": data["emotion_tag"],
        "risk_level": data["risk_level"],
        "is_fallback": True
    }
