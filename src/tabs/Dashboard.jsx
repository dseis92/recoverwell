import React, { useState, useEffect } from 'react';
import { Heart, Zap, MapPin, TrendingUp, Star, Bell, ChevronRight, Sun, Moon, Cloud } from 'lucide-react';

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
  { id: 1, emoji: '😰', label: 'Struggling' },
  { id: 2, emoji: '😔', label: 'Low' },
  { id: 3, emoji: '😐', label: 'Okay' },
  { id: 4, emoji: '🙂', label: 'Good' },
  { id: 5, emoji: '😊', label: 'Great' },
];

const MILESTONES = [
  { days: 1, label: '24 Hours' },
  { days: 3, label: '3 Days' },
  { days: 7, label: '1 Week' },
  { days: 14, label: '2 Weeks' },
  { days: 30, label: '1 Month' },
  { days: 60, label: '2 Months' },
  { days: 90, label: '3 Months' },
  { days: 180, label: '6 Months' },
  { days: 365, label: '1 Year' },
  { days: 730, label: '2 Years' },
  { days: 1825, label: '5 Years' },
];

function getElapsed(sobrietyDate) {
  const start = new Date(sobrietyDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - start);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { days, hours, minutes, totalSeconds };
}

function getNextMilestone(days) {
  return MILESTONES.find(m => m.days > days) || MILESTONES[MILESTONES.length - 1];
}

function getPrevMilestone(days) {
  const passed = MILESTONES.filter(m => m.days <= days);
  return passed[passed.length - 1] || { days: 0, label: 'Start' };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', Icon: Sun };
  if (h < 18) return { text: 'Good afternoon', Icon: Sun };
  return { text: 'Good evening', Icon: Moon };
}

export default function Dashboard({ userData, onNavigate, onUpdateUser }) {
  const [elapsed, setElapsed] = useState(getElapsed(userData.sobrietyDate));
  const [todayMood, setTodayMood] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);

  const affirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];
  const { text: greeting, Icon: GreetingIcon } = getGreeting();
  const moneySaved = (elapsed.days * parseFloat(userData.dailyCost || 0)).toFixed(2);
  const nextMilestone = getNextMilestone(elapsed.days);
  const prevMilestone = getPrevMilestone(elapsed.days);
  const milestoneProgress = nextMilestone.days === prevMilestone.days
    ? 100
    : Math.round(((elapsed.days - prevMilestone.days) / (nextMilestone.days - prevMilestone.days)) * 100);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(getElapsed(userData.sobrietyDate)), 1000);
    return () => clearInterval(interval);
  }, [userData.sobrietyDate]);

  useEffect(() => {
    const today = new Date().toDateString();
    const todayEntry = userData.moodLog?.find(m => new Date(m.date).toDateString() === today);
    if (todayEntry) {
      setTodayMood(todayEntry.mood);
      setMoodSaved(true);
    }
  }, [userData.moodLog]);

  const saveMood = (mood) => {
    setTodayMood(mood);
    setMoodSaved(true);
    const today = new Date().toDateString();
    const moodLog = userData.moodLog?.filter(m => new Date(m.date).toDateString() !== today) || [];
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
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-emerald-400" fill="currentColor" />
        </div>
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

        {/* Milestone progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{prevMilestone.label}</span>
            <span className="text-emerald-400 font-medium">{nextMilestone.label} in {nextMilestone.days - elapsed.days}d</span>
          </div>
          <div className="h-2 bg-gray-800/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${milestoneProgress}%` }}
            />
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
                todayMood === m.id
                  ? 'bg-emerald-500/20 scale-110'
                  : moodSaved ? 'opacity-50' : 'hover:bg-gray-800 active:scale-95'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-gray-400 text-xs">{m.label}</span>
            </button>
          ))}
        </div>
        {moodSaved && (
          <p className="text-emerald-400 text-xs text-center mt-2">Mood logged for today</p>
        )}
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide px-1">Quick Actions</p>
        <button
          onClick={() => onNavigate('tools')}
          className="w-full flex items-center justify-between bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-3.5 hover:bg-red-900/50 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">I'm Having a Craving</p>
              <p className="text-gray-400 text-xs">Get immediate support</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>

        <button
          onClick={() => onNavigate('resources')}
          className="w-full flex items-center justify-between bg-blue-900/30 border border-blue-700/40 rounded-xl px-4 py-3.5 hover:bg-blue-900/50 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">Find Support Near Me</p>
              <p className="text-gray-400 text-xs">Meetings, counselors, facilities</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>

        <button
          onClick={() => onNavigate('tracker')}
          className="w-full flex items-center justify-between bg-purple-900/30 border border-purple-700/40 rounded-xl px-4 py-3.5 hover:bg-purple-900/50 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">View My Progress</p>
              <p className="text-gray-400 text-xs">Milestones, habits, timeline</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
