-- Collectibles psychology: inventory, timed drops, activity feed, cart pressure

create table public.product_inventory (
  product_id text primary key,
  stock_total integer not null check (stock_total >= 0),
  stock_remaining integer not null check (stock_remaining >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now(),
  constraint stock_remaining_lte_total check (stock_remaining <= stock_total)
);

create table public.timed_drops (
  id uuid primary key default gen_random_uuid(),
  product_id text not null unique,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  constraint timed_drops_window check (ends_at > starts_at)
);

create index timed_drops_active_idx on public.timed_drops (is_active, ends_at);

create table public.purchase_activity_events (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  product_name text not null,
  display_name text not null,
  city text,
  created_at timestamptz not null default now()
);

create index purchase_activity_events_created_idx
  on public.purchase_activity_events (created_at desc);

create table public.cart_sessions (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  session_id text not null,
  expires_at timestamptz not null,
  unique (product_id, session_id)
);

create index cart_sessions_product_expires_idx
  on public.cart_sessions (product_id, expires_at);

alter table public.product_inventory enable row level security;
alter table public.timed_drops enable row level security;
alter table public.purchase_activity_events enable row level security;
alter table public.cart_sessions enable row level security;

create policy "Product inventory is publicly readable"
  on public.product_inventory for select
  using (true);

create policy "Timed drops are publicly readable"
  on public.timed_drops for select
  using (true);

create policy "Purchase activity is publicly readable"
  on public.purchase_activity_events for select
  using (true);

create policy "Cart sessions are publicly readable"
  on public.cart_sessions for select
  using (true);

create policy "Anyone can upsert cart interest"
  on public.cart_sessions for insert
  with check (true);

create policy "Anyone can refresh cart interest"
  on public.cart_sessions for update
  using (true)
  with check (true);

create policy "Anyone can remove cart interest"
  on public.cart_sessions for delete
  using (true);

-- Atomic stock decrement (service role / server actions via RPC)
create or replace function public.decrement_product_stock(p_product_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_remaining integer;
begin
  select stock_remaining into v_remaining
  from product_inventory
  where product_id = p_product_id
  for update;

  if not found then
    return -1;
  end if;

  if v_remaining <= 0 then
    raise exception 'Product % is sold out', p_product_id;
  end if;

  update product_inventory
  set stock_remaining = stock_remaining - 1,
      updated_at = now()
  where product_id = p_product_id
  returning stock_remaining into v_remaining;

  return v_remaining;
end;
$$;

-- Activity feed trigger on purchase
create or replace function public.log_purchase_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
  v_cities text[] := array[
    'Toronto', 'Brooklyn', 'Austin', 'London', 'Chicago',
    'Portland', 'Denver', 'Seattle', 'Miami', 'Los Angeles'
  ];
begin
  select username into v_username
  from profiles
  where id = new.user_id;

  insert into purchase_activity_events (
    product_id,
    product_name,
    display_name,
    city
  ) values (
    new.product_id,
    new.product_name,
    coalesce(v_username, 'Anonymous Sinner'),
    v_cities[1 + floor(random() * array_length(v_cities, 1))::int]
  );

  return new;
end;
$$;

create trigger indulgence_purchase_activity
  after insert on public.indulgence_purchases
  for each row
  execute function public.log_purchase_activity();

-- Seed demo scarcity
insert into public.product_inventory (product_id, stock_total, stock_remaining, low_stock_threshold)
values
  ('hell-free-card', 12, 3, 5),
  ('sin-mystery-crate', 50, 18, 10)
on conflict (product_id) do nothing;

insert into public.timed_drops (product_id, starts_at, ends_at, is_active)
values (
  'celebrity-prayer-jump',
  now() - interval '1 hour',
  now() + interval '48 hours',
  true
)
on conflict (product_id) do nothing;

-- Enable realtime for activity and inventory
alter publication supabase_realtime add table public.purchase_activity_events;
alter publication supabase_realtime add table public.product_inventory;
