create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  series_id uuid references public.series (id) on delete set null,

  title text,
  idea_prompt text not null,
  character_ids uuid[] not null default '{}',

  tone text,
  duration_seconds integer not null default 45,
  scene_count_target integer not null default 5,
  target_platform text check (target_platform in ('tiktok', 'instagram_reels', 'youtube_shorts')),
  language text not null default 'fr',
  target_audience text,
  absurdity_level integer check (absurdity_level between 1 and 5),
  drama_intensity integer check (drama_intensity between 1 and 5),
  call_to_action text,
  visual_style text,

  hook text,
  synopsis text,
  cliffhanger text,
  caption text,
  hashtags text[] not null default '{}',

  status generation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index episodes_user_idx on public.episodes (user_id, created_at desc);
create index episodes_project_idx on public.episodes (project_id);
create index episodes_series_idx on public.episodes (series_id);

comment on table public.episodes is 'One generated video episode: the wizard idea + generated script metadata. Scenes live in storyboards/scenes below.';

create table public.storyboards (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.episodes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status generation_status not null default 'draft',
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index storyboards_episode_idx on public.storyboards (episode_id);

create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  storyboard_id uuid not null references public.storyboards (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,

  scene_number integer not null,
  duration_seconds numeric(5, 2) not null default 5,
  visual_description text,
  camera_direction text,
  environment text,
  characters_present uuid[] not null default '{}',
  character_actions jsonb not null default '{}'::jsonb,
  emotions jsonb not null default '{}'::jsonb,
  dialogue jsonb not null default '[]'::jsonb,
  narration text,
  sound_effects text[] not null default '{}',
  transition text,

  image_prompt text,
  video_prompt text,
  negative_prompt text,
  reference_asset_id uuid,

  estimated_credit_cost integer not null default 0,
  status generation_status not null default 'draft',
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint scenes_storyboard_number_unique unique (storyboard_id, scene_number)
);

create index scenes_storyboard_idx on public.scenes (storyboard_id, sort_order);
create index scenes_episode_idx on public.scenes (episode_id);
