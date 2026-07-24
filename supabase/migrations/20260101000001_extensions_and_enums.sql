-- Extensions
create extension if not exists "pgcrypto" with schema public;

-- Enums
create type generation_status as enum (
  'draft',
  'queued',
  'processing',
  'awaiting_provider',
  'succeeded',
  'partially_succeeded',
  'failed',
  'cancelled',
  'refunded'
);

create type subscription_plan as enum ('free', 'starter', 'creator', 'pro');

create type subscription_status as enum (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'unpaid',
  'paused'
);

create type credit_transaction_type as enum (
  'grant_signup',
  'grant_monthly',
  'purchase',
  'reservation',
  'debit',
  'refund',
  'adjustment_admin',
  'expiration'
);

create type project_type as enum ('series', 'standalone_ad');

create type character_species as enum (
  'fruit',
  'animal',
  'human',
  'brainrot',
  'mascot',
  'object',
  'other'
);

create type asset_kind as enum (
  'character_reference',
  'scene_image',
  'scene_clip',
  'audio_voice',
  'audio_music',
  'audio_sfx',
  'final_video',
  'thumbnail',
  'subtitle',
  'logo',
  'avatar'
);

create type job_type as enum (
  'script_generation',
  'storyboard_generation',
  'character_reference_generation',
  'scene_image_generation',
  'scene_video_generation',
  'audio_generation',
  'subtitle_generation',
  'ffmpeg_render',
  'upload_final'
);

create type provider_kind as enum ('text', 'image', 'video', 'voice', 'music', 'moderation');

comment on type generation_status is 'Shared status enum for jobs, scenes, storyboards, renders and generations.';
