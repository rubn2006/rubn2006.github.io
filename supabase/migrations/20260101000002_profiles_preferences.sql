create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  stripe_customer_id text unique,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth.users user. Admin status is verified server-side against ADMIN_EMAILS, the role column is informational only.';

create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  profile_kind text check (profile_kind in ('creator', 'brand', 'agency', 'business')),
  content_type text,
  main_platform text check (main_platform in ('tiktok', 'instagram_reels', 'youtube_shorts', 'multi')),
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')),
  monthly_goal text,
  preferred_style text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.credit_wallets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  lifetime_granted integer not null default 0,
  lifetime_spent integer not null default 0,
  updated_at timestamptz not null default now()
);

comment on table public.credit_wallets is 'Cached balance for fast reads. Source of truth for history is credit_transactions; never derive balance from anything but the ledger sum.';

-- The handle_new_user() trigger that populates these tables (plus subscriptions
-- and the signup credit_transactions entry) is created in
-- 20260101000011_functions_triggers.sql, once every referenced table exists.
