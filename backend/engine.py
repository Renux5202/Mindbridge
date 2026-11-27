import re
import random
from typing import Dict, List, Optional

# Structured Q&A Knowledge Base for Substance Addiction, Relapse, Triggers, & Recovery
CURATED_QA = [
    {
        "id": "cravings_duration",
        "category": "Cravings & Urges",
        "question": "How long do drug or alcohol cravings usually last?",
        "keywords": ["how long", "craving last", "urge duration", "how long craving", "waves", "fade"],
        "answer": "Most acute substance cravings peak within 3 to 5 minutes and generally begin subsiding within 15 to 20 minutes if you don't feed them. Cravings operate like ocean waves—they crest, swell, and naturally dissolve. The technique of 'Urge Surfing' (sitting with the physical sensation without acting) allows your dopamine receptors to reset without giving in.",
        "coping_step": "Open the Urge SOS tab and practice the 10-Minute Urge Surf timer or Box Breathing to ride out the peak.",
        "emotion_tag": "Craving Education",
        "risk_level": "moderate"
    },
    {
        "id": "relapse_slip",
        "category": "Relapse & Guilt",
        "question": "I had a slip or relapse. Did I ruin all my progress?",
        "keywords": ["relapse", "slip", "ruined progress", "fell off", "messed up", "started again", "guilt", "shame"],
        "answer": "Absolutely not. A lapse or slip is an event, not a failure of your character. The sober days, neural rewiring, and coping skills you accumulated don't vanish because of a setback. Recovery is rarely a straight line. What matters most right now is self-compassion: pause, avoid the 'abstinence violation effect' (thinking 'I messed up so I might as well keep using'), and analyze what triggered the slip without judging yourself.",
        "coping_step": "Dump any remaining substance down the drain, drink water, and write down the trigger in the Mood Tracker.",
        "emotion_tag": "Relapse Recovery",
        "risk_level": "moderate"
    },
    {
        "id": "peer_pressure_say_no",
        "category": "Peer Pressure",
        "question": "How do I say 'No' to friends pressuring me to use?",
        "keywords": ["say no", "peer pressure", "party", "friends offer", "forcing me", "refuse drink", "refuse drugs"],
        "answer": "You can use the 'Broken Record' or 'Delay & Exit' strategies. You never owe anyone a long debate about your health. Effective scripts include: 1) 'I'm good with my soda tonight, I have an early morning.' 2) 'I'm taking a 30-day health reset.' 3) 'Doctor told me to lay off for a while.' True friends will respect your boundary immediately. If a group persistently bullies or pressures you, having an immediate exit plan is self-protection, not rudeness.",
        "coping_step": "Keep a non-alcoholic drink physically in your hand at social events so people are less likely to offer you one.",
        "emotion_tag": "Boundary Skills",
        "risk_level": "low"
    },
    {
        "id": "coping_with_stress",
        "category": "Stress & Anxiety",
        "question": "I used drugs to cope with stress. How do I cope without them?",
        "keywords": ["stress", "anxiety", "work pressure", "exam stress", "cope without", "overwhelmed", "relief"],
        "answer": "Substances provide an artificial, rapid chemical shortcut to relieve stress, but they increase baseline anxiety (cortisol and adrenaline) once they wear off. Healthy replacement coping focuses on regulating your parasympathetic nervous system directly: slow belly breathing (lengthening the exhale), sensory grounding (5-4-3-2-1), vigorous 15-minute physical movement, or taking a warm shower.",
        "coping_step": "Try 2 minutes of double-inhale physiological sighs (deep breath through nose, top-up inhale, followed by a long slow mouth exhale).",
        "emotion_tag": "Stress Regulation",
        "risk_level": "low"
    },
    {
        "id": "loneliness_boredom",
        "category": "Loneliness & Triggers",
        "question": "I only get cravings when I am lonely or bored at night. Why?",
        "keywords": ["lonely", "bored", "alone at night", "quiet hours", "empty", "nothing to do", "isolated"],
        "answer": "Loneliness and boredom are two of the most potent addiction triggers (part of the classic H.A.L.T. warning signs: Hungry, Angry, Lonely, Tired). When the environment gets quiet, the brain seeks stimulation and dopaminergic connection. Developing a structured evening wind-down routine—such as listening to recovery podcasts, reading, journaling, or connecting with peer groups—fills the emotional vacuum safely.",
        "coping_step": "Reach out to one person with a low-stakes text message, or switch your lighting to warm dim tones and listen to an ambient playlist.",
        "emotion_tag": "Loneliness Support",
        "risk_level": "low"
    },
    {
        "id": "withdrawal_symptoms",
        "category": "Detox & Physical Health",
        "question": "What should I expect during physical withdrawal, and is it dangerous?",
        "keywords": ["withdrawal", "detox", "sweating", "shaking", "nausea", "headache", "insomnia", "safe detox"],
        "answer": "Withdrawal symptoms vary depending on the substance, dosage, and duration of use. Common symptoms include sweating, restless sleep, tremors, irritability, nausea, and intense cravings. Importantly: severe alcohol or benzodiazepine withdrawal can pose medical risks (such as seizures or delirium tremens) and requires medical supervision. Always consult a healthcare professional or call a de-addiction helpline before attempting cold-turkey detox from heavy daily alcohol or sedative use.",
        "coping_step": "Call the National Drug De-addiction Helpline at 14446 for free medical guidance on safe outpatient or inpatient detox.",
        "emotion_tag": "Detox Safety",
        "risk_level": "moderate"
    },
    {
        "id": "halt_technique",
        "category": "Relapse Prevention",
        "question": "What is the H.A.L.T. method in addiction recovery?",
        "keywords": ["halt", "hungry angry lonely tired", "relapse prevention tool", "vulnerability"],
        "answer": "H.A.L.T. stands for Hungry, Angry, Lonely, Tired. Research in addiction psychology shows that over 80% of sudden urges occur not because you truly desire the chemical, but because your body or mind is in an unaddressed state of physical vulnerability. Whenever an intense urge strikes, ask yourself: 'Am I Hungry? Am I Angry? Am I Lonely? Am I Tired?' Addressing the physical deficit often makes the craving dissipate immediately.",
        "coping_step": "Drink a glass of water, eat a high-protein snack, and take a 20-minute rest.",
        "emotion_tag": "Relapse Prevention",
        "risk_level": "low"
    },
    {
        "id": "tell_family",
        "category": "Relationships & Support",
        "question": "How do I tell my family or loved ones that I need help?",
        "keywords": ["tell family", "confess", "tell parents", "loved ones", "admit addiction", "ask for help", "scared to tell"],
        "answer": "Admitting you are struggling takes immense bravery. You don't have to share every painful detail all at once. Choose a calm, quiet moment when nobody is rushed or angry. You can say: 'I have been fighting a battle with substance use that is bigger than I can handle alone, and I want to get healthy. I am sharing this because I love you and need your support finding professional help.' Having a counsellor or helpline on standby can also help facilitate a family conversation.",
        "coping_step": "If speaking aloud is too scary, draft a short handwritten letter or text to a trusted relative or mentor.",
        "emotion_tag": "Family & Relationships",
        "risk_level": "low"
    },
    {
        "id": "replacement_habits",
        "category": "Habit Building",
        "question": "What healthy habits can replace the dopamine from drugs or alcohol?",
        "keywords": ["dopamine", "replacement", "new habits", "healthy alternatives", "natural high", "boredom buster"],
        "answer": "Addiction hijacks the brain's reward pathway. To rebalance dopamine naturally, engage in activities that release sustained endorphins and dopamine: 1) High-intensity interval workouts, running, or brisk walks. 2) Cold water immersion or cold showers. 3) Creative hobbies like drawing, music, cooking, or coding. 4) Volunteer work and animal interaction. 5) Community recovery groups where you can share openly without fear.",
        "coping_step": "Check off your daily walk or breathing exercise in the Mood & Habits tracker right now.",
        "emotion_tag": "Positive Habits",
        "risk_level": "low"
    },
    {
        "id": "mental_health_dual_diagnosis",
        "category": "Mental Health",
        "question": "Are depression and substance addiction connected?",
        "keywords": ["depression", "mental health", "dual diagnosis", "self medicate", "sadness", "trauma"],
        "answer": "Yes, profoundly so. Over 50% of individuals struggling with substance use are 'self-medicating' underlying depression, social anxiety, ADHD, or unprocessed trauma. While substances offer temporary numbness, they deplete neurotransmitters like serotonin and dopamine over time, deepening the depressive valley. Treating both the emotional health condition and the substance use simultaneously (known as Dual Diagnosis care) produces the highest long-term recovery rates.",
        "coping_step": "Reach out to Tele-MANAS at 14416 (24/7) for free mental health assessment with qualified clinical psychologists.",
        "emotion_tag": "Dual Diagnosis Care",
        "risk_level": "moderate"
    },
    {
        "id": "privacy_anonymity",
        "category": "Privacy & MindBridge",
        "question": "Is my data and chat history completely anonymous on MindBridge?",
        "keywords": ["is this private", "privacy", "anonymous", "who can see", "tracking", "wipe history"],
        "answer": "Yes, 100%. MindBridge requires zero email, zero phone number, and zero account sign-up. Your nickname is generated randomly in your browser, and all chat logs, mood check-ins, and habit trackers are stored exclusively in your browser's private local storage. You can hit the 'Quick Exit (Esc)' button at any second to escape to Google, or click the Trash icon in the navbar to wipe all records instantly.",
        "coping_step": "Press the Escape key on your keyboard right now if you ever need an instant privacy escape.",
        "emotion_tag": "Privacy & Trust",
        "risk_level": "low"
    },
    {
        "id": "helpline_cost",
        "category": "Help & Resources",
        "question": "Are Indian de-addiction helplines like 14446 and 14416 free?",
        "keywords": ["helpline free", "cost of rehab", "toll free", "14446", "14416", "charge", "counselling free"],
        "answer": "Yes! Both 14446 (National Drug De-addiction Helpline by Ministry of Social Justice and Empowerment) and 14416 (Tele-MANAS Mental Health Programme) are completely toll-free from any mobile or landline in India. They operate 24 hours a day, 7 days a week, and offer confidential assistance in Hindi, English, and regional languages.",
        "coping_step": "Click the Helplines & Rehab tab to view direct one-click dials and contact cards.",
        "emotion_tag": "Free Resources",
        "risk_level": "low"
    }
]

# Emergency Crisis Detection Patterns
CRISIS_PATTERNS = [
    r"\b(suicide|kill myself|end it all|don't want to live|want to die|overdose|harm myself|hanging|jump off|self harm)\b"
]

def find_best_qa_match(user_message: str) -> Optional[Dict]:
    """Matches user queries against curated recovery Q&As using keyword density and intent."""
    msg = user_message.lower().strip()
    best_match = None
    max_score = 0

    for item in CURATED_QA:
        score = 0
        # Check direct question substring or keyword matches
        q_clean = item["question"].lower()
        if msg in q_clean or q_clean in msg:
            score += 10

        for kw in item["keywords"]:
            if kw.lower() in msg:
                score += 3

        # Match single words in the question
        q_words = set(re.findall(r"\w+", q_clean))
        msg_words = set(re.findall(r"\w+", msg))
        common_words = q_words.intersection(msg_words) - {"how", "what", "why", "do", "i", "is", "a", "the", "to", "and", "or", "in", "my"}
        score += len(common_words)

        if score > max_score and score >= 3:
            max_score = score
            best_match = item

    return best_match

def analyze_intent(message: str) -> str:
    msg_clean = message.lower()
    for pat in CRISIS_PATTERNS:
        if re.search(pat, msg_clean):
            return "crisis"
    return "general"

def generate_local_response(message: str, history: List[Dict[str, str]] = None) -> Dict[str, str]:
    # 1. First priority: Check for life-safety crisis
    if analyze_intent(message) == "crisis":
        return {
            "response": "I hear how overwhelming and deeply painful things feel right now. Please know you are not alone in this dark moment, and there is support ready to hold you. Your life has immense value. Please pause and connect directly with trained support right now.",
            "coping_step": "Call Tele-MANAS at 14416 or National Drug Helpline at 14446 immediately (24/7 Toll-Free).",
            "emotion_tag": "Crisis Alert",
            "risk_level": "high",
            "is_fallback": True
        }

    # 2. Second priority: Match against the extensive curated Q&A knowledge base
    qa_match = find_best_qa_match(message)
    if qa_match:
        return {
            "response": qa_match["answer"],
            "coping_step": qa_match["coping_step"],
            "emotion_tag": qa_match["emotion_tag"],
            "risk_level": qa_match["risk_level"],
            "is_fallback": True,
            "matched_question": qa_match["question"]
        }

    # 3. Third priority: Compassionate Motivational Interviewing conversational fallback
    msg_lower = message.lower()
    if any(k in msg_lower for k in ["crave", "urge", "smoke", "drink", "use", "hit"]):
        reply = "Recognizing this urge takes incredible honesty and courage. Cravings are intense, but they are like ocean waves—they build up, crest, and will naturally subside within 15 to 20 minutes if we surf them without acting. You have survived 100% of your hardest days so far."
        step = "Try our 10-Minute Urge Surf or Box Breathing in the Urge SOS tab, or drink a tall glass of cold water right now."
        tag = "Urge / Craving"
    elif any(k in msg_lower for k in ["friend", "party", "pressur", "hangout", "social"]):
        reply = "Navigating social pressure while protecting your recovery is one of the hardest challenges. True friends will respect your boundaries, even if it feels awkward at first. You don't owe anyone a debate over your well-being."
        step = "Use the 'Delay or Pivot' technique: say 'I'm good with my soda right now' or 'I have an early commitment tomorrow morning'."
        tag = "Peer Pressure"
    elif any(k in msg_lower for k in ["stress", "work", "exam", "anxious", "panic", "overwhelm"]):
        reply = "It sounds like the demands on you have piled up so high that your mind is searching for a quick escape. That reaction is completely understandable. When everything feels urgent, let's take just 60 seconds to step off the treadmill."
        step = "Try the 5-4-3-2-1 Grounding exercise: Name 5 things you can see around you right now and take two slow deep exhales."
        tag = "Stress & Overwhelm"
    elif any(k in msg_lower for k in ["lonely", "alone", "empty", "nobody", "isolated"]):
        reply = "Loneliness can echo so loudly, especially in quiet hours. Even if it feels like nobody understands, the fact that you reached out here shows your resilience and desire for connection. This quiet moment does not define your future."
        step = "Send a simple, low-stakes text to someone you care about ('Hey, saw something that made me think of you!'), or listen to a warm comfort playlist."
        tag = "Loneliness"
    else:
        reply = "Thank you for sharing that with me. Recovery and emotional healing are not linear journeys; every single day you choose your health is a quiet victory. Taking time to process how you feel instead of numbing it is a profound act of self-care. Tell me a bit more about what's on your mind."
        step = "Notice your posture, gently unclench your jaw, drop your shoulders away from your ears, and take one deep breath."
        tag = "Reflection & Support"

    return {
        "response": reply,
        "coping_step": step,
        "emotion_tag": tag,
        "risk_level": "low",
        "is_fallback": True
    }
