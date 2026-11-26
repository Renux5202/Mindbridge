import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Frown, 
  Meh, 
  Flame, 
  Activity, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Plus, 
  Award, 
  Trash2, 
  Clock, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';
import { STORAGE_KEYS } from '../utils/storage';

const MOODS = [
  { id: 'Calm', score: 5, icon: Smile, color: '#5C8979', label: 'Calm & Grounded' },
  { id: 'Stressed', score: 3, icon: Meh, color: '#E5A93C', label: 'Stressed / Overwhelmed' },
  { id: 'Lonely', score: 2, icon: Frown, color: '#4A7C8C', label: 'Lonely / Isolated' },
  { id: 'Anxious', score: 2, icon: Activity, color: '#A06CD5', label: 'Anxious / Restless' },
  { id: 'Tempted', score: 1, icon: Flame, color: '#E26D5C', label: 'Tempted / Strong Urge' },
];

const COMMON_TRIGGERS = [
  'Peer Pressure / Friends',
  'Exams / Work Deadlines',
  'Late Night / Insomnia',
  'Boredom / Aimlessness',
  'Family Conflict / Arguments',
  'Physical Exhaustion'
];

const DEFAULT_HABITS = [
  { id: 'walk', label: '15-min walk outside in fresh air', completed: false },
  { id: 'water', label: 'Drank 2+ liters of pure water', completed: true },
  { id: 'friend', label: 'Talked to a safe friend or loved one', completed: false },
  { id: 'sleep', label: 'Wind down and sleep before 11 PM', completed: false },
  { id: 'breathe', label: 'Practiced 5 mins of box breathing', completed: true },
];

// Realistic demo data for presentation
const SAMPLE_CHART_DATA = [
  { day: 'Mon', score: 4, mood: 'Calm' },
  { day: 'Tue', score: 2, mood: 'Stressed' },
  { day: 'Wed', score: 1, mood: 'Tempted' },
  { day: 'Thu', score: 3, mood: 'Anxious' },
  { day: 'Fri', score: 4, mood: 'Calm' },
  { day: 'Sat', score: 3, mood: 'Lonely' },
  { day: 'Sun (Today)', score: 5, mood: 'Calm' },
];

const SAMPLE_TRIGGERS_DATA = [
  { trigger: 'Late Night', count: 6 },
  { trigger: 'Work Stress', count: 5 },
  { trigger: 'Peer Pressure', count: 4 },
  { trigger: 'Boredom', count: 2 },
  { trigger: 'Conflict', count: 1 },
];

export default function TrackerView({ nickname }) {
  // Check-in form states
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [journalNote, setJournalNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [useSampleData, setUseSampleData] = useState(true);

  // Stored mood logs
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOOD_LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Daily habits
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_HABITS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOOD_LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  const toggleTrigger = (trig) => {
    if (selectedTriggers.includes(trig)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trig));
    } else {
      setSelectedTriggers([...selectedTriggers, trig]);
    }
  };

  const handleSaveCheckIn = (e) => {
    e.preventDefault();
    const moodObj = MOODS.find(m => m.id === selectedMood);
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      score: moodObj ? moodObj.score : 3,
      triggers: selectedTriggers,
      note: journalNote.trim()
    };

    setLogs([newEntry, ...logs]);
    setSelectedTriggers([]);
    setJournalNote('');
    setSavedSuccess(true);
    setUseSampleData(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const completedHabitsCount = habits.filter(h => h.completed).length;
  const habitPercentage = Math.round((completedHabitsCount / habits.length) * 100);

  // Prepare chart data: use user logs if available and user toggled off sample data
  const chartData = (!useSampleData && logs.length >= 2)
    ? logs.slice(0, 7).reverse().map(l => ({ day: l.date, score: l.score, mood: l.mood }))
    : SAMPLE_CHART_DATA;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-300 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#212928] dark:text-[#E5EBE8]">
            Mood, Trigger & Habit Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#61776E] dark:text-[#99AEA3]">
            Track the emotional patterns behind your urges in complete confidentiality.
          </p>
        </div>

        {/* Demo Sample Data Switch */}
        <div className="flex items-center gap-2 self-start sm:self-auto p-1.5 rounded-xl bg-white dark:bg-[#1A2621] border border-[#D9E7E0] dark:border-[#2C4037] text-xs">
          <span className="text-[#6B8076] dark:text-[#9BB2A7]">Sample Trends:</span>
          <button
            onClick={() => setUseSampleData(!useSampleData)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              useSampleData
                ? 'bg-[#5C8979] text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {useSampleData ? 'Demo ON' : 'My Data'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Daily Check-In Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] shadow-xs">
            <h2 className="text-lg font-bold text-[#212928] dark:text-[#E5EBE8] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#5C8979]" />
              <span>Quick Daily Check-In</span>
            </h2>

            <form onSubmit={handleSaveCheckIn} className="space-y-5">
              
              {/* Mood selector */}
              <div>
                <label className="text-xs font-semibold text-[#5A6F66] dark:text-[#9CB3A8] block mb-2">
                  1. How is your emotional weather right now?
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {MOODS.map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedMood === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setSelectedMood(m.id)}
                        className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                          isSelected
                            ? 'bg-[#E3EDE8] dark:bg-[#20342B] border-[#5C8979] scale-105 shadow-xs'
                            : 'bg-[#F7F9F8] dark:bg-[#131D18] border-[#E3EDE8] dark:border-[#23332A] opacity-80 hover:opacity-100'
                        }`}
                        title={m.label}
                      >
                        <Icon className="w-5 h-5" style={{ color: m.color }} />
                        <span className="text-[10px] font-semibold text-[#212928] dark:text-[#E5EBE8]">
                          {m.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Triggers */}
              <div>
                <label className="text-xs font-semibold text-[#5A6F66] dark:text-[#9CB3A8] block mb-2">
                  2. Any triggers present today? (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TRIGGERS.map((trig) => {
                    const active = selectedTriggers.includes(trig);
                    return (
                      <button
                        type="button"
                        key={trig}
                        onClick={() => toggleTrigger(trig)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all ${
                          active
                            ? 'bg-[#5C8979] text-white border-[#5C8979]'
                            : 'bg-[#F7F9F8] dark:bg-[#131D18] text-[#556961] dark:text-[#9EB5AA] border-[#E0EDE6] dark:border-[#23332A]'
                        }`}
                      >
                        {trig}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Private Journal Note */}
              <div>
                <label className="text-xs font-semibold text-[#5A6F66] dark:text-[#9CB3A8] block mb-2">
                  3. Private reflection / note (Encrypted in browser)
                </label>
                <textarea
                  rows={3}
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="What triggered this urge or helped you stay grounded today?..."
                  className="w-full p-3 text-xs rounded-2xl bg-[#F7F9F8] dark:bg-[#131D18] border border-[#D9E7E0] dark:border-[#273B32] text-[#212928] dark:text-[#E2EBE6] focus:outline-hidden focus:ring-2 focus:ring-[#5C8979]/40"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#5C8979] hover:bg-[#4A7364] text-white font-semibold text-xs shadow-sm transition-all"
              >
                Save Confidential Log
              </button>

              {savedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium text-center animate-in fade-in">
                  ✓ Check-in saved securely to your browser!
                </div>
              )}
            </form>
          </div>

          {/* Healthy Habits Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#212928] dark:text-[#E5EBE8] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Daily Recovery Habits</span>
              </h2>
              <span className="text-xs font-bold font-mono text-[#5C8979]">
                {completedHabitsCount}/{habits.length} ({habitPercentage}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#5C8979] to-[#3D7879] transition-all duration-300"
                style={{ width: `${habitPercentage}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    habit.completed
                      ? 'bg-[#EBF3EF] dark:bg-[#1E2E26] border-[#8CB4A4] dark:border-[#2F4D3F] text-[#2F4D40] dark:text-[#A8D3C1]'
                      : 'bg-[#F7F9F8] dark:bg-[#131D18] border-[#E3EDE8] dark:border-[#23332A] text-[#556961] dark:text-[#95ADA2]'
                  }`}
                >
                  <span className={`text-xs font-medium ${habit.completed ? 'line-through opacity-80' : ''}`}>
                    {habit.label}
                  </span>
                  <CheckCircle className={`w-4 h-4 shrink-0 ${habit.completed ? 'text-[#5C8979]' : 'text-gray-300 dark:text-gray-600'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Insights Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Mood Trend Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#212928] dark:text-[#E5EBE8] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#5C8979]" />
                  <span>7-Day Emotional Resilience Curve</span>
                </h3>
                <p className="text-xs text-[#6B8076] dark:text-[#9BB1A7]">
                  5 = Calm, 4 = Balanced, 3 = Stressed, 2 = Anxious/Lonely, 1 = Strong Urge
                </p>
              </div>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#889E94" fontSize={11} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#889E94" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E2B25', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#E3EDE8', 
                      fontSize: '12px' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#5C8979" 
                    strokeWidth={3} 
                    dot={{ fill: '#5C8979', r: 5 }} 
                    activeDot={{ r: 7 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Triggers Bar Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] shadow-xs">
            <h3 className="text-base font-bold text-[#212928] dark:text-[#E5EBE8] mb-1">
              Top Personal Craving Triggers
            </h3>
            <p className="text-xs text-[#6B8076] dark:text-[#9BB1A7] mb-4">
              Identifying recurring environmental cues lets you build proactive boundary plans.
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SAMPLE_TRIGGERS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="trigger" stroke="#889E94" fontSize={11} />
                  <YAxis stroke="#889E94" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E2B25', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#E3EDE8', 
                      fontSize: '12px' 
                    }} 
                  />
                  <Bar dataKey="count" fill="#3D7879" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Check-Ins List */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#18231E] border border-[#E3EDE8] dark:border-[#24352F] shadow-xs">
            <h3 className="text-base font-bold text-[#212928] dark:text-[#E5EBE8] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#5C8979]" />
              <span>Your Recent Check-In Journal</span>
            </h3>

            {logs.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#7A9188] dark:text-[#93AEA2]">
                No check-in logs saved yet. Fill out the daily form on the left to see your private journal here!
              </div>
            ) : (
              <div className="space-y-3">
                {logs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-3.5 rounded-2xl bg-[#F7F9F8] dark:bg-[#141E19] border border-[#E3EDE8] dark:border-[#22332A] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#395B4E] dark:text-[#A4D5C2]">
                        {log.mood} (Score: {log.score}/5)
                      </span>
                      <span className="text-[#849C91]">{log.date} at {log.time}</span>
                    </div>
                    {log.triggers && log.triggers.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {log.triggers.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-[#E3EDE8] dark:bg-[#20342B] text-[#315245] dark:text-[#BDDFD2] text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {log.note && (
                      <p className="italic text-[#556B62] dark:text-[#9EB7AC] pt-1">
                        "{log.note}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
