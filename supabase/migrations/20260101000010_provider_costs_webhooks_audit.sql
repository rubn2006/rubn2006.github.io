create table public.provider_costs (
  id uuid primary key default gen_random_uuid(),
  provider provider_kind not null,
  provider_name text not null,
  model text,
  unit text not null,
  cost_usd numeric(10, 4) not null,
  credits_charged integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_name, model, unit)
);

comment on table public.provider_costs is 'Reference table for real provider cost vs. credits charged, used by the admin margin dashboard (Phase 5). Service-role access only.';

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'stripe',
  event_type text not null,
  external_event_id text not null,
  payload jsonb not null,
  processed_at timestamptz,
  processing_error text,
  created_at timestamptz not null default now(),
  unique (source, external_event_id)
);

comment on table public.webhook_events is 'Every processed webhook (Stripe, etc.) is recorded here keyed by external event id, giving idempotent processing on redelivery. Service-role access only.';

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles (id) on delete set null,
  actor_is_admin boolean not null default false,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_actor_idx on public.audit_logs (actor_user_id, created_at desc);
create index audit_logs_target_idx on public.audit_logs (target_table, target_id);

comment on table public.audit_logs is 'Append-only trail for admin/privileged actions (credit adjustments, refunds, account suspension, etc). Service-role access only.';
