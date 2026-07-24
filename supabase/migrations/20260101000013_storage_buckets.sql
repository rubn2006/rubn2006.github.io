-- ============================================================================
-- Storage buckets (spec §14)
--
-- Convention: every object lives at `{bucket}/{user_id}/{...}` so a single
-- folder-prefix RLS policy can cover every bucket. All buckets are private
-- (served through signed URLs from the server) except `avatars`, which is
-- small, low-sensitivity, and shown all over the UI as plain <img> tags.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp']),
  ('character-references', 'character-references', false, 15728640, array['image/png', 'image/jpeg', 'image/webp']),
  ('generated-images', 'generated-images', false, 15728640, array['image/png', 'image/jpeg', 'image/webp']),
  ('generated-clips', 'generated-clips', false, 209715200, array['video/mp4', 'video/webm']),
  ('generated-audio', 'generated-audio', false, 52428800, array['audio/mpeg', 'audio/wav', 'audio/mp4']),
  ('final-videos', 'final-videos', false, 524288000, array['video/mp4']),
  ('thumbnails', 'thumbnails', false, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- avatars: public read, owner-only write
create policy "avatars_public_read" on storage.objects for select
  using (bucket_id = 'avatars');
create policy "avatars_owner_write" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_update" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_delete" on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Remaining buckets: fully private, owner-only via folder prefix.
do $$
declare
  b text;
  private_buckets text[] := array[
    'character-references', 'generated-images', 'generated-clips',
    'generated-audio', 'final-videos', 'thumbnails'
  ];
begin
  foreach b in array private_buckets loop
    execute format(
      $p$create policy "%1$s_owner_select" on storage.objects for select
        using (bucket_id = %2$L and (storage.foldername(name))[1] = auth.uid()::text)$p$,
      b, b
    );
    execute format(
      $p$create policy "%1$s_owner_insert" on storage.objects for insert
        with check (bucket_id = %2$L and (storage.foldername(name))[1] = auth.uid()::text)$p$,
      b, b
    );
    execute format(
      $p$create policy "%1$s_owner_update" on storage.objects for update
        using (bucket_id = %2$L and (storage.foldername(name))[1] = auth.uid()::text)$p$,
      b, b
    );
    execute format(
      $p$create policy "%1$s_owner_delete" on storage.objects for delete
        using (bucket_id = %2$L and (storage.foldername(name))[1] = auth.uid()::text)$p$,
      b, b
    );
  end loop;
end;
$$;
