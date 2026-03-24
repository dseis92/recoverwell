# RecoverWell Supabase Backend

This directory contains the Supabase backend configuration for RecoverWell.

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key-here
```

### 3. Run Database Migration

In your Supabase project dashboard:
1. Go to SQL Editor
2. Copy and paste the contents of `schema.sql`
3. Run the query

Or use the Supabase CLI:
```bash
supabase db push
```

### 4. Generate VAPID Keys

For push notifications, generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

### 5. Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-id

# Deploy the function
supabase functions deploy send-reminders
```

### 6. Set Edge Function Secrets

In your Supabase dashboard, go to Edge Functions → Settings → Secrets:

```
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_CONTACT=mailto:your-email@example.com
```

### 7. Set Up Cron Job

Go to [cron-job.org](https://cron-job.org) and create a job:
- URL: `https://your-project-id.supabase.co/functions/v1/send-reminders`
- Schedule: Every minute (*/1 * * * *)
- Headers: Add `Authorization: Bearer your-anon-key`

## Database Schema

### Tables

#### `profiles`
Stores user recovery data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | User ID (references auth.users) |
| data | JSONB | User profile data (see structure below) |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| created_at | TIMESTAMPTZ | Creation timestamp |

**Profile Data Structure:**
```json
{
  "name": "User Name",
  "substance": "Alcohol",
  "sobrietyDate": "2024-01-01T00:00:00.000Z",
  "dailyCost": "20",
  "sponsorName": "Sponsor Name",
  "sponsorPhone": "555-0123",
  "emergencyName": "Emergency Contact",
  "emergencyPhone": "555-4567",
  "reminderEnabled": true,
  "reminderTime": "09:00",
  "timezone": "America/New_York",
  "lightMode": false,
  "lastMilestoneDays": 30,
  "moodLog": [
    {
      "date": "2024-01-01T12:00:00.000Z",
      "mood": "Happy",
      "energy": 8,
      "sleep": 7,
      "triggers": ["stress"],
      "grateful": "My family",
      "notes": "Great day"
    }
  ],
  "journal": [
    {
      "id": "uuid",
      "date": "2024-01-01T12:00:00.000Z",
      "entry": "Journal entry text"
    }
  ],
  "checklist": [
    {
      "text": "Attend meeting",
      "done": true
    }
  ]
}
```

#### `push_subscriptions`
Stores Web Push API subscription objects.

| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | User ID (references auth.users) |
| subscription | JSONB | PushSubscription object |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Subscription Structure:**
```json
{
  "endpoint": "https://fcm.googleapis.com/...",
  "keys": {
    "p256dh": "base64-encoded-key",
    "auth": "base64-encoded-key"
  }
}
```

### Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- Read their own data
- Insert their own data
- Update their own data
- Delete their own data (push_subscriptions only)

## Edge Functions

### `send-reminders`

Cron-triggered function that sends push notifications to users at their scheduled reminder times.

**Trigger:** Every minute via cron-job.org

**Process:**
1. Gets current time in HH:MM format (UTC)
2. Queries profiles with `reminderEnabled: true` and matching `reminderTime`
3. Fetches push subscriptions for those users
4. Sends Web Push notifications using VAPID
5. Cleans up expired subscriptions (410 Gone responses)

**Response:**
```json
{
  "sent": 5,
  "errors": [],
  "time": "09:00"
}
```

## Migrations

Migration files are in `migrations/` directory:

- `20250324_initial_schema.sql` - Initial database schema

To create a new migration:
```bash
# Create file: migrations/YYYYMMDD_description.sql
# Add your SQL changes
# Run via Supabase dashboard or CLI
```

## Security

- All tables use Row Level Security (RLS)
- Users can only access their own data
- Push subscriptions use VAPID for authentication
- Edge Functions use Supabase service role key (automatically available)
- Sensitive data (sponsor info, emergency contacts) stored in encrypted JSONB

## Backup & Recovery

Supabase provides automatic backups. To export data:

```bash
# Export all data
supabase db dump > backup.sql

# Export specific table
supabase db dump --table profiles > profiles_backup.sql
```

## Development

### Local Development

```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase db reset

# Test edge function locally
supabase functions serve send-reminders
```

### Testing Push Notifications

1. Subscribe in the app (Settings → Daily Reminder → Enable)
2. Manually trigger the edge function:
   ```bash
   curl -X POST https://your-project-id.supabase.co/functions/v1/send-reminders \
     -H "Authorization: Bearer your-anon-key"
   ```
3. Check browser for notification

## Troubleshooting

### Push notifications not working

1. Check VAPID keys are set in Edge Function secrets
2. Verify user has `reminderEnabled: true` in their profile
3. Check user's `reminderTime` matches current UTC time
4. Ensure cron job is running and hitting the correct URL
5. Check Edge Function logs in Supabase dashboard

### Sync issues

1. Check RLS policies are correctly applied
2. Verify user is authenticated
3. Check browser console for errors
4. Ensure `.env` has correct Supabase URL and anon key

## Performance

- Indexes on `updated_at` for efficient queries
- JSONB indexes on `reminderEnabled` and `reminderTime` for fast reminder lookups
- Automatic timestamp updates via triggers
- Expired subscriptions automatically cleaned up

## Future Improvements

- [ ] Add timezone support for accurate reminder times
- [ ] Implement subscription expiration checks
- [ ] Add analytics table for usage tracking
- [ ] Create backup/export endpoints
- [ ] Add rate limiting for API calls
