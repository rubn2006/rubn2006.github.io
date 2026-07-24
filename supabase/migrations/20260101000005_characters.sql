create table public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  series_id uuid references public.series (id) on delete set null,

  name text not null,
  description text,
  species character_species not null default 'other',
  species_other text,

  physical_appearance text,
  primary_colors text[] not null default '{}',
  accessories text[] not null default '{}',
  clothing text,

  personality text,
  speech_style text,
  default_emotion text not null default 'neutral',

  voice_provider text,
  voice_id text,
  voice_settings jsonb not null default '{}'::jsonb,

  primary_reference_asset_id uuid,
  visual_prompt_locked text,
  negative_prompt text,
  universe text,

  is_locked boolean not null default true,
  is_template boolean not null default false,
  rights_confirmed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index characters_user_idx on public.characters (user_id, created_at desc);
create index characters_project_idx on public.characters (project_id);
create index characters_series_idx on public.characters (series_id);

comment on table public.characters is 'Character sheet used to build a locked, reusable prompt block (see buildCharacterConsistencyPrompt) so every scene/episode stays visually and behaviourally consistent.';
comment on column public.characters.is_locked is 'Character lock: when true, generation pipelines must not silently alter appearance/personality fields.';
comment on column public.characters.rights_confirmed is 'User confirmed they own rights to any imported reference image for this character (spec §13).';

create table public.character_reference_images (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  asset_id uuid not null,
  label text,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index character_reference_images_character_idx on public.character_reference_images (character_id);
create unique index character_reference_images_primary_idx
  on public.character_reference_images (character_id)
  where is_primary;
