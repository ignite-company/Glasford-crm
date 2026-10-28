-- Apply only to a NEW dedicated Glasford Supabase project.
-- Do not commit personal email addresses or server keys to this public repository.
begin;
create schema if not exists glasford_private;
revoke all on schema glasford_private from public, anon, authenticated;

create table if not exists glasford_private.approved_users (
  email text primary key check (email = lower(email))
);
revoke all on glasford_private.approved_users from public, anon, authenticated;

-- An administrator must add approved addresses in the Supabase SQL editor
-- AFTER creating this project, with:
-- insert into glasford_private.approved_users (email) values (lower('CLIENT_EMAIL')), (lower('IGNITE_ADMIN_EMAIL'))
-- on conflict do nothing;
-- Replace placeholder strings in the SQL editor only; do not commit addresses.

create or replace function glasford_private.has_access()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1 from glasford_private.approved_users a
      where a.email = lower(coalesce((select auth.jwt() ->> 'email'), ''))
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
commit;
