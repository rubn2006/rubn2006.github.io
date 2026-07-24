import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables } from "@/types/database";
import { getSignedAssetUrl } from "@/lib/storage/upload";

/**
 * Batch-resolves signed URLs for characters' primary reference image.
 * Two plain queries + N signed-url calls rather than a PostgREST embed, so
 * this stays easy to reason about without a live Storage service to test
 * embed syntax against.
 */
export async function resolveCharacterImageUrls(
  supabase: SupabaseClient<Database>,
  characters: Pick<Tables<"characters">, "id" | "primary_reference_asset_id">[],
): Promise<Map<string, string>> {
  const assetIds = characters
    .map((c) => c.primary_reference_asset_id)
    .filter((id): id is string => Boolean(id));

  if (assetIds.length === 0) return new Map();

  const { data: assets } = await supabase
    .from("assets")
    .select("id, bucket, storage_path")
    .in("id", assetIds);

  if (!assets) return new Map();

  const signedByAssetId = new Map<string, string>();
  await Promise.all(
    assets.map(async (asset) => {
      const url = await getSignedAssetUrl(
        supabase,
        asset.bucket as "character-references",
        asset.storage_path,
      );
      if (url) signedByAssetId.set(asset.id, url);
    }),
  );

  const result = new Map<string, string>();
  for (const character of characters) {
    const url = character.primary_reference_asset_id
      ? signedByAssetId.get(character.primary_reference_asset_id)
      : undefined;
    if (url) result.set(character.id, url);
  }
  return result;
}
