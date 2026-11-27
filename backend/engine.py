import re
import random
from typing import Dict, List, Optional

# COMPREHENSIVE CONVERSATIONAL DIALOGUE KNOWLEDGE BASE
# Covers natural human conversation: greetings, feelings, cravings, fears, questions, slips, everyday talk
CONVERSATIONAL_INTENTS = [
    # 1. Greetings & Casual Hello
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

    # 2. How are you / Who are you
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

    # 3. Feeling Good / Proud / Milestones
    {
        "patterns": [
            r"\b(i feel good|doing well|clean for|sober for|days clean|weeks clean|months clean|i did it|proud of myself|feeling happy|good news|resisted an urge)\b"
        ],
        "replies": [
            "That is incredible! Seriously, celebrating these wins—big or small—is so vital. You made a conscious choice to protect your peace and body, and that takes genuine courage. I'm really proud of you!",
            "Hearing that brings a smile to my face! Every single clean day rewires your neural pathways toward freedom. How does it feel in your body to have won that battle?"
        ],
        "coping_step": "Acknowledge this victory: treat yourself to a favorite healthy meal, fruit, or tea today.",
        "emotion_tag": "Celebration & Strength",
        "risk_level": "low"
    },

    # 4. Immediate Craving / Urge to Use
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

    # 5. Peer Pressure / Party / Friends
    {
        "patterns": [
            r"\b(peer pressure|friends? (are )?(drinking|smoking|pressuring|forcing|offering)|friends?|party|parties|social pressure|feel left out|hard to say no|they made fun of me|forced to drink|forced to smoke)\b"
        ],
        "replies": [
            "Being in a room where people are using or pressuring you is one of the toughest tests. Remember: your recovery is for *you*, not them. True friends will respect your boundary, even if it feels awkward right now.",
            "You never have to justify choosing your health. Try saying: 'I'm good with this soda tonight, got an early morning tomorrow.' If the pressure doesn't stop, having an exit strategy is self-respect, not weakness."
        ],
        "coping_step": "Keep a non-alcoholic beverage in your hand so people stop offering you things, or step outside for 5 minutes of fresh air.",
        "emotion_tag": "Boundary Skills",
        "risk_level": "moderate"
    },

    # 6. Relapse / Slip / Guilt & Shame
    {
        "patterns": [
            r"\b(i relapsed|i slipped|i messed up|i used again|i drank again|i smoked again|hate myself|ruined my streak|failed|all progress gone|guilty|ashamed)\b"
        ],
        "replies": [
            "Please stop right there and take a gentle breath. You have NOT ruined all your progress. A slip is an event, not your identity. The sober days you built and the coping skills you learned are still inside you.",
            "Guilt and shame make cravings worse by tricking you into thinking 'I already ruined it, so I might as well keep going.' Don't fall for that trap. Forgive yourself right now, throw away anything left, and start fresh from this exact minute."
        ],
        "coping_step": "Flush or dump any remaining substance immediately, drink water, and log this trigger in the Mood Tracker.",
        "emotion_tag": "Relapse Recovery",
        "risk_level": "moderate"
    },

    # 7. Stress / Overwhelmed / Work / Exams
    {
        "patterns": [
            r"\b(stress|stressed|overwhelm|overwhelmed|exam|exams|work pressure|boss|deadline|deadlines|panic|anxiety|too much pressure|burnout)\b"
        ],
        "replies": [
            "It sounds like everything is piling up at once. When our nervous system gets flooded by stress, our brain instinctively screams for a fast chemical escape. That reaction is natural, but substances only borrow energy and calm from tomorrow.",
            "You don't have to solve your entire week or year right now. Let's break it down to just the next 15 minutes. What is the single smallest thing on your plate you can set aside for tonight?"
        ],
        "coping_step": "Do the 5-4-3-2-1 Grounding exercise: Name 5 objects around you, touch 4 textures, and take 2 slow exhales.",
        "emotion_tag": "Stress Relief",
        "risk_level": "low"
    },

    # 8. Loneliness / Boredom / Empty
    {
        "patterns": [
            r"\b(lonely|alone|nobody cares|no friends|empty|emptiness|bored|boredom|nothing to do|isolated|isolation|abandoned)\b"
        ],
        "replies": [
            "Loneliness can feel so heavy and quiet. A lot of people turn to substances simply because the silence becomes too loud. But please know that you are not invisible, and sitting with me right now is proof you want connection.",
            "When we are bored and alone, our brain searches for high-dopamine hits. Instead of an artificial chemical spike, let's substitute something real: music, a walk, a hot shower, or messaging someone you haven't spoken to in a while."
        ],
        "coping_step": "Send a simple message to an old friend or family member ('Hey, thought of you! Hope you're having a good week').",
        "emotion_tag": "Loneliness & Warmth",
        "risk_level": "low"
    },

    # 9. Sadness / Depression / Crying
    {
        "patterns": [
            r"\b(sad|depressed|depression|crying|tears|hopeless|down|can't get out of bed|numb|heavy heart|hurts so much)\b"
        ],
        "replies": [
            "I'm sending you so much warmth right now. It takes so much strength just to wake up and carry sadness some days. You don't have to be productive or cheerful today—just breathing and being gentle with yourself is enough.",
            "It is okay to not be okay. Numbing sadness with substances only postpones the pain. Letting yourself feel it, cry if you need to, and resting without guilt is true healing."
        ],
        "coping_step": "Wrap yourself in a warm blanket, drink a sip of water, and listen to a calming comfort playlist.",
        "emotion_tag": "Compassion & Comfort",
        "risk_level": "low"
    },

    # 10. Can't Sleep / Insomnia / Late Night
    {
        "patterns": [
            r"\b(can't sleep|cant sleep|insomnia|awake|middle of the night|3am|4am|late night|mind is racing|racing thoughts)\b"
        ],
        "replies": [
            "Late nights are when cravings and racing thoughts love to strike. The world is asleep, and your mind starts running in loops. First, take the pressure off: even if you can't fall asleep immediately, resting quietly with your eyes closed still restores your body.",
            "Don't stay in bed tossing and turning if it's stressing you out. Get up, get a glass of water, keep the lights dim, and read something relaxing until your eyes feel heavy."
        ],
        "coping_step": "Try Box Breathing (4 seconds in, 4 hold, 4 out, 4 hold) for 2 minutes to drop your heart rate.",
        "emotion_tag": "Sleep & Calming",
        "risk_level": "low"
    },

    # 11. Anger / Irritation / Frustration
    {
        "patterns": [
            r"\b(angry|mad|furious|pissed|annoyed|irritated|hate everyone|frustrated|argument|fight)\b"
        ],
        "replies": [
            "Anger is a fiery emotion, and it pumps adrenaline through your veins making you want an immediate outlet. But using substances when you're angry never solves the problem—it just creates a new regret tomorrow.",
            "Your frustration is valid. Let's burn off that physical adrenaline safely: do 15 jumping jacks, squeeze a pillow, or write out a raw, unfiltered note and then tear it up."
        ],
        "coping_step": "Physical release: take a brisk 10-minute walk outside or splash cold water directly on your face.",
        "emotion_tag": "Emotional De-escalation",
        "risk_level": "low"
    },

    # 12. Life-Safety Crisis / Severe Harm
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

    # 13. Gratitude / Thank You
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

# FAQ Q&As for direct questions
FAQ_QA = [
    {
        "keywords": ["how long", "craving last", "urge duration", "waves"],
        "answer": "Most acute substance cravings peak within 3 to 5 minutes and subside within 15 to 20 minutes if you don't feed them. Cravings operate like ocean waves—they crest, swell, and naturally dissolve. The technique of 'Urge Surfing' (observing the sensation without acting) allows your dopamine receptors to reset without giving in.",
        "step": "Open the Urge SOS tab and practice the 10-Minute Urge Surf timer or Box Breathing to ride out the peak.",
        "tag": "Craving Education"
    },
    {
        "keywords": ["halt", "hungry angry", "lonely tired"],
        "answer": "H.A.L.T. stands for Hungry, Angry, Lonely, Tired. Over 80% of sudden urges occur when your body or mind is in an unaddressed state of physical vulnerability. Whenever an intense urge strikes, ask yourself: 'Am I Hungry? Am I Angry? Am I Lonely? Am I Tired?' Solving the physical need usually dissolves the craving.",
        "step": "Drink water, eat a nourishing snack, and take a 20-minute rest.",
        "tag": "Relapse Prevention"
    },
    {
        "keywords": ["withdrawal", "detox", "shaking", "sweating"],
        "answer": "Withdrawal symptoms vary depending on the substance and duration. Common signs include sweating, tremors, sleep disruption, and anxiety. Note: severe alcohol or sedative withdrawal can be medically dangerous—always seek medical supervision for safe detox.",
        "step": "Call 14446 (National Drug Helpline) for free guidance on verified detox centers.",
        "tag": "Detox Safety"
    },
    {
        "keywords": ["helpline", "free", "cost", "14446", "14416"],
        "answer": "Yes! Both 14446 (National Drug De-addiction Helpline) and 14416 (Tele-MANAS Mental Health Helpline) are 100% free and toll-free across India, operating 24 hours a day in multiple Indian languages.",
        "step": "Go to the Helplines & Rehab tab to view direct one-click dials.",
        "tag": "Free Resources"
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

    # 1. Check conversational intents (greetings, feelings, cravings, etc.)
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

    # 2. Check FAQ questions
    for faq in FAQ_QA:
        if any(kw in msg_clean for kw in faq["keywords"]):
            return {
                "response": faq["answer"],
                "coping_step": faq["step"],
                "emotion_tag": faq["tag"],
                "risk_level": "low",
                "is_fallback": True
            }

    # 3. Empathetic open-ended conversational response
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
