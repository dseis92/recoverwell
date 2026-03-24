import React, { useState } from 'react';
import { Heart, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const SUBSTANCES = [
  'Alcohol', 'Opioids', 'Stimulants (cocaine, meth)', 'Cannabis',
  'Benzodiazepines', 'Nicotine', 'Gambling', 'Multiple substances', 'Other',
];

const GOALS = [
  { id: 'sobriety', label: 'Maintain sobriety' },
  { id: 'health', label: 'Improve my health' },
  { id: 'family', label: 'Rebuild family relationships' },
  { id: 'work', label: 'Stabilize my career' },
  { id: 'mental', label: 'Improve mental health' },
  { id: 'financial', label: 'Financial stability' },
  { id: 'community', label: 'Build a sober community' },
];

export default function Setup({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    substance: '',
    sobrietyDate: new Date().toISOString().split('T')[0],
    sobrietyTime: '00:00',
    dailyCost: '20',
    goals: [],
    habits: [
      { id: 1, name: 'Exercise', emoji: '🏃' },
      { id: 2, name: 'Meditate', emoji: '🧘' },
      { id: 3, name: 'Attend a meeting', emoji: '🤝' },
      { id: 4, name: 'Journal', emoji: '📓' },
      { id: 5, name: 'Connect with sponsor', emoji: '📞' },
    ],
    communityPosts: [],
    moodLog: [],
    habitLog: {},
    cbaAnalysis: { pros_use: '', cons_use: '', pros_quit: '', cons_quit: '' },
    relapseWarnings: [],
    relapseActions: [],
  });

  const steps = [
    { title: 'Welcome', subtitle: "Let's personalize your recovery journey" },
    { title: 'What are you recovering from?', subtitle: 'This helps us tailor your support' },
    { title: 'Your sobriety date', subtitle: 'When did your recovery begin?' },
    { title: 'Daily spending', subtitle: 'See how much you\'re saving' },
    { title: 'Your goals', subtitle: 'What matters most to you?' },
  ];

  const toggleGoal = (id) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(id) ? f.goals.filter(g => g !== id) : [...f.goals, id],
    }));
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1) return form.substance.length > 0;
    if (step === 2) return form.sobrietyDate.length > 0;
    if (step === 3) return true;
    if (step === 4) return form.goals.length > 0;
    return true;
  };

  const handleFinish = () => {
    const sobrietyDateTime = new Date(`${form.sobrietyDate}T${form.sobrietyTime}:00`).toISOString();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    onComplete({
      ...form,
      sobrietyDate: sobrietyDateTime,
      timezone,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-3 glow-green">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-white">RecoverWell</h1>
          <p className="text-gray-400 text-sm mt-1">Your all-in-one recovery companion</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-emerald-500' : i < step ? 'w-4 bg-emerald-700' : 'w-4 bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-1">{steps[step].title}</h2>
          <p className="text-gray-400 text-sm mb-6">{steps[step].subtitle}</p>

          {step === 0 && (
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Your first name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Alex"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-lg"
                autoFocus
              />
              <p className="text-gray-500 text-xs mt-3">Your information stays private on this device.</p>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-gray-400 text-xs mb-3">Select all that apply</p>
              <div className="grid grid-cols-1 gap-2">
                {SUBSTANCES.map(s => {
                  const substances = form.substance ? form.substance.split(', ') : [];
                  const isSelected = substances.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        if (isSelected) {
                          const updated = substances.filter(sub => sub !== s).join(', ');
                          setForm(f => ({ ...f, substance: updated }));
                        } else {
                          const updated = [...substances, s].join(', ');
                          setForm(f => ({ ...f, substance: updated }));
                        }
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-sm font-medium">{s}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Date</label>
                <input
                  type="date"
                  value={form.sobrietyDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(f => ({ ...f, sobrietyDate: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Time (optional)</label>
                <input
                  type="time"
                  value={form.sobrietyTime}
                  onChange={e => setForm(f => ({ ...f, sobrietyTime: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-gray-500 text-xs">If you're not sure of the exact time, leave it at midnight.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  Estimated daily spending on your substance ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
                  <input
                    type="number"
                    value={form.dailyCost}
                    onChange={e => setForm(f => ({ ...f, dailyCost: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-lg"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <p className="text-emerald-400 text-sm font-medium">Your savings potential</p>
                <p className="text-emerald-300 text-2xl font-bold mt-1">
                  ${(parseFloat(form.dailyCost || 0) * 365).toLocaleString()}/year
                </p>
                <p className="text-gray-400 text-xs mt-1">estimated annual savings</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 gap-2">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    form.goals.includes(g.id)
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <span className="text-sm font-medium">{g.label}</span>
                  {form.goals.includes(g.id) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={step === steps.length - 1 ? handleFinish : () => setStep(s => s + 1)}
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
              canProceed()
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {step === steps.length - 1 ? (
              <>Start My Recovery <Heart className="w-4 h-4" fill="white" /></>
            ) : (
              <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
