import React, { useState } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const reset = (newMode) => {
    setMode(newMode);
    setError('');
    setMessage('');
    setPassword('');
    setConfirm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (password !== confirm) { setError('Passwords do not match.'); return; }

        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;

        if (data.session) {
          // Email verification disabled — signed in immediately
          onAuth(data.session, 'signup');
        } else {
          // Email verification required
          setMessage('Account created! Check your email to verify, then sign in.');
          reset('signin');
        }

      } else if (mode === 'signin') {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onAuth(data.session, 'signin');

      } else if (mode === 'reset') {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (err) throw err;
        setMessage('Reset link sent! Check your email inbox.');
      }
    } catch (err) {
      const msg = err?.message || 'Something went wrong. Please try again.';
      if (msg.includes('Invalid login')) setError('Incorrect email or password.');
      else if (msg.includes('already registered')) setError('An account with this email already exists. Sign in instead.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
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
          <p className="text-gray-400 text-sm mt-1">Your recovery, your journey</p>
        </div>

        {mode === 'reset' ? (
          /* ── Forgot Password ──────────────────────── */
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <button onClick={() => reset('signin')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </button>
            <h2 className="text-white font-bold text-lg mb-1">Reset your password</h2>
            <p className="text-gray-400 text-sm mb-5">Enter your email and we'll send a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email address" required autoComplete="email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              {error && <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</p>}
              {message && <p className="text-emerald-400 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" />{message}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-all">
                {loading ? 'Sending…' : 'Send Reset Email'}
              </button>
            </form>
          </div>

        ) : (
          /* ── Sign In / Sign Up ────────────────────── */
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            {/* Mode toggle */}
            <div className="flex border-b border-gray-800">
              {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([m, label]) => (
                <button key={m} onClick={() => reset(m)}
                  className={`flex-1 py-4 text-sm font-semibold transition-all ${
                    mode === m
                      ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoComplete="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-400 text-xs font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                    required autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-11 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPw ? 'text' : 'password'} value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat your password" required autoComplete="new-password"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Errors / Messages */}
              {error && (
                <div className="flex items-start gap-2 bg-red-900/30 border border-red-700/40 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              {message && (
                <div className="flex items-start gap-2 bg-emerald-900/30 border border-emerald-700/40 rounded-xl px-3 py-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-300 text-sm">{message}</p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading || !email || !password}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all">
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {mode === 'signup' ? 'Creating account…' : 'Signing in…'}</span>
                  : mode === 'signup' ? 'Create Account' : 'Sign In'
                }
              </button>

              {/* Forgot password */}
              {mode === 'signin' && (
                <button type="button" onClick={() => reset('reset')}
                  className="w-full text-center text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Forgot your password?
                </button>
              )}
            </form>
          </div>
        )}

        <p className="text-gray-600 text-xs text-center mt-6">
          Your data is encrypted and only accessible to you.
        </p>
      </div>
    </div>
  );
}
