import React, { useState, useEffect, useRef } from 'react';
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

const STORAGE_KEY = 'recoverwell_v1';

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1825];

function getDays(sobrietyDate) {
  return Math.floor(Math.max(0, Date.now() - new Date(sobrietyDate).getTime()) / 86400000);
}

export default function App() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiMsg, setConfettiMsg] = useState('');
  const notifChecked = useRef(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setUserData(JSON.parse(saved)); }
      catch { localStorage.removeItem(STORAGE_KEY); }
    }
  }, []);

  // Light mode class on root
  useEffect(() => {
    document.documentElement.classList.toggle('light', !!userData?.lightMode);
  }, [userData?.lightMode]);

  // Milestone detection
  useEffect(() => {
    if (!userData?.sobrietyDate) return;
    const days = getDays(userData.sobrietyDate);
    const lastMilestone = userData.lastMilestoneDays || 0;
    const newlyEarned = MILESTONES.filter(m => m <= days && m > lastMilestone);
    if (newlyEarned.length > 0) {
      const best = Math.max(...newlyEarned);
      const label = { 1:'24 Hours',3:'3 Days',7:'1 Week',14:'2 Weeks',30:'1 Month',60:'2 Months',90:'3 Months',180:'6 Months',365:'1 Year',730:'2 Years',1825:'5 Years' }[best];
      setConfettiMsg(`${label} Milestone!`);
      setShowConfetti(true);
      saveUserData({ lastMilestoneDays: best });
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [userData?.sobrietyDate, userData?.lastMilestoneDays]);

  // Daily notification reminder
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
          new Notification('RecoverWell', {
            body: "Time for your daily check-in. How are you feeling today?",
            icon: '/icon.svg',
          });
        }
        setTimeout(() => { notifChecked.current = false; }, 70000);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [userData?.reminderEnabled, userData?.reminderTime, userData?.moodLog]);

  const saveUserData = (data) => {
    setUserData(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSetupComplete = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUserData(data);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserData(null);
    setShowSettings(false);
  };

  if (!userData) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard userData={userData} onNavigate={setActiveTab} onUpdateUser={saveUserData} onOpenSettings={() => setShowSettings(true)} />;
      case 'tracker':
        return <Tracker userData={userData} onUpdateUser={saveUserData} />;
      case 'tools':
        return <Tools userData={userData} onUpdateUser={saveUserData} />;
      case 'community':
        return <Community userData={userData} onUpdateUser={saveUserData} />;
      case 'resources':
        return <Resources />;
      default:
        return <Dashboard userData={userData} onNavigate={setActiveTab} onUpdateUser={saveUserData} onOpenSettings={() => setShowSettings(true)} />;
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

      {/* Floating SOS button */}
      <SOSButton />

      {/* Confetti + milestone toast */}
      <Confetti show={showConfetti} />
      {showConfetti && (
        <div style={{
          position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9998, backgroundColor: '#10b981', color: 'white',
          padding: '12px 24px', borderRadius: '999px', fontWeight: 700,
          fontSize: '15px', boxShadow: '0 4px 20px rgba(16,185,129,0.5)',
          animation: 'fade-in 0.3s ease-out',
          whiteSpace: 'nowrap',
        }}>
          🎉 {confettiMsg}
        </div>
      )}

      {/* Settings overlay */}
      {showSettings && (
        <Settings
          userData={userData}
          onUpdateUser={saveUserData}
          onClose={() => setShowSettings(false)}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
