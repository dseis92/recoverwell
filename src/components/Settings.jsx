import React, { useState, useEffect } from 'react';
import { X, User, Phone, Bell, Sun, Moon, AlertTriangle, Check, ChevronRight, LogOut, Mail } from 'lucide-react';
import { subscribeToPush, unsubscribeFromPush, getPushSubscription } from '../lib/supabase';

const SUBSTANCES = [
  'Alcohol', 'Opioids', 'Stimulants (cocaine, meth)', 'Cannabis',
  'Benzodiazepines', 'Nicotine', 'Gambling', 'Multiple substances', 'Other',
];

export default function Settings({ userData, onUpdateUser, onClose, onReset, onSignOut, userEmail, userId }) {
  const [section, setSection] = useState(null);
  const [form, setForm] = useState({
    name: userData.name || '',
    substance: userData.substance || '',
    sobrietyDate: userData.sobrietyDate ? new Date(userData.sobrietyDate).toISOString().split('T')[0] : '',
    sobrietyTime: userData.sobrietyDate
      ? `${String(new Date(userData.sobrietyDate).getHours()).padStart(2,'0')}:${String(new Date(userData.sobrietyDate).getMinutes()).padStart(2,'0')}`
      : '00:00',
    dailyCost: userData.dailyCost || '20',
    sponsorName: userData.sponsorName || '',
    sponsorPhone: userData.sponsorPhone || '',
    emergencyName: userData.emergencyName || '',
    emergencyPhone: userData.emergencyPhone || '',
    reminderEnabled: userData.reminderEnabled || false,
    reminderTime: userData.reminderTime || '09:00',
    lightMode: userData.lightMode || false,
  });
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState('');

  useEffect(() => {
    getPushSubscription().then(sub => setPushSubscribed(!!sub));
  }, []);

  const save = (updates) => {
    const merged = { ...form, ...updates };
    setForm(merged);
    const sobrietyDateTime = new Date(`${merged.sobrietyDate}T${merged.sobrietyTime}:00`).toISOString();
    onUpdateUser({
      name: merged.name,
      substance: merged.substance,
      sobrietyDate: sobrietyDateTime,
      dailyCost: merged.dailyCost,
      sponsorName: merged.sponsorName,
      sponsorPhone: merged.sponsorPhone,
      emergencyName: merged.emergencyName,
      emergencyPhone: merged.emergencyPhone,
      reminderEnabled: merged.reminderEnabled,
      reminderTime: merged.reminderTime,
      lightMode: merged.lightMode,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const requestNotifications = async () => {
    if (typeof Notification === 'undefined') return;
    const perm = await Notification.requestPermission();
    setNotifStatus(perm);
    if (perm === 'granted') {
      save({ reminderEnabled: true });
      new Notification('RecoverWell', {
        body: 'Daily reminders are now enabled!',
        icon: '/icon.svg',
      });
    }
  };

  const SECTIONS = [
    { id: 'profile', label: 'Profile & Sobriety', icon: User, color: '#10b981' },
    { id: 'sponsor', label: 'Sponsor & Emergency Contact', icon: Phone, color: '#3b82f6' },
    { id: 'notifications', label: 'Daily Reminder', icon: Bell, color: '#f59e0b' },
    { id: 'appearance', label: 'Appearance', icon: Sun, color: '#8b5cf6' },
    { id: 'danger', label: 'Reset Data', icon: AlertTriangle, color: '#ef4444' },
  ];

  const [signOutConfirm, setSignOutConfirm] = useState(false);

  const renderSection = () => {
    switch (section) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Your Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Substance</label>
              <div className="space-y-1.5">
                {SUBSTANCES.map(s => (
                  <button
                    key={s}
                    onClick={() => setForm(f => ({ ...f, substance: s }))}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
                      form.substance === s
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-gray-700 bg-gray-800 text-gray-300'
                    }`}
                  >
                    {s}
                    {form.substance === s && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Sobriety Date</label>
              <input
                type="date"
                value={form.sobrietyDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, sobrietyDate: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Sobriety Time</label>
              <input
                type="time"
                value={form.sobrietyTime}
                onChange={e => setForm(f => ({ ...f, sobrietyTime: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Daily Cost ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={form.dailyCost}
                  min="0"
                  onChange={e => setForm(f => ({ ...f, dailyCost: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <button onClick={() => save({})} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold">
              {saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>
        );

      case 'sponsor':
        return (
          <div className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3">
              <p className="text-blue-300 text-xs">Your sponsor and emergency contact are stored privately on this device only.</p>
            </div>
            <p className="text-white font-semibold text-sm">Sponsor</p>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Sponsor Name</label>
              <input
                value={form.sponsorName}
                onChange={e => setForm(f => ({ ...f, sponsorName: e.target.value }))}
                placeholder="e.g. John"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">Sponsor Phone</label>
              <input
                type="tel"
                value={form.sponsorPhone}
                onChange={e => setForm(f => ({ ...f, sponsorPhone: e.target.value }))}
                placeholder="e.g. 555-0123"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="border-t border-gray-800 pt-4">
              <p className="text-white font-semibold text-sm mb-3">Emergency Contact</p>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">Name</label>
                  <input
                    value={form.emergencyName}
                    onChange={e => setForm(f => ({ ...f, emergencyName: e.target.value }))}
                    placeholder="e.g. Mom"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs font-medium mb-1.5 block">Phone</label>
                  <input
                    type="tel"
                    value={form.emergencyPhone}
                    onChange={e => setForm(f => ({ ...f, emergencyPhone: e.target.value }))}
                    placeholder="e.g. 555-4567"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <button onClick={() => save({})} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              {saved ? '✓ Saved' : 'Save Contacts'}
            </button>
          </div>
        );

      case 'notifications': {
        const pushSupported = 'serviceWorker' in navigator && 'PushManager' in window;

        const handleSubscribe = async () => {
          setPushLoading(true);
          setPushError('');
          try {
            await subscribeToPush(userId);
            setPushSubscribed(true);
            setNotifStatus('granted');
            save({ reminderEnabled: true });
          } catch (err) {
            setPushError(err.message || 'Could not enable notifications.');
          } finally {
            setPushLoading(false);
          }
        };

        const handleUnsubscribe = async () => {
          setPushLoading(true);
          try {
            await unsubscribeFromPush(userId);
            setPushSubscribed(false);
            save({ reminderEnabled: false });
          } catch {}
          finally { setPushLoading(false); }
        };

        return (
          <div className="space-y-4">
            {/* Status card */}
            <div className={`rounded-xl border p-4 flex items-center gap-3 ${
              pushSubscribed ? 'bg-emerald-900/20 border-emerald-700/40' : 'bg-gray-900 border-gray-800'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${pushSubscribed ? 'bg-emerald-500/20' : 'bg-gray-800'}`}>
                <Bell className={`w-5 h-5 ${pushSubscribed ? 'text-emerald-400' : 'text-gray-500'}`} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  {pushSubscribed ? 'Push Notifications Active' : 'Push Notifications Off'}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {pushSubscribed ? 'You\'ll get reminders even when the app is closed' : 'Enable to get daily reminders in the background'}
                </p>
              </div>
            </div>

            {!pushSupported && (
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-3">
                <p className="text-yellow-300 text-xs">Push notifications are not supported in this browser. Try Chrome, Edge, or Firefox.</p>
              </div>
            )}

            {pushError && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3">
                <p className="text-red-300 text-xs">{pushError}</p>
                {notifStatus === 'denied' && (
                  <p className="text-gray-500 text-xs mt-1">Go to browser settings → Site permissions → Notifications → Allow for this site.</p>
                )}
              </div>
            )}

            {pushSupported && (
              pushSubscribed ? (
                <button
                  onClick={handleUnsubscribe}
                  disabled={pushLoading}
                  className="w-full border border-gray-700 text-gray-300 hover:bg-gray-800 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                >
                  {pushLoading ? 'Disabling…' : 'Disable Push Notifications'}
                </button>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={pushLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                >
                  {pushLoading ? 'Enabling…' : 'Enable Push Notifications'}
                </button>
              )
            )}

            {/* Reminder time (when push is active) */}
            {pushSubscribed && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">Daily Reminder</p>
                    <p className="text-gray-400 text-xs mt-0.5">What time should we remind you?</p>
                  </div>
                  <button
                    onClick={() => save({ reminderEnabled: !form.reminderEnabled })}
                    className={`w-12 h-6 rounded-full relative transition-all ${form.reminderEnabled ? 'bg-emerald-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.reminderEnabled ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
                {form.reminderEnabled && (
                  <input
                    type="time"
                    value={form.reminderTime}
                    onChange={e => save({ reminderTime: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                )}
              </div>
            )}

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-3">
              <p className="text-gray-500 text-xs">Reminders are sent by our server — they arrive even when RecoverWell is closed. Your reminder time is matched in UTC.</p>
            </div>
          </div>
        );
      }

      case 'appearance':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {form.lightMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
                  <div>
                    <p className="text-white font-medium text-sm">{form.lightMode ? 'Light Mode' : 'Dark Mode'}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Toggle app theme</p>
                  </div>
                </div>
                <button
                  onClick={() => save({ lightMode: !form.lightMode })}
                  className={`w-12 h-6 rounded-full relative transition-all ${form.lightMode ? 'bg-yellow-400' : 'bg-blue-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.lightMode ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'danger':
        return (
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
              <p className="text-red-400 font-semibold text-sm mb-1">Danger Zone</p>
              <p className="text-gray-400 text-sm">Resetting will permanently delete all your sobriety data, mood logs, journal entries, and progress. This cannot be undone.</p>
            </div>
            {!resetConfirm ? (
              <button
                onClick={() => setResetConfirm(true)}
                className="w-full border border-red-700/60 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-900/30 transition-all"
              >
                Reset All Data
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-white text-sm text-center font-semibold">Are you absolutely sure?</p>
                <button
                  onClick={onReset}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="w-full bg-gray-800 text-gray-300 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'flex-end',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md mx-auto bg-gray-950 rounded-t-2xl"
        style={{ maxHeight: '90vh', overflowY: 'auto', animation: 'slide-up 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-800">
          {section ? (
            <button onClick={() => setSection(null)} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
              ← Back
            </button>
          ) : (
            <h2 className="text-white font-bold text-lg">Settings</h2>
          )}
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="px-5 py-4">
          {!section ? (
            <div className="space-y-2">
              {/* Account info */}
              {userEmail && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs">Signed in as</p>
                    <p className="text-white text-sm font-medium truncate">{userEmail}</p>
                  </div>
                </div>
              )}

              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    s.id === 'danger'
                      ? 'border-red-900/40 bg-red-900/10 hover:bg-red-900/20'
                      : 'border-gray-800 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: s.color + '22' }}
                  >
                    <s.icon style={{ width: '18px', height: '18px', color: s.color }} />
                  </div>
                  <span className={`flex-1 font-medium text-sm ${s.id === 'danger' ? 'text-red-400' : 'text-white'}`}>
                    {s.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              ))}
              {/* Sign out */}
              {onSignOut && (
                <div className="pt-2 border-t border-gray-800 mt-2">
                  {!signOutConfirm ? (
                    <button
                      onClick={() => setSignOutConfirm(true)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900 hover:bg-gray-800 transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                        <LogOut className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-300 font-medium text-sm">Sign Out</span>
                    </button>
                  ) : (
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
                      <p className="text-white text-sm font-semibold">Sign out of RecoverWell?</p>
                      <p className="text-gray-400 text-xs">Your data is safely stored in the cloud.</p>
                      <div className="flex gap-2">
                        <button onClick={onSignOut} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl text-sm font-semibold">
                          Sign Out
                        </button>
                        <button onClick={() => setSignOutConfirm(false)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold">
                          Stay
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <h3 className="text-white font-bold mb-4">
                {SECTIONS.find(s => s.id === section)?.label}
              </h3>
              {renderSection()}
            </>
          )}
        </div>
        <div className="h-8" />
      </div>
    </div>
  );
}
