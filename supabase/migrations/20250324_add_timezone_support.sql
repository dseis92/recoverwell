-- Migration: Add Timezone Support
-- Created: 2025-03-24
-- Description: Updates existing profiles to include timezone data if missing

-- Note: This is a data migration, not a schema migration
-- The profiles table uses JSONB which is flexible and doesn't require schema changes

-- Add timezone to existing profiles that don't have one
-- This sets a default timezone of UTC, users can update it in settings
UPDATE profiles
SET data = jsonb_set(
  data,
  '{timezone}',
  '"UTC"'::jsonb,
  true
)
WHERE data->>'timezone' IS NULL;

-- Optional: Add a comment documenting the timezone field
COMMENT ON COLUMN profiles.data IS 'User profile data as JSONB. Expected fields include: name, substance, sobrietyDate, dailyCost, sponsorName, sponsorPhone, emergencyName, emergencyPhone, reminderEnabled, reminderTime, timezone, lightMode, lastMilestoneDays, moodLog, journal, checklist';
