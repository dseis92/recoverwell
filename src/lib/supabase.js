import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_KEY = 'recoverwell_v1';

// ── Profile ───────────────────────────────────────────────

export async function loadProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.data ?? null;
  } catch {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : null;
  }
}

export async function saveProfile(userId, data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, data, updated_at: new Date().toISOString() });
    return !error;
  } catch {
    return false;
  }
}

export async function signOut() {
  localStorage.removeItem(LOCAL_KEY);
  await supabase.auth.signOut();
}

// ── Push subscriptions ────────────────────────────────────

/** Save or replace a user's push subscription */
export async function savePushSubscription(userId, subscription) {
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({ user_id: userId, subscription }, { onConflict: 'user_id' });
  return !error;
}

/** Remove a user's push subscription (when they disable notifications) */
export async function deletePushSubscription(userId) {
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', userId);
  return !error;
}

/** Convert a VAPID base64 public key to the Uint8Array format PushManager needs */
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

/** Subscribe the current browser to push and save to Supabase */
export async function subscribeToPush(userId) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported in this browser.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied.');
  }

  const registration = await navigator.serviceWorker.ready;
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });

  const ok = await savePushSubscription(userId, subscription.toJSON());
  if (!ok) throw new Error('Failed to save subscription to server.');
  return subscription;
}

/** Unsubscribe from push and remove from Supabase */
export async function unsubscribeFromPush(userId) {
  try {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
  } catch {}
  return deletePushSubscription(userId);
}

/** Check if this browser is currently subscribed */
export async function getPushSubscription() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}
