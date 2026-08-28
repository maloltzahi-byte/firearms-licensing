-- Ordered addendum to live-schema-baseline-2026-08-28.sql
-- Captures live migration 20260828080143_add_public_health_ping_2026_08_28.
-- Apply immediately after the main 2026-08-28 baseline when reconstructing a fresh project.

create or replace function public.health_ping()
returns text
language sql
stable
set search_path to ''
as $$
  select 'ok'::text
$$;

revoke execute on function public.health_ping() from public;
grant execute on function public.health_ping() to anon, authenticated, service_role;
