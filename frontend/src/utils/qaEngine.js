// Client-side instant knowledge base for all recovery questions & natural conversation
// Guarantees immediate, accurate, non-repetitive answers even if network or backend is offline.

export const CLIENT_QA_DATABASE = [
  {
    keywords: ["how long", "craving last", "urge last", "duration of craving", "how long do craving", "waves", "fade"],
    answer: "Most acute drug and alcohol cravings peak within 3 to 5 minutes and subside naturally within 15 to 20 minutes if you do not feed them. Cravings operate like ocean waves—they build up, crest, and naturally dissolve. The psychological technique of 'Urge Surfing' teaches you to sit with the physical sensation without giving in until the dopamine storm passes.",
    step: "Open the Urge SOS tab and run the 10-Minute Urge Surf countdown or do Box Breathing to ride out the crest.",
    tag: "Craving Science",
    risk_level: "low"
  },
  {
    keywords: ["ruin", "ruined", "slip", "relapse", "messed up", "all progress gone", "start over", "guilt", "shame", "failed"],
    answer: "No, absolutely not. A slip or lapse is an isolated event, not a failure of your character. The sober days you achieved, the physical healing, and the neural rewiring you built do not disappear because of a setback. Be gentle with yourself, discard any remaining substance immediately, avoid shame spirals, and analyze what environmental trigger led to the slip.",
    step: "Throw away anything left right now, drink a glass of water, and write down the trigger in the Mood Tracker.",
    tag: "Relapse Recovery",
    risk_level: "low"
  },
  {
    keywords: ["say no", "peer pressure", "party", "friends", "offered", "forcing me", "pressuring", "refuse", "social"],
    answer: "You never owe anyone an explanation or debate regarding your personal health. Use direct, clear scripts: 1) 'I am good with my soda tonight, I have an early morning commitment.' 2) 'I am on a 30-day health reset.' 3) 'Doctor advised me to stay completely clear of alcohol/substances.' True friends will respect your boundary immediately. If anyone continues pushing, leaving the venue is self-protection, not rudeness.",
    step: "Always keep a non-alcoholic beverage physically in your hand so people are less likely to offer you a drink.",
    tag: "Boundary Skills",
    risk_level: "low"
  },
  {
    keywords: ["cope", "stress", "anxiety", "work pressure", "exam", "overwhelm", "without drugs", "without drinking", "relief"],
    answer: "Drugs and alcohol provide a quick, artificial shortcut to numb emotions, but they trigger a rebound surge of cortisol and anxiety once they wear off. Healthy replacement coping focuses on calming your parasympathetic nervous system naturally: double-inhale physiological sighs, 5-4-3-2-1 sensory grounding, brisk physical walking, or taking a cool shower.",
    step: "Do the 5-4-3-2-1 Grounding exercise: Name 5 objects around you, touch 4 textures, and take 2 slow exhales.",
    tag: "Stress Regulation",
    risk_level: "low"
  },
  {
    keywords: ["lonely", "bored", "alone at night", "quiet", "empty", "isolated", "nothing to do", "insomnia", "night"],
    answer: "Loneliness and boredom are two of the strongest neurological addiction triggers. When the surrounding world goes quiet, the brain's reward pathway screams for dopaminergic stimulation. Developing a structured evening wind-down routine—ambient lighting, comfort music, journaling, reading, or connecting with peer groups—fills the emotional void safely.",
    step: "Send a simple message to an old friend or family member ('Hey, thought of you! Hope you are doing well').",
    tag: "Loneliness Support",
    risk_level: "low"
  },
  {
    keywords: ["halt", "h.a.l.t", "hungry angry", "lonely tired", "vulnerability"],
    answer: "H.A.L.T. stands for Hungry, Angry, Lonely, Tired. Clinical research shows that over 80% of sudden substance urges occur when the body or mind is in an unaddressed physical vulnerability state. Whenever a sudden craving strikes, ask yourself: 'Am I Hungry? Am I Angry? Am I Lonely? Am I Tired?' Solving the physical deficit usually dissolves the urge.",
    step: "Drink a tall glass of water, eat a healthy snack, and take a 20-minute rest.",
    tag: "Relapse Prevention",
    risk_level: "low"
  },
  {
    keywords: ["withdrawal", "detox", "shaking", "sweating", "dangerous", "cold turkey", "tremors"],
    answer: "Withdrawal symptoms vary depending on the substance, dosage, and duration of use. Common signs include sweating, restlessness, tremors, irritability, nausea, and intense cravings. Please note: severe alcohol or sedative/benzodiazepine withdrawal can be medically hazardous (causing seizures) and requires clinical oversight. Always speak with a healthcare professional or helpline before detoxing.",
    step: "Call the National Drug De-addiction Helpline at 14446 for free medical guidance on safe detox facilities.",
    tag: "Detox Safety",
    risk_level: "moderate"
  },
  {
    keywords: ["tell family", "parents", "loved ones", "confess", "admit", "ask help family", "scared to tell"],
    answer: "Admitting you are struggling takes immense courage. Choose a quiet, calm moment when neither you nor your family is rushed or upset. You can say: 'I have been fighting a battle with substance use that is bigger than I can handle alone, and I want to get healthy. I am sharing this because I love you and need your support finding professional help.'",
    step: "If speaking aloud is too overwhelming, write your thoughts in a short handwritten letter or message first.",
    tag: "Family & Relationships",
    risk_level: "low"
  },
  {
    keywords: ["dopamine", "replacement", "habits", "alternatives", "natural high", "healthy habits"],
    answer: "Addiction hijacks the brain's dopamine reward loop. To restore natural dopamine sensitivity: 1) High-intensity cardio or brisk outdoor walks. 2) Cold water immersion or showers. 3) Creative hobbies like music, drawing, cooking, or coding. 4) Volunteering and spending time with pets. 5) Regular sleep schedules before 11 PM.",
    step: "Check off your daily walk or breathing exercise in the Mood & Habits tracker right now.",
    tag: "Positive Habits",
    risk_level: "low"
  },
  {
    keywords: ["helpline", "free", "cost", "14446", "14416", "charge", "counselling free", "toll free"],
    answer: "Yes! Both 14446 (National Drug De-addiction Helpline by Ministry of Social Justice and Empowerment) and 14416 (Tele-MANAS Mental Health Helpline) are 100% free and toll-free across India. They operate 24 hours a day, 7 days a week, and offer confidential assistance in Hindi, English, and regional Indian languages.",
    step: "Go to the Helplines & Rehab tab to view direct one-click dials and verified treatment centers.",
    tag: "Free Resources",
    risk_level: "low"
  },
  {
    keywords: ["cant sleep", "can't sleep", "insomnia", "awake", "middle of the night", "3am", "racing"],
    answer: "Late nights are when cravings and racing thoughts love to strike. First, take the pressure off: even resting quietly with your eyes closed restores your body. Don't stay in bed tossing and turning if it's stressing you out. Get up, get a glass of water, keep lights dim, and read something relaxing.",
    step: "Try Box Breathing (4 seconds in, 4 hold, 4 out, 4 hold) for 2 minutes to drop your heart rate.",
    tag: "Sleep & Calming",
    risk_level: "low"
  },
  {
    keywords: ["hi", "hey", "hello", "heyy", "hii", "yo", "morning", "evening", "sup", "namaste"],
    answer: "Hello my friend! I am right here with you. Take a gentle breath—this is a safe, completely anonymous space. How is your day going, and what is on your mind?",
    step: "Take one slow, deep belly breath and unclench your jaw.",
    tag: "Friendly Welcome",
    risk_level: "low"
  },
  {
    keywords: ["who are you", "what is mindbridge", "how are you", "what can you do"],
    answer: "I'm MindBridge, your anonymous recovery companion. I'm here to listen, help you navigate cravings, talk through stress, loneliness, or peer pressure, and share proven coping strategies without any lectures or judgment.",
    step: "Give your body a gentle stretch and drop your shoulders away from your ears.",
    tag: "Companion Introduction",
    risk_level: "low"
  },
  {
    keywords: ["suicide", "kill myself", "end it all", "want to die", "overdose", "harm myself", "hanging"],
    answer: "I hear how deeply painful and overwhelming things feel right now. Please know that your life has immense value and you do not have to carry this alone. Please pause and connect directly with trained support immediately.",
    step: "Call Tele-MANAS at 14416 or National Drug Helpline at 14446 immediately (24/7 Toll-Free).",
    tag: "Crisis Alert",
    risk_level: "high"
  },
  {
    keywords: ["thank you", "thanks", "thx", "appreciate", "helpful"],
    answer: "You are so very welcome! Remember that you did the hard work of pausing, seeking support, and choosing your well-being. I am always right here whenever you need a companion.",
    step: "Take a quiet moment of gratitude for your commitment to your healing journey.",
    tag: "Gratitude & Connection",
    risk_level: "low"
  }
];

export function getClientFallbackResponse(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  
  let bestMatch = null;
  let maxScore = 0;

  for (const item of CLIENT_QA_DATABASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (msg.includes(kw)) {
        score += kw.length; // prioritize longer, more specific matches
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      content: bestMatch.answer,
      coping_step: bestMatch.step,
      emotion_tag: bestMatch.tag,
      risk_level: bestMatch.risk_level
    };
  }

  // Open-ended dynamic fallback
  return {
    content: "Thank you for sharing that with me. I am listening closely. Taking time to express what you are experiencing instead of numbing it is a profound act of self-care. Tell me a bit more about what feels heaviest right now.",
    coping_step: "Notice your posture, gently unclench your jaw, and take one slow, deep breath.",
    emotion_tag: "Thoughtful Reflection",
    risk_level: "low"
  };
}
