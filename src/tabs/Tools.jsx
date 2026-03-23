import React, { useState } from 'react';
import { Zap, Brain, BarChart2, Wind, Shield, ArrowLeft, ChevronRight, Check, RefreshCw, Heart } from 'lucide-react';

// ─── Craving Manager ───────────────────────────────────────────────────────────
const CRAVING_TRIGGERS = [
  { id: 'stress', label: 'I\'m stressed or overwhelmed', emoji: '😤' },
  { id: 'bored', label: 'I\'m bored', emoji: '😑' },
  { id: 'social', label: 'Social pressure or situation', emoji: '👥' },
  { id: 'sad', label: 'I\'m sad or depressed', emoji: '😢' },
  { id: 'angry', label: 'I\'m angry or frustrated', emoji: '😠' },
  { id: 'lonely', label: 'I\'m feeling lonely', emoji: '🥺' },
  { id: 'celebrate', label: 'Something good happened', emoji: '🎉' },
  { id: 'pain', label: 'I\'m in physical pain', emoji: '🤕' },
  { id: 'insomnia', label: 'I can\'t sleep', emoji: '😴' },
  { id: 'habit', label: 'It\'s a habitual time/place', emoji: '🔄' },
];

const CRAVING_TOOLS = {
  stress: {
    title: 'Stress Relief Toolkit',
    steps: [
      'Stop. Take 5 slow, deep breaths — in for 4 counts, hold for 4, out for 6.',
      'Name 3 things in the room you can see. This anchors you to the present.',
      'Ask yourself: "Will using actually solve this stress, or just delay it?"',
      'Write down the stressor in one sentence. Problems feel smaller on paper.',
      'Call someone you trust and share what\'s going on.',
      'Remind yourself: this feeling is temporary. It will pass in 15-30 minutes.',
    ],
  },
  bored: {
    title: 'Beat the Boredom',
    steps: [
      'Boredom is a signal — your brain is ready for something new.',
      'Stand up and move. Walk around the block, do 10 push-ups, stretch.',
      'Text a friend you\'ve been meaning to reach out to.',
      'Pick up something creative: draw, write, play music.',
      'Watch a documentary or read something genuinely interesting.',
      'Plan something to look forward to — even something small tomorrow.',
    ],
  },
  social: {
    title: 'Navigate Social Pressure',
    steps: [
      'You have the right to say no. You don\'t owe anyone an explanation.',
      'Prepare a simple phrase: "No thanks, I\'m good." Practice it now.',
      'If pressure continues, create distance — step away, use the bathroom, leave.',
      'Remember: real friends respect your sobriety.',
      'Have your sponsor or support person\'s number ready to call.',
      'Ask yourself: is this environment safe for my recovery right now?',
    ],
  },
  sad: {
    title: 'Working Through Sadness',
    steps: [
      'Sadness is valid. Allow yourself to feel it without acting on it.',
      'Using won\'t erase sadness — it will come back stronger after.',
      'Write about what\'s making you sad. Getting it out helps.',
      'Reach out to someone — a friend, your sponsor, or a hotline.',
      'Watch or listen to something that genuinely comforts you.',
      'Remind yourself: you\'ve survived every hard day so far.',
    ],
  },
  angry: {
    title: 'Managing Anger',
    steps: [
      'STOP. Do not make any decisions right now.',
      'Leave the triggering environment if you can.',
      'Do something physical: sprint, punch a pillow, do push-ups.',
      'Write out everything you\'re angry about — uncensored.',
      'After cooling down, identify the real need behind the anger.',
      'Talk to someone safe about what happened.',
    ],
  },
  lonely: {
    title: 'Coping with Loneliness',
    steps: [
      'Loneliness is one of the biggest relapse triggers. Take it seriously.',
      'Reach out to one person right now — text, call, or go see them.',
      'Go somewhere with people: a coffee shop, library, or meeting.',
      'Find an online recovery community or forum.',
      'Volunteer or attend a group activity in your area.',
      'Remember: connection is available. You just have to reach for it.',
    ],
  },
  celebrate: {
    title: 'Celebrate Without Using',
    steps: [
      'Positive events can trigger cravings too — that\'s completely normal.',
      'Plan a sober reward in advance for good moments.',
      'Share your good news with your sober support network.',
      'Reframe: "I can feel this joy fully because I\'m sober."',
      'Treat yourself to something meaningful: a meal, experience, or purchase.',
      'Let this moment remind you why sobriety is worth it.',
    ],
  },
  pain: {
    title: 'Managing Physical Pain',
    steps: [
      'Contact your doctor about non-addictive pain management options.',
      'Try ice/heat, stretching, or over-the-counter pain relief.',
      'Practice guided meditation focused on pain tolerance.',
      'Distract with absorbing activities: TV, games, conversations.',
      'Tell your care team you are in recovery — they can help.',
      'Use a non-opioid pain management plan if you don\'t have one.',
    ],
  },
  insomnia: {
    title: 'Sleep Without Substances',
    steps: [
      'Put your phone away 30 minutes before bed.',
      'Do the 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s.',
      'Keep your sleep environment cool and dark.',
      'Try progressive muscle relaxation — tense and release each muscle group.',
      'Don\'t lie in bed awake for more than 20 minutes — get up and read.',
      'Sleep struggles are common in early recovery and do improve.',
    ],
  },
  habit: {
    title: 'Breaking the Habit Loop',
    steps: [
      'You\'ve identified a trigger. That\'s already a huge step.',
      'Change your environment — move to a different room or location.',
      'Replace the ritual: same time, different (healthy) activity.',
      'Set a 15-minute timer. Cravings peak and then subside.',
      'Call your sponsor or support person.',
      'Remind yourself: the craving is just your brain\'s old programming. It can be rewired.',
    ],
  },
};

function CravingManager({ onBack }) {
  const [trigger, setTrigger] = useState(null);
  const [step, setStep] = useState(0);

  const tool = trigger ? CRAVING_TOOLS[trigger] : null;

  if (!trigger) {
    return (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
          <p className="text-red-300 text-sm font-semibold">You've got this.</p>
          <p className="text-gray-400 text-sm mt-1">What's triggering your craving right now?</p>
        </div>
        {CRAVING_TRIGGERS.map(t => (
          <button
            key={t.id}
            onClick={() => setTrigger(t.id)}
            className="w-full flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-red-700/50 transition-all text-left"
          >
            <span className="text-2xl">{t.emoji}</span>
            <span className="text-white text-sm font-medium">{t.label}</span>
            <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
        <p className="text-red-300 text-sm font-semibold">{tool.title}</p>
        <p className="text-gray-400 text-xs mt-0.5">Step {step + 1} of {tool.steps.length}</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-700 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm font-bold">{step + 1}</div>
        </div>
        <p className="text-white text-base leading-relaxed">{tool.steps[step]}</p>
      </div>

      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${((step + 1) / tool.steps.length) * 100}%` }} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => step === 0 ? setTrigger(null) : setStep(s => s - 1)}
          className="px-4 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm"
        >
          Back
        </button>
        {step < tool.steps.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold"
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={() => { setTrigger(null); setStep(0); }}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> I Made It Through
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CBT Exercises ──────────────────────────────────────────────────────────────
const CBT_EXERCISES = [
  {
    id: 'thought_challenge',
    title: 'Thought Record',
    desc: 'Challenge automatic negative thoughts',
    emoji: '💭',
    steps: [
      { prompt: 'What situation triggered this thought?', placeholder: 'e.g. My friend invited me to a party...' },
      { prompt: 'What automatic thought came up?', placeholder: 'e.g. I can\'t go, I\'ll definitely relapse...' },
      { prompt: 'What emotion did you feel? (Rate intensity 1-10)', placeholder: 'e.g. Anxiety — 8/10' },
      { prompt: 'What evidence SUPPORTS this thought?', placeholder: 'e.g. I\'ve had trouble at parties before...' },
      { prompt: 'What evidence CHALLENGES this thought?', placeholder: 'e.g. I\'ve also attended sober events successfully...' },
      { prompt: 'What is a more balanced thought?', placeholder: 'e.g. I can go for an hour and leave if I feel uncomfortable...' },
    ],
  },
  {
    id: 'behavioral',
    title: 'Behavioral Activation',
    desc: 'Schedule a positive activity',
    emoji: '🎯',
    steps: [
      { prompt: 'What activity makes you feel good when you do it?', placeholder: 'e.g. Going for a walk, cooking, calling a friend...' },
      { prompt: 'When will you do it? (Be specific — day and time)', placeholder: 'e.g. Tomorrow at 10am' },
      { prompt: 'What might get in the way?', placeholder: 'e.g. I might feel too tired...' },
      { prompt: 'How will you overcome that obstacle?', placeholder: 'e.g. I\'ll set an alarm and commit to just 10 minutes...' },
    ],
  },
  {
    id: 'urge_surf',
    title: 'Urge Surfing',
    desc: 'Ride out a craving like a wave',
    emoji: '🌊',
    steps: [
      { prompt: 'Notice the urge. Where do you feel it in your body?', placeholder: 'e.g. Tightness in my chest, restlessness in my legs...' },
      { prompt: 'Rate the intensity of the urge right now (1-10)', placeholder: 'e.g. 7/10' },
      { prompt: 'Observe without acting. What does the urge "want" to tell you?', placeholder: 'e.g. It wants relief, escape, comfort...' },
      { prompt: 'Wait 15 minutes. Now rate the intensity again.', placeholder: 'e.g. It\'s gone down to 4/10...' },
    ],
  },
];

function CBTExercises({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!selected) {
    return (
      <div className="space-y-3">
        <p className="text-gray-400 text-sm">CBT (Cognitive Behavioral Therapy) exercises help you identify and change unhelpful thought patterns.</p>
        {CBT_EXERCISES.map(ex => (
          <button
            key={ex.id}
            onClick={() => { setSelected(ex); setStep(0); setAnswers({}); }}
            className="w-full flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-700/50 transition-all text-left"
          >
            <span className="text-3xl">{ex.emoji}</span>
            <div>
              <p className="text-white font-semibold text-sm">{ex.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{ex.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
          </button>
        ))}
      </div>
    );
  }

  const currentStep = selected.steps[step];
  const allDone = step >= selected.steps.length;

  if (allDone) {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-900/30 border border-emerald-700/40 rounded-xl p-5 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-emerald-400 font-bold text-lg">Exercise Complete!</p>
          <p className="text-gray-400 text-sm mt-1">Great work. You've practiced {selected.title}.</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
          <p className="text-white font-semibold text-sm">Your responses:</p>
          {selected.steps.map((s, i) => (
            <div key={i} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
              <p className="text-gray-400 text-xs mb-1">{s.prompt}</p>
              <p className="text-white text-sm">{answers[i] || '—'}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setSelected(null)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm">
          Back to Exercises
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <p className="text-blue-300 font-semibold">{selected.emoji} {selected.title}</p>
        <p className="text-gray-400 text-xs mt-0.5">Step {step + 1} of {selected.steps.length}</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 space-y-3">
        <p className="text-white font-medium text-sm">{currentStep.prompt}</p>
        <textarea
          value={answers[step] || ''}
          onChange={e => setAnswers(a => ({ ...a, [step]: e.target.value }))}
          placeholder={currentStep.placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm resize-none"
          rows={4}
        />
      </div>

      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((step + 1) / selected.steps.length) * 100}%` }} />
      </div>

      <div className="flex gap-3">
        <button onClick={() => step === 0 ? setSelected(null) : setStep(s => s - 1)} className="px-4 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm">
          Back
        </button>
        <button
          onClick={() => setStep(s => s + 1)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold"
        >
          {step === selected.steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

// ─── Cost-Benefit Analysis (SMART Recovery) ────────────────────────────────────
function CostBenefitAnalysis({ userData, onUpdateUser, onBack }) {
  const [cba, setCba] = useState(userData.cbaAnalysis || { pros_use: '', cons_use: '', pros_quit: '', cons_quit: '' });

  const save = () => {
    onUpdateUser({ cbaAnalysis: cba });
    alert('Your Cost-Benefit Analysis has been saved.');
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <p className="text-white text-sm">The Cost-Benefit Analysis is a core SMART Recovery tool. It helps you weigh the real costs and benefits of using vs. not using.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3">
          <p className="text-red-400 text-xs font-semibold uppercase mb-2">Using — Pros</p>
          <textarea
            value={cba.pros_use}
            onChange={e => setCba(c => ({ ...c, pros_use: e.target.value }))}
            placeholder="e.g. Feel relaxed, escape pain..."
            className="w-full bg-gray-800/50 rounded-lg px-2 py-2 text-white placeholder-gray-600 text-xs focus:outline-none resize-none"
            rows={5}
          />
        </div>
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3">
          <p className="text-red-400 text-xs font-semibold uppercase mb-2">Using — Cons</p>
          <textarea
            value={cba.cons_use}
            onChange={e => setCba(c => ({ ...c, cons_use: e.target.value }))}
            placeholder="e.g. Health damage, cost money..."
            className="w-full bg-gray-800/50 rounded-lg px-2 py-2 text-white placeholder-gray-600 text-xs focus:outline-none resize-none"
            rows={5}
          />
        </div>
        <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase mb-2">Not Using — Pros</p>
          <textarea
            value={cba.pros_quit}
            onChange={e => setCba(c => ({ ...c, pros_quit: e.target.value }))}
            placeholder="e.g. Better health, save money..."
            className="w-full bg-gray-800/50 rounded-lg px-2 py-2 text-white placeholder-gray-600 text-xs focus:outline-none resize-none"
            rows={5}
          />
        </div>
        <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase mb-2">Not Using — Cons</p>
          <textarea
            value={cba.cons_quit}
            onChange={e => setCba(c => ({ ...c, cons_quit: e.target.value }))}
            placeholder="e.g. Miss the ritual, withdrawal..."
            className="w-full bg-gray-800/50 rounded-lg px-2 py-2 text-white placeholder-gray-600 text-xs focus:outline-none resize-none"
            rows={5}
          />
        </div>
      </div>

      <button onClick={save} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
        <Check className="w-4 h-4" /> Save My Analysis
      </button>
    </div>
  );
}

// ─── Grounding & PTSD Tools ─────────────────────────────────────────────────────
const GROUNDING_TOOLS = [
  {
    id: '54321',
    title: '5-4-3-2-1 Grounding',
    desc: 'Anchor yourself to the present moment',
    emoji: '🌍',
    steps: [
      '👁 Name 5 things you can SEE around you right now.',
      '✋ Touch 4 things and notice how they FEEL.',
      '👂 Listen for 3 things you can HEAR.',
      '👃 Identify 2 things you can SMELL (or like to smell).',
      '👅 Notice 1 thing you can TASTE.',
      '✅ You are grounded. Take a slow breath. You are safe.',
    ],
  },
  {
    id: 'box_breathing',
    title: 'Box Breathing',
    desc: 'Calm your nervous system in 2 minutes',
    emoji: '🌬️',
    steps: [
      'Sit comfortably. Exhale completely.',
      'Inhale slowly through your nose for 4 counts: 1... 2... 3... 4...',
      'Hold your breath for 4 counts: 1... 2... 3... 4...',
      'Exhale through your mouth for 4 counts: 1... 2... 3... 4...',
      'Hold empty for 4 counts: 1... 2... 3... 4...',
      'Repeat 4 times. Notice how calm you feel.',
    ],
  },
  {
    id: 'self_talk',
    title: 'Positive Self-Talk',
    desc: 'Reframe your inner voice',
    emoji: '💬',
    steps: [
      'Notice the negative thought you\'re having. Write it mentally.',
      'Ask: "Would I say this to a friend in recovery?" Probably not.',
      'Replace it: "I am doing the best I can today."',
      'Add: "I have survived every hard moment before this one."',
      'Affirm: "My sobriety matters. I am worth fighting for."',
      'Say these out loud if you can. Your brain listens.',
    ],
  },
  {
    id: 'anger',
    title: 'Anger Management',
    desc: 'Release anger without using',
    emoji: '🔥',
    steps: [
      'STOP. Don\'t speak or act right now.',
      'Leave the situation if at all possible.',
      'Do 10 jumping jacks, sprint in place, or do push-ups.',
      'Write out everything you\'re angry about — no filter.',
      'Take 5 slow box breaths.',
      'When calmer: identify what you actually NEED in this moment.',
    ],
  },
];

function GroundingTools({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);

  if (!selected) {
    return (
      <div className="space-y-3">
        <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-3">
          <p className="text-purple-300 text-sm">These tools help with PTSD, anxiety, and dual-diagnosis challenges. They work for everyone in recovery.</p>
        </div>
        {GROUNDING_TOOLS.map(t => (
          <button
            key={t.id}
            onClick={() => { setSelected(t); setStep(0); }}
            className="w-full flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-700/50 transition-all text-left"
          >
            <span className="text-3xl">{t.emoji}</span>
            <div>
              <p className="text-white font-semibold text-sm">{t.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{t.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
          </button>
        ))}
      </div>
    );
  }

  const done = step >= selected.steps.length;

  return (
    <div className="space-y-4">
      <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
        <p className="text-purple-300 font-semibold">{selected.emoji} {selected.title}</p>
        {!done && <p className="text-gray-400 text-xs mt-0.5">Step {step + 1} of {selected.steps.length}</p>}
      </div>

      {done ? (
        <div className="bg-emerald-900/30 border border-emerald-700/40 rounded-xl p-5 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-emerald-400 font-bold">Well done.</p>
          <p className="text-gray-400 text-sm mt-1">You completed {selected.title}.</p>
          <button onClick={() => setSelected(null)} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-semibold text-sm">
            Back to Tools
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-5 min-h-[100px] flex items-center">
            <p className="text-white text-base leading-relaxed">{selected.steps[step]}</p>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${((step + 1) / selected.steps.length) * 100}%` }} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => step === 0 ? setSelected(null) : setStep(s => s - 1)} className="px-4 py-3 bg-gray-800 text-gray-300 rounded-xl text-sm">Back</button>
            <button onClick={() => setStep(s => s + 1)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold">
              {step === selected.steps.length - 1 ? 'Done' : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Relapse Prevention Plan ────────────────────────────────────────────────────
function RelapsePreventionPlan({ userData, onUpdateUser, onBack }) {
  const [plan, setPlan] = useState({
    warnings: (userData.relapseWarnings || []).join('\n'),
    actions: (userData.relapseActions || []).join('\n'),
    contacts: (userData.relapseContacts || []).join('\n'),
    safePlace: userData.relapseSafePlace || '',
  });

  const save = () => {
    onUpdateUser({
      relapseWarnings: plan.warnings.split('\n').filter(Boolean),
      relapseActions: plan.actions.split('\n').filter(Boolean),
      relapseContacts: plan.contacts.split('\n').filter(Boolean),
      relapseSafePlace: plan.safePlace,
    });
    alert('Relapse Prevention Plan saved.');
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-3">
        <p className="text-amber-300 text-sm">A relapse prevention plan helps you recognize warning signs and know exactly what to do before a crisis hits.</p>
      </div>

      {[
        { key: 'warnings', label: 'My Warning Signs', placeholder: 'e.g. Isolating from friends\nSkipping meetings\nIdealization of using\nIncreased stress or irritability', color: 'yellow' },
        { key: 'actions', label: 'What I Will Do If I Feel Close to Relapsing', placeholder: 'e.g. Call my sponsor immediately\nLeave the triggering situation\nGo to a meeting\nUse the craving tool in this app', color: 'blue' },
        { key: 'contacts', label: 'People I Can Call (name & number)', placeholder: 'e.g. Sponsor — John — 555-0123\nSister — 555-4567\nCrisis line — 988', color: 'green' },
        { key: 'safePlace', label: 'My Safe Place / Environment', placeholder: 'e.g. Home with my dog, the park near my house, the community center...', color: 'purple' },
      ].map(({ key, label, placeholder, color }) => (
        <div key={key} className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-2">
          <p className="text-white text-sm font-semibold">{label}</p>
          <textarea
            value={plan[key]}
            onChange={e => setPlan(p => ({ ...p, [key]: e.target.value }))}
            placeholder={placeholder}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            rows={4}
          />
        </div>
      ))}

      <button onClick={save} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
        <Check className="w-4 h-4" /> Save My Plan
      </button>
    </div>
  );
}

// ─── Main Tools Tab ─────────────────────────────────────────────────────────────
const TOOL_CARDS = [
  { id: 'craving', title: 'Craving Manager', desc: 'Get immediate help when cravings hit', emoji: '⚡', color: 'red' },
  { id: 'cbt', title: 'CBT Exercises', desc: 'Thought records, behavioral activation & urge surfing', emoji: '🧠', color: 'blue' },
  { id: 'cba', title: 'Cost-Benefit Analysis', desc: 'SMART Recovery decision-making tool', emoji: '⚖️', color: 'emerald' },
  { id: 'grounding', title: 'Grounding & PTSD Tools', desc: 'Breathing, 5-4-3-2-1, self-talk, anger management', emoji: '🌿', color: 'purple' },
  { id: 'relapse', title: 'Relapse Prevention Plan', desc: 'Build your personal safety plan', emoji: '🛡️', color: 'amber' },
];

const CARD_COLORS = {
  red: 'border-red-700/40 hover:border-red-600/60',
  blue: 'border-blue-700/40 hover:border-blue-600/60',
  emerald: 'border-emerald-700/40 hover:border-emerald-600/60',
  purple: 'border-purple-700/40 hover:border-purple-600/60',
  amber: 'border-amber-700/40 hover:border-amber-600/60',
};

export default function Tools({ userData, onUpdateUser }) {
  const [activeTool, setActiveTool] = useState(null);

  if (activeTool) {
    return (
      <div className="px-4 pt-6 pb-4 fade-in">
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </button>
        <h2 className="text-xl font-bold text-white mb-4">
          {TOOL_CARDS.find(t => t.id === activeTool)?.title}
        </h2>
        {activeTool === 'craving' && <CravingManager onBack={() => setActiveTool(null)} />}
        {activeTool === 'cbt' && <CBTExercises onBack={() => setActiveTool(null)} />}
        {activeTool === 'cba' && <CostBenefitAnalysis userData={userData} onUpdateUser={onUpdateUser} onBack={() => setActiveTool(null)} />}
        {activeTool === 'grounding' && <GroundingTools onBack={() => setActiveTool(null)} />}
        {activeTool === 'relapse' && <RelapsePreventionPlan userData={userData} onUpdateUser={onUpdateUser} onBack={() => setActiveTool(null)} />}
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-4 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Recovery Tools</h1>
        <p className="text-gray-400 text-sm mt-1">Evidence-based tools to support your journey</p>
      </div>

      <div className="space-y-3">
        {TOOL_CARDS.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`w-full flex items-center gap-4 p-4 bg-gray-900 border rounded-xl transition-all text-left active:scale-[0.98] ${CARD_COLORS[tool.color]}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
              {tool.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{tool.title}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-snug">{tool.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <p className="text-gray-400 text-xs text-center">These tools are evidence-based but do not replace professional treatment. If you are in crisis, call 988 (Suicide & Crisis Lifeline).</p>
      </div>
    </div>
  );
}
