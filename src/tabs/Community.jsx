import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Flame, UserCircle, Clock, Plus, X } from 'lucide-react';

const SEED_POSTS = [
  {
    id: 'seed1',
    author: 'Jamie R.',
    avatar: 'J',
    time: '2h ago',
    content: 'Hit 90 days today. Three months ago I couldn\'t imagine getting here. One day at a time really works. Thank you all for the support.',
    likes: 47,
    comments: 8,
    tag: 'milestone',
    isSeeded: true,
  },
  {
    id: 'seed2',
    author: 'Marcus T.',
    avatar: 'M',
    time: '5h ago',
    content: 'Had a really tough craving this afternoon. Used the breathing exercise and called my sponsor. Stayed sober. Small wins count.',
    likes: 32,
    comments: 12,
    tag: 'victory',
    isSeeded: true,
  },
  {
    id: 'seed3',
    author: 'Sarah K.',
    avatar: 'S',
    time: '1d ago',
    content: 'For anyone in early recovery feeling like it\'s impossible — I\'m at 2 years now. The first 30 days were the hardest thing I\'ve ever done. But I promise it gets easier. Keep going.',
    likes: 91,
    comments: 24,
    tag: 'support',
    isSeeded: true,
  },
  {
    id: 'seed4',
    author: 'Devon L.',
    avatar: 'D',
    time: '2d ago',
    content: 'First NA meeting today. I was terrified to walk in. By the end I was sharing. Everyone was so welcoming. If you\'re on the fence about going to a meeting — just go.',
    likes: 58,
    comments: 16,
    tag: 'inspiration',
    isSeeded: true,
  },
  {
    id: 'seed5',
    author: 'Priya M.',
    avatar: 'P',
    time: '3d ago',
    content: 'Gratitude list for today: 1. Woke up clear-headed. 2. Made coffee and actually tasted it. 3. My daughter hugged me and said I seem happy. Sobriety gives these moments back.',
    likes: 74,
    comments: 19,
    tag: 'gratitude',
    isSeeded: true,
  },
];

const POST_TAGS = [
  { id: 'milestone', label: 'Milestone', color: 'emerald' },
  { id: 'victory', label: 'Victory', color: 'blue' },
  { id: 'support', label: 'Support', color: 'purple' },
  { id: 'inspiration', label: 'Inspiration', color: 'yellow' },
  { id: 'gratitude', label: 'Gratitude', color: 'pink' },
  { id: 'struggle', label: 'Struggling', color: 'red' },
];

const TAG_COLORS = {
  emerald: 'bg-emerald-500/20 text-emerald-400',
  blue: 'bg-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/20 text-purple-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  pink: 'bg-pink-500/20 text-pink-400',
  red: 'bg-red-500/20 text-red-400',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function Community({ userData, onUpdateUser }) {
  const [composing, setComposing] = useState(false);
  const [postText, setPostText] = useState('');
  const [postTag, setPostTag] = useState('victory');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [burningDesire, setBurningDesire] = useState(false);
  const [filterTag, setFilterTag] = useState(null);

  const userPosts = userData.communityPosts || [];
  const allPosts = [...userPosts, ...SEED_POSTS].sort((a, b) => {
    if (a.isSeeded && !b.isSeeded) return 1;
    if (!a.isSeeded && b.isSeeded) return -1;
    return 0;
  });

  const filteredPosts = filterTag ? allPosts.filter(p => p.tag === filterTag) : allPosts;

  const submitPost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      author: userData.name || 'Anonymous',
      avatar: (userData.name || 'A')[0].toUpperCase(),
      time: new Date().toISOString(),
      content: postText.trim(),
      likes: 0,
      comments: 0,
      tag: postTag,
      isSeeded: false,
    };
    const posts = [newPost, ...userPosts];
    onUpdateUser({ communityPosts: posts });
    setPostText('');
    setComposing(false);
  };

  const toggleLike = (id) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Community</h1>
          <p className="text-gray-400 text-sm">You are not alone in this journey</p>
        </div>
        <button
          onClick={() => setComposing(true)}
          className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-all"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Burning desire button */}
      <button
        onClick={() => setBurningDesire(true)}
        className="w-full flex items-center gap-3 bg-red-900/40 border border-red-700/50 rounded-xl px-4 py-3 hover:bg-red-900/60 transition-all"
      >
        <Flame className="w-5 h-5 text-red-400" />
        <div className="text-left">
          <p className="text-red-300 font-semibold text-sm">Burning Desire</p>
          <p className="text-gray-400 text-xs">I need urgent support right now</p>
        </div>
      </button>

      {burningDesire && (
        <div className="bg-red-900/40 border border-red-600/50 rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between">
            <p className="text-red-300 font-semibold">You are not alone.</p>
            <button onClick={() => setBurningDesire(false)} className="text-gray-500 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            This community sees you. Take a breath. Here are immediate options:
          </p>
          <div className="space-y-2">
            <a href="tel:988" className="flex items-center gap-3 bg-red-800/50 rounded-xl p-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-white text-sm font-semibold">Call 988 Now</p>
                <p className="text-gray-400 text-xs">Suicide & Crisis Lifeline — Free, 24/7</p>
              </div>
            </a>
            <a href="tel:18004874889" className="flex items-center gap-3 bg-red-800/50 rounded-xl p-3">
              <span className="text-xl">🆘</span>
              <div>
                <p className="text-white text-sm font-semibold">SAMHSA Helpline</p>
                <p className="text-gray-400 text-xs">1-800-662-4357 — Free, 24/7</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Compose post */}
      {composing && (
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold text-sm">Share with the community</p>
            <button onClick={() => setComposing(false)} className="text-gray-500 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={postText}
            onChange={e => setPostText(e.target.value)}
            placeholder="Share your story, a victory, or offer support..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500 resize-none"
            rows={4}
            autoFocus
          />
          <div>
            <p className="text-gray-400 text-xs mb-2">Tag your post:</p>
            <div className="flex flex-wrap gap-2">
              {POST_TAGS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setPostTag(t.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    postTag === t.id ? TAG_COLORS[t.color] : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={submitPost}
            disabled={!postText.trim()}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              postText.trim() ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" /> Share
          </button>
        </div>
      )}

      {/* Filter tags */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterTag(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all ${
            !filterTag ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          All
        </button>
        {POST_TAGS.map(t => (
          <button
            key={t.id}
            onClick={() => setFilterTag(filterTag === t.id ? null : t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all ${
              filterTag === t.id ? TAG_COLORS[t.color] : 'bg-gray-800 text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Posts feed */}
      <div className="space-y-3">
        {filteredPosts.map(post => {
          const tagInfo = POST_TAGS.find(t => t.id === post.tag);
          const liked = likedPosts.has(post.id);
          return (
            <div key={post.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {post.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{post.author}</p>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <p className="text-gray-500 text-xs">{post.isSeeded ? post.time : timeAgo(post.time)}</p>
                    </div>
                  </div>
                </div>
                {tagInfo && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[tagInfo.color]}`}>
                    {tagInfo.label}
                  </span>
                )}
              </div>

              <p className="text-gray-200 text-sm leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                >
                  <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
                  <span>{post.likes + (liked ? 1 : 0)}</span>
                </button>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No posts yet. Be the first to share!</p>
        </div>
      )}
    </div>
  );
}
