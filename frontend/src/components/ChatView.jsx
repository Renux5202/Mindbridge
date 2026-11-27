import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  AlertCircle, 
  PhoneCall, 
  RefreshCw, 
  Lightbulb, 
  ShieldAlert, 
  Smile, 
  Flame, 
  Users, 
  CloudRain,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';
import { STORAGE_KEYS } from '../utils/storage';
import { API_BASE_URL } from '../utils/api';

// Natural things users frequently say to MindBridge
const CONVERSATION_STARTERS = [
  { text: "Hey! How can you help me?", icon: Smile, tag: "Friendly Hello" },
  { text: "I'm having an urge right now and need help", icon: Flame, tag: "Urge to Use" },
  { text: "My friends are pressuring me to drink/smoke", icon: Users, tag: "Peer Pressure" },
  { text: "I had a slip yesterday and feel guilty", icon: AlertCircle, tag: "Relapse Guilt" },
  { text: "I'm stressed out and overwhelmed", icon: CloudRain, tag: "Stress" },
  { text: "I can't sleep and my mind is racing", icon: Sparkles, tag: "Insomnia" },
  { text: "Feeling lonely and empty tonight", icon: HeartHandshake, tag: "Loneliness" }
];

const RECOVERY_QUESTIONS = [
  {
    category: "Cravings & Urges",
    q: "How long do drug or alcohol cravings usually last?",
    short: "Cravings peak within 3-5 minutes and fade in 15-20 minutes."
  },
  {
    category: "Relapse & Guilt",
    q: "I had a slip or relapse. Did I ruin all my progress?",
    short: "No. A lapse is an event, not a failure. Your neural progress is preserved."
  },
  {
    category: "Peer Pressure",
    q: "How do I say 'No' to friends pressuring me to use?",
    short: "Use 'Broken Record' or 'Delay & Exit' scripts without guilt."
  },
  {
    category: "Stress & Anxiety",
    q: "I used drugs to cope with stress. How do I cope without them?",
    short: "Parasympathetic breathing, physiological sighs, and 5-4-3-2-1 grounding."
  },
  {
    category: "Loneliness & Triggers",
    q: "I only get cravings when I am lonely or bored at night. Why?",
    short: "H.A.L.T. triggers: brain seeks stimulation when the environment goes quiet."
  },
  {
    category: "Relapse Prevention",
    q: "What is the H.A.L.T. method in addiction recovery?",
    short: "Hungry, Angry, Lonely, Tired—check physical needs before reacting to urges."
  },
  {
    category: "Detox & Safety",
    q: "What should I expect during physical withdrawal, and is it dangerous?",
    short: "Symptoms vary; severe alcohol/sedative withdrawal requires medical supervision."
  },
  {
    category: "Relationships",
    q: "How do I tell my family or loved ones that I need help?",
    short: "Choose a calm time and share that you want to heal with their support."
  },
  {
    category: "Habit Building",
    q: "What healthy habits can replace the dopamine from drugs or alcohol?",
    short: "Vigorous exercise, cold showers, creative hobbies, and peer connection."
  },
  {
    category: "Privacy & Helplines",
    q: "Are Indian de-addiction helplines like 14446 and 14416 free?",
    short: "Yes, 100% toll-free, 24/7 confidential counseling in multiple languages."
  }
];

export default function ChatView({ nickname, setActiveTab }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Hello ${nickname}. Welcome to MindBridge. I am your safe, confidential companion. You can ask me any question about cravings, relapse, peer pressure, or withdrawal—or click any of the frequent questions below for instant guidance.`,
        coping_step: "Take one gentle, slow breath and unclench your jaw.",
        emotion_tag: "Welcome",
        risk_level: "low",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaqDrawer, setShowFaqDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          nickname: nickname,
          history: newHistory.slice(-6).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        coping_step: data.coping_step,
        emotion_tag: data.emotion_tag,
        risk_level: data.risk_level,
        is_fallback: data.is_fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn("Using smart client resilience fallback:", err);
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm right here with you. Cravings and intense emotions are like storm waves—they crest, peak, and naturally begin to subside after 15 to 20 minutes if we ride them out without acting. You are stronger than this single moment.",
        coping_step: "Drink a glass of cold water and try the Box Breathing tool in the Urge SOS tab.",
        emotion_tag: "Support & Grounding",
        risk_level: "low",
        is_fallback: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Clear this conversation history?")) {
      const initial = [
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Fresh page, ${nickname}. Ask me anything about recovery, coping with triggers, or managing an urge.`,
          emotion_tag: "Ready",
          risk_level: "low",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(initial);
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(initial));
    }
  };

  const filteredQuestions = selectedCategory === 'All' 
    ? RECOVERY_QUESTIONS 
    : RECOVERY_QUESTIONS.filter(q => q.category === selectedCategory);

  const categories = ['All', ...new Set(RECOVERY_QUESTIONS.map(q => q.category))];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E3EDE8] dark:border-[#24352F]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E3EDE8] dark:bg-[#1D2C25] text-[#395B4E] dark:text-[#9DD1BE] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#212928] dark:text-[#E5EBE8] flex items-center gap-2">
              MindBridge Companion
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-[#637971] dark:text-[#99AEA3]">
              Non-judgmental answers to your questions on addiction, cravings, and recovery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFaqDrawer(!showFaqDrawer)}
            className="text-xs text-[#395B4E] dark:text-[#9DD1BE] font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E3EDE8] dark:bg-[#1D2C25] hover:bg-[#D5E4DC] dark:hover:bg-[#253930] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Questions Library</span>
            {showFaqDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleClearChat}
            className="text-xs text-[#7A9188] hover:text-[#395B4E] dark:hover:text-[#9DD1BE] flex items-center gap-1 p-2 rounded-lg hover:bg-[#E3EDE8]/50 dark:hover:bg-[#1C2924] transition-colors"
            title="Clear current chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Expandable Frequent Questions Drawer */}
      {showFaqDrawer && (
        <div className="mt-2 p-4 rounded-3xl bg-white dark:bg-[#18231E] border border-[#D7E5DF] dark:border-[#2C4037] shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 space-y-3 shrink-0 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#395B4E] dark:text-[#9DD1BE] uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#5C8979]" /> Frequent Recovery Questions (Click to Ask)
            </span>
            <span className="text-[11px] text-[#7A9188]">{filteredQuestions.length} Topics</span>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#5C8979] text-white shadow-2xs'
                    : 'bg-[#F3F7F5] dark:bg-[#202E28] text-[#556961] dark:text-[#A7BCB3] hover:bg-[#E3EDE8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {filteredQuestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleSend(item.q);
                  setShowFaqDrawer(false);
                }}
                className="p-2.5 rounded-2xl bg-[#F7F9F8] dark:bg-[#15201B] border border-[#E3EDE8] dark:border-[#24352F] hover:border-[#5C8979] text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-semibold text-[#212928] dark:text-[#E2EBE6] group-hover:text-[#5C8979] leading-snug">
                    {item.q}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#5C8979] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                </div>
                <span className="text-[10px] text-[#7A9188] dark:text-[#88A396] mt-1 line-clamp-1">
                  {item.short}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        
        {/* Quick Question Chips (shown when chat is fresh) */}
        {messages.length <= 2 && (
          <div className="p-4 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] space-y-2.5 shadow-2xs">
            <p className="text-xs font-semibold text-[#5C8979] dark:text-[#88BBA7] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Tap What You Want To Say:
            </p>
            <div className="flex flex-wrap gap-2">
              {CONVERSATION_STARTERS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3F7F5] dark:bg-[#202E28] hover:bg-[#E3EDE8] dark:hover:bg-[#283C34] text-xs text-[#395B4E] dark:text-[#C5DED4] transition-all text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#5C8979] shrink-0" />
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[75%] rounded-3xl p-4 shadow-2xs leading-relaxed text-sm ${
                  isUser
                    ? 'bg-[#5C8979] text-white rounded-br-xs'
                    : 'bg-white dark:bg-[#18231E] text-[#212928] dark:text-[#E2EBE6] border border-[#E3EDE8] dark:border-[#24352F] rounded-bl-xs'
                }`}
              >
                {!isUser && msg.emotion_tag && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#E3EDE8]/50 dark:border-[#2C4037]">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E3EDE8] dark:bg-[#203129] text-[#395B4E] dark:text-[#9DD1BE]">
                      {msg.emotion_tag}
                    </span>
                    <span className="text-[10px] text-[#869C93]">{msg.timestamp}</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Coping Step Card */}
                {!isUser && msg.coping_step && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#F3F7F5] dark:bg-[#1F2E27] border border-[#DEECE5] dark:border-[#293F34] flex items-start gap-2 text-xs text-[#315245] dark:text-[#BBDCD0]">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Recommended Action:</span>
                      <span>{msg.coping_step}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* High Risk Crisis Support Card */}
              {!isUser && msg.risk_level === 'high' && (
                <div className="max-w-[90%] sm:max-w-[80%] rounded-2xl bg-amber-50 dark:bg-[#2B1B18] border border-amber-300 dark:border-[#522923] p-4 text-xs space-y-2 mt-1">
                  <div className="flex items-center gap-2 text-[#C2410C] dark:text-[#F87171] font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Crisis Support Bridge</span>
                  </div>
                  <p className="text-[#7C2D12] dark:text-[#FCA5A5] leading-relaxed">
                    You do not have to battle this alone. If you feel at risk of harming yourself or experiencing an overdose crisis, please connect with certified de-addiction and mental health professionals immediately:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href="tel:14446"
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#3D1E1A] border border-amber-200 dark:border-[#6B2E26] text-[#9A3412] dark:text-[#FED7AA] font-bold hover:bg-amber-100 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>National Drug Helpline</span>
                      </div>
                      <span className="font-mono text-sm underline">14446</span>
                    </a>
                    <a
                      href="tel:14416"
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#3D1E1A] border border-amber-200 dark:border-[#6B2E26] text-[#9A3412] dark:text-[#FED7AA] font-bold hover:bg-amber-100 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Tele-MANAS (24/7)</span>
                      </div>
                      <span className="font-mono text-sm underline">14416</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 max-w-xs rounded-2xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] text-xs text-[#5C8979]">
            <span className="w-2 h-2 rounded-full bg-[#5C8979] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#5C8979] animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[#5C8979] animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 text-[#668075] dark:text-[#90A79E]">Reflecting compassionately...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-1.5 bg-white dark:bg-[#18231E] border border-[#D7E5DF] dark:border-[#293B32] rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-[#5C8979]/40 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question (e.g. 'How long do cravings last?', 'I had a slip', 'How to say no')..."
            className="flex-1 px-4 py-2 text-sm bg-transparent border-0 focus:outline-hidden text-[#212928] dark:text-[#E2EBE6] placeholder-[#8EA39A]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#5C8979] hover:bg-[#4A7364] disabled:opacity-40 text-white transition-all shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-center text-[#7E938A] dark:text-[#7A9388] mt-2">
          MindBridge provides supportive peer-style AI companion tools, not medical diagnoses. For emergencies, tap Quick Exit or dial 14416.
        </p>
      </div>

    </div>
  );
}
