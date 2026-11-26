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
  ExternalLink
} from 'lucide-react';
import { STORAGE_KEYS } from '../utils/storage';

const STARTER_PROMPTS = [
  { text: "I'm stressed and feeling an overwhelming urge to use", icon: Flame, tag: "Craving" },
  { text: "Feeling pressured by friends at a party", icon: Users, tag: "Peer Pressure" },
  { text: "Just feeling lonely and empty tonight", icon: CloudRain, tag: "Loneliness" },
  { text: "I had a slip/relapse and feel terrible about myself", icon: AlertCircle, tag: "Relapse Guilt" },
  { text: "Can you help me practice saying 'No' politely?", icon: Smile, tag: "Boundary Practice" }
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
        content: `Hello ${nickname}. Welcome to MindBridge. I am your quiet, safe companion. Whatever you are feeling right now—whether it's heavy stress, an urge calling out, or feeling alone—you can share it freely here. No judgment, ever.`,
        coping_step: "Take one gentle, slow breath and unclench your jaw.",
        emotion_tag: "Welcome",
        risk_level: "low",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch('/api/chat', {
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
      // Fallback in case backend server is unreachable
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
          content: `Fresh page, ${nickname}. How can I support you right now?`,
          emotion_tag: "Ready",
          risk_level: "low",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(initial);
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(initial));
    }
  };

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
              Compassionate, non-judgmental guidance for cravings and emotional distress
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-[#7A9188] hover:text-[#395B4E] dark:hover:text-[#9DD1BE] flex items-center gap-1 p-2 rounded-lg hover:bg-[#E3EDE8]/50 dark:hover:bg-[#1C2924] transition-colors"
          title="Clear current chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        
        {/* Starter Chips */}
        {messages.length <= 2 && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] space-y-2.5">
            <p className="text-xs font-semibold text-[#5C8979] dark:text-[#88BBA7] uppercase tracking-wider">
              Quick Starter Prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3F7F5] dark:bg-[#202E28] hover:bg-[#E3EDE8] dark:hover:bg-[#283C34] text-xs text-[#395B4E] dark:text-[#C5DED4] transition-all text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#5C8979] shrink-0" />
                    <span>{prompt.text}</span>
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
                      <span className="font-semibold block">Gentle Step:</span>
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
            placeholder="Type how you're feeling (e.g. 'Craving is really intense right now')..."
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
