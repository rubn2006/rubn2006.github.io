-- Local development seed data. Run automatically by `supabase db reset`.
-- Only reference data that doesn't depend on an auth user goes here — see
-- README.md "Seed a demo account" for how to populate a demo project/
-- character (Ruby the strawberry) once you have a real signed-up user id.

insert into public.provider_costs (provider, provider_name, model, unit, cost_usd, credits_charged, is_active)
values
  ('text', 'mock', 'mock-text-1', 'per_1k_tokens', 0, 0, true),
  ('text', 'openai', 'gpt-4.1-mini', 'per_1k_tokens', 0.15, 1, true),
  ('text', 'anthropic', 'claude-sonnet', 'per_1k_tokens', 3.00, 3, true),
  ('image', 'mock', 'mock-image-1', 'per_image', 0, 0, true),
  ('image', 'openai', 'gpt-image-1', 'per_image', 0.04, 3, true),
  ('video', 'mock', 'mock-video-1', 'per_second', 0, 0, true),
  ('video', 'kling', 'kling-v1', 'per_second', 0.35, 4, true),
  ('video', 'runway', 'gen-3-alpha', 'per_second', 0.50, 5, true),
  ('video', 'luma', 'dream-machine', 'per_second', 0.40, 4, true),
  ('voice', 'mock', 'mock-voice-1', 'per_10_seconds', 0, 0, true),
  ('voice', 'elevenlabs', 'eleven-multilingual-v2', 'per_10_seconds', 0.05, 2, true),
  ('music', 'mock', 'mock-music-1', 'per_track', 0, 0, true)
on conflict (provider_name, model, unit) do nothing;
