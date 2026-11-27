import re
import random
from typing import Dict, List, Optional

# COMPREHENSIVE RECOVERY KNOWLEDGE BASE FOR MINDBRIDGE
RECOVERY_KNOWLEDGE = [
  # 1. Life-Safety Crisis (Highest Priority)
  {
    "id": "crisis_alert",
    "category": "Crisis Alert",
    "priority": 100,
    "patterns": [
      r"\b(suicide|kill myself|end it all|want to die|overdose|harm myself|hanging|jump off|self harm|bleed|end my life|dont want to live|don't want to live|slit|die)\b"
    ],
    "answer": "I hear how deeply painful and overwhelming things feel right now. Please know that your life has immense value and you do not have to carry this alone. Please pause right now. Connect directly with trained support who care and will protect you through this moment.",
    "step": "Call Tele-MANAS at 14416 or National Drug Helpline at 14446 immediately (24/7 Toll-Free).",
    "tag": "Crisis Alert",
    "risk_level": "high"
  },

  # 2. Immediate Crisis / What should I do right now?
  {
    "id": "immediate_action",
    "category": "Immediate Action Plan",
    "priority": 45,
    "patterns": [
      r"\bwhat should i do\b",
      r"\bwhat can i do\b",
      r"\bwhat do i do\b",
      r"\bhelp me right now\b",
      r"\bright now\b",
      r"\bwhat to do right now\b",
      r"\bi need help now\b",
      r"\bi don't know what to do\b",
      r"\bi dont know what to do\b",
      r"\bguide me\b",
      r"\btell me what to do\b"
    ],
    "answer": "Right now, freeze what you are doing and take 3 deep, slow breaths. Here is your immediate 3-step action plan: 1) Change your physical room or scenery immediately—put physical distance between you and the trigger. 2) Drink a large glass of ice-cold water or splash cold water on your face to activate your dive reflex and drop your heart rate. 3) Set a timer for 10 minutes. Cravings crest like waves and fade if you ride them out without acting.",
    "step": "Tap the 'Urge SOS' tab and start the 10-Minute Urge Surf countdown or Box Breathing right now.",
    "tag": "Immediate Action Plan",
    "risk_level": "moderate"
  },

  # 3. Peer Pressure / Parties / Social situations
  {
    "id": "peer_pressure",
    "category": "Peer Pressure & Boundaries",
    "priority": 40,
    "patterns": [
      r"\b(peer|peer pressure|pressur\w*|party|club|hangout|forcing|offered|refus\w*|say no|social pressure|teas\w*|made fun|left out|everyone is (drinking|smoking|doing))\b",
      r"\b(friends? (are|is)? (pressuring|forcing|offering|drinking|smoking))\b",
      r"\bhow (do|can) i say no\b"
    ],
    "answer": "Navigating social pressure while protecting your recovery is one of the hardest challenges. You never owe anyone an explanation or debate about your well-being. Try simple, direct scripts: 1) 'I'm good with my soda tonight, I have an early commitment tomorrow.' 2) 'I'm on a 30-day health reset.' Real friends will respect your boundary immediately. If people keep pushing, leaving the room is self-care, not rudeness.",
    "step": "Keep a non-alcoholic drink physically in your hand at social events so people stop offering you things.",
    "tag": "Peer Pressure & Boundaries",
    "risk_level": "low"
  },

  # 4. Already used / Drank / Slipped / Relapsed / Guilt
  {
    "id": "relapse_guilt",
    "category": "Relapse & Compassion",
    "priority": 38,
    "patterns": [
      r"\b(relaps\w*|slipped|slip up|messed up|ruined|broke my streak|streak broken|guilt\w*|ashamed|hate myself|fell off|failed|did it again|broke my promise)\b",
      r"\bi (drank|smoked|used|vaped|consumed|gave in)\b",
      r"\bi had a slip\b",
      r"\bdid i ruin\b"
    ],
    "answer": "Take a deep breath and pause right where you are. You have NOT ruined all your progress. A slip or lapse is an isolated event, not a failure of who you are. The sober days you achieved, the physical healing, and the skills you built do not vanish. Shame and guilt only trick your brain into using more. Forgive yourself, discard anything remaining right now, and let's restart clean from this exact moment.",
    "step": "Dump or flush any remaining substance right now, drink a full glass of water, and log this trigger in the Mood Tracker.",
    "tag": "Relapse & Compassion",
    "risk_level": "moderate"
  },

  # 5. Withdrawal / Physical Symptoms / Detox Safety
  {
    "id": "withdrawal_detox",
    "category": "Withdrawal & Detox",
    "priority": 35,
    "patterns": [
      r"\b(withdraw\w*|detox\w*|cold turkey)\b",
      r"\b(shak\w*|tremor\w*|cold sweat\w*|sweat\w*|nausea|vomit\w*|fever|chills|seizure\w*)\b",
      r"\b(hands? (are )?shaking|body (is )?shaking|shivering)\b",
      r"\b(is withdrawal dangerous|safe detox)\b"
    ],
    "answer": "Withdrawal symptoms vary depending on the substance, dosage, and duration of use. Common signs include sweating, restlessness, tremors, shaking hands, sleep disruption, and anxiety. Important note: severe alcohol or sedative/benzodiazepine withdrawal can be medically hazardous (risk of seizures) and requires clinical oversight. Always speak with a healthcare professional or helpline before detoxing.",
    "step": "Call the National Drug De-addiction Helpline at 14446 for free medical guidance on safe detox facilities.",
    "tag": "Withdrawal & Detox",
    "risk_level": "moderate"
  },

  # 6. Telling Family / Loved ones / Parents
  {
    "id": "telling_family",
    "category": "Family & Loved Ones",
    "priority": 35,
    "patterns": [
      r"\b(tell|talk to|confess|admit|explain to|speak to)\b.*\b(parent\w*|family|mom|mother|dad|father|relatives?|loved ones)\b",
      r"\b(parents? (found out|know|disappointed|angry))\b",
      r"\bhow to tell (my )?(parents|family|mom|dad)\b",
      r"\bscared to tell\b"
    ],
    "answer": "Admitting you are struggling takes immense courage. Choose a quiet, calm moment when neither you nor your family is rushed or upset. You can say: 'I have been fighting a battle with substance use that is bigger than I can handle alone, and I want to get healthy. I am sharing this because I love you and need your support finding professional help.'",
    "step": "If speaking aloud is too overwhelming, write your thoughts in a short handwritten letter or message first.",
    "tag": "Family & Loved Ones",
    "risk_level": "low"
  },

  # 7. Recovery Roadmap / How to Quit / How to Stop Addiction
  {
    "id": "recovery_roadmap",
    "category": "Recovery Roadmap",
    "priority": 32,
    "patterns": [
      r"\bhow (do|can) i (quit|stop|recover|beat|overcome)\b",
      r"\b(how to quit|how to stop|how to recover|how to get clean|how to get sober)\b",
      r"\b(quit\w* (drugs?|smoking|drinking|weed|alcohol|addiction))\b",
      r"\b(stop\w* (using|drugs?|smoking|drinking|addiction))\b",
      r"\b(stay clean|stay sober|maintain sobriety)\b",
      r"\bhelp me quit\b"
    ],
    "answer": "Deciding to quit is the most powerful choice you will ever make. Recovery isn't about willpower alone—it is about strategy: 1) Remove easy access—clear your space of substances and paraphernalia. 2) Identify your top 3 triggers (people, places, stress). 3) Replace the dopamine ritual with physical exercise, hydration, and creative hobbies. 4) Build a daily accountability habit using our Streak & Habit tracker. Take it one single day—or one single hour—at a time.",
    "step": "Start your recovery clock in the Sobriety Tracker and commit to staying clean just for today.",
    "tag": "Recovery Roadmap",
    "risk_level": "low"
  },

  # 8. What is Addiction / Brain Science / Mechanism
  {
    "id": "science_of_addiction",
    "category": "Science of Addiction",
    "priority": 30,
    "patterns": [
      r"\b(what is addiction|how does addiction work|why do i get addicted|is addiction a disease|science of addiction|addiction psychology|brain on drugs)\b",
      r"\b(symptoms of (addiction|drug abuse)|signs of addiction)\b"
    ],
    "answer": "Addiction is a chronic, treatable neurobiological condition, not a moral failure or lack of willpower. Substances flood the brain's mesolimbic pathway with unnatural surges of dopamine—up to 10 times what natural rewards provide. Over time, the brain downregulates its dopamine receptors, creating tolerance and cravings. The good news is neuroplasticity: with abstinence, your brain rewires and restores natural dopamine sensitivity.",
    "step": "Read through our Psychoeducation guides in the Resources tab to understand how your brain heals.",
    "tag": "Science of Addiction",
    "risk_level": "low"
  },

  # 9. Cravings / Urges / Wanting to Use / Drink / Smoke / Vape / Weed
  {
    "id": "cravings_urges",
    "category": "Craving Support",
    "priority": 25,
    "patterns": [
      r"\b(crav\w*|urge\w*|tempt\w*|resist urge)\b",
      r"\b(want to|feel like|craving for|urge to|need a|thinking of)\b.*\b(smoke|smoking|drink|drinking|beer|alcohol|weed|joint|puff|hit|vape|vaping|substance|high|buzz|pills?|drug)\b",
      r"\b(smoke|smoking|cigarette|cigar|bidi|weed|cannabis|pot|vape|vaping|alcohol|beer|whiskey|vodka|drinks?|high|stoned)\b",
      r"\bhow long (do |does )?(cravings?|urges?) last\b"
    ],
    "answer": "I hear you, and it's completely valid that you're feeling this urge right now. Cravings are intense, but remember: an urge is just a neurochemical wave, not a command. They naturally peak within 3 to 5 minutes and subside within 15 to 20 minutes if you don't feed them. You don't have to fight it with brute force—just surf through the next 10 minutes.",
    "step": "Try the 10-Minute Urge Surf countdown or Box Breathing in the Urge SOS tab, or drink a large glass of ice-cold water right now.",
    "tag": "Craving Support",
    "risk_level": "moderate"
  },

  # 10. Stress / Anxiety / Exams / College / Work / Burnout
  {
    "id": "stress_anxiety",
    "category": "Stress & Anxiety",
    "priority": 22,
    "patterns": [
      r"\b(stress\w*|anxious\w*|anxiety|panic\w*|overwhelm\w*|burnout|racing mind)\b",
      r"\b(exam\w*|stud\w*|test\w*|school|college|university|assignment\w*|grades?)\b",
      r"\b(work\w*|job|office|boss|deadline\w*|career|pressure)\b",
      r"\b(too much to handle|cant handle this|can't handle this)\b"
    ],
    "answer": "It sounds like everything is piling up at once. When our nervous system gets flooded by stress, our brain instinctively screams for a fast chemical escape. That reaction is natural, but substances only borrow calm from tomorrow and cause rebound anxiety. Let's take just 60 seconds to step off the treadmill and reset your body's stress response.",
    "step": "Do the 5-4-3-2-1 Grounding exercise: Name 5 things you can see around you right now, touch 4 textures, and take 2 slow exhales.",
    "tag": "Stress Regulation",
    "risk_level": "low"
  },

  # 11. Depression / Sadness / Hopelessness
  {
    "id": "depression_sadness",
    "category": "Emotional Support",
    "priority": 24,
    "patterns": [
      r"\b(depress\w*|hopeless\w*|worthless|miserable|feel like giving up|giving up|broken inside|heartbroken|unhappy)\b"
    ],
    "answer": "I hear how heavy your heart is feeling. Depression tells lies—it tells you that you are alone, that nothing will change, and that you are beyond help. None of those things are true. You are dealing with real neurological fatigue, and simply waking up and making it through today is an accomplishment. Please treat yourself with radical kindness today.",
    "step": "Wrap yourself in a comfortable blanket, drink some warm water or tea, and listen to soothing audio in the SOS tab.",
    "tag": "Emotional Support",
    "risk_level": "low"
  },

  # 12. Loneliness / Boredom / Isolation / Empty
  {
    "id": "loneliness_boredom",
    "category": "Loneliness & Triggers",
    "priority": 20,
    "patterns": [
      r"\b(lonel\w*|alone|bored\w*|empty|nobody|no one|isolat\w*|abandoned|by myself|quiet night|sad|crying)\b",
      r"\b(no friends|feel alone|feel empty|nothing to do)\b"
    ],
    "answer": "Loneliness and boredom can feel so heavy, especially in quiet hours. When the world is silent, the brain searches for quick dopamine hits. But please know that you are not invisible, and reaching out here shows your strength and desire for connection. Instead of an artificial chemical spike, let's substitute something real: comfort music, a warm shower, or sending a message to someone you haven't spoken to in a while.",
    "step": "Send a low-stakes text message to a loved one or old friend ('Hey, thought of you! Hope your week is going well').",
    "tag": "Loneliness Support",
    "risk_level": "low"
  },

  # 13. Insomnia / Can't Sleep / Late Night
  {
    "id": "sleep_insomnia",
    "category": "Sleep & Calming",
    "priority": 20,
    "patterns": [
      r"\b(sleep\w*|cant sleep|can't sleep|insomnia|sleepless\w*|awake|middle of the night|3am|4am|late night|tossing)\b",
      r"\b(restless|trouble sleeping)\b"
    ],
    "answer": "Late nights are when cravings and racing thoughts love to strike because there are no distractions. First, take the pressure off: even if you can't fall asleep immediately, resting quietly with your eyes closed restores your body. Don't stay in bed tossing and turning if it's stressing you out. Get up, get a glass of water, keep the lights dim, and read something relaxing.",
    "step": "Try Box Breathing (4 seconds in, 4 hold, 4 out, 4 hold) for 2 minutes to drop your resting heart rate.",
    "tag": "Sleep & Calming",
    "risk_level": "low"
  },

  # 14. Anger / Frustration / Arguments
  {
    "id": "anger_frustration",
    "category": "Emotional De-escalation",
    "priority": 20,
    "patterns": [
      r"\b(angry|mad|furious|annoy\w*|irritat\w*|pissed|fight\w*|argument\w*|hate everything|frustrat\w*)\b"
    ],
    "answer": "Anger pumps adrenaline through your veins, making your brain demand an instant emotional release. But using substances when you are angry never solves the issue—it just creates a new regret tomorrow. Your feelings are valid, but let's release that physical adrenaline safely without harming your body.",
    "step": "Physical release: take a brisk 10-minute walk outside or splash ice-cold water directly onto your face.",
    "tag": "Emotional De-escalation",
    "risk_level": "low"
  },

  # 15. H.A.L.T. / Hunger / Tiredness
  {
    "id": "halt_method",
    "category": "Relapse Prevention",
    "priority": 20,
    "patterns": [
      r"\b(halt|h\.a\.l\.t)\b",
      r"\b(hungry|starving|exhausted|worn out|no energy)\b",
      r"\bwhat is halt\b"
    ],
    "answer": "H.A.L.T. stands for Hungry, Angry, Lonely, Tired. Clinical research shows that over 80% of sudden substance urges occur when the body or mind is in an unaddressed physical vulnerability state. Whenever a sudden craving strikes, ask yourself: 'Am I Hungry? Am I Angry? Am I Lonely? Am I Tired?' Solving the physical deficit usually dissolves the urge immediately.",
    "step": "Drink a tall glass of water, eat a healthy snack with protein, and take a 20-minute rest.",
    "tag": "Relapse Prevention",
    "risk_level": "low"
  },

  # 16. Replacement habits / Dopamine / Healthy Alternatives
  {
    "id": "positive_habits",
    "category": "Positive Habits",
    "priority": 20,
    "patterns": [
      r"\b(dopamine|replacement\w*|new habits?|alternative\w*|what to do instead|natural high|healthy habits?)\b",
      r"\b(replace (drugs|alcohol|smoking|weed))\b"
    ],
    "answer": "Addiction hijacks the brain's dopamine reward loop. To restore natural dopamine sensitivity: 1) High-intensity cardio or brisk outdoor walks. 2) Cold water immersion or showers. 3) Creative hobbies like music, drawing, cooking, or coding. 4) Volunteering and spending time with pets. 5) Regular sleep schedules before 11 PM.",
    "step": "Check off your daily walk or breathing exercise in the Mood & Habits tracker right now.",
    "tag": "Positive Habits",
    "risk_level": "low"
  },

  # 17. Indian Helplines & Cost
  {
    "id": "free_helplines",
    "category": "Free Resources",
    "priority": 25,
    "patterns": [
      r"\b(helpline\w*|free|cost|charge|14446|14416|tele-manas|tele manas|toll free|counselling free|rehab cost|helpline number)\b",
      r"\b(is (the )?helpline free|government helpline)\b"
    ],
    "answer": "Yes! Both 14446 (National Drug De-addiction Helpline by Ministry of Social Justice and Empowerment) and 14416 (Tele-MANAS Mental Health Helpline) are 100% free and toll-free across India. They operate 24 hours a day, 7 days a week, and offer confidential assistance in Hindi, English, and regional Indian languages.",
    "step": "Go to the Helplines & Rehab tab to view direct one-click dials and verified treatment centers.",
    "tag": "Free Resources",
    "risk_level": "low"
  },

  # 18. Who are you / How MindBridge Works
  {
    "id": "companion_intro",
    "category": "Companion Introduction",
    "priority": 15,
    "patterns": [
      r"\b(who are you|what is mindbridge|what do you do|how are you|how can you help|what are you|are you an ai|are you human)\b"
    ],
    "answer": "I'm MindBridge, your anonymous companion against substance addiction and emotional distress. I'm here to listen, help you surf cravings, talk through stress or loneliness, and support your journey without any lectures or judgment. You can tell me how you feel, ask about recovery, or use the Urge SOS tools.",
    "step": "Give your body a gentle stretch and drop your shoulders away from your ears.",
    "tag": "Companion Introduction",
    "risk_level": "low"
  },

  # 19. Friendly Greetings / Casual conversation
  {
    "id": "friendly_welcome",
    "category": "Friendly Welcome",
    "priority": 10,
    "patterns": [
      r"^(hi|hey|hello|heyy+|hii+|yo|howdy|good morning|good evening|good afternoon|sup|anyone there|what's up|namaste)\b",
      r"\b(hello mindbridge|hey mindbridge|hi there)\b"
    ],
    "answer": "Hello my friend! I am right here with you. Take a gentle breath—this is a safe, completely anonymous space. How is your day going, and what is on your mind?",
    "step": "Take one slow, deep belly breath and unclench your jaw.",
    "tag": "Friendly Welcome",
    "risk_level": "low"
  },

  # 20. Gratitude & Thank you
  {
    "id": "gratitude",
    "category": "Gratitude & Connection",
    "priority": 10,
    "patterns": [
      r"\b(thank you|thanks|thx|thank u|appreciate|helpful|feeling better|helped a lot|good advice)\b"
    ],
    "answer": "You are so very welcome! Remember that you did the hard work of pausing, seeking support, and choosing your well-being. I am always right here whenever you need a companion.",
    "step": "Take a quiet moment of gratitude for your commitment to your healing journey.",
    "tag": "Gratitude & Connection",
    "risk_level": "low"
  }
]

# Backward compatibility alias
CORE_RECOVERY_QA = RECOVERY_KNOWLEDGE

def analyze_intent(message: str) -> str:
    msg_clean = message.lower()
    for item in RECOVERY_KNOWLEDGE:
        if item["id"] == "crisis_alert":
            for pat in item["patterns"]:
                if re.search(pat, msg_clean, re.IGNORECASE):
                    return "crisis"
    return "general"

def generate_local_response(message: str, history: List[Dict[str, str]] = None) -> Dict[str, str]:
    msg_clean = message.lower().strip()

    # 1. First priority: Check Life-Safety Crisis
    if analyze_intent(message) == "crisis":
        return {
            "response": "I hear how deeply painful and overwhelming things feel right now. Please know that your life has immense value and you do not have to carry this alone. Please pause right now. Connect directly with trained support who care and will protect you through this moment.",
            "coping_step": "Call Tele-MANAS at 14416 or National Drug Helpline at 14446 immediately (24/7 Toll-Free).",
            "emotion_tag": "Crisis Alert",
            "risk_level": "high",
            "is_fallback": True
        }

    # 2. Score against knowledge base
    best_match = None
    max_score = -1

    for item in RECOVERY_KNOWLEDGE:
        score = 0
        for pat in item["patterns"]:
            if re.search(pat, msg_clean, re.IGNORECASE):
                score += item.get("priority", 10)
        if score > max_score and score > 0:
            max_score = score
            best_match = item

    if best_match and max_score > 0:
        return {
            "response": best_match["answer"],
            "coping_step": best_match["step"],
            "emotion_tag": best_match["tag"],
            "risk_level": best_match["risk_level"],
            "is_fallback": True
        }

    # 3. Empathetic dynamic reflections
    dynamic_fallbacks = [
        {
            "response": "Thank you for sharing that with me. I am listening closely. Taking time to express what you are experiencing instead of numbing it is a profound act of self-care. Tell me a bit more about what you are feeling right now.",
            "coping_step": "Notice your posture, gently unclench your jaw, and take one slow, deep breath.",
            "emotion_tag": "Thoughtful Reflection",
            "risk_level": "low"
        },
        {
            "response": "I hear you. Recovery and healing aren't straight lines—every single day you choose to pause and reflect is a victory. What feels like the heaviest thing on your mind right now?",
            "coping_step": "Drop your shoulders away from your ears and let your belly relax.",
            "emotion_tag": "Empathetic Listening",
            "risk_level": "low"
        },
        {
            "response": "I am right here beside you. Whatever you are going through, you don't have to carry it alone. Take a slow breath, and tell me what would bring you even a tiny bit of relief today.",
            "coping_step": "Take a sip of water and pause for a quiet 10-second breath.",
            "emotion_tag": "Grounding Support",
            "risk_level": "low"
        }
    ]

    chosen = random.choice(dynamic_fallbacks)
    return {
        "response": chosen["response"],
        "coping_step": chosen["coping_step"],
        "emotion_tag": chosen["emotion_tag"],
        "risk_level": chosen["risk_level"],
        "is_fallback": True
    }
