/**
 * Bucket size limits — must stay in sync with
 * supabase/migrations/20260101000013_storage_buckets.sql. The DB is the
 * actual enforcement point; these are used to fail fast client/server-side
 * with a friendly message before hitting Storage.
 */
export const BUCKET_SIZE_LIMITS = {
  avatars: 5 * 1024 * 1024,
  "character-references": 15 * 1024 * 1024,
  "generated-images": 15 * 1024 * 1024,
  "generated-clips": 200 * 1024 * 1024,
  "generated-audio": 50 * 1024 * 1024,
  "final-videos": 500 * 1024 * 1024,
  thumbnails: 5 * 1024 * 1024,
} as const;
