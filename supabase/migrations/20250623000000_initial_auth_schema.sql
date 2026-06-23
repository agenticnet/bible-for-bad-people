-- Bible for Bad People: initial auth + chamber data schema

create type public.vote_type as enum ('absolve', 'condemn');
create type public.chat_chamber as enum ('god', 'lucifer', 'support');

-- Profiles (username stored here, not user_metadata)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  salvation_score integer not null default 0,
  total_spent numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

create index profiles_username_idx on public.profiles (username);
create index profiles_salvation_score_idx on public.profiles (salvation_score desc);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Sin log
create table public.sin_log_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  sin_id text,
  petty text not null,
  translation text not null,
  source text not null,
  completed_at timestamptz not null default now()
);

create index sin_log_items_user_id_idx on public.sin_log_items (user_id, completed_at desc);

alter table public.sin_log_items enable row level security;

create policy "Users can read own sin log"
  on public.sin_log_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own sin log"
  on public.sin_log_items for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own sin log"
  on public.sin_log_items for delete
  using (auth.uid() = user_id);

-- Community sins (public read)
create table public.sin_community_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  petty text not null,
  translation text not null,
  category text not null,
  difficulty text not null,
  submitted_at timestamptz not null default now()
);

alter table public.sin_community_items enable row level security;

create policy "Community sins are publicly readable"
  on public.sin_community_items for select
  using (true);

create policy "Authenticated users can contribute sins"
  on public.sin_community_items for insert
  with check (auth.uid() = user_id);

-- Daily sin checklist
create table public.sin_daily_done (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date_key text not null,
  sin_ids jsonb not null default '[]'::jsonb,
  unique (user_id, date_key)
);

alter table public.sin_daily_done enable row level security;

create policy "Users can read own daily sins"
  on public.sin_daily_done for select
  using (auth.uid() = user_id);

create policy "Users can insert own daily sins"
  on public.sin_daily_done for insert
  with check (auth.uid() = user_id);

create policy "Users can update own daily sins"
  on public.sin_daily_done for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indulgence purchases
create table public.indulgence_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  certificate_id text not null,
  price_paid numeric(10, 2) not null,
  purchased_at timestamptz not null default now()
);

create index indulgence_purchases_user_id_idx on public.indulgence_purchases (user_id, purchased_at desc);

alter table public.indulgence_purchases enable row level security;

create policy "Users can read own purchases"
  on public.indulgence_purchases for select
  using (auth.uid() = user_id);

create policy "Users can insert own purchases"
  on public.indulgence_purchases for insert
  with check (auth.uid() = user_id);

-- Confessions
create table public.confessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) <= 500),
  created_at timestamptz not null default now()
);

create index confessions_created_at_idx on public.confessions (created_at desc);

alter table public.confessions enable row level security;

create policy "Confessions are publicly readable"
  on public.confessions for select
  using (true);

create policy "Authenticated users can post confessions"
  on public.confessions for insert
  with check (auth.uid() = user_id);

-- Confession votes
create table public.confession_votes (
  id uuid primary key default gen_random_uuid(),
  confession_id uuid not null references public.confessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  vote public.vote_type not null,
  created_at timestamptz not null default now(),
  unique (confession_id, user_id)
);

create index confession_votes_confession_id_idx on public.confession_votes (confession_id);

alter table public.confession_votes enable row level security;

create policy "Users can read own votes"
  on public.confession_votes for select
  using (auth.uid() = user_id);

create policy "Users can insert own votes"
  on public.confession_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own votes"
  on public.confession_votes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own votes"
  on public.confession_votes for delete
  using (auth.uid() = user_id);

-- Oracle readings
create table public.oracle_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date_key text not null,
  cards jsonb not null,
  doom_score integer not null,
  summary text not null,
  revealed boolean not null default false,
  unique (user_id, date_key)
);

alter table public.oracle_readings enable row level security;

create policy "Users can read own oracle readings"
  on public.oracle_readings for select
  using (auth.uid() = user_id);

create policy "Users can insert own oracle readings"
  on public.oracle_readings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own oracle readings"
  on public.oracle_readings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Smite history
create table public.smite_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target text not null,
  target_label text not null,
  custom_name text,
  plague text not null,
  tier text not null,
  result text not null,
  visual_description text,
  smote_at timestamptz not null default now(),
  price_paid numeric(10, 2) not null default 0
);

create index smite_history_user_id_idx on public.smite_history (user_id, smote_at desc);

alter table public.smite_history enable row level security;

create policy "Users can read own smite history"
  on public.smite_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own smite records"
  on public.smite_history for insert
  with check (auth.uid() = user_id);

-- Smite daily counts
create table public.smite_daily_counts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date_key text not null,
  count integer not null default 0,
  unique (user_id, date_key)
);

alter table public.smite_daily_counts enable row level security;

create policy "Users can read own smite daily counts"
  on public.smite_daily_counts for select
  using (auth.uid() = user_id);

create policy "Users can insert own smite daily counts"
  on public.smite_daily_counts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own smite daily counts"
  on public.smite_daily_counts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Chat messages
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  chamber public.chat_chamber not null,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_user_chamber_idx on public.chat_messages (user_id, chamber, created_at);

alter table public.chat_messages enable row level security;

create policy "Users can read own chat messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own chat messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

-- Support tickets
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ticket_number text not null,
  subject text not null,
  category text not null,
  priority text not null,
  description text not null,
  status text not null default 'processing',
  response text,
  submitted_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index support_tickets_user_id_idx on public.support_tickets (user_id, submitted_at desc);

alter table public.support_tickets enable row level security;

create policy "Users can read own support tickets"
  on public.support_tickets for select
  using (auth.uid() = user_id);

create policy "Users can insert own support tickets"
  on public.support_tickets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own support tickets"
  on public.support_tickets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
