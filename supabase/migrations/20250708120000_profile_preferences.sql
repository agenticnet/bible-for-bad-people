alter table public.profiles
  add column if not exists display_name text,
  add column if not exists favorite_chambers jsonb not null default '[]'::jsonb,
  add column if not exists chamber_order jsonb not null default '[]'::jsonb,
  add column if not exists default_accent text not null default 'wine',
  add column if not exists notification_prefs jsonb not null default '{"weeklyDigest":true,"sinReminders":true,"smiteAlerts":false}'::jsonb,
  add column if not exists starter_pack_id text,
  add column if not exists onboarding_completed_at timestamptz;
