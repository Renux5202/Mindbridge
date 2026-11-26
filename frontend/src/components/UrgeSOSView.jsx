import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Wind, 
  Eye, 
  Ear, 
  Hand, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  Heart,
  Droplet
} from 'lucide-react';

export default function UrgeSOSView() {
  const [activeSOSSubtab, setActiveSOSSubtab] = useState('breathing'); // 'breathing', 'grounding', 'timer'

  // --- BOX BREATHING LOGIC ---
  // Phases: Inhale (4s), Hold (4s), Exhale (4s), Hold (4s)
  const [breathPhase, setBreathPhase] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [isBreathingRunning, setIsBreathingRunning] = useState(true);

  const PHASES = [
    { label: 'Inhale Slowly...', desc: 'Fill your belly with calm air', color: '#5C8979', scale: 1.35 },
    { label: 'Hold Gently...', desc: 'Pause and rest in stillness', color: '#3D7879', scale: 1.35 },
    { label: 'Exhale Smoothly...', desc: 'Release tension and cravings', color: '#E26D5C', scale: 0.85 },
    { label: 'Hold & Empty...', desc: 'Feel grounded and present', color: '#7A9188', scale: 0.85 },
  ];

  useEffect(() => {
    let interval = null;
    if (isBreathingRunning) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((p) => (p + 1) % 4);
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingRunning]);

  // --- 5-4-3-2-1 GROUNDING STATE ---
  const [groundingChecks, setGroundingChecks] = useState({
    see: [false, false, false, false, false],
    touch: [false, false, false, false],
    hear: [false, false, false],
    smell: [false, false],
    taste: [false]
  });

  const toggleCheck = (category, index) => {
    setGroundingChecks((prev) => {
      const nextArr = [...prev[category]];
      nextArr[index] = !nextArr[index];
      return { ...prev, [category]: nextArr };
    });
  };

  const resetGrounding = () => {
    setGroundingChecks({
      see: [false, false, false, false, false],
      touch: [false, false, false, false],
      hear: [false, false, false],
      smell: [false, false],
      taste: [false]
    });
  };

  const totalGroundingItems = 5 + 4 + 3 + 2 + 1;
  const completedGroundingCount = Object.values(groundingChecks).flat().filter(Boolean).length;

  // --- 10-MINUTE URGE SURF TIMER ---
  const INITIAL_TIMER_SECS = 10 * 60;
  const [surfSeconds, setSurfSeconds] = useState(INITIAL_TIMER_SECS);
  const [isSurfRunning, setIsSurfRunning] = useState(false);

  useEffect(() => {
    let t = null;
    if (isSurfRunning && surfSeconds > 0) {
      t = setInterval(() => setSurfSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(t);
  }, [isSurfRunning, surfSeconds]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Dynamic surf micro-messages based on time left
  const getSurfMessage = () => {
    const elapsed = INITIAL_TIMER_SECS - surfSeconds;
    if (surfSeconds === 0) return "🎉 Incredible! You've successfully surfed this entire 10-minute wave. Cravings peak and fade. You did this!";
    if (elapsed < 120) return "Cravings trigger strong surges, but you don't have to obey them. Just observe the wave without judgment.";
    if (elapsed < 300) return "Notice physical sensations: tightness in your chest or hands? Breathe directly into that area. It's just adrenaline fading.";
    if (elapsed < 480) return "You've passed the crest of the urge! The brain's neurochemical spike is decreasing now. Keep breathing.";
    return "Almost at the shore. Give your body a stretch and congratulate yourself for choosing your tomorrow.";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FEEBE8] to-[#FFF3F0] dark:from-[#2B1816] dark:to-[#221615] border border-[#FAD0C8] dark:border-[#4D2622] mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E26D5C] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#E26D5C]/30">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#212928] dark:text-[#F3ECEB]">
                Urge SOS — Craving Interrupter
              </h1>
              <p className="text-xs sm:text-sm text-[#7D4D47] dark:text-[#D1A09A]">
                The average craving wave lasts only 15 to 20 minutes. Don't fight it with force—interrupt it with physiology.
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/70 dark:bg-black/30 text-[#E26D5C] font-semibold text-xs border border-[#FAD0C8] dark:border-[#4D2622]">
            Panic / Craving State
          </div>
        </div>

        {/* SOS Subtabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveSOSSubtab('breathing')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSOSSubtab === 'breathing'
                ? 'bg-[#E26D5C] text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#1E1716] text-[#7D4D47] dark:text-[#C5A29D] hover:bg-white dark:hover:bg-[#2A1E1D]'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Box Breathing Visualizer</span>
          </button>

          <button
            onClick={() => setActiveSOSSubtab('grounding')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSOSSubtab === 'grounding'
                ? 'bg-[#E26D5C] text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#1E1716] text-[#7D4D47] dark:text-[#C5A29D] hover:bg-white dark:hover:bg-[#2A1E1D]'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>5-4-3-2-1 Sensory Grounding</span>
          </button>

          <button
            onClick={() => setActiveSOSSubtab('timer')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeSOSSubtab === 'timer'
                ? 'bg-[#E26D5C] text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#1E1716] text-[#7D4D47] dark:text-[#C5A29D] hover:bg-white dark:hover:bg-[#2A1E1D]'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>10-Minute Urge Surf</span>
          </button>
        </div>
      </div>

      {/* --- SUBTAB 1: BOX BREATHING --- */}
      {activeSOSSubtab === 'breathing' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] text-center space-y-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-[#212928] dark:text-[#E5EBE8] mb-1">
              Parasympathetic Box Breathing
            </h2>
            <p className="text-xs text-[#637971] dark:text-[#9BB1A7]">
              Used by tactical units and therapists to decelerate heart rates and switch nervous systems away from primal fight-or-flight craving states.
            </p>
          </div>

          {/* Visual Breathing Circle */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-6">
            {/* Outer pulsating ring */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-dashed border-[#5C8979]/40 transition-transform duration-1000 ease-in-out"
              style={{
                transform: `scale(${PHASES[breathPhase].scale * 1.08})`
              }}
            />

            {/* Inner responsive orb */}
            <div
              className="w-48 h-48 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-1000 ease-in-out"
              style={{
                backgroundColor: PHASES[breathPhase].color,
                transform: `scale(${PHASES[breathPhase].scale})`
              }}
            >
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                {PHASES[breathPhase].label}
              </span>
              <span className="text-4xl font-extrabold my-1 font-mono">
                {breathSeconds}s
              </span>
              <span className="text-[11px] px-3 text-center opacity-90">
                {PHASES[breathPhase].desc}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsBreathingRunning(!isBreathingRunning)}
              className="px-5 py-2.5 rounded-2xl bg-[#5C8979] hover:bg-[#4A7364] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              {isBreathingRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isBreathingRunning ? 'Pause Exercise' : 'Resume Exercise'}</span>
            </button>
            <button
              onClick={() => {
                setBreathPhase(0);
                setBreathSeconds(4);
              }}
              className="px-4 py-2.5 rounded-2xl border border-[#D5E4DC] dark:border-[#2C4037] text-xs font-medium text-[#4A5D56] dark:text-[#A7BCB3] hover:bg-[#F3F7F5] dark:hover:bg-[#1E2B24] flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: 5-4-3-2-1 GROUNDING CHECKLIST --- */}
      {activeSOSSubtab === 'grounding' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3EDE8] dark:border-[#24352F]">
            <div>
              <h2 className="text-xl font-bold text-[#212928] dark:text-[#E5EBE8]">
                5-4-3-2-1 Sensory Grounding Technique
              </h2>
              <p className="text-xs text-[#637971] dark:text-[#9BB1A7]">
                Disconnects racing obsessive thoughts by re-anchoring your sensory nervous system to physical reality.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#5C8979] dark:text-[#88BBA7]">
                {completedGroundingCount} of {totalGroundingItems} Completed
              </span>
              <button
                onClick={resetGrounding}
                className="text-xs text-[#7A9188] hover:text-[#395B4E] dark:hover:text-[#9DD1BE] underline"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Step 5: See */}
          <div className="p-4 rounded-2xl bg-[#F7F9F8] dark:bg-[#1D2B25] border border-[#E3EDE8] dark:border-[#293E35] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#395B4E] dark:text-[#9DD1BE]">
              <Eye className="w-4 h-4 text-[#5C8979]" />
              <span>5 Things You Can See</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {['Object 1', 'Object 2', 'Object 3', 'Object 4', 'Object 5'].map((name, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck('see', i)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                    groundingChecks.see[i]
                      ? 'bg-[#E3EDE8] dark:bg-[#284036] border-[#5C8979] text-[#2F4D41] dark:text-[#BDE2D4]'
                      : 'bg-white dark:bg-[#15201B] border-[#DCE8E2] dark:border-[#263730] text-[#556961] dark:text-[#96AEA4]'
                  }`}
                >
                  <span>{name}</span>
                  {groundingChecks.see[i] ? <CheckCircle2 className="w-3.5 h-3.5 text-[#5C8979]" /> : <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Touch */}
          <div className="p-4 rounded-2xl bg-[#F7F9F8] dark:bg-[#1D2B25] border border-[#E3EDE8] dark:border-[#293E35] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#395B4E] dark:text-[#9DD1BE]">
              <Hand className="w-4 h-4 text-[#5C8979]" />
              <span>4 Things You Can Physically Touch</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {['Texture 1 (e.g. Jeans)', 'Texture 2 (e.g. Desk)', 'Texture 3 (e.g. Hair)', 'Texture 4 (e.g. Ring)'].map((name, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck('touch', i)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                    groundingChecks.touch[i]
                      ? 'bg-[#E3EDE8] dark:bg-[#284036] border-[#5C8979] text-[#2F4D41] dark:text-[#BDE2D4]'
                      : 'bg-white dark:bg-[#15201B] border-[#DCE8E2] dark:border-[#263730] text-[#556961] dark:text-[#96AEA4]'
                  }`}
                >
                  <span className="truncate mr-1">{name}</span>
                  {groundingChecks.touch[i] ? <CheckCircle2 className="w-3.5 h-3.5 text-[#5C8979]" /> : <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Hear */}
          <div className="p-4 rounded-2xl bg-[#F7F9F8] dark:bg-[#1D2B25] border border-[#E3EDE8] dark:border-[#293E35] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#395B4E] dark:text-[#9DD1BE]">
              <Ear className="w-4 h-4 text-[#5C8979]" />
              <span>3 Things You Can Hear</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Sound 1 (e.g. Fan)', 'Sound 2 (e.g. Traffic)', 'Sound 3 (e.g. Breath)'].map((name, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck('hear', i)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                    groundingChecks.hear[i]
                      ? 'bg-[#E3EDE8] dark:bg-[#284036] border-[#5C8979] text-[#2F4D41] dark:text-[#BDE2D4]'
                      : 'bg-white dark:bg-[#15201B] border-[#DCE8E2] dark:border-[#263730] text-[#556961] dark:text-[#96AEA4]'
                  }`}
                >
                  <span>{name}</span>
                  {groundingChecks.hear[i] ? <CheckCircle2 className="w-3.5 h-3.5 text-[#5C8979]" /> : <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 & 1: Smell & Taste */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F7F9F8] dark:bg-[#1D2B25] border border-[#E3EDE8] dark:border-[#293E35] space-y-2">
              <span className="text-xs font-bold text-[#395B4E] dark:text-[#9DD1BE] block">
                2 Scents (Coffee, soap, clothing)
              </span>
              <div className="flex gap-2">
                {[0, 1].map((i) => (
                  <button
                    key={i}
                    onClick={() => toggleCheck('smell', i)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                      groundingChecks.smell[i]
                        ? 'bg-[#E3EDE8] dark:bg-[#284036] border-[#5C8979] text-[#2F4D41]'
                        : 'bg-white dark:bg-[#15201B] border-[#DCE8E2] dark:border-[#263730] text-[#556961]'
                    }`}
                  >
                    Scent {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F9F8] dark:bg-[#1D2B25] border border-[#E3EDE8] dark:border-[#293E35] space-y-2">
              <span className="text-xs font-bold text-[#395B4E] dark:text-[#9DD1BE] block">
                1 Taste (A sip of water, mint, or swallow)
              </span>
              <button
                onClick={() => toggleCheck('taste', 0)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                  groundingChecks.taste[0]
                    ? 'bg-[#E3EDE8] dark:bg-[#284036] border-[#5C8979] text-[#2F4D41]'
                    : 'bg-white dark:bg-[#15201B] border-[#DCE8E2] dark:border-[#263730] text-[#556961]'
                }`}
              >
                Taste / Cold Water
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: 10-MINUTE URGE SURF TIMER --- */}
      {activeSOSSubtab === 'timer' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] text-center space-y-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-[#212928] dark:text-[#E5EBE8] mb-1">
              10-Minute Urge Surfing
            </h2>
            <p className="text-xs text-[#637971] dark:text-[#9BB1A7]">
              Instead of resisting or obsessing, we "surf" on top of the craving sensation like a surfer on an ocean wave until it flattens.
            </p>
          </div>

          {/* Large Countdown */}
          <div className="py-6">
            <div className="text-6xl sm:text-7xl font-extrabold font-mono tracking-wider text-[#E26D5C]">
              {formatTimer(surfSeconds)}
            </div>
            <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-4 overflow-hidden">
              <div 
                className="h-full bg-[#E26D5C] transition-all duration-1000"
                style={{ width: `${((INITIAL_TIMER_SECS - surfSeconds) / INITIAL_TIMER_SECS) * 100}%` }}
              />
            </div>
          </div>

          {/* Micro-encouragement message box */}
          <div className="p-4 max-w-lg mx-auto rounded-2xl bg-[#FFF6F4] dark:bg-[#271B19] border border-[#FAD6CF] dark:border-[#4B2925] text-xs text-[#7A3E37] dark:text-[#EBB5AD] leading-relaxed">
            <Sparkles className="w-4 h-4 text-[#E26D5C] mx-auto mb-1.5" />
            <p className="font-medium">{getSurfMessage()}</p>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsSurfRunning(!isSurfRunning)}
              className="px-6 py-3 rounded-2xl bg-[#E26D5C] hover:bg-[#D05B4A] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              {isSurfRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSurfRunning ? 'Pause Surf' : 'Start 10-Min Surf'}</span>
            </button>
            <button
              onClick={() => {
                setIsSurfRunning(false);
                setSurfSeconds(INITIAL_TIMER_SECS);
              }}
              className="px-4 py-3 rounded-2xl border border-[#D5E4DC] dark:border-[#2C4037] text-xs font-medium text-[#4A5D56] dark:text-[#A7BCB3] hover:bg-[#F3F7F5] dark:hover:bg-[#1E2B24] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
