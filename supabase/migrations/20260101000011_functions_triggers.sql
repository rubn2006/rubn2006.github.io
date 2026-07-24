create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
  tables_with_updated_at text[] := array[
    'profiles', 'user_preferences', 'credit_wallets', 'subscriptions',
    'projects', 'series', 'characters', 'episodes', 'storyboards', 'scenes',
    'generation_jobs', 'scene_generations', 'audio_generations', 'video_renders',
    'provider_costs'
  ];
begin
  foreach t in array tables_with_updated_at loop
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute procedure public.set_updated_at()',
      t
    );
  end loop;
end;
$$;

-- Creates profile + preferences + wallet + free-plan subscription and grants
-- signup credits the moment a new Supabase auth user is created. SECURITY
-- DEFINER because this runs before any user-scoped RLS session exists.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  signup_credits integer := 40;
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.user_preferences (user_id)
  values (new.id);

  insert into public.credit_wallets (user_id, balance, lifetime_granted)
  values (new.id, signup_credits, signup_credits);

  insert into public.credit_transactions (
    user_id, type, amount, balance_before, balance_after, reason, idempotency_key
  )
  values (
    new.id,
    'grant_signup',
    signup_credits,
    0,
    signup_credits,
    'Crédits offerts à l''inscription',
    'signup-grant-' || new.id::text
  );

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

comment on function public.handle_new_user() is 'Bootstraps profile/preferences/wallet/subscription and grants FREE_SIGNUP_CREDITS (src/lib/config/pricing.ts) for every new auth user. Keep the literal here in sync with that constant.';
