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
