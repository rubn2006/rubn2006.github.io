create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type credit_transaction_type not null,
  amount integer not null,
  balance_before integer not null,
  balance_after integer not null,
  project_id uuid references public.projects (id) on delete set null,
  generation_id uuid references public.generation_jobs (id) on delete set null,
  provider text,
  reason text,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);

create index credit_transactions_user_idx on public.credit_transactions (user_id, created_at desc);
create index credit_transactions_generation_idx on public.credit_transactions (generation_id);

comment on table public.credit_transactions is 'Immutable ledger. This is the sole source of truth for a user''s credit history; credit_wallets.balance is only a cache derived from this table. Never update or delete a row here.';
comment on column public.credit_transactions.amount is 'Positive for grants/refunds/purchases, negative for reservations/debits.';
comment on column public.credit_transactions.idempotency_key is 'Prevents double-debit/double-grant on retries (e.g. Stripe webhook redelivery, job retry).';

-- Ledger rows are financial records: nobody, including the owning user, may
-- update or delete them from the client. All mutation happens via INSERT
-- through server-side code using the service role.
revoke update, delete on public.credit_transactions from authenticated, anon;
