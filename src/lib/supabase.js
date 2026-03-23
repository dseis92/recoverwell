import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_KEY = 'recoverwell_v1';

/**
 * Load a user's profile from Supabase.
 * Falls back to localStorage if offline or on error.
 */
export async function loadProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', userId)
      .single();

    // PGRST116 = no rows found (new user)
    if (error && error.code !== 'PGRST116') throw error;
    return data?.data ?? null;
  } catch {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : null;
  }
}

/**
 * Save a user's profile to Supabase and localStorage.
 * Returns true on success, false if cloud save failed (data still saved locally).
 */
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

/**
 * Sign the current user out.
 */
export async function signOut() {
  localStorage.removeItem(LOCAL_KEY);
  await supabase.auth.signOut();
}
