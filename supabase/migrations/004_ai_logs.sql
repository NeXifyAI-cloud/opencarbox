create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  provider text not null,
  model text not null,
  status text not null check (status in ('ok', 'error')),
  latency_ms integer not null check (latency_ms >= 0),
  error_code text,
  created_at timestamptz not null default now()
);

alter table public.ai_logs enable row level security;

create policy "Users can read own ai logs"
  on public.ai_logs
  for select
  using (auth.uid() = user_id);

create policy "Service role can write ai logs"
  on public.ai_logs
  for insert
  with check (auth.role() = 'service_role');
