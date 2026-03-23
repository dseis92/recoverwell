import React, { useState } from 'react';
import { Phone, MapPin, Calendar, BookOpen, Search, ChevronRight, ArrowLeft, ExternalLink } from 'lucide-react';

// ─── Crisis Hotlines (always visible) ──────────────────────────────────────────
const HOTLINES = [
  { name: 'SAMHSA National Helpline', number: '1-800-662-4357', desc: 'Substance use treatment referrals — Free, 24/7', emoji: '🆘' },
  { name: 'Suicide & Crisis Lifeline', number: '988', desc: 'Mental health & crisis support — Free, 24/7', emoji: '💙' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: 'Text-based crisis support — Free, 24/7', emoji: '💬', isText: true },
  { name: 'AA Meeting Hotline', number: '1-800-839-1686', desc: 'Find an AA meeting near you', emoji: '🤝' },
  { name: 'NA Meeting Hotline', number: '1-818-773-9999', desc: 'Narcotics Anonymous helpline', emoji: '🌿' },
];

// ─── Treatment Providers (mock directory, SoberWorx-inspired) ──────────────────
const PROVIDERS = [
  { id: 1, name: 'Sunrise Recovery Center', type: 'Rehab Facility', location: 'New York, NY', specialty: 'Opioids, Alcohol', rating: 4.8, phone: '555-0101', accepts: 'Most insurance' },
  { id: 2, name: 'Dr. Lisa Chen, LCSW', type: 'Therapist', location: 'Los Angeles, CA', specialty: 'Dual diagnosis, CBT', rating: 4.9, phone: '555-0102', accepts: 'Sliding scale' },
  { id: 3, name: 'Clean Slate Counseling', type: 'Substance Abuse Counselor', location: 'Chicago, IL', specialty: 'Stimulants, Cannabis', rating: 4.7, phone: '555-0103', accepts: 'Medicaid, Medicare' },
  { id: 4, name: 'New Horizons Sober Living', type: 'Sober Living Home', location: 'Austin, TX', specialty: 'All substances', rating: 4.6, phone: '555-0104', accepts: 'Private pay' },
  { id: 5, name: 'Harbor Light Treatment', type: 'Rehab Facility', location: 'Seattle, WA', specialty: 'Alcohol, Benzodiazepines', rating: 4.8, phone: '555-0105', accepts: 'Most insurance' },
  { id: 6, name: 'Dr. Marcus Webb, MD', type: 'Addiction Psychiatrist', location: 'Boston, MA', specialty: 'MAT, Dual diagnosis', rating: 4.9, phone: '555-0106', accepts: 'Most insurance' },
  { id: 7, name: 'Serenity Counseling Services', type: 'Substance Abuse Counselor', location: 'Phoenix, AZ', specialty: 'Opioids, Meth', rating: 4.5, phone: '555-0107', accepts: 'Sliding scale' },
  { id: 8, name: 'The Recovery House', type: 'Sober Living Home', location: 'Denver, CO', specialty: 'All substances', rating: 4.7, phone: '555-0108', accepts: 'Private pay' },
];

const PROVIDER_TYPES = ['All', 'Rehab Facility', 'Therapist', 'Substance Abuse Counselor', 'Sober Living Home', 'Addiction Psychiatrist'];

function TreatmentFinder() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = PROVIDERS.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || p.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
        <p className="text-blue-300 text-xs">This is a sample directory. For your area, visit SAMHSA's treatment locator at findtreatment.gov or call 1-800-662-4357.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, location, or specialty..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {PROVIDER_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all ${
              typeFilter === t ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-white font-semibold text-sm">{p.name}</p>
              <span className="text-yellow-400 text-xs flex-shrink-0">★ {p.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">{p.type}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <MapPin className="w-3 h-3" />
                {p.location}
              </div>
              <p className="text-gray-400 text-xs">Specialty: {p.specialty}</p>
              <p className="text-gray-400 text-xs">Insurance: {p.accepts}</p>
            </div>
            <a
              href={`tel:${p.phone}`}
              className="flex items-center gap-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold w-full justify-center transition-all"
            >
              <Phone className="w-3.5 h-3.5" /> Call {p.phone}
            </a>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">No providers match your search.</p>
        )}
      </div>
    </div>
  );
}

// ─── Meeting Finder ─────────────────────────────────────────────────────────────
const MEETINGS = [
  { type: 'AA', name: 'Alcoholics Anonymous', desc: 'The original 12-step fellowship. Open to anyone with a desire to stop drinking.', schedule: 'Daily meetings worldwide', url: 'https://www.aa.org/find-aa', color: 'blue' },
  { type: 'NA', name: 'Narcotics Anonymous', desc: '12-step fellowship for people recovering from drug addiction. No specific drug required.', schedule: 'Daily meetings worldwide', url: 'https://www.na.org', color: 'emerald' },
  { type: 'SMART', name: 'SMART Recovery', desc: 'Science-based alternative to 12-step. Uses CBT and motivational techniques. No higher power required.', schedule: 'Thousands of meetings weekly', url: 'https://www.smartrecovery.org', color: 'orange' },
  { type: 'Al-Anon', name: 'Al-Anon / Nar-Anon', desc: 'For family members and friends of people struggling with addiction.', schedule: 'Daily meetings worldwide', url: 'https://al-anon.org', color: 'purple' },
  { type: 'Refuge', name: 'Refuge Recovery', desc: 'Buddhist-inspired recovery program. Mindfulness and meditation based.', schedule: 'Growing national presence', url: 'https://refugerecovery.org', color: 'pink' },
  { type: 'Celebrate', name: 'Celebrate Recovery', desc: 'Christ-centered 12-step program for all types of hurts, hang-ups, and habits.', schedule: 'Churches nationwide', url: 'https://www.celebraterecovery.com', color: 'yellow' },
];

const MEETING_COLORS = {
  blue: 'bg-blue-500/10 border-blue-700/40 text-blue-400',
  emerald: 'bg-emerald-500/10 border-emerald-700/40 text-emerald-400',
  orange: 'bg-orange-500/10 border-orange-700/40 text-orange-400',
  purple: 'bg-purple-500/10 border-purple-700/40 text-purple-400',
  pink: 'bg-pink-500/10 border-pink-700/40 text-pink-400',
  yellow: 'bg-yellow-500/10 border-yellow-700/40 text-yellow-400',
};

function MeetingFinder() {
  return (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-3">
        <p className="text-gray-400 text-xs">Find meetings near you through each program's official website or call their helpline.</p>
      </div>
      {MEETINGS.map(m => {
        const colors = MEETING_COLORS[m.color];
        return (
          <div key={m.type} className={`rounded-xl border p-4 space-y-2 ${colors}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{m.name}</span>
              <span className="text-xs opacity-70 bg-white/10 px-2 py-0.5 rounded-full">{m.type}</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">{m.desc}</p>
            <p className="text-gray-400 text-xs">📅 {m.schedule}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Recovery Articles ──────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1,
    title: 'Understanding the Stages of Recovery',
    category: 'Education',
    readTime: '5 min read',
    preview: 'Recovery is not a single event but a long-term process with distinct stages. Understanding where you are can help you navigate the journey...',
    content: `Recovery typically moves through several stages: pre-contemplation, contemplation, preparation, action, and maintenance. Each stage requires different strategies and support. In early recovery (0-90 days), the focus is on physical stabilization and building a support network. In middle recovery (3-18 months), the work shifts to addressing underlying issues and rebuilding relationships. In late recovery (18+ months), the focus turns to lifestyle management and growth.\n\nUnderstanding your stage helps you know what to expect. Early recovery is often the hardest physically, but the rewards compound over time. Many people in long-term recovery describe it as the most fulfilling period of their lives.`,
    emoji: '📖',
  },
  {
    id: 2,
    title: 'How to Build a Sober Support Network',
    category: 'Relationships',
    readTime: '4 min read',
    preview: 'Connection is one of the most powerful protective factors against relapse. Here\'s how to build genuine, sober support...',
    content: `A strong support network is one of the biggest predictors of sustained recovery. This network should include: a sponsor or recovery coach, sober friends, family members who support your recovery, a therapist or counselor, and a peer support group.\n\nBuilding this network takes time. Start by being honest about your recovery with people you trust. Attend meetings regularly — the relationships formed there are invaluable. Don't isolate. Connection is the opposite of addiction.\n\nIf old friendships centered on using, it may be necessary to create distance from those relationships. This is hard but necessary. New, sober connections will fill that void in time.`,
    emoji: '🤝',
  },
  {
    id: 3,
    title: 'Managing Post-Acute Withdrawal Syndrome (PAWS)',
    category: 'Health',
    readTime: '6 min read',
    preview: 'PAWS affects many people in recovery and can last months. Knowing what it is and how to manage it makes a huge difference...',
    content: `Post-Acute Withdrawal Syndrome (PAWS) refers to a set of symptoms that can appear weeks or months after the acute withdrawal phase ends. Common symptoms include mood swings, anxiety, difficulty concentrating, sleep disturbances, and intermittent cravings.\n\nPAWS is caused by the brain readjusting to functioning without the substance. It's a normal part of recovery, not a sign of failure.\n\nManaging PAWS:\n• Maintain a consistent sleep schedule\n• Exercise regularly — it's one of the most effective treatments\n• Eat nutritious food and stay hydrated\n• Practice stress management techniques\n• Be patient — PAWS symptoms improve with time\n• Talk to your doctor — some medications can help\n\nKnowing that what you're experiencing has a name and is temporary can make it much more manageable.`,
    emoji: '🧠',
  },
  {
    id: 4,
    title: 'The Science of Habit Change in Recovery',
    category: 'Science',
    readTime: '5 min read',
    preview: 'Understanding how habits form and how to replace them with healthier ones is central to lasting recovery...',
    content: `Addiction is, at its core, a habit disorder — a powerful, compulsive habit that hijacks the brain's reward circuitry. Recovery involves building new habits to replace old ones.\n\nThe habit loop has three parts: cue (trigger), routine (behavior), and reward (outcome). In addiction, the cue might be stress, the routine is using, and the reward is temporary relief. Recovery involves keeping the cue and reward but changing the routine.\n\nEffective replacement habits for recovery:\n• Exercise releases dopamine naturally\n• Social connection provides belonging (same reward as some substances)\n• Mindfulness trains the brain to pause before reacting\n• Creative activities provide stimulation and meaning\n\nHabit change takes an average of 66 days to stick, not 21 days as commonly believed. Be patient with yourself and celebrate small wins.`,
    emoji: '🔬',
  },
  {
    id: 5,
    title: 'Navigating Relationships in Recovery',
    category: 'Relationships',
    readTime: '4 min read',
    preview: 'Recovery changes you, and that affects every relationship in your life. Here\'s how to navigate these changes...',
    content: `Recovery transforms relationships — sometimes in difficult ways. Family members who were hurt by your addiction may not trust you immediately. Old friends who still use may no longer be safe for you. New sober connections may feel unfamiliar.\n\nKey principles for relationships in recovery:\n\n1. Earn trust through consistent action, not words. Trust is rebuilt slowly.\n2. Make amends when appropriate and possible, without expectations.\n3. Set boundaries with people who undermine your recovery.\n4. Communicate openly about your needs and limitations.\n5. Give relationships time. Healing doesn't happen overnight.\n\nMany people in recovery find that their relationships, once rebuilt on honesty, become deeper and more meaningful than they ever were.`,
    emoji: '💞',
  },
];

function RecoveryArticles() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </button>
        <div className="space-y-3">
          <div className="text-4xl">{selected.emoji}</div>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">{selected.category}</span>
          <h2 className="text-xl font-bold text-white">{selected.title}</h2>
          <p className="text-gray-400 text-xs">{selected.readTime}</p>
          {selected.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-200 text-sm leading-relaxed">{para}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ARTICLES.map(article => (
        <button
          key={article.id}
          onClick={() => setSelected(article)}
          className="w-full bg-gray-900 rounded-xl border border-gray-800 p-4 text-left hover:border-gray-700 transition-all"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{article.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-emerald-400 font-medium">{article.category}</span>
                <span className="text-gray-600 text-xs">•</span>
                <span className="text-gray-500 text-xs">{article.readTime}</span>
              </div>
              <p className="text-white font-semibold text-sm mb-1">{article.title}</p>
              <p className="text-gray-400 text-xs leading-snug line-clamp-2">{article.preview}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── 12-Step Resources ──────────────────────────────────────────────────────────
const TWELVE_STEPS = [
  { n: 1, text: 'We admitted we were powerless over our addiction — that our lives had become unmanageable.' },
  { n: 2, text: 'Came to believe that a Power greater than ourselves could restore us to sanity.' },
  { n: 3, text: 'Made a decision to turn our will and our lives over to the care of God as we understood Him.' },
  { n: 4, text: 'Made a searching and fearless moral inventory of ourselves.' },
  { n: 5, text: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.' },
  { n: 6, text: 'Were entirely ready to have God remove all these defects of character.' },
  { n: 7, text: 'Humbly asked Him to remove our shortcomings.' },
  { n: 8, text: 'Made a list of all persons we had harmed, and became willing to make amends to them all.' },
  { n: 9, text: 'Made direct amends to such people wherever possible, except when to do so would injure them or others.' },
  { n: 10, text: 'Continued to take personal inventory and when we were wrong promptly admitted it.' },
  { n: 11, text: 'Sought through prayer and meditation to improve our conscious contact with God as we understood Him.' },
  { n: 12, text: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to addicts, and to practice these principles in all our affairs.' },
];

const BIG_BOOK_EXCERPTS = [
  {
    title: 'There Is a Solution',
    text: '"We, of Alcoholics Anonymous, know thousands of men and women who were once just as hopeless as Bill. Nearly all have recovered. They have solved the drink problem. We are average Americans. All sections of this country and many of its peoples are represented, as well as many political, economic, social, and religious backgrounds."',
  },
  {
    title: 'On Courage',
    text: '"Fear is an evil and corroding thread; the fabric of our existence was shot through with it. It set in motion trains of circumstances which brought us misfortune we felt we didn\'t deserve. But did not we, ourselves, set the ball rolling?"',
  },
  {
    title: 'The Promise',
    text: '"We are going to know a new freedom and a new happiness. We will not regret the past nor wish to shut the door on it. We will comprehend the word serenity and we will know peace."',
  },
];

function TwelveStepResources() {
  const [view, setView] = useState('steps');

  return (
    <div className="space-y-4">
      <div className="flex bg-gray-900 rounded-xl p-1 gap-1">
        {[
          { id: 'steps', label: '12 Steps' },
          { id: 'bigbook', label: 'Big Book' },
          { id: 'serenity', label: 'Serenity Prayer' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${view === v.id ? 'bg-emerald-500 text-white' : 'text-gray-400'}`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'steps' && (
        <div className="space-y-2">
          {TWELVE_STEPS.map(s => (
            <div key={s.n} className="flex gap-3 bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                {s.n}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'bigbook' && (
        <div className="space-y-3">
          <p className="text-gray-400 text-xs">Excerpts from Alcoholics Anonymous (The Big Book)</p>
          {BIG_BOOK_EXCERPTS.map((e, i) => (
            <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-2">
              <p className="text-emerald-400 text-xs font-semibold">{e.title}</p>
              <p className="text-gray-200 text-sm leading-relaxed italic">{e.text}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'serenity' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center space-y-4">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide">The Serenity Prayer</p>
            <p className="text-white text-lg leading-relaxed font-medium italic">
              "God, grant me the serenity<br />
              to accept the things I cannot change,<br />
              courage to change the things I can,<br />
              and wisdom to know the difference."
            </p>
            <p className="text-gray-500 text-xs">— Reinhold Niebuhr</p>
          </div>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold text-sm mb-2">The 3 Principles</p>
            <div className="space-y-2">
              {[
                { label: 'Serenity', desc: 'Peace with what you cannot control' },
                { label: 'Courage', desc: 'Strength to change what you can' },
                { label: 'Wisdom', desc: 'Knowing the difference between the two' },
              ].map(p => (
                <div key={p.label} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-emerald-400 text-sm font-medium">{p.label}: </span>
                    <span className="text-gray-300 text-sm">{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Resources Tab ─────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'crisis', label: 'Crisis Lines', emoji: '🆘', color: 'red' },
  { id: 'treatment', label: 'Find Treatment', emoji: '🏥', color: 'blue' },
  { id: 'meetings', label: 'Meetings', emoji: '🤝', color: 'emerald' },
  { id: 'articles', label: 'Articles', emoji: '📖', color: 'purple' },
  { id: 'twelve', label: '12 Steps', emoji: '⭐', color: 'yellow' },
];

export default function Resources() {
  const [activeSection, setActiveSection] = useState('crisis');

  return (
    <div className="px-4 pt-6 pb-4 space-y-4 fade-in">
      <h1 className="text-2xl font-bold text-white">Resources</h1>

      {/* Section tabs */}
      <div className="grid grid-cols-5 gap-1 bg-gray-900 rounded-xl p-1">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${
              activeSection === s.id ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">{s.emoji}</span>
            <span className={`text-xs font-medium leading-tight text-center ${activeSection === s.id ? 'text-white' : 'text-gray-500'}`}>
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Crisis section */}
      {activeSection === 'crisis' && (
        <div className="space-y-3">
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3">
            <p className="text-red-300 text-sm font-semibold">If you are in immediate danger, call 911.</p>
          </div>
          {HOTLINES.map((h, i) => (
            <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{h.emoji}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{h.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{h.desc}</p>
                </div>
              </div>
              {h.isText ? (
                <div className="bg-gray-800 rounded-xl px-4 py-2.5 text-center">
                  <p className="text-white font-bold text-sm">{h.number}</p>
                </div>
              ) : (
                <a
                  href={`tel:${h.number.replace(/\D/g, '')}`}
                  className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white rounded-xl px-4 py-2.5 font-semibold text-sm transition-all w-full"
                >
                  <Phone className="w-4 h-4" /> {h.number}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSection === 'treatment' && <TreatmentFinder />}
      {activeSection === 'meetings' && <MeetingFinder />}
      {activeSection === 'articles' && <RecoveryArticles />}
      {activeSection === 'twelve' && <TwelveStepResources />}
    </div>
  );
}
