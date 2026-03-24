import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, Plus, Star, X, Copy, Check } from 'lucide-react';

const DEFAULT_AFFIRMATIONS = [
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
  "Your strength inspires others more than you know.",
  "Every craving you resist makes you stronger.",
  "You are capable of amazing things.",
  "This too shall pass.",
  "You've survived 100% of your worst days.",
  "Your life is worth fighting for.",
  "Small steps every day lead to big changes.",
  "You are enough, exactly as you are.",
  "Choose progress over perfection.",
  "You are creating the life you deserve.",
  "Every day you choose recovery is a day you choose yourself.",
  "Your courage doesn't always roar. Sometimes it's the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
  "Recovery is giving yourself permission to be human.",
  "You are not your past. You are the present and the possibility of your future.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "You don't have to see the whole staircase, just take the first step.",
  "Rock bottom became the solid foundation on which I rebuilt my life.",
  "Fall seven times, stand up eight.",
  "It does not matter how slowly you go as long as you do not stop.",
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "The only impossible journey is the one you never begin.",
  "Your addiction is not your identity.",
  "You matter. Your recovery matters. Your life matters.",
  "Setbacks are setups for comebacks.",
  "You've got this. And even on days when you don't feel like you do, you still do.",
];

export default function Affirmations({ userData, onUpdateUser }) {
  const [current, setCurrent] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [copied, setCopied] = useState(false);

  const customAffirmations = userData.customAffirmations || [];
  const favoriteAffirmations = userData.favoriteAffirmations || [];
  const allAffirmations = [...DEFAULT_AFFIRMATIONS, ...customAffirmations];

  useEffect(() => {
    // Set daily affirmation (same one for the whole day)
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem('daily_affirmation');
    const savedDate = localStorage.getItem('daily_affirmation_date');

    if (savedDate === today && savedDaily) {
      setCurrent(savedDaily);
    } else {
      const random = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
      setCurrent(random);
      localStorage.setItem('daily_affirmation', random);
      localStorage.setItem('daily_affirmation_date', today);
    }
  }, []);

  const getNewAffirmation = () => {
    let random;
    do {
      random = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
    } while (random === current && allAffirmations.length > 1);
    setCurrent(random);
  };

  const toggleFavorite = (affirmation) => {
    const isFav = favoriteAffirmations.includes(affirmation);
    const updated = isFav
      ? favoriteAffirmations.filter(a => a !== affirmation)
      : [...favoriteAffirmations, affirmation];
    onUpdateUser({ favoriteAffirmations: updated });
  };

  const addCustom = () => {
    if (newAffirmation.trim()) {
      onUpdateUser({
        customAffirmations: [...customAffirmations, newAffirmation.trim()]
      });
      setCurrent(newAffirmation.trim());
      setNewAffirmation('');
      setShowAdd(false);
    }
  };

  const deleteCustom = (affirmation) => {
    onUpdateUser({
      customAffirmations: customAffirmations.filter(a => a !== affirmation)
    });
    if (current === affirmation) {
      getNewAffirmation();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(current);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFavorite = favoriteAffirmations.includes(current);

  return (
    <div className="p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Daily Affirmations</h1>
        <p className="text-gray-400 text-sm">Words of strength for your journey</p>
      </div>

      {/* Main Affirmation Card */}
      <div className="bg-gradient-to-br from-emerald-900/40 to-blue-900/40 border border-emerald-700/30 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleFavorite(current)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                isFavorite ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={copyToClipboard}
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <p className="text-white text-lg leading-relaxed mb-6">{current}</p>

        <button
          onClick={getNewAffirmation}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Get Another Affirmation
        </button>
      </div>

      {/* Add Custom */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 mb-4"
      >
        <Plus className="w-4 h-4" />
        Add Your Own Affirmation
      </button>

      {showAdd && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
          <textarea
            value={newAffirmation}
            onChange={e => setNewAffirmation(e.target.value)}
            placeholder="Write your personal affirmation..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 min-h-[100px] resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={addCustom}
              disabled={!newAffirmation.trim()}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-semibold disabled:opacity-50"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAdd(false);
                setNewAffirmation('');
              }}
              className="px-6 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Favorites */}
      {favoriteAffirmations.length > 0 && (
        <div className="mb-4">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            Your Favorites
          </h3>
          <div className="space-y-2">
            {favoriteAffirmations.map((aff, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-start justify-between gap-3 group"
              >
                <p className="text-gray-300 text-sm flex-1">{aff}</p>
                <button
                  onClick={() => setCurrent(aff)}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-medium whitespace-nowrap"
                >
                  Show
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Affirmations */}
      {customAffirmations.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Your Custom Affirmations</h3>
          <div className="space-y-2">
            {customAffirmations.map((aff, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-start justify-between gap-3"
              >
                <p className="text-gray-300 text-sm flex-1">{aff}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrent(aff)}
                    className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
                  >
                    Show
                  </button>
                  <button
                    onClick={() => deleteCustom(aff)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-xs text-center">
          Affirmations can rewire your brain and strengthen your recovery. Read them daily, say them out loud, and believe in them.
        </p>
      </div>
    </div>
  );
}
