-- Glasford Tree Trimming isolated workspace.
-- Apply inside Ignite's existing Supabase project during the temporary hosting period.
-- It creates ONLY Glasford-namespaced objects and does not alter Ignite customer tables.
-- On final payment, move this schema, data, and access policy to the client's new project.

create schema if not exists glasford_private;
revoke all on schema glasford_private from public, anon, authenticated;

create table if not exists glasford_private.approved_users (
  email text primary key check (email = lower(email))
);
revoke all on glasford_private.approved_users from public, anon, authenticated;
alter table glasford_private.approved_users enable row level security;

-- Authorization checks a verified login against auth.users, not user-editable metadata.
-- Keep the allowlist in a private schema, never inside publicly committed SQL.
create or replace function glasford_private.has_access()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from auth.users u
    join glasford_private.approved_users a on a.email = lower(u.email)
    where u.id = (select auth.uid()) and u.email_confirmed_at is not null
  );
$$;
revoke all on function glasford_private.has_access() from public, anon;
grant usage on schema glasford_private to authenticated;
grant execute on function glasford_private.has_access() to authenticated;

create table if not exists public.glasford_workspace (
  id text primary key default 'main' check (id = 'main'),
  snapshot jsonb not null,
  revision bigint not null default 0 check (revision >= 0),
  updated_at timestamptz not null default now(),
  updated_by uuid
);
insert into public.glasford_workspace (id, snapshot)
values ('main', '{"version":1,"demo":false,"leads":[],"estimates":[],"jobs":[],"payments":[]}'::jsonb)
on conflict (id) do nothing;

alter table public.glasford_workspace enable row level security;
revoke all on public.glasford_workspace from public, anon;
grant select, update on public.glasford_workspace to authenticated;

create policy "glasford_approved_read" on public.glasford_workspace
  for select to authenticated using ((select glasford_private.has_access()));
create policy "glasford_approved_update" on public.glasford_workspace
  for update to authenticated
  using ((select glasford_private.has_access()))
  with check ((select glasford_private.has_access()));

alter publication supabase_realtime add table public.glasford_workspace;
