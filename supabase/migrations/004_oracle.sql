-- ORACLE: zentrale Richtlinien + Run-Logs
create extension if not exists pgcrypto;

create table if not exists public.oracle_policies (
  id bigint generated always as identity primary key,
  tool text not null,
  enabled boolean not null default true,
  max_ai_calls int not null default 10,
  max_conflict_files int not null default 10,
  max_file_bytes int not null default 2000000,
  forbid_workflows boolean not null default true,
  deny_globs text[] not null default array[]::text[],
  updated_at timestamptz not null default now()
);

create unique index if not exists oracle_policies_tool_uq on public.oracle_policies(tool);

create table if not exists public.oracle_runs (
  id uuid primary key default gen_random_uuid(),
  tool text not null,
  run_source text not null,
  github_run_id text,
  github_ref text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  success boolean,
  meta jsonb not null default '{}'::jsonb
);

create table if not exists public.oracle_events (
  id bigint generated always as identity primary key,
  run_id uuid references public.oracle_runs(id) on delete cascade,
  ts timestamptz not null default now(),
  kind text not null,
  details jsonb not null default '{}'::jsonb
);

create table if not exists public.oracle_daily_budget (
  day date not null,
  tool text not null,
  max_calls int not null default 200,
  used_calls int not null default 0,
  primary key(day, tool)
);

create or replace function public.oracle_consume_calls(p_tool text, p_n int)
returns table(allowed boolean, remaining int)
language plpgsql
as $$
declare
  d date := current_date;
  maxc int;
  used int;
begin
  insert into public.oracle_daily_budget(day, tool)
  values (d, p_tool)
  on conflict (day, tool) do nothing;

  select max_calls, used_calls into maxc, used
  from public.oracle_daily_budget
  where day = d and tool = p_tool
  for update;

  if used + p_n > maxc then
    return query select false, (maxc - used);
    return;
  end if;

  update public.oracle_daily_budget
  set used_calls = used_calls + p_n
  where day = d and tool = p_tool;

  return query
    select true, (maxc - (used + p_n));
end;
$$;

insert into public.oracle_policies(tool, enabled, max_ai_calls, max_conflict_files, max_file_bytes, forbid_workflows, deny_globs)
values
  ('ai_merge_conflicts', true, 10, 10, 2000000, true, array['.env*', 'node_modules/**', '.next/**', 'dist/**']),
  ('auto_improve', true, 10, 0, 2000000, true, array['.env*', 'node_modules/**', '.next/**', 'dist/**'])
on conflict (tool) do update
set
  enabled = excluded.enabled,
  max_ai_calls = excluded.max_ai_calls,
  max_conflict_files = excluded.max_conflict_files,
  max_file_bytes = excluded.max_file_bytes,
  forbid_workflows = excluded.forbid_workflows,
  deny_globs = excluded.deny_globs,
  updated_at = now();

alter table public.oracle_policies enable row level security;
alter table public.oracle_runs enable row level security;
alter table public.oracle_events enable row level security;
alter table public.oracle_daily_budget enable row level security;
