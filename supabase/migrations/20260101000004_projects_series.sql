create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  type project_type not null default 'series',
  default_platform text check (default_platform in ('tiktok', 'instagram_reels', 'youtube_shorts')),
  cover_asset_id uuid,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_idx on public.projects (user_id, created_at desc);

create table public.series (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  universe_description text,
  visual_style text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index series_project_idx on public.series (project_id);
create index series_user_idx on public.series (user_id, created_at desc);

comment on table public.projects is 'Top-level container a user creates from the dashboard. A project is either a recurring "series" (grouping multiple series/episodes) or a standalone ad video.';
comment on table public.series is 'A recurring show/universe inside a project: locks a visual style and groups episodes that share characters and world.';
