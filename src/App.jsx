import React, { useState, useEffect, useRef } from 'react';
import { supabase, loadProfile, saveProfile, signOut } from './lib/supabase';
import Auth from './components/Auth';
import Setup from './components/Setup';
import Navigation from './components/Navigation';
import Settings from './components/Settings';
import Confetti from './components/Confetti';
import SOSButton from './components/SOSButton';
import Dashboard from './tabs/Dashboard';
import Tracker from './tabs/Tracker';
import Tools from './tabs/Tools';
import Community from './tabs/Community';
import Resources from './tabs/Resources';

const LOCAL_KEY = 'recoverwell_v1';
const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1825];

function getDays(sobrietyDate) {
  return Math.floor(Math.max(0, Date.now() - new Date(sobrietyDate).getTime()) / 86400000);
}

// Sync status dot shown in header area
function SyncDot({ status }) {
  const colors = { synced: 'bg-emerald-500', syncing: 'bg-yellow-400 animate-pulse', error: 'bg-red-500', offline: 'bg-gray-500' };
  const labels = { synced: 'Synced', syncing: 'Saving…', error: 'Sync error', offline: 'Offline' };
  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 bg-gray-900/80 backdrop-blur rounded-full px-2.5 py-1 border border-gray-700/50">
      <div className={`w-1.5 h-1.5 rounded-full ${colors[status]}`} />
      <span className="text-gray-400 text-xs">{labels[status]}</span>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = no session
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiMsg, setConfettiMsg] = useState('');
  const [syncStatus, setSyncStatus] = useState('synced');
  const notifChecked = useRef(false);

  // ── Auth: listen for session changes ───────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      if (!s) { setUserData(null); }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load profile when session appears ──────────────────
  useEffect(() => {
    if (!session) return;
    (async () => {
      setSyncStatus('syncing');
      let profile = await loadProfile(session.user.id);

      // Migration: if no cloud profile but localStorage has data, migrate it
      if (!profile) {
        const local = localStorage.getItem(LOCAL_KEY);
        if (local) {
          try { profile = JSON.parse(local); } catch { /* ignore */ }
        }
      }

      if (profile) {
        setUserData(profile);
        // Ensure cloud is up to date
        await saveProfile(session.user.id, profile);
      }
      setSyncStatus('synced');
    })();
  }, [session?.user?.id]);

  // ── Light mode class ───────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('light', !!userData?.lightMode);
  }, [userData?.lightMode]);

  // ── Milestone detection ────────────────────────────────
  useEffect(() => {
    if (!userData?.sobrietyDate) return;
    const days = getDays(userData.sobrietyDate);
    const lastMilestone = userData.lastMilestoneDays || 0;
    const newlyEarned = MILESTONES.filter(m => m <= days && m > lastMilestone);
    if (newlyEarned.length > 0) {
      const best = Math.max(...newlyEarned);
      const labels = { 1:'24 Hours',3:'3 Days',7:'1 Week',14:'2 Weeks',30:'1 Month',60:'2 Months',90:'3 Months',180:'6 Months',365:'1 Year',730:'2 Years',1825:'5 Years' };
      setConfettiMsg(`${labels[best]} Milestone!`);
      setShowConfetti(true);
      saveUserData({ lastMilestoneDays: best });
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [userData?.sobrietyDate, userData?.lastMilestoneDays]);

  // ── Daily notification reminder ────────────────────────
  useEffect(() => {
    if (!userData?.reminderEnabled || !userData?.reminderTime) return;
    const interval = setInterval(() => {
      if (notifChecked.current) return;
      const now = new Date();
      const [h, m] = userData.reminderTime.split(':').map(Number);
      if (now.getHours() === h && now.getMinutes() === m) {
        notifChecked.current = true;
        const today = now.toDateString();
        const hasLoggedToday = userData.moodLog?.some(e => new Date(e.date).toDateString() === today);
        if (!hasLoggedToday && Notification?.permission === 'granted') {
          new Notification('RecoverWell', { body: 'Time for your daily check-in. How are you feeling today?', icon: '/icon.svg' });
        }
        setTimeout(() => { notifChecked.current = false; }, 70000);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [userData?.reminderEnabled, userData?.reminderTime, userData?.moodLog]);

  // ── Save data: local + cloud ───────────────────────────
  const saveUserData = (updates) => {
    setUserData(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      if (session) {
        setSyncStatus('syncing');
        saveProfile(session.user.id, updated).then(ok => {
          setSyncStatus(ok ? 'synced' : 'error');
          if (!ok) setTimeout(() => setSyncStatus('synced'), 3000);
        });
      }
      return updated;
    });
  };

  const handleAuth = async (newSession, type) => {
    setSession(newSession);
    // Profile loading is handled by the session useEffect above
  };

  const handleSetupComplete = async (data) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    setUserData(data);
    if (session) {
      setSyncStatus('syncing');
      const ok = await saveProfile(session.user.id, data);
      setSyncStatus(ok ? 'synced' : 'error');
    }
  };

  const handleSignOut = async () => {
    setShowSettings(false);
    await signOut();
    setUserData(null);
    setSession(null);
  };

  const handleReset = async () => {
    if (session) await saveProfile(session.user.id, {});
    localStorage.removeItem(LOCAL_KEY);
    setUserData(null);
    setShowSettings(false);
  };

  // ── Loading state ──────────────────────────────────────
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading RecoverWell…</p>
        </div>
      </div>
    );
  }

  // ── No session → Auth screen ───────────────────────────
  if (!session) {
    return <Auth onAuth={handleAuth} />;
  }

  // ── Authenticated but no profile → Setup ───────────────
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  // ── Profile exists but setup not complete ──────────────
  if (!userData.sobrietyDate) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home':      return <Dashboard userData={userData} onNavigate={setActiveTab} onUpdateUser={saveUserData} onOpenSettings={() => setShowSettings(true)} />;
      case 'tracker':   return <Tracker userData={userData} onUpdateUser={saveUserData} />;
      case 'tools':     return <Tools userData={userData} onUpdateUser={saveUserData} />;
      case 'community': return <Community userData={userData} onUpdateUser={saveUserData} />;
      case 'resources': return <Resources />;
      default:          return <Dashboard userData={userData} onNavigate={setActiveTab} onUpdateUser={saveUserData} onOpenSettings={() => setShowSettings(true)} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-950 text-white flex flex-col items-center${userData.lightMode ? ' light' : ''}`}>
      <div className="w-full max-w-md min-h-screen relative flex flex-col">
        <div className="flex-1 pb-20 tab-content" key={activeTab}>
          {renderTab()}
        </div>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <SyncDot status={syncStatus} />
      <SOSButton />
      <Confetti show={showConfetti} />

      {showConfetti && (
        <div style={{
          position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9998, backgroundColor: '#10b981', color: 'white',
          padding: '12px 24px', borderRadius: '999px', fontWeight: 700,
          fontSize: '15px', boxShadow: '0 4px 20px rgba(16,185,129,0.5)',
          animation: 'fade-in 0.3s ease-out', whiteSpace: 'nowrap',
        }}>
          {confettiMsg}
        </div>
      )}

      {showSettings && (
        <Settings
          userData={userData}
          onUpdateUser={saveUserData}
          onClose={() => setShowSettings(false)}
          onReset={handleReset}
          onSignOut={handleSignOut}
          userEmail={session.user.email}
          userId={session.user.id}
        />
      )}
    </div>
  );
}
