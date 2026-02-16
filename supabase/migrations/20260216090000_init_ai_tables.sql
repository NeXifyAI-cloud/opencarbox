create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'deepseek',
  base_url text,
  model text,
  key_status_flags jsonb not null default '{}'::jsonb,
  api_key_preview text,
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  model text not null,
  latency_ms integer not null,
  success boolean not null,
  error_code text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.ai_settings enable row level security;
alter table public.ai_logs enable row level security;

create policy "profiles_own_rows" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_settings_own_rows" on public.ai_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_logs_own_rows" on public.ai_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
