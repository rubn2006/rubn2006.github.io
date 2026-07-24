create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind asset_kind not null,
  bucket text not null,
  storage_path text not null,
  mime_type text,
  file_size_bytes bigint,
  width integer,
  height integer,
  duration_seconds numeric(6, 2),

  related_character_id uuid references public.characters (id) on delete set null,
  related_project_id uuid references public.projects (id) on delete set null,
  related_episode_id uuid references public.episodes (id) on delete set null,
  related_scene_id uuid references public.scenes (id) on delete set null,

  metadata jsonb not null default '{}'::jsonb,
  is_temporary boolean not null default false,
  expires_at timestamptz,

  created_at timestamptz not null default now()
);

create index assets_user_idx on public.assets (user_id, created_at desc);
create unique index assets_bucket_path_idx on public.assets (bucket, storage_path);
create index assets_cleanup_idx on public.assets (expires_at) where is_temporary;

comment on table public.assets is 'Registry row for every object in Supabase Storage across all buckets. Access is always through this table + signed URLs, never a public bucket URL.';

-- Deferred foreign keys now that public.assets exists.
alter table public.projects
  add constraint projects_cover_asset_fk foreign key (cover_asset_id) references public.assets (id) on delete set null;

alter table public.characters
  add constraint characters_primary_reference_asset_fk foreign key (primary_reference_asset_id) references public.assets (id) on delete set null;

alter table public.character_reference_images
  add constraint character_reference_images_asset_fk foreign key (asset_id) references public.assets (id) on delete cascade;

alter table public.scenes
  add constraint scenes_reference_asset_fk foreign key (reference_asset_id) references public.assets (id) on delete set null;

create table public.scene_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  job_id uuid references public.generation_jobs (id) on delete set null,

  generation_kind text not null check (generation_kind in ('image', 'video')),
  provider text not null,
  model text,
  seed text,
  prompt text,
  negative_prompt text,
  duration_seconds numeric(5, 2),
  resolution text,
  cost_credits integer not null default 0,
  provider_generation_id text,
  status generation_status not null default 'queued',
  asset_id uuid references public.assets (id) on delete set null,
  error_message text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index scene_generations_scene_idx on public.scene_generations (scene_id, created_at desc);
create index scene_generations_user_idx on public.scene_generations (user_id);

create table public.audio_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  scene_id uuid references public.scenes (id) on delete cascade,
  character_id uuid references public.characters (id) on delete set null,
  job_id uuid references public.generation_jobs (id) on delete set null,

  audio_kind text not null check (audio_kind in ('voice', 'music', 'sfx')),
  provider text,
  voice_id text,
  text_input text,
  language text not null default 'fr',
  speed numeric(3, 2) not null default 1.0,
  stability numeric(3, 2),
  style text,
  duration_seconds numeric(6, 2),
  cost_credits integer not null default 0,
  status generation_status not null default 'queued',
  asset_id uuid references public.assets (id) on delete set null,
  error_message text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index audio_generations_episode_idx on public.audio_generations (episode_id);
create index audio_generations_user_idx on public.audio_generations (user_id);

create table public.video_renders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  job_id uuid references public.generation_jobs (id) on delete set null,

  target_platform text check (target_platform in ('tiktok', 'instagram_reels', 'youtube_shorts')),
  resolution text not null default '1080x1920',
  fps integer not null default 30,
  has_watermark boolean not null default true,
  subtitle_style text,

  music_asset_id uuid references public.assets (id) on delete set null,
  logo_asset_id uuid references public.assets (id) on delete set null,
  final_asset_id uuid references public.assets (id) on delete set null,
  thumbnail_asset_id uuid references public.assets (id) on delete set null,

  duration_seconds numeric(6, 2),
  file_size_bytes bigint,
  status generation_status not null default 'draft',
  error_message text,
  credits_cost integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index video_renders_episode_idx on public.video_renders (episode_id, created_at desc);
create index video_renders_user_idx on public.video_renders (user_id);
