import React from 'react';
import { Home, BarChart2, Wrench, Users, BookOpen } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'tracker', label: 'Tracker', Icon: BarChart2 },
  { id: 'tools', label: 'Tools', Icon: Wrench },
  { id: 'community', label: 'Community', Icon: Users },
  { id: 'resources', label: 'Resources', Icon: BookOpen },
];

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${active ? 'text-emerald-400' : 'text-gray-500'}`}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`text-xs font-medium transition-colors ${active ? 'text-emerald-400' : 'text-gray-500'}`}>
                {label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
