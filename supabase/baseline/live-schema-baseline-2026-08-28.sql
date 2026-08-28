-- Firearms Licensing — live Supabase reference baseline
-- Captured from project lcvshepgzizrlqbzvjoe on 2026-08-28.
--
-- IMPORTANT:
-- 1. This is a forward reproducibility reference, not a historical migration.
-- 2. It MUST NOT be applied to the live project as part of ordinary deploys.
-- 3. Historical SQL for live migrations 1-19 is unavailable; it is not fabricated here.
-- 4. Source of truth for this file is live catalog introspection +
--    live-migration-manifest-2026-08-28.json.

begin;

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create type public.app_role as enum ('client', 'lawyer', 'reviewer', 'support', 'admin');
create type public.case_status as enum ('draft', 'needs_info', 'counsel_review', 'approved', 'blocked', 'submitted', 'authority_wait', 'interview', 'appeal', 'closed');
create type public.gate_state as enum ('REVIEW', 'NEEDS_INFO', 'BLOCK', 'APPROVED');
create type public.request_type as enum ('new', 'existing', 'appeal');
create type public.review_state as enum ('pending', 'review', 'needs_info', 'approved', 'rejected');
create type public.sensitivity_level as enum ('normal', 'sensitive', 'medical');

create table public.audit_events (
  id bigint generated always as identity not null,
  case_id uuid,
  actor_id uuid,
  event_type text not null,
  object_type text not null,
  object_id text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null,
  constraint audit_events_pkey primary key (id)
);

create table public.case_members (
  case_id uuid not null,
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz default now() not null,
  constraint case_members_pkey primary key (case_id, user_id)
);

create table public.cases (
  id uuid default gen_random_uuid() not null,
  case_number text default ('RFL-'::text || upper(substr(replace((gen_random_uuid())::text, '-'::text, ''::text), 1, 8))) not null,
  client_user_id uuid,
  request_type public.request_type default 'new'::public.request_type not null,
  status public.case_status default 'draft'::public.case_status not null,
  title text default 'תיק רישוי כלי ירייה'::text not null,
  next_action text,
  authority_status text,
  authority_status_source text,
  authority_status_observed_at timestamptz,
  created_by uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint cases_case_number_key unique (case_number),
  constraint cases_pkey primary key (id)
);

create table public.decision_gates (
  case_id uuid not null,
  state public.gate_state default 'REVIEW'::public.gate_state not null,
  rationale text,
  decided_by uuid,
  decided_at timestamptz,
  version integer default 1 not null,
  updated_at timestamptz default now() not null,
  constraint decision_gates_pkey primary key (case_id)
);

create table public.documents (
  id uuid default gen_random_uuid() not null,
  case_id uuid not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint,
  sha256 text,
  evidence_role text,
  sensitivity public.sensitivity_level default 'normal'::public.sensitivity_level not null,
  review_status public.review_state default 'pending'::public.review_state not null,
  uploaded_by uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint documents_pkey primary key (id),
  constraint documents_size_bytes_check check (size_bytes is null or size_bytes >= 0),
  constraint documents_storage_path_key unique (storage_path)
);

create table public.evidence_items (
  id uuid default gen_random_uuid() not null,
  case_id uuid not null,
  claim_key text not null,
  description text not null,
  source_kind text not null,
  source_ref text,
  document_id uuid,
  review_status public.review_state default 'pending'::public.review_state not null,
  sensitivity public.sensitivity_level default 'normal'::public.sensitivity_level not null,
  created_by uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint evidence_items_pkey primary key (id)
);

create table public.messages (
  id uuid default gen_random_uuid() not null,
  case_id uuid not null,
  sender_id uuid,
  body text not null,
  channel text default 'in_app'::text not null,
  is_internal boolean default false not null,
  created_at timestamptz default now() not null,
  constraint messages_body_check check (char_length(body) >= 1 and char_length(body) <= 10000),
  constraint messages_channel_check check (channel = any (array['in_app'::text, 'email'::text, 'sms'::text, 'whatsapp'::text])),
  constraint messages_pkey primary key (id)
);

create table public.payment_records (
  id uuid default gen_random_uuid() not null,
  case_id uuid not null,
  provider text default 'adapter'::text not null,
  provider_reference text,
  amount_minor integer,
  currency char(3) default 'ILS'::bpchar not null,
  status text default 'pending'::text not null,
  service_scope text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint payment_records_amount_minor_check check (amount_minor is null or amount_minor >= 0),
  constraint payment_records_pkey primary key (id),
  constraint payment_records_status_check check (status = any (array['pending'::text, 'authorized'::text, 'paid'::text, 'failed'::text, 'refunded'::text, 'cancelled'::text]))
);

create table public.profiles (
  id uuid not null,
  role public.app_role default 'client'::public.app_role not null,
  display_name text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint profiles_pkey primary key (id)
);

create table public.questionnaire_answers (
  id uuid default gen_random_uuid() not null,
  case_id uuid not null,
  field_key text not null,
  value jsonb default 'null'::jsonb not null,
  sensitivity public.sensitivity_level default 'normal'::public.sensitivity_level not null,
  source text default 'client'::text not null,
  created_by uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint questionnaire_answers_case_id_field_key_key unique (case_id, field_key),
  constraint questionnaire_answers_pkey primary key (id)
);

create table public.stage11_bundle_chunks (
  module text not null,
  seq integer not null,
  payload text not null,
  created_at timestamptz default now() not null,
  constraint stage11_bundle_chunks_pkey primary key (module, seq)
);

create table public.system_checks (
  key text not null,
  value text not null,
  updated_at timestamptz default now() not null,
  constraint system_checks_pkey primary key (key)
);

create table public.tasks (
  id uuid default gen_random_uuid() not null,
  case_id uuid not null,
  title text not null,
  description text,
  status text default 'open'::text not null,
  due_at timestamptz,
  assigned_to uuid,
  created_by uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint tasks_pkey primary key (id),
  constraint tasks_status_check check (status = any (array['open'::text, 'in_progress'::text, 'done'::text, 'cancelled'::text]))
);

alter table public.audit_events add constraint audit_events_actor_id_fkey foreign key (actor_id) references auth.users(id) on delete set null;
alter table public.audit_events add constraint audit_events_case_id_fkey foreign key (case_id) references public.cases(id) on delete set null;
alter table public.case_members add constraint case_members_case_id_fkey foreign key (case_id) references public.cases(id) on delete cascade;
alter table public.case_members add constraint case_members_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.cases add constraint cases_client_user_id_fkey foreign key (client_user_id) references auth.users(id) on delete set null;
alter table public.cases add constraint cases_created_by_fkey foreign key (created_by) references auth.users(id) on delete set null;
alter table public.decision_gates add constraint decision_gates_case_id_fkey foreign key (case_id) references public.cases(id) on delete cascade;
alter table public.decision_gates add constraint decision_gates_decided_by_fkey foreign key (decided_by) references auth.users(id) on delete set null;
alter table public.documents add constraint documents_case_id_fkey foreign key (case_id) references public.cases(id) on delete cascade;
alter table public.documents add constraint documents_uploaded_by_fkey foreign key (uploaded_by) references auth.users(id) on delete set null;
alter table public.evidence_items add constraint evidence_items_case_id_fkey foreign key (case_id) references public.cases(id) on delete cascade;
alter table public.evidence_items add constraint evidence_items_created_by_fkey foreign key (created_by) references auth.users(id) on delete set null;
alter table public.evidence_items add constraint evidence_items_document_id_fkey foreign key (document_id) references public.documents(id) on delete set null;
alter table public.messages add constraint messages_case_id_fkey foreign key (case_id) references public.cases(id) on delete cascade;
alter table public.messages add constraint messages_sender_id_fkey foreign key (sender_id) references auth.users(id) on delete set null;
alter table public.payment_records add constraint payment_records_case_id_fkey foreign key (case_id) references public.cases(id) on delete cascade;
alter table public.profiles add constraint profiles_id_fkey foreign key (id) references auth.users(id) on delete cascade;
alter table public.questionnaire_answers add constraint questionnaire_answers_case_id_fkey foreign key (case_id) references public.cases(id) on delete cascade;
alter table public.questionnaire_answers add constraint questionnaire_answers_created_by_fkey foreign key (created_by) references auth.users(id) on delete set null;
alter table public.tasks add constraint tasks_assigned_to_fkey foreign key (assigned_to) references auth.users(id) on delete set null;
alter table public.tasks add constraint tasks_case_id_fkey foreign key (case_id) references public.cases(id) on delete cascade;
alter table public.tasks add constraint tasks_created_by_fkey foreign key (created_by) references auth.users(id) on delete set null;

create index audit_actor_idx on public.audit_events using btree (actor_id);
create index audit_case_idx on public.audit_events using btree (case_id, created_at desc);
create index case_members_user_idx on public.case_members using btree (user_id);
create index cases_client_idx on public.cases using btree (client_user_id);
create index cases_created_by_idx on public.cases using btree (created_by);
create index cases_status_idx on public.cases using btree (status);
create index decision_gates_decided_by_idx on public.decision_gates using btree (decided_by);
create index documents_case_idx on public.documents using btree (case_id);
create index documents_uploaded_by_idx on public.documents using btree (uploaded_by);
create index evidence_case_idx on public.evidence_items using btree (case_id);
create index evidence_created_by_idx on public.evidence_items using btree (created_by);
create index evidence_document_idx on public.evidence_items using btree (document_id);
create index messages_case_idx on public.messages using btree (case_id, created_at desc);
create index messages_sender_idx on public.messages using btree (sender_id);
create index payments_case_idx on public.payment_records using btree (case_id);
create index qa_case_idx on public.questionnaire_answers using btree (case_id);
create index qa_created_by_idx on public.questionnaire_answers using btree (created_by);
create index tasks_assigned_to_idx on public.tasks using btree (assigned_to);
create index tasks_case_idx on public.tasks using btree (case_id, status);
create index tasks_created_by_idx on public.tasks using btree (created_by);

create or replace function private.current_app_role()
returns public.app_role
language sql stable security definer
set search_path to ''
as $$
  select coalesce((select p.role from public.profiles p where p.id = (select auth.uid()) and p.is_active), 'client'::public.app_role)
$$;

create or replace function private.is_aal2()
returns boolean
language sql stable
set search_path to ''
as $$
  select coalesce(auth.jwt()->>'aal','') = 'aal2'
$$;

create or replace function private.is_legal_staff()
returns boolean
language sql stable security definer
set search_path to ''
as $$
  select private.current_app_role() in ('lawyer','reviewer','admin')
$$;

create or replace function private.is_staff()
returns boolean
language sql stable security definer
set search_path to ''
as $$
  select private.current_app_role() in ('lawyer','reviewer','support','admin')
$$;

create or replace function private.can_access_case(p_case_id uuid)
returns boolean
language sql stable security definer
set search_path to ''
as $$
  select exists (select 1 from public.cases c where c.id=p_case_id and c.client_user_id=(select auth.uid()))
      or exists (select 1 from public.case_members m where m.case_id=p_case_id and m.user_id=(select auth.uid()))
      or private.current_app_role()='admin'
$$;

create or replace function private.can_access_sensitive_case(p_case_id uuid)
returns boolean
language sql stable security definer
set search_path to ''
as $$
  select
    exists (
      select 1 from public.cases c
      where c.id=p_case_id and c.client_user_id=(select auth.uid())
    )
    or (
      private.can_access_case(p_case_id)
      and private.current_app_role() in ('lawyer','reviewer','admin')
      and private.is_aal2()
    )
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql security definer
set search_path to ''
as $$
begin
 insert into public.profiles(id,role,display_name) values(new.id,'client',coalesce(new.raw_user_meta_data->>'full_name',new.email)) on conflict(id) do nothing;
 return new;
end
$$;

create or replace function private.bootstrap_case_gate()
returns trigger
language plpgsql security definer
set search_path to ''
as $$
declare v_role public.app_role;
begin
 insert into public.decision_gates(case_id,state) values(new.id,'REVIEW') on conflict(case_id) do nothing;
 if new.client_user_id is not null then
  insert into public.case_members(case_id,user_id,role) values(new.id,new.client_user_id,'client') on conflict do nothing;
 end if;
 if new.created_by is not null and (new.client_user_id is null or new.created_by <> new.client_user_id) then
  v_role := private.current_app_role();
  insert into public.case_members(case_id,user_id,role) values(new.id,new.created_by,v_role) on conflict do nothing;
 end if;
 return new;
end
$$;

create or replace function private.set_case_decision_gate(p_case_id uuid, p_state public.gate_state, p_rationale text)
returns public.decision_gates
language plpgsql security definer
set search_path to ''
as $$
declare v_actor uuid:=auth.uid(); v_old public.decision_gates%rowtype; v_new public.decision_gates%rowtype;
begin
 if v_actor is null then raise exception 'authentication required'; end if;
 if not private.is_aal2() then raise exception 'AAL2 required for decision gate'; end if;
 if private.current_app_role() not in ('lawyer','admin') then raise exception 'lawyer role required'; end if;
 if not private.can_access_case(p_case_id) then raise exception 'case access denied'; end if;
 if p_rationale is null or char_length(trim(p_rationale))<8 then raise exception 'rationale required'; end if;
 select * into v_old from public.decision_gates where case_id=p_case_id for update;
 if not found then
  insert into public.decision_gates(case_id,state,rationale,decided_by,decided_at,version) values(p_case_id,p_state,trim(p_rationale),v_actor,now(),1) returning * into v_new;
 else
  update public.decision_gates set state=p_state,rationale=trim(p_rationale),decided_by=v_actor,decided_at=now(),version=v_old.version+1,updated_at=now() where case_id=p_case_id returning * into v_new;
 end if;
 insert into public.audit_events(case_id,actor_id,event_type,object_type,object_id,before_data,after_data,metadata) values(p_case_id,v_actor,'DECISION_GATE_CHANGED','decision_gate',p_case_id::text,case when v_old.case_id is null then null else to_jsonb(v_old) end,to_jsonb(v_new),jsonb_build_object('aal',auth.jwt()->>'aal'));
 return v_new;
end
$$;

create or replace function private.set_case_status(p_case_id uuid, p_status public.case_status, p_next_action text default null::text)
returns public.cases
language plpgsql security definer
set search_path to ''
as $$
declare
  v_actor uuid := auth.uid();
  v_old public.cases%rowtype;
  v_new public.cases%rowtype;
begin
  if v_actor is null then raise exception 'authentication required'; end if;
  if not private.is_aal2() then raise exception 'AAL2 required'; end if;
  if private.current_app_role() not in ('lawyer','admin') then raise exception 'lawyer role required'; end if;
  if not private.can_access_case(p_case_id) then raise exception 'case access denied'; end if;
  select * into v_old from public.cases where id=p_case_id for update;
  if not found then raise exception 'case not found'; end if;
  update public.cases
    set status=p_status,
        next_action=nullif(trim(p_next_action),''),
        updated_at=now()
    where id=p_case_id
    returning * into v_new;
  insert into public.audit_events(case_id,actor_id,event_type,object_type,object_id,before_data,after_data,metadata)
  values(p_case_id,v_actor,'CASE_STATUS_CHANGED','case',p_case_id::text,to_jsonb(v_old),to_jsonb(v_new),jsonb_build_object('aal',auth.jwt()->>'aal'));
  return v_new;
end
$$;

create or replace function public.set_case_decision_gate(p_case_id uuid, p_state public.gate_state, p_rationale text)
returns public.decision_gates
language sql
set search_path to ''
as $$ select private.set_case_decision_gate(p_case_id,p_state,p_rationale) $$;

create or replace function public.set_case_status(p_case_id uuid, p_status public.case_status, p_next_action text default null::text)
returns public.cases
language sql
set search_path to ''
as $$ select private.set_case_status(p_case_id,p_status,p_next_action) $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path to 'public'
as $$ begin new.updated_at = now(); return new; end $$;

create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();
create trigger trg_bootstrap_case_gate after insert on public.cases for each row execute function private.bootstrap_case_gate();

alter table public.audit_events enable row level security;
alter table public.case_members enable row level security;
alter table public.cases enable row level security;
alter table public.decision_gates enable row level security;
alter table public.documents enable row level security;
alter table public.evidence_items enable row level security;
alter table public.messages enable row level security;
alter table public.payment_records enable row level security;
alter table public.profiles enable row level security;
alter table public.questionnaire_answers enable row level security;
alter table public.stage11_bundle_chunks enable row level security;
alter table public.system_checks enable row level security;
alter table public.tasks enable row level security;

create policy audit_select on public.audit_events for select to authenticated using ((case_id is not null) and private.can_access_case(case_id) and private.is_legal_staff());
create policy case_members_select on public.case_members for select to authenticated using ((user_id = (select auth.uid())) or (private.current_app_role() = 'admin'::public.app_role) or private.can_access_case(case_id));
create policy cases_insert_client on public.cases for insert to authenticated with check ((client_user_id = (select auth.uid())) or private.is_staff());
create policy cases_select on public.cases for select to authenticated using ((client_user_id = (select auth.uid())) or (created_by = (select auth.uid())) or private.can_access_case(id));
create policy gate_select on public.decision_gates for select to authenticated using (private.can_access_case(case_id));
create policy documents_delete on public.documents for delete to authenticated using (private.can_access_case(case_id) and (((uploaded_by = (select auth.uid())) and (review_status = 'pending'::public.review_state)) or private.is_legal_staff()));
create policy documents_insert on public.documents for insert to authenticated with check (private.can_access_case(case_id) and (uploaded_by = (select auth.uid())));
create policy documents_select on public.documents for select to authenticated using (case when sensitivity = 'medical'::public.sensitivity_level then private.can_access_sensitive_case(case_id) else private.can_access_case(case_id) end);
create policy evidence_select on public.evidence_items for select to authenticated using (case when sensitivity = 'medical'::public.sensitivity_level then private.can_access_sensitive_case(case_id) else private.can_access_case(case_id) end);
create policy evidence_staff_delete on public.evidence_items for delete to authenticated using (private.is_legal_staff() and private.can_access_case(case_id));
create policy evidence_staff_insert on public.evidence_items for insert to authenticated with check (private.is_legal_staff() and private.can_access_case(case_id));
create policy evidence_staff_update on public.evidence_items for update to authenticated using (private.is_legal_staff() and private.can_access_case(case_id)) with check (private.is_legal_staff() and private.can_access_case(case_id));
create policy messages_insert on public.messages for insert to authenticated with check (private.can_access_case(case_id) and (sender_id = (select auth.uid())) and ((not is_internal) or private.is_staff()));
create policy messages_select on public.messages for select to authenticated using (private.can_access_case(case_id) and ((not is_internal) or private.is_staff()));
create policy payments_select on public.payment_records for select to authenticated using (private.can_access_case(case_id));
create policy profiles_select on public.profiles for select to authenticated using ((id = (select auth.uid())) or (private.current_app_role() = 'admin'::public.app_role));
create policy qa_insert on public.questionnaire_answers for insert to authenticated with check (private.can_access_case(case_id) and ((created_by is null) or (created_by = (select auth.uid()))));
create policy qa_select on public.questionnaire_answers for select to authenticated using (case when sensitivity = 'medical'::public.sensitivity_level then private.can_access_sensitive_case(case_id) else private.can_access_case(case_id) end);
create policy qa_update on public.questionnaire_answers for update to authenticated using (private.can_access_case(case_id)) with check (private.can_access_case(case_id) and (created_by = (select auth.uid())));
create policy stage11_deny_all on public.stage11_bundle_chunks for all to anon, authenticated using (false) with check (false);
create policy system_checks_authenticated_read on public.system_checks for select to authenticated using (true);
create policy tasks_select on public.tasks for select to authenticated using (private.can_access_case(case_id));
create policy tasks_staff_delete on public.tasks for delete to authenticated using (private.is_staff() and private.can_access_case(case_id));
create policy tasks_staff_insert on public.tasks for insert to authenticated with check (private.is_staff() and private.can_access_case(case_id));
create policy tasks_staff_update on public.tasks for update to authenticated using (private.is_staff() and private.can_access_case(case_id)) with check (private.is_staff() and private.can_access_case(case_id));

-- Least-privilege table grants captured from live state.
revoke all on all tables in schema public from anon, authenticated;
grant select on table public.audit_events to authenticated;
grant select on table public.case_members to authenticated;
grant insert, select on table public.cases to authenticated;
grant select on table public.decision_gates to authenticated;
grant delete, insert, select on table public.documents to authenticated;
grant insert, select on table public.evidence_items to authenticated;
grant insert, select on table public.messages to authenticated;
grant select on table public.payment_records to authenticated;
grant select on table public.profiles to authenticated;
grant insert, select, update on table public.questionnaire_answers to authenticated;
grant insert, select on table public.tasks to authenticated;

-- Function execution surface captured from live state.
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.can_access_case(uuid) to authenticated, service_role;
grant execute on function private.can_access_sensitive_case(uuid) to authenticated, service_role;
grant execute on function private.current_app_role() to authenticated, service_role;
grant execute on function private.is_aal2() to authenticated, service_role;
grant execute on function private.is_legal_staff() to authenticated, service_role;
grant execute on function private.is_staff() to authenticated, service_role;
grant execute on function private.set_case_decision_gate(uuid, public.gate_state, text) to authenticated, service_role;
grant execute on function private.set_case_status(uuid, public.case_status, text) to authenticated, service_role;

revoke execute on function public.set_case_decision_gate(uuid, public.gate_state, text) from public, anon;
revoke execute on function public.set_case_status(uuid, public.case_status, text) from public, anon;
grant execute on function public.set_case_decision_gate(uuid, public.gate_state, text) to authenticated, service_role;
grant execute on function public.set_case_status(uuid, public.case_status, text) to authenticated, service_role;

-- Supabase Storage is platform-provisioned. Reproduce the application bucket only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('rfl-case-documents', 'rfl-case-documents', false, 15728640, array['application/pdf','image/jpeg','image/png'])
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy rfl_storage_delete on storage.objects for delete to authenticated using ((bucket_id = 'rfl-case-documents'::text) and (name ~ '^[0-9a-fA-F-]{36}/'::text) and private.can_access_case(((storage.foldername(name))[1])::uuid));
create policy rfl_storage_insert on storage.objects for insert to authenticated with check ((bucket_id = 'rfl-case-documents'::text) and (name ~ '^[0-9a-fA-F-]{36}/'::text) and private.can_access_case(((storage.foldername(name))[1])::uuid));
create policy rfl_storage_select on storage.objects for select to authenticated using ((bucket_id = 'rfl-case-documents'::text) and (name ~ '^[0-9a-fA-F-]{36}/'::text) and private.can_access_case(((storage.foldername(name))[1])::uuid));
create policy rfl_storage_update on storage.objects for update to authenticated using ((bucket_id = 'rfl-case-documents'::text) and (name ~ '^[0-9a-fA-F-]{36}/'::text) and private.can_access_case(((storage.foldername(name))[1])::uuid)) with check ((bucket_id = 'rfl-case-documents'::text) and (name ~ '^[0-9a-fA-F-]{36}/'::text) and private.can_access_case(((storage.foldername(name))[1])::uuid));

commit;
