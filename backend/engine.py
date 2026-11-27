import re
import random
from typing import Dict, List, Optional

# COMPREHENSIVE CONVERSATIONAL & TOPICAL KNOWLEDGE BASE
FAQ_TOPICS = [
    {
        "keywords": ["how long", "craving last", "urge last", "duration of craving", "how long do craving", "waves"],
        "answer": "Most acute substance cravings peak within 3 to 5 minutes and subside naturally within 15 to 20 minutes if you don't feed them. Cravings operate like ocean waves—they crest, swell, and naturally dissolve. The technique of 'Urge Surfing' (observing the sensation without acting) allows your dopamine receptors to reset without giving in.",
        "step": "Open the Urge SOS tab and practice the 10-Minute Urge Surf timer or Box Breathing to ride out the peak.",
        "tag": "Craving Education"
    },
    {
        "keywords": ["ruin", "ruined", "slip", "relapse", "messed up", "all progress gone", "start over", "guilt", "shame"],
        "answer": "No, you haven't ruined all your progress. A slip or relapse is an event, not a failure of who you are. The sober days you achieved, the mental rewiring, and the lessons you learned are still yours. Be compassionate with yourself, discard any remaining substance, and start fresh from this exact moment.",
        "step": "Throw away anything left right now, drink a glass of water, and write down the trigger in the Mood Tracker.",
        "tag": "Relapse Recovery"
    },
    {
        "keywords": ["say no", "peer pressure", "party", "friends", "offered", "forcing me", "pressuring", "refuse"],
        "answer": "You never have to justify choosing your health. Try simple, firm scripts: 1) 'I'm good with my soda tonight, I have an early morning.' 2) 'I'm on a health reset.' 3) 'Doctor told me to lay off for a bit.' Real friends will respect your boundary immediately. If people keep pressuring you, leaving the room is self-care, not rudeness.",
        "step": "Keep a non-alcoholic drink physically in your hand so people are less likely to offer you anything.",
        "tag": "Boundary Skills"
    },
    {
        "keywords": ["cope", "stress", "anxiety", "work pressure", "exam", "overwhelm", "without drugs", "without drinking"],
        "answer": "Substances provide a quick artificial shortcut to numb stress, but they cause a rebound spike in cortisol once they wear off. Healthy replacement coping focuses on calming your nervous system naturally: double-inhale physiological sighs, 5-4-3-2-1 sensory grounding, brisk physical walking, or taking a hot/cold shower.",
        "step": "Do the 5-4-3-2-1 Grounding exercise: Name 5 objects around you, touch 4 textures, and take 2 slow exhales.",
        "tag": "Stress Regulation"
    },
    {
        "keywords": ["lonely", "bored", "alone at night", "quiet", "empty", "isolated", "nothing to do"],
        "answer": "Loneliness and boredom are two of the biggest addiction triggers (part of the H.A.L.T. warning signs). When everything gets quiet, the brain screams for dopaminergic stimulation. Developing a structured evening wind-down routine—music, reading, journaling, or connecting with peer groups—safely fills the emotional void.",
        "step": "Send a simple message to an old friend or family member ('Hey, thought of you! Hope you're doing well').",
        "tag": "Loneliness Support"
    },
    {
        "keywords": ["halt", "h.a.l.t", "hungry angry", "lonely tired"],
        "answer": "H.A.L.T. stands for Hungry, Angry, Lonely, Tired. Research in addiction psychology shows that over 80% of sudden urges occur when your body or mind is in an unaddressed state of physical vulnerability. Whenever an intense urge strikes, ask yourself: 'Am I Hungry? Am I Angry? Am I Lonely? Am I Tired?' Solving the physical need usually dissolves the craving.",
        "step": "Drink water, eat a nourishing snack, and take a 20-minute rest.",
        "tag": "Relapse Prevention"
    },
    {
        "keywords": ["withdrawal", "detox", "shaking", "sweating", "dangerous", "cold turkey"],
        "answer": "Withdrawal symptoms vary depending on the substance and duration. Common signs include sweating, tremors, sleep disruption, and anxiety. Note: severe alcohol or sedative withdrawal can be medically dangerous—always seek medical supervision for safe detox.",
        "step": "Call 14446 (National Drug Helpline) for free guidance on verified detox centers.",
        "tag": "Detox Safety"
    },
    {
        "keywords": ["tell family", "parents", "loved ones", "confess", "admit", "ask help family"],
        "answer": "Opening up takes courage. Choose a calm, quiet moment when nobody is rushed or angry. You can say: 'I have been fighting a battle with substance use that is bigger than I can handle alone, and I want to get healthy. I am sharing this because I love you and need your support finding professional help.'",
        "step": "If speaking aloud feels too scary, draft a short handwritten note or text message first.",
        "tag": "Family & Relationships"
    },
    {
        "keywords": ["dopamine", "replacement", "habits", "alternatives", "natural high"],
        "answer": "To rebalance dopamine naturally without chemicals, engage in activities that release sustained endorphins: 1) High-intensity exercise or brisk walking. 2) Cold showers. 3) Creative outlets like music, drawing, cooking, or coding. 4) Volunteering and pet care. 5) Community recovery peer groups.",
        "step": "Check off your daily walk or breathing exercise in the Mood & Habits tracker right now.",
        "tag": "Positive Habits"
    },
    {
        "keywords": ["helpline", "free", "cost", "14446", "14416", "charge"],
        "answer": "Yes! Both 14446 (National Drug De-addiction Helpline) and 14416 (Tele-MANAS Mental Health Helpline) are 100% free and toll-free across India, operating 24 hours a day in multiple Indian languages.",
        "step": "Go to the Helplines & Rehab tab to view direct one-click dials.",
        "tag": "Free Resources"
    },
    {
        "keywords": ["cant sleep", "can't sleep", "insomnia", "awake", "middle of the night", "3am", "racing"],
        "answer": "Late nights are when cravings and racing thoughts love to strike. First, take the pressure off: even resting quietly with your eyes closed restores your body. Don't stay in bed tossing and turning if it's stressing you out. Get up, get a glass of water, keep lights dim, and read something relaxing.",
        "step": "Try Box Breathing (4 seconds in, 4 hold, 4 out, 4 hold) for 2 minutes to drop your heart rate.",
        "tag": "Sleep & Calming"
    }
]

# CONVERSATIONAL INTENTS (GREETINGS, EMOTIONS, CRAVINGS)
CONVERSATIONAL_INTENTS = [
    # 1. Greetings
    {
        "patterns": [
            r"^(hi|hey|hello|heyy+|hii+|yo|howdy|good morning|good evening|good afternoon|sup|anyone there|what's up|namaste)\b"
        ],
        "replies": [
            "Hey there! I'm right here with you. How is your day going so far, and how are you feeling inside?",
            "Hello my friend. I'm glad you stopped by. Take a breath—this is a safe, zero-judgment space. What's on your mind today?",
            "Hey! Whether you're having an easy day, a difficult one, or just checking in, I'm happy you're here. How can I support you right now?"
        ],
        "coping_step": "Take one slow, deep belly breath. Unclench your shoulders.",
        "emotion_tag": "Friendly Welcome",
        "risk_level": "low"
    },

    # 2. Who are you / How are you
    {
        "patterns": [
            r"\b(how are you|how r u|who are you|what are you|what can you do|what is mindbridge)\b"
        ],
        "replies": [
            "I'm doing well, thank you for asking! I'm MindBridge, your anonymous companion. I'm here to listen, help you navigate cravings, talk through stress or loneliness, and support your journey without any lectures or judgment.",
            "I'm here and ready to listen. You can talk to me about anything: strong urges, feeling pressured by friends, feeling alone, or just venting about a rough day."
        ],
        "coping_step": "Notice your posture, gently unclench your jaw, and give your body a gentle stretch.",
        "emotion_tag": "Companion Introduction",
        "risk_level": "low"
    },

    # 3. Urge / Craving
    {
        "patterns": [
            r"\b(crave|craving|urge|want to use|want to smoke|want to drink|need a hit|need a puff|need a sip|relapse coming|tempted|can't resist|feeling the urge|having an urge)\b"
        ],
        "replies": [
            "I hear you. Thank you for coming here and talking to me instead of giving in immediately. That pause you just took is your superpower. Cravings feel huge, but they are like waves—they peak within 5 minutes and subside if you don't feed them.",
            "This feeling is really uncomfortable, but remember: an urge is just a feeling, not a command. You don't have to obey it. You've survived 100% of your hardest cravings before, and you can ride this one out too."
        ],
        "coping_step": "Try our 10-Minute Urge Surf in the Urge SOS tab, or drink a large glass of ice-cold water right now.",
        "emotion_tag": "Craving Support",
        "risk_level": "moderate"
    },

    # 4. Crisis / Life-Safety
    {
        "patterns": [
            r"\b(suicide|kill myself|end it all|don't want to live|want to die|overdose|harm myself|hanging|jump off|self harm)\b"
        ],
        "replies": [
            "I hear how deeply painful and unbearable things feel right now. Please know that your life is precious and you do not have to carry this agonizing weight all by yourself. There are compassionate people waiting to listen and help you through this minute.",
            "Please pause right now. Don't make a permanent decision in a temporary storm. Connect directly with someone trained who cares and will protect you."
        ],
        "coping_step": "Call Tele-MANAS at 14416 or the National Drug Helpline at 14446 immediately (24/7 Toll-Free).",
        "emotion_tag": "Crisis Alert",
        "risk_level": "high"
    },

    # 5. Gratitude / Thanks
    {
        "patterns": [
            r"\b(thank you|thanks|thx|thank u|appreciate it|helpful|you helped me|feeling better)\b"
        ],
        "replies": [
            "You are so very welcome! But remember: *you* did the hard work of pausing, reaching out, and choosing your well-being. I'm always right here whenever you need me.",
            "It is truly my pleasure. Keep this momentum going into the rest of your day, one gentle step at a time!"
        ],
        "coping_step": "Give yourself a moment of appreciation for taking care of your mental and physical health today.",
        "emotion_tag": "Gratitude & Connection",
        "risk_level": "low"
    }
]

def analyze_intent(message: str) -> str:
    msg_clean = message.lower()
    for item in CONVERSATIONAL_INTENTS:
        if item["emotion_tag"] == "Crisis Alert":
            for pat in item["patterns"]:
                if re.search(pat, msg_clean):
                    return "crisis"
    return "general"

def generate_local_response(message: str, history: List[Dict[str, str]] = None) -> Dict[str, str]:
    msg_clean = message.lower().strip()

    # 1. First priority: Check FAQ topics with keyword density
    best_faq = None
    max_matches = 0
    for faq in FAQ_TOPICS:
        matches = sum(1 for kw in faq["keywords"] if kw in msg_clean)
        if matches > max_matches:
            max_matches = matches
            best_faq = faq

    if best_faq and max_matches >= 1:
        return {
            "response": best_faq["answer"],
            "coping_step": best_faq["step"],
            "emotion_tag": best_faq["tag"],
            "risk_level": "low",
            "is_fallback": True
        }

    # 2. Second priority: Check conversational intents (greetings, feelings, cravings)
    for item in CONVERSATIONAL_INTENTS:
        for pat in item["patterns"]:
            if re.search(pat, msg_clean):
                return {
                    "response": random.choice(item["replies"]),
                    "coping_step": item["coping_step"],
                    "emotion_tag": item["emotion_tag"],
                    "risk_level": item["risk_level"],
                    "is_fallback": True
                }

    # 3. Empathetic open-ended conversational fallback
    default_replies = [
        "Thank you for sharing that with me. I'm listening closely. Taking time to express what's going on inside rather than numbing it is a really brave step. Can you tell me a little more about how you're feeling right now?",
        "I hear you. Recovery and healing aren't straight lines—every single day you choose to pause and reflect is a victory. What feels like the heaviest thing on your mind right now?",
        "I'm right here beside you. Whatever you're going through, you don't have to carry it alone. Take a slow breath, and tell me what would bring you even a tiny bit of relief today."
    ]

    return {
        "response": random.choice(default_replies),
        "coping_step": "Notice your posture, gently unclench your jaw, drop your shoulders away from your ears, and take one deep breath.",
        "emotion_tag": "Thoughtful Reflection",
        "risk_level": "low",
        "is_fallback": True
    }
