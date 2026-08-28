-- Production-readiness fix applied to Supabase on 2026-08-28.
-- The questionnaire API uses upsert on (case_id, field_key), so authenticated
-- clients require UPDATE in addition to INSERT/SELECT when editing an existing
-- saved answer. RLS still controls row ownership and sensitivity.

grant update on table public.questionnaire_answers to authenticated;
