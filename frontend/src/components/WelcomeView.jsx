import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Flame, 
  MessageSquareHeart, 
  HelpCircle, 
  Activity, 
  Sparkles,
  Lock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { generateRandomNickname, STORAGE_KEYS } from '../utils/storage';

export default function WelcomeView({ setActiveTab, nickname, setNickname }) {
  const handleRegenerateNick = () => {
    const newNick = generateRandomNickname();
    setNickname(newNick);
    localStorage.setItem(STORAGE_KEYS.NICKNAME, newNick);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3EDE8] dark:bg-[#1C2B24] text-[#395B4E] dark:text-[#9DD1BE] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#5C8979]" />
          <span>Anonymous, Judgment-Free Companion Against Substance Addiction</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#212928] dark:text-[#EAEFEA] leading-tight">
          A safe bridge between how you feel and who you want to be.
        </h1>

        <p className="text-base sm:text-lg text-[#5A6F66] dark:text-[#9CB3A8] leading-relaxed">
          MindBridge addresses the hidden roots of cravings—stress, loneliness, peer pressure, and overwhelm—without lectures, judgment, or required sign-ups.
        </p>

        {/* Identity & Start Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-[#18231E] border border-[#DCE8E2] dark:border-[#273B32] shadow-xs text-sm">
            <ShieldCheck className="w-4 h-4 text-[#5C8979]" />
            <span className="text-[#5A6F66] dark:text-[#9CB3A8]">Your Identity:</span>
            <span className="font-mono font-bold text-[#395B4E] dark:text-[#9DD1BE]">{nickname}</span>
            <button
              onClick={handleRegenerateNick}
              className="ml-1 text-xs text-[#5C8979] hover:underline"
              title="Generate another nickname"
            >
              (change)
            </button>
          </div>

          <button
            onClick={() => setActiveTab('chat')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#5C8979] hover:bg-[#4A7364] text-white font-semibold text-sm shadow-md shadow-[#5C8979]/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span>Start Anonymously</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Access Action Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Chat */}
        <div 
          onClick={() => setActiveTab('chat')}
          className="group cursor-pointer p-6 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] hover:border-[#5C8979]/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#E3EDE8] dark:bg-[#203129] text-[#395B4E] dark:text-[#9DD1BE] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#212928] dark:text-[#E5EBE8] mb-1">
              Talk to MindBridge
            </h3>
            <p className="text-xs sm:text-sm text-[#61776E] dark:text-[#99AEA3] leading-relaxed">
              Unpack overwhelming feelings, vent about triggers, or practice saying "no" to peer pressure with our empathetic AI.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-[#5C8979] dark:text-[#88BBA7] group-hover:translate-x-1 transition-transform">
            <span>Open Companion Chat</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Card 2: Urge SOS */}
        <div 
          onClick={() => setActiveTab('sos')}
          className="group cursor-pointer p-6 rounded-3xl bg-white dark:bg-[#18231E] border border-[#FADCD7] dark:border-[#422521] hover:border-[#E26D5C]/60 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#E26D5C]/15 text-[#E26D5C] text-[10px] font-bold uppercase tracking-wider">
            Crisis Tool
          </div>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FEEBE8] dark:bg-[#341C1A] text-[#E26D5C] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#212928] dark:text-[#E5EBE8] mb-1">
              I'm Having an Urge (SOS)
            </h3>
            <p className="text-xs sm:text-sm text-[#61776E] dark:text-[#99AEA3] leading-relaxed">
              Immediate craving interrupter: Box Breathing visualizer, 5-4-3-2-1 sensory grounding, and the 10-Minute Urge Surf timer.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-[#E26D5C] group-hover:translate-x-1 transition-transform">
            <span>Interrupt Craving Now</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Card 3: Real Help */}
        <div 
          onClick={() => setActiveTab('help')}
          className="group cursor-pointer p-6 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] hover:border-[#3D7879]/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#E0EFF0] dark:bg-[#192E30] text-[#3D7879] dark:text-[#8EC2C3] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#212928] dark:text-[#E5EBE8] mb-1">
              Find Real Help
            </h3>
            <p className="text-xs sm:text-sm text-[#61776E] dark:text-[#99AEA3] leading-relaxed">
              Verified 24/7 Indian toll-free helplines (14446, 14416, 14405), filterable rehab clinics, and anonymous counsellor callbacks.
            </p>
          </div>
          <div className="mt-5 flex items-center text-xs font-semibold text-[#3D7879] dark:text-[#8EC2C3] group-hover:translate-x-1 transition-transform">
            <span>View Verified Helplines</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

      </div>

      {/* Trust & Privacy Pillars */}
      <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#EBF3EF] dark:bg-[#15221C] border border-[#D8E6DF] dark:border-[#22352B]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E2E26] text-[#5C8979] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#212928] dark:text-[#E5EBE8]">100% Client-Side Privacy</h4>
              <p className="text-xs text-[#637971] dark:text-[#9CB3A8] mt-0.5">
                No passwords, phone numbers, or cookies. All records live strictly on your browser.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E2E26] text-[#5C8979] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#212928] dark:text-[#E5EBE8]">Motivational Interviewing</h4>
              <p className="text-xs text-[#637971] dark:text-[#9CB3A8] mt-0.5">
                Rooted in non-judgmental empathy to help you explore your own reasons for healthy change.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#1E2E26] text-[#5C8979] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#212928] dark:text-[#E5EBE8]">Quick Escape Enabled</h4>
              <p className="text-xs text-[#637971] dark:text-[#9CB3A8] mt-0.5">
                Hit <span className="font-mono bg-black/10 dark:bg-white/10 px-1 rounded">Esc</span> at any time to instantly redirect to a clean Google search page.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
