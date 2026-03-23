import React, { useState, useEffect } from 'react';
import Setup from './components/Setup';
import Navigation from './components/Navigation';
import Dashboard from './tabs/Dashboard';
import Tracker from './tabs/Tracker';
import Tools from './tabs/Tools';
import Community from './tabs/Community';
import Resources from './tabs/Resources';

const STORAGE_KEY = 'recoverwell_v1';

function App() {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUserData(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveUserData = (data) => {
    const updated = { ...userData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUserData(updated);
  };

  const handleSetupComplete = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUserData(data);
  };

  if (!userData) {
    return <Setup onComplete={handleSetupComplete} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard userData={userData} onNavigate={setActiveTab} onUpdateUser={saveUserData} />;
      case 'tracker':
        return <Tracker userData={userData} onUpdateUser={saveUserData} />;
      case 'tools':
        return <Tools userData={userData} onUpdateUser={saveUserData} />;
      case 'community':
        return <Community userData={userData} onUpdateUser={saveUserData} />;
      case 'resources':
        return <Resources />;
      default:
        return <Dashboard userData={userData} onNavigate={setActiveTab} onUpdateUser={saveUserData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen relative flex flex-col">
        <div className="flex-1 pb-20 tab-content">
          {renderTab()}
        </div>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;
