import React, { useState, useEffect } from 'react';
import { Heart, Zap, MapPin, TrendingUp, Star, ChevronRight, Sun, Moon, Settings, Phone } from 'lucide-react';

const AFFIRMATIONS = [
  "Every day sober is a victory worth celebrating.",
  "You are stronger than your cravings.",
  "Recovery is not a race. Be gentle with yourself.",
  "One day at a time. That's all you need.",
  "Your best days are still ahead of you.",
  "Healing is not linear, but you are always moving forward.",
  "The courage it takes to face each day sober is extraordinary.",
  "You didn't come this far to only come this far.",
  "Each moment of sobriety is a gift you give yourself.",
  "Progress, not perfection.",
  "You are rewriting your story every single day.",
  "Sobriety is the greatest adventure you'll ever embark on.",
  "The hardest battles are fought by the strongest warriors.",
  "You are not alone. Millions stand with you in recovery.",
  "Today is a new beginning.",
];

const MOODS = [
  { id: 1, emoji: '😰', label: 'Struggling', color: '#ef4444' },
  { id: 2, emoji: '😔', label: 'Low',       color: '#f97316' },
  { id: 3, emoji: '😐', label: 'Okay',      color: '#eab308' },
  { id: 4, emoji: '🙂', label: 'Good',      color: '#22c55e' },
  { id: 5, emoji: '😊', label: 'Great',     color: '#10b981' },
];

const MILESTONES = [
  { days: 1, label: '24 Hours' }, { days: 3, label: '3 Days' }, { days: 7, label: '1 Week' },
  { days: 14, label: '2 Weeks' }, { days: 30, label: '1 Month' }, { days: 60, label: '2 Months' },
  { days: 90, label: '3 Months' }, { days: 180, label: '6 Months' }, { days: 365, label: '1 Year' },
  { days: 730, label: '2 Years' }, { days: 1825, label: '5 Years' },
];

function getElapsed(sobrietyDate) {
  const diff = Math.max(0, Date.now() - new Date(sobrietyDate).getTime());
  const s = Math.floor(diff / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60) };
}
function getNextMilestone(days) { return MILESTONES.find(m => m.days > days) || MILESTONES[MILESTONES.length - 1]; }
function getPrevMilestone(days) { const p = MILESTONES.filter(m => m.days <= days); return p[p.length - 1] || { days: 0, label: 'Start' }; }
function getGreeting() { const h = new Date().getHours(); return h < 12 ? { text: 'Good morning', Icon: Sun } : h < 18 ? { text: 'Good afternoon', Icon: Sun } : { text: 'Good evening', Icon: Moon }; }

// 7-day SVG mood chart
function MoodChart({ moodLog }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d;
  });
  const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MOOD_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  return (
    <svg width="100%" viewBox="0 0 245 68" preserveAspectRatio="xMidYMid meet">
      {days.map((day, i) => {
        const entry = moodLog?.find(m => new Date(m.date).toDateString() === day.toDateString());
        const mood = entry?.mood || 0;
        const barH = mood ? Math.max(8, (mood / 5) * 44) : 4;
        const color = mood ? MOOD_COLORS[mood] : '#1f2937';
        return (
          <g key={i}>
            <rect x={i * 35 + 2} y={52 - barH} width={28} height={barH} rx={4} fill={color} opacity={mood ? 1 : 0.4} />
            <text x={i * 35 + 16} y={66} textAnchor="middle" fill="#6b7280" fontSize={9}>
              {DAY_LABELS[day.getDay()]}
            </text>
            {mood > 0 && (
              <text x={i * 35 + 16} y={50 - barH} textAnchor="middle" fill={color} fontSize={8} fontWeight="bold">
                {mood}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// Habit completion this week
function weeklyHabitRate(habits, habitLog) {
  if (!habits?.length) return 0;
  let total = 0, done = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toDateString();
    total += habits.length;
    done += (habitLog?.[key] || []).length;
  }
  return total ? Math.round((done / total) * 100) : 0;
}

function avgMood(moodLog) {
  if (!moodLog?.length) return null;
  const week = moodLog.filter(m => Date.now() - new Date(m.date).getTime() < 7 * 86400000);
  if (!week.length) return null;
  return (week.reduce((s, m) => s + m.mood, 0) / week.length).toFixed(1);
}

export default function Dashboard({ userData, onNavigate, onUpdateUser, onOpenSettings }) {
  const [elapsed, setElapsed] = useState(getElapsed(userData.sobrietyDate));
  const [todayMood, setTodayMood] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);

  const affirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];
  const { text: greeting, Icon: GreetingIcon } = getGreeting();
  const moneySaved = (elapsed.days * parseFloat(userData.dailyCost || 0)).toFixed(2);
  const nextMilestone = getNextMilestone(elapsed.days);
  const prevMilestone = getPrevMilestone(elapsed.days);
  const milestoneProgress = nextMilestone.days === prevMilestone.days ? 100
    : Math.round(((elapsed.days - prevMilestone.days) / (nextMilestone.days - prevMilestone.days)) * 100);
  const habitRate = weeklyHabitRate(userData.habits, userData.habitLog);
  const avg = avgMood(userData.moodLog);

  useEffect(() => {
    const id = setInterval(() => setElapsed(getElapsed(userData.sobrietyDate)), 1000);
    return () => clearInterval(id);
  }, [userData.sobrietyDate]);

  useEffect(() => {
    const today = new Date().toDateString();
    const entry = userData.moodLog?.find(m => new Date(m.date).toDateString() === today);
    if (entry) { setTodayMood(entry.mood); setMoodSaved(true); }
    else { setTodayMood(null); setMoodSaved(false); }
  }, [userData.moodLog]);

  const saveMood = (mood) => {
    setTodayMood(mood); setMoodSaved(true);
    const today = new Date().toDateString();
    const moodLog = (userData.moodLog || []).filter(m => new Date(m.date).toDateString() !== today);
    moodLog.push({ date: new Date().toISOString(), mood });
    onUpdateUser({ moodLog });
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <GreetingIcon className="w-4 h-4" />
            <span>{greeting}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
        </div>
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-all"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main sobriety card */}
      <div className="bg-gradient-to-br from-emerald-900/60 to-emerald-800/30 rounded-2xl p-5 border border-emerald-700/40 glow-green">
        <p className="text-emerald-300 text-sm font-medium mb-1">Time Sober</p>
        <div className="flex items-baseline gap-3">
          <span className="text-6xl font-black text-white">{elapsed.days}</span>
          <span className="text-xl text-emerald-400 font-semibold">days</span>
        </div>
        <div className="flex gap-3 mt-1">
          <span className="text-gray-300 text-sm">{elapsed.hours}h {elapsed.minutes}m</span>
          <span className="text-gray-500 text-sm">•</span>
          <span className="text-gray-300 text-sm">{userData.substance}</span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{prevMilestone.label}</span>
            <span className="text-emerald-400 font-medium">{nextMilestone.label} in {nextMilestone.days - elapsed.days}d</span>
          </div>
          <div className="h-2 bg-gray-800/60 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${milestoneProgress}%` }} />
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">{milestoneProgress}% to next milestone</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-xs font-medium mb-1">Money Saved</p>
          <p className="text-2xl font-bold text-emerald-400">${parseFloat(moneySaved).toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-0.5">at ${userData.dailyCost}/day</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-xs font-medium mb-1">Next Milestone</p>
          <p className="text-2xl font-bold text-blue-400">{nextMilestone.days - elapsed.days}</p>
          <p className="text-gray-500 text-xs mt-0.5">days to {nextMilestone.label}</p>
        </div>
      </div>

      {/* Sponsor card */}
      {userData.sponsorName && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <p className="text-gray-400 text-xs font-medium mb-2">My Sponsor</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                {userData.sponsorName[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{userData.sponsorName}</p>
                <p className="text-gray-500 text-xs">{userData.sponsorPhone || 'No phone saved'}</p>
              </div>
            </div>
            {userData.sponsorPhone && (
              <a
                href={`tel:${userData.sponsorPhone}`}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            )}
          </div>
        </div>
      )}
      {!userData.sponsorName && (
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-gray-700 text-gray-500 hover:border-blue-500 hover:text-blue-400 transition-all text-sm"
        >
          <Phone className="w-4 h-4" />
          Add your sponsor for quick dial
          <ChevronRight className="w-4 h-4 ml-auto" />
        </button>
      )}

      {/* Daily affirmation */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Today's Affirmation</p>
        </div>
        <p className="text-white text-sm leading-relaxed italic">"{affirmation}"</p>
      </div>

      {/* Mood check-in */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <p className="text-white text-sm font-semibold mb-3">How are you feeling today?</p>
        <div className="flex justify-between">
          {MOODS.map(m => (
            <button
              key={m.id}
              onClick={() => !moodSaved && saveMood(m.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                todayMood === m.id ? 'scale-110' : moodSaved ? 'opacity-50' : 'hover:bg-gray-800 active:scale-95'
              }`}
              style={todayMood === m.id ? { backgroundColor: m.color + '22' } : {}}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-gray-400 text-xs">{m.label}</span>
            </button>
          ))}
        </div>
        {moodSaved && <p className="text-emerald-400 text-xs text-center mt-2">Mood logged for today</p>}
      </div>

      {/* Analytics */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-3">
        <p className="text-white text-sm font-semibold">7-Day Mood Trend</p>
        <MoodChart moodLog={userData.moodLog} />
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-800">
          <div>
            <p className="text-gray-500 text-xs">Avg mood this week</p>
            <p className="text-white font-bold text-lg">{avg ? `${avg}/5` : '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Habit completion</p>
            <p className="text-white font-bold text-lg">{habitRate}%</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide px-1">Quick Actions</p>
        {[
          { tab: 'tools', bg: 'bg-red-900/30', border: 'border-red-700/40', hoverBg: 'hover:bg-red-900/50', iconBg: 'bg-red-500/20', iconColor: 'text-red-400', Icon: Zap, title: "I'm Having a Craving", sub: 'Get immediate support' },
          { tab: 'resources', bg: 'bg-blue-900/30', border: 'border-blue-700/40', hoverBg: 'hover:bg-blue-900/50', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', Icon: MapPin, title: 'Find Support Near Me', sub: 'Meetings, counselors, facilities' },
          { tab: 'tracker', bg: 'bg-purple-900/30', border: 'border-purple-700/40', hoverBg: 'hover:bg-purple-900/50', iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400', Icon: TrendingUp, title: 'View My Progress', sub: 'Milestones, habits, journal' },
        ].map(({ tab, bg, border, hoverBg, iconBg, iconColor, Icon, title, sub }) => (
          <button
            key={tab}
            onClick={() => onNavigate(tab)}
            className={`w-full flex items-center justify-between ${bg} border ${border} rounded-xl px-4 py-3.5 ${hoverBg} transition-all active:scale-[0.98]`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">{title}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
