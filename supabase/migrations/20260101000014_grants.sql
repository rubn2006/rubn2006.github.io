-- ============================================================================
-- Data API grants
--
-- Recent Supabase projects (and this CLI version) no longer auto-expose new
-- public-schema tables to the Data API roles (anon, authenticated,
-- service_role) — every table needs an explicit GRANT or PostgREST returns
-- permission denied regardless of RLS. RLS then narrows rows within whatever
-- the GRANT allows. `service_role` also needs explicit grants: BYPASSRLS
-- skips policy evaluation, it does not imply table privileges.
-- ============================================================================

grant usage on schema public to anon, authenticated, service_role;

-- service_role: full access to every table, used only by trusted server code
-- (webhooks, the credit engine, job workers, admin routes).
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;

-- authenticated: matches the RLS policies in 20260101000012_rls_policies.sql
grant select, update on public.profiles to authenticated;
grant select, update on public.user_preferences to authenticated;
grant select on public.credit_wallets to authenticated;
grant select on public.credit_transactions to authenticated;
grant select on public.subscriptions to authenticated;

grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.series to authenticated;
grant select, insert, update, delete on public.characters to authenticated;
grant select, insert, update, delete on public.character_reference_images to authenticated;
grant select, insert, update, delete on public.episodes to authenticated;
grant select, insert, update, delete on public.storyboards to authenticated;
grant select, insert, update, delete on public.scenes to authenticated;

grant select on public.generation_jobs to authenticated;
grant select on public.scene_generations to authenticated;
grant select on public.audio_generations to authenticated;
grant select on public.video_renders to authenticated;

grant select, insert, delete on public.assets to authenticated;

-- profiles.role / stripe_customer_id must stay server-managed even though the
-- table-level UPDATE grant above includes them; this narrows it to safe columns.
-- onboarding_completed_at is included because the user legitimately marks
-- their own onboarding done/skipped from the onboarding flow.
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url, onboarding_completed_at) on public.profiles to authenticated;

-- provider_costs, webhook_events, audit_logs: intentionally no anon/authenticated
-- grants. Only service_role (granted above) can reach them.
