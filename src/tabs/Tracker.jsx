import React, { useState, useEffect } from 'react';
import { Award, Clock, DollarSign, Activity, Check, Plus, X } from 'lucide-react';

const MILESTONES = [
  { days: 1, label: '24 Hours', emoji: '🌱', desc: 'Your first day is the hardest.' },
  { days: 3, label: '3 Days', emoji: '💪', desc: 'Acute withdrawal often peaks here.' },
  { days: 7, label: '1 Week', emoji: '⭐', desc: 'One full week of freedom.' },
  { days: 14, label: '2 Weeks', emoji: '🔥', desc: 'Your brain is healing rapidly.' },
  { days: 30, label: '1 Month', emoji: '🏆', desc: '30 days — a true milestone.' },
  { days: 60, label: '2 Months', emoji: '💎', desc: 'New habits are forming.' },
  { days: 90, label: '3 Months', emoji: '🌟', desc: 'Significant cognitive improvement.' },
  { days: 180, label: '6 Months', emoji: '🦋', desc: 'Transformation is well underway.' },
  { days: 365, label: '1 Year', emoji: '👑', desc: 'A full year — extraordinary.' },
  { days: 730, label: '2 Years', emoji: '🚀', desc: 'You are an inspiration.' },
  { days: 1825, label: '5 Years', emoji: '🌈', desc: 'A life completely transformed.' },
];

const WITHDRAWAL_STAGES = [
  {
    phase: 'Hours 0–24',
    title: 'Initial Stage',
    color: 'yellow',
    symptoms: ['Anxiety and restlessness', 'Sweating and tremors', 'Nausea', 'Insomnia', 'Strong cravings'],
    note: 'Symptoms begin as the substance leaves your system. Seek medical supervision if severe.',
  },
  {
    phase: 'Days 1–3',
    title: 'Acute Phase',
    color: 'red',
    symptoms: ['Peak withdrawal intensity', 'Muscle aches', 'Mood swings', 'Headaches', 'Difficulty sleeping'],
    note: 'The hardest days. Symptoms peak and begin to subside. Medical support is recommended.',
  },
  {
    phase: 'Days 4–7',
    title: 'Stabilization',
    color: 'orange',
    symptoms: ['Gradually improving', 'Fatigue', 'Irritability', 'Anxiety', 'Appetite changes'],
    note: 'The acute phase is ending. Physical symptoms are improving significantly.',
  },
  {
    phase: 'Weeks 2–4',
    title: 'Post-Acute Phase',
    color: 'blue',
    symptoms: ['Mood instability', 'Sleep disruption', 'Cravings (intermittent)', 'Brain fog', 'Low energy'],
    note: 'PAWS (Post-Acute Withdrawal Syndrome) can appear. This is normal.',
  },
  {
    phase: 'Months 1–6',
    title: 'Recovery Phase',
    color: 'emerald',
    symptoms: ['Improving mental clarity', 'Better sleep', 'Stable mood', 'Reduced cravings', 'Increased energy'],
    note: 'Your brain is healing. Cravings become less frequent and intense.',
  },
  {
    phase: 'Month 6+',
    title: 'Long-Term Recovery',
    color: 'purple',
    symptoms: ['Neurological healing', 'Emotional regulation', 'Cravings rare', 'Restored relationships', 'New purpose'],
    note: 'The rewards of sobriety compound. Life continues to improve.',
  },
];

const COLOR_MAP = {
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400' },
};

function getElapsed(sobrietyDate) {
  const start = new Date(sobrietyDate).getTime();
  const diff = Math.max(0, Date.now() - start);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

export default function Tracker({ userData, onUpdateUser }) {
  const [elapsed, setElapsed] = useState(getElapsed(userData.sobrietyDate));
  const [activeSection, setActiveSection] = useState('timer');
  const [newHabit, setNewHabit] = useState('');
  const [addingHabit, setAddingHabit] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(getElapsed(userData.sobrietyDate)), 1000);
    return () => clearInterval(interval);
  }, [userData.sobrietyDate]);

  const today = new Date().toDateString();
  const moneySaved = (elapsed.days * parseFloat(userData.dailyCost || 0));

  const isHabitDoneToday = (habitId) => {
    const log = userData.habitLog || {};
    return (log[today] || []).includes(habitId);
  };

  const toggleHabit = (habitId) => {
    const log = { ...(userData.habitLog || {}) };
    const todayLog = [...(log[today] || [])];
    const idx = todayLog.indexOf(habitId);
    if (idx > -1) todayLog.splice(idx, 1);
    else todayLog.push(habitId);
    log[today] = todayLog;
    onUpdateUser({ habitLog: log });
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const habits = [...(userData.habits || [])];
    habits.push({ id: Date.now(), name: newHabit.trim(), emoji: '✨' });
    onUpdateUser({ habits });
    setNewHabit('');
    setAddingHabit(false);
  };

  const removeHabit = (habitId) => {
    const habits = (userData.habits || []).filter(h => h.id !== habitId);
    onUpdateUser({ habits });
  };

  const earnedMilestones = MILESTONES.filter(m => elapsed.days >= m.days);
  const nextMilestone = MILESTONES.find(m => m.days > elapsed.days);

  const sections = ['timer', 'milestones', 'withdrawal', 'habits'];
  const sectionLabels = ['Timer', 'Badges', 'Timeline', 'Habits'];

  return (
    <div className="px-4 pt-6 pb-4 space-y-4 fade-in">
      <h1 className="text-2xl font-bold text-white">My Progress</h1>

      {/* Section tabs */}
      <div className="flex bg-gray-900 rounded-xl p-1 gap-1">
        {sections.map((s, i) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSection === s ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {sectionLabels[i]}
          </button>
        ))}
      </div>

      {/* Timer section */}
      {activeSection === 'timer' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-emerald-400" />
              <p className="text-emerald-400 text-sm font-medium">Live Sobriety Counter</p>
            </div>
            <div className="text-center">
              <div className="text-7xl font-black text-white mb-2">{elapsed.days}</div>
              <div className="text-emerald-400 text-lg font-semibold mb-4">days</div>
              <div className="flex justify-center gap-3">
                {[
                  { val: pad(elapsed.hours), label: 'HRS' },
                  { val: pad(elapsed.minutes), label: 'MIN' },
                  { val: pad(elapsed.seconds), label: 'SEC' },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-gray-800 rounded-xl px-4 py-3 min-w-[60px]">
                    <div className="text-2xl font-bold text-white font-mono">{val}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <p className="text-gray-400 text-xs font-medium">Total Saved</p>
              </div>
              <p className="text-2xl font-bold text-green-400">${moneySaved.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <p className="text-gray-400 text-xs font-medium">This Week</p>
              </div>
              <p className="text-2xl font-bold text-blue-400">
                ${(Math.min(elapsed.days, 7) * parseFloat(userData.dailyCost || 0)).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-2">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Annual Savings Projection</p>
            <p className="text-3xl font-bold text-emerald-400">
              ${(parseFloat(userData.dailyCost || 0) * 365).toLocaleString()}/yr
            </p>
            <p className="text-gray-500 text-xs">Based on ${userData.dailyCost}/day estimated spending</p>
          </div>
        </div>
      )}

      {/* Milestones section */}
      {activeSection === 'milestones' && (
        <div className="space-y-3">
          {nextMilestone && (
            <div className="bg-emerald-900/30 border border-emerald-700/40 rounded-xl p-4">
              <p className="text-emerald-400 text-xs font-medium mb-1">Next milestone</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{nextMilestone.emoji}</span>
                <div>
                  <p className="text-white font-semibold">{nextMilestone.label}</p>
                  <p className="text-gray-400 text-xs">{nextMilestone.days - elapsed.days} days away</p>
                </div>
              </div>
            </div>
          )}
          {MILESTONES.map(m => {
            const earned = elapsed.days >= m.days;
            return (
              <div
                key={m.days}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  earned
                    ? 'bg-gray-800 border-emerald-700/50'
                    : 'bg-gray-900/50 border-gray-800 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${earned ? 'bg-gray-700' : 'bg-gray-800'}`}>
                  {earned ? m.emoji : '🔒'}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${earned ? 'text-white' : 'text-gray-500'}`}>{m.label}</p>
                  <p className="text-gray-400 text-xs">{m.desc}</p>
                </div>
                {earned && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Withdrawal timeline */}
      {activeSection === 'withdrawal' && (
        <div className="space-y-3">
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
            <p className="text-blue-300 text-xs">This timeline is general guidance only and varies by substance and individual. Always consult a medical professional during withdrawal.</p>
          </div>
          {WITHDRAWAL_STAGES.map((stage) => {
            const colors = COLOR_MAP[stage.color];
            return (
              <div key={stage.phase} className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}>{stage.phase}</span>
                </div>
                <p className="text-white font-semibold mb-2">{stage.title}</p>
                <ul className="space-y-1 mb-3">
                  {stage.symptoms.map(s => (
                    <li key={s} className="text-gray-300 text-xs flex items-start gap-1.5">
                      <span className="mt-1 w-1 h-1 rounded-full bg-gray-500 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-400 text-xs italic">{stage.note}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Habits section */}
      {activeSection === 'habits' && (
        <div className="space-y-3">
          <p className="text-gray-400 text-xs">Check off your daily recovery habits.</p>
          {(userData.habits || []).map(habit => {
            const done = isHabitDoneToday(habit.id);
            return (
              <div
                key={habit.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  done ? 'bg-emerald-900/30 border-emerald-700/40' : 'bg-gray-900 border-gray-800'
                }`}
              >
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 hover:border-emerald-500'
                  }`}
                >
                  {done && <Check className="w-4 h-4 text-white" />}
                </button>
                <span className="text-xl">{habit.emoji}</span>
                <span className={`flex-1 font-medium ${done ? 'text-emerald-300 line-through decoration-emerald-700' : 'text-white'}`}>
                  {habit.name}
                </span>
                <button onClick={() => removeHabit(habit.id)} className="text-gray-600 hover:text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {addingHabit ? (
            <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 space-y-3">
              <input
                type="text"
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                placeholder="Habit name..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && addHabit()}
              />
              <div className="flex gap-2">
                <button onClick={addHabit} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold">
                  Add
                </button>
                <button onClick={() => setAddingHabit(false)} className="px-4 bg-gray-800 text-gray-300 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingHabit(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Custom Habit
            </button>
          )}

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">Today's Progress</p>
            <p className="text-white font-semibold">
              {(userData.habits || []).filter(h => isHabitDoneToday(h.id)).length} / {(userData.habits || []).length} habits completed
            </p>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{
                  width: `${(userData.habits || []).length === 0 ? 0 : ((userData.habits || []).filter(h => isHabitDoneToday(h.id)).length / (userData.habits || []).length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
