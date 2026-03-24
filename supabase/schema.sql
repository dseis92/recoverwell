-- RecoverWell Database Schema
-- Run this in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Stores user recovery data as JSONB for flexibility
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON profiles(updated_at);

-- JSONB indexes for common queries
CREATE INDEX IF NOT EXISTS profiles_reminder_enabled_idx
  ON profiles ((data->>'reminderEnabled'));
CREATE INDEX IF NOT EXISTS profiles_reminder_time_idx
  ON profiles ((data->>'reminderTime'));

-- ============================================================
-- PUSH_SUBSCRIPTIONS TABLE
-- Stores Web Push subscription objects for each user
-- ============================================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can read own subscription"
  ON push_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscription
CREATE POLICY "Users can insert own subscription"
  ON push_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscription
CREATE POLICY "Users can update own subscription"
  ON push_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own subscription
CREATE POLICY "Users can delete own subscription"
  ON push_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS push_subscriptions_updated_at_idx
  ON push_subscriptions(updated_at);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for push_subscriptions table
DROP TRIGGER IF EXISTS update_push_subscriptions_updated_at ON push_subscriptions;
CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DATA STRUCTURE DOCUMENTATION
-- ============================================================

-- profiles.data JSONB structure:
-- {
--   "name": "string",
--   "substance": "string",
--   "sobrietyDate": "ISO 8601 datetime string",
--   "dailyCost": "string (number)",
--   "sponsorName": "string",
--   "sponsorPhone": "string",
--   "emergencyName": "string",
--   "emergencyPhone": "string",
--   "reminderEnabled": boolean,
--   "reminderTime": "HH:MM",
--   "timezone": "string (IANA timezone)", // TODO: Add this
--   "lightMode": boolean,
--   "lastMilestoneDays": number,
--   "moodLog": [
--     {
--       "date": "ISO 8601 datetime",
--       "mood": "string",
--       "energy": number,
--       "sleep": number,
--       "triggers": ["string"],
--       "grateful": "string",
--       "notes": "string"
--     }
--   ],
--   "journal": [
--     {
--       "id": "string",
--       "date": "ISO 8601 datetime",
--       "entry": "string"
--     }
--   ],
--   "checklist": [
--     {
--       "text": "string",
--       "done": boolean
--     }
--   ]
-- }

-- push_subscriptions.subscription JSONB structure (PushSubscription object):
-- {
--   "endpoint": "string (URL)",
--   "keys": {
--     "p256dh": "string (base64)",
--     "auth": "string (base64)"
--   }
-- }
