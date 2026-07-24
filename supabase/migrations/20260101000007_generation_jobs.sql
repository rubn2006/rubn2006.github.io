create table public.generation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  episode_id uuid references public.episodes (id) on delete set null,
  scene_id uuid references public.scenes (id) on delete set null,

  job_type job_type not null,
  status generation_status not null default 'queued',
  progress integer not null default 0 check (progress between 0 and 100),
  step text,
  user_message text,
  internal_error text,

  attempt_count integer not null default 0,
  max_attempts integer not null default 3,

  provider text,
  external_id text,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,

  credits_reserved integer not null default 0,
  credits_debited integer not null default 0,
  idempotency_key text unique,

  started_at timestamptz,
  finished_at timestamptz,
  next_retry_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index generation_jobs_user_idx on public.generation_jobs (user_id, created_at desc);
create index generation_jobs_status_idx on public.generation_jobs (status);
create index generation_jobs_episode_idx on public.generation_jobs (episode_id);
create index generation_jobs_retry_idx on public.generation_jobs (next_retry_at) where status = 'failed';

comment on table public.generation_jobs is 'Every async pipeline step (script/storyboard/image/video/audio/subtitles/render/upload) is one traceable job row. Retries use exponential backoff via next_retry_at and stop at max_attempts.';
