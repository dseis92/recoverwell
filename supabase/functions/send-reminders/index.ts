// Supabase Edge Function — called every minute by cron-job.org
// Sends Web Push reminders to users whose reminder time matches the current minute.
//
// Required secrets (set via Supabase Dashboard → Edge Functions → Secrets):
//   VAPID_PUBLIC_KEY
//   VAPID_PRIVATE_KEY
//   VAPID_CONTACT       e.g. mailto:you@example.com
//   SUPABASE_SERVICE_ROLE_KEY   (auto-available in Edge Functions)
//   SUPABASE_URL                (auto-available in Edge Functions)

import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

webpush.setVapidDetails(
  Deno.env.get('VAPID_CONTACT') ?? 'mailto:admin@recoverwell.app',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
);

Deno.serve(async (_req) => {
  try {
    // Current time as HH:MM (UTC — users should store reminder times in their local TZ,
    // but for simplicity we match on UTC. A future improvement could store user TZ offsets.)
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Fetch all profiles with reminders enabled at this time
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, data')
      .filter('data->>reminderEnabled', 'eq', 'true')
      .filter('data->>reminderTime', 'eq', timeStr);

    if (profilesError) throw profilesError;
    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ sent: 0, time: timeStr }), { status: 200 });
    }

    const userIds = profiles.map((p: any) => p.id);

    // Fetch their push subscriptions
    const { data: subs, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('user_id, subscription')
      .in('user_id', userIds);

    if (subsError) throw subsError;

    const payload = JSON.stringify({
      title: 'RecoverWell',
      body: "Time for your daily check-in. How are you feeling today?",
    });

    let sent = 0;
    const errors: string[] = [];

    for (const sub of subs ?? []) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        sent++;
      } catch (err: any) {
        // 410 Gone = subscription expired — clean it up
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('user_id', sub.user_id);
        } else {
          errors.push(err?.message ?? 'unknown error');
        }
      }
    }

    return new Response(JSON.stringify({ sent, errors, time: timeStr }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
