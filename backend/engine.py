import re
import random
from typing import Dict, List, Optional

# 10 CORE CURATED QUESTIONS AND ANSWERS FOR SUBSTANCE ADDICTION & RECOVERY
CORE_RECOVERY_QA = [
    {
        "id": "craving_duration",
        "question": "How long do drug or alcohol cravings usually last?",
        "keywords": ["how long", "craving last", "urge last", "duration of craving", "how long do craving", "waves", "fade"],
        "answer": "Most acute drug and alcohol cravings peak within 3 to 5 minutes and subside naturally within 15 to 20 minutes if you do not feed them. Cravings operate like ocean waves—they build up, crest, and naturally dissolve. The psychological technique of 'Urge Surfing' teaches you to sit with the physical sensation without giving in until the dopamine storm passes.",
        "step": "Open the Urge SOS tab and run the 10-Minute Urge Surf countdown or do Box Breathing to ride out the crest.",
        "tag": "Craving Science"
    },
    {
        "id": "relapse_progress",
        "question": "I had a slip or relapse. Did I ruin all my progress?",
        "keywords": ["ruin", "ruined", "slip", "relapse", "messed up", "all progress gone", "start over", "guilt", "shame", "failed"],
        "answer": "No, absolutely not. A slip or lapse is an isolated event, not a failure of your character. The sober days you achieved, the physical healing, and the neural rewiring you built do not disappear because of a setback. Be gentle with yourself, discard any remaining substance immediately, avoid shame spirals, and analyze what environmental trigger led to the slip.",
        "step": "Throw away anything left right now, drink a glass of water, and write down the trigger in the Mood Tracker.",
        "tag": "Relapse Recovery"
    },
    {
        "id": "say_no_pressure",
        "question": "How do I say 'No' to friends pressuring me to use?",
        "keywords": ["say no", "peer pressure", "party", "friends", "offered", "forcing me", "pressuring", "refuse", "social"],
        "answer": "You never owe anyone an explanation or debate regarding your personal health. Use direct, clear scripts: 1) 'I am good with my soda tonight, I have an early morning commitment.' 2) 'I am on a 30-day health reset.' 3) 'Doctor advised me to stay completely clear of alcohol/substances.' True friends will respect your boundary immediately. If anyone continues pushing, leaving the venue is self-protection, not rudeness.",
        "step": "Always keep a non-alcoholic beverage physically in your hand so people are less likely to offer you a drink.",
        "tag": "Boundary Skills"
    },
    {
        "id": "cope_stress_without_drugs",
        "question": "I used drugs to cope with stress. How do I cope without them?",
        "keywords": ["cope", "stress", "anxiety", "work pressure", "exam", "overwhelm", "without drugs", "without drinking", "relief"],
        "answer": "Drugs and alcohol provide a quick, artificial shortcut to numb emotions, but they trigger a rebound surge of cortisol and anxiety once they wear off. Healthy replacement coping focuses on calming your parasympathetic nervous system naturally: double-inhale physiological sighs, 5-4-3-2-1 sensory grounding, brisk physical walking, or taking a cool shower.",
        "step": "Do the 5-4-3-2-1 Grounding exercise: Name 5 objects around you, touch 4 textures, and take 2 slow exhales.",
        "tag": "Stress Regulation"
    },
    {
        "id": "lonely_boredom_urges",
        "question": "I only get cravings when I am lonely or bored at night. Why?",
        "keywords": ["lonely", "bored", "alone at night", "quiet", "empty", "isolated", "nothing to do", "insomnia", "night"],
        "answer": "Loneliness and boredom are two of the strongest neurological addiction triggers. When the surrounding world goes quiet, the brain's reward pathway screams for dopaminergic stimulation. Developing a structured evening wind-down routine—ambient lighting, comfort music, journaling, reading, or connecting with peer groups—fills the emotional void safely.",
        "step": "Send a simple message to an old friend or family member ('Hey, thought of you! Hope you are doing well').",
        "tag": "Loneliness Support"
    },
    {
        "id": "halt_technique",
        "question": "What is the H.A.L.T. method in addiction recovery?",
        "keywords": ["halt", "h.a.l.t", "hungry angry", "lonely tired", "vulnerability"],
        "answer": "H.A.L.T. stands for Hungry, Angry, Lonely, Tired. Clinical research shows that over 80% of sudden substance urges occur when the body or mind is in an unaddressed physical vulnerability state. Whenever a sudden craving strikes, ask yourself: 'Am I Hungry? Am I Angry? Am I Lonely? Am I Tired?' Solving the physical deficit usually dissolves the urge.",
        "step": "Drink a tall glass of water, eat a healthy snack, and take a 20-minute rest.",
        "tag": "Relapse Prevention"
    },
    {
        "id": "withdrawal_safety",
        "question": "What should I expect during physical withdrawal, and is it dangerous?",
        "keywords": ["withdrawal", "detox", "shaking", "sweating", "dangerous", "cold turkey", "tremors"],
        "answer": "Withdrawal symptoms vary depending on the substance, dosage, and duration of use. Common signs include sweating, restlessness, tremors, irritability, nausea, and intense cravings. Please note: severe alcohol or sedative/benzodiazepine withdrawal can be medically hazardous (causing seizures) and requires clinical oversight. Always speak with a healthcare professional or helpline before detoxing.",
        "step": "Call the National Drug De-addiction Helpline at 14446 for free medical guidance on safe detox facilities.",
        "tag": "Detox Safety"
    },
    {
        "id": "tell_family_help",
        "question": "How do I tell my family or loved ones that I need help?",
        "keywords": ["tell family", "parents", "loved ones", "confess", "admit", "ask help family", "scared to tell"],
        "answer": "Admitting you are struggling takes immense courage. Choose a quiet, calm moment when neither you nor your family is rushed or upset. You can say: 'I have been fighting a battle with substance use that is bigger than I can handle alone, and I want to get healthy. I am sharing this because I love you and need your support finding professional help.'",
        "step": "If speaking aloud is too overwhelming, write your thoughts in a short handwritten letter or message first.",
        "tag": "Family & Relationships"
    },
    {
        "id": "natural_dopamine",
        "question": "What healthy habits can replace the dopamine from drugs or alcohol?",
        "keywords": ["dopamine", "replacement", "habits", "alternatives", "natural high", "healthy habits"],
        "answer": "Addiction hijacks the brain's dopamine reward loop. To restore natural dopamine sensitivity: 1) High-intensity cardio or brisk outdoor walks. 2) Cold water immersion or showers. 3) Creative hobbies like music, drawing, cooking, or coding. 4) Volunteering and spending time with pets. 5) Regular sleep schedules before 11 PM.",
        "step": "Check off your daily walk or breathing exercise in the Mood & Habits tracker right now.",
        "tag": "Positive Habits"
    },
    {
        "id": "free_helplines_india",
        "question": "Are Indian de-addiction helplines like 14446 and 14416 free?",
        "keywords": ["helpline", "free", "cost", "14446", "14416", "charge", "counselling free", "toll free"],
        "answer": "Yes! Both 14446 (National Drug De-addiction Helpline by Ministry of Social Justice and Empowerment) and 14416 (Tele-MANAS Mental Health Helpline) are 100% free and toll-free across India. They operate 24 hours a day, 7 days a week, and offer confidential assistance in Hindi, English, and regional Indian languages.",
        "step": "Go to the Helplines & Rehab tab to view direct one-click dials and verified treatment centers.",
        "tag": "Free Resources"
    }
]

# CONVERSATIONAL INTENTS (GREETINGS, CASUAL TALK, CRISIS)
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

    # 1. First priority: Check Life-Safety Crisis
    if analyze_intent(message) == "crisis":
        return {
            "response": "I hear how deeply painful things feel right now. Please know you are not alone, and your life has immense value. Please pause and connect with trained counselors right now.",
            "coping_step": "Call Tele-MANAS at 14416 or National Drug Helpline at 14446 immediately (24/7 Toll-Free).",
            "emotion_tag": "Crisis Alert",
            "risk_level": "high",
            "is_fallback": True
        }

    # 2. Second priority: Match against the 10 Core Curated Q&As
    best_qa = None
    max_score = 0
    for qa in CORE_RECOVERY_QA:
        # Check direct question substring
        q_clean = qa["question"].lower()
        score = 0
        if msg_clean in q_clean or q_clean in msg_clean:
            score += 15

        for kw in qa["keywords"]:
            if kw in msg_clean:
                score += 3

        if score > max_score and score >= 3:
            max_score = score
            best_qa = qa

    if best_qa:
        return {
            "response": best_qa["answer"],
            "coping_step": best_qa["step"],
            "emotion_tag": best_qa["tag"],
            "risk_level": "low",
            "is_fallback": True
        }

    # 3. Third priority: Conversational greetings, who are you, cravings, gratitude
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

    # 4. Open-ended empathetic response
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
