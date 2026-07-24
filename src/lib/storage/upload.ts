import "server-only";
import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables } from "@/types/database";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export const ALLOWED_IMAGE_TYPES = Object.keys(EXTENSION_BY_MIME);

export function validateImageFile(file: File, maxBytes: number): string | null {
  if (file.size === 0) return "Le fichier est vide.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Format d'image non supporté (PNG, JPEG ou WebP uniquement).";
  }
  if (file.size > maxBytes) {
    return `L'image dépasse la taille maximale autorisée (${Math.round(maxBytes / 1024 / 1024)} Mo).`;
  }
  return null;
}

type PrivateBucket =
  | "character-references"
  | "generated-images"
  | "generated-clips"
  | "generated-audio"
  | "final-videos"
  | "thumbnails";

export async function uploadImageAsset(params: {
  supabase: SupabaseClient<Database>;
  userId: string;
  bucket: PrivateBucket | "avatars";
  file: File;
  kind: Tables<"assets">["kind"];
  relatedCharacterId?: string;
  relatedProjectId?: string;
}): Promise<{ assetId: string; path: string } | { error: string }> {
  const ext = EXTENSION_BY_MIME[params.file.type] ?? "bin";
  // Never trust the client-supplied filename: sanitize by generating our own.
  const path = `${params.userId}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await params.supabase.storage
    .from(params.bucket)
    .upload(path, params.file, { contentType: params.file.type, upsert: false });
  if (uploadError) {
    console.error("[uploadImageAsset] storage upload failed", uploadError);
    return { error: "Le téléversement de l'image a échoué." };
  }

  const { data: asset, error: assetError } = await params.supabase
    .from("assets")
    .insert({
      user_id: params.userId,
      kind: params.kind,
      bucket: params.bucket,
      storage_path: path,
      mime_type: params.file.type,
      file_size_bytes: params.file.size,
      related_character_id: params.relatedCharacterId,
      related_project_id: params.relatedProjectId,
    })
    .select("id")
    .single();

  if (assetError || !asset) {
    console.error("[uploadImageAsset] asset insert failed", assetError);
    await params.supabase.storage.from(params.bucket).remove([path]);
    return { error: "Impossible d'enregistrer l'image." };
  }

  return { assetId: asset.id, path };
}

export async function getSignedAssetUrl(
  supabase: SupabaseClient<Database>,
  bucket: PrivateBucket,
  path: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) {
    console.error("[getSignedAssetUrl] failed", error);
    return null;
  }
  return data.signedUrl;
}
