create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan subscription_plan not null default 'free',
  status subscription_status not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text unique,
  stripe_price_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  last_monthly_grant_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_idx on public.subscriptions (user_id, created_at desc);

comment on table public.subscriptions is 'Mirrors Stripe subscription state. Every user gets a free-plan row at signup (see handle_new_user trigger); paid plans update this row via Stripe webhooks only.';
