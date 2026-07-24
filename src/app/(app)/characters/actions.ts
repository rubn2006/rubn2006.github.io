"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { actionError, actionErrorFromUnknown, type ActionResult } from "@/lib/action-result";
import { BUCKET_SIZE_LIMITS } from "@/lib/config/storage";
import { createClient } from "@/lib/supabase/server";
import { uploadImageAsset, validateImageFile } from "@/lib/storage/upload";
import { characterFormSchema } from "@/lib/validations/character";

function fieldErrorsFromZod(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}) {
  const flat = error.flatten().fieldErrors;
  const out: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(flat)) {
    if (value) out[key] = value;
  }
  return out;
}

function parseCharacterForm(formData: FormData) {
  return characterFormSchema.safeParse({
    name: formData.get("name"),
    species: formData.get("species"),
    speciesOther: formData.get("speciesOther") || undefined,
    description: formData.get("description") || undefined,
    physicalAppearance: formData.get("physicalAppearance") || undefined,
    primaryColors: formData.get("primaryColors") || "",
    accessories: formData.get("accessories") || "",
    clothing: formData.get("clothing") || undefined,
    personality: formData.get("personality") || undefined,
    speechStyle: formData.get("speechStyle") || undefined,
    defaultEmotion: formData.get("defaultEmotion") || "neutre",
    voiceId: formData.get("voiceId") || undefined,
    visualPromptLocked: formData.get("visualPromptLocked") || undefined,
    negativePrompt: formData.get("negativePrompt") || undefined,
    universe: formData.get("universe") || undefined,
    isLocked: formData.get("isLocked"),
    rightsConfirmed: formData.get("rightsConfirmed"),
    projectId: formData.get("projectId") || "",
    seriesId: formData.get("seriesId") || "",
  });
}

export async function createCharacter(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = parseCharacterForm(formData);
  if (!parsed.success) {
    return actionError("Merci de corriger les champs indiqués.", fieldErrorsFromZod(parsed.error));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  const referenceImage = formData.get("referenceImage");
  if (referenceImage instanceof File && referenceImage.size > 0) {
    const validationError = validateImageFile(
      referenceImage,
      BUCKET_SIZE_LIMITS["character-references"],
    );
    if (validationError) return actionError(validationError, { referenceImage: [validationError] });
  }

  let characterId: string;
  try {
    const { data: character, error } = await supabase
      .from("characters")
      .insert({
        user_id: user.id,
        name: parsed.data.name,
        species: parsed.data.species,
        species_other: parsed.data.speciesOther ?? null,
        description: parsed.data.description ?? null,
        physical_appearance: parsed.data.physicalAppearance ?? null,
        primary_colors: parsed.data.primaryColors,
        accessories: parsed.data.accessories,
        clothing: parsed.data.clothing ?? null,
        personality: parsed.data.personality ?? null,
        speech_style: parsed.data.speechStyle ?? null,
        default_emotion: parsed.data.defaultEmotion,
        voice_provider: parsed.data.voiceId ? "mock" : null,
        voice_id: parsed.data.voiceId ?? null,
        visual_prompt_locked: parsed.data.visualPromptLocked ?? null,
        negative_prompt: parsed.data.negativePrompt ?? null,
        universe: parsed.data.universe ?? null,
        is_locked: parsed.data.isLocked,
        rights_confirmed: parsed.data.rightsConfirmed,
        project_id: parsed.data.projectId || null,
        series_id: parsed.data.seriesId || null,
      })
      .select("id")
      .single();
    if (error || !character) throw error ?? new Error("insert failed");
    characterId = character.id;

    if (referenceImage instanceof File && referenceImage.size > 0) {
      const uploadResult = await uploadImageAsset({
        supabase,
        userId: user.id,
        bucket: "character-references",
        file: referenceImage,
        kind: "character_reference",
        relatedCharacterId: characterId,
      });
      if ("error" in uploadResult) {
        return actionError(uploadResult.error);
      }
      await supabase.from("character_reference_images").insert({
        character_id: characterId,
        user_id: user.id,
        asset_id: uploadResult.assetId,
        is_primary: true,
      });
      await supabase
        .from("characters")
        .update({ primary_reference_asset_id: uploadResult.assetId })
        .eq("id", characterId);
    }
  } catch (err) {
    return actionErrorFromUnknown("createCharacter", err);
  }

  revalidatePath("/characters");
  redirect(`/characters/${characterId}`);
}

export async function updateCharacter(
  characterId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseCharacterForm(formData);
  if (!parsed.success) {
    return actionError("Merci de corriger les champs indiqués.", fieldErrorsFromZod(parsed.error));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  const referenceImage = formData.get("referenceImage");
  if (referenceImage instanceof File && referenceImage.size > 0) {
    const validationError = validateImageFile(
      referenceImage,
      BUCKET_SIZE_LIMITS["character-references"],
    );
    if (validationError) return actionError(validationError, { referenceImage: [validationError] });
  }

  try {
    const { error } = await supabase
      .from("characters")
      .update({
        name: parsed.data.name,
        species: parsed.data.species,
        species_other: parsed.data.speciesOther ?? null,
        description: parsed.data.description ?? null,
        physical_appearance: parsed.data.physicalAppearance ?? null,
        primary_colors: parsed.data.primaryColors,
        accessories: parsed.data.accessories,
        clothing: parsed.data.clothing ?? null,
        personality: parsed.data.personality ?? null,
        speech_style: parsed.data.speechStyle ?? null,
        default_emotion: parsed.data.defaultEmotion,
        voice_provider: parsed.data.voiceId ? "mock" : null,
        voice_id: parsed.data.voiceId ?? null,
        visual_prompt_locked: parsed.data.visualPromptLocked ?? null,
        negative_prompt: parsed.data.negativePrompt ?? null,
        universe: parsed.data.universe ?? null,
        is_locked: parsed.data.isLocked,
        rights_confirmed: parsed.data.rightsConfirmed,
        project_id: parsed.data.projectId || null,
        series_id: parsed.data.seriesId || null,
      })
      .eq("id", characterId)
      .eq("user_id", user.id);
    if (error) throw error;

    if (referenceImage instanceof File && referenceImage.size > 0) {
      const uploadResult = await uploadImageAsset({
        supabase,
        userId: user.id,
        bucket: "character-references",
        file: referenceImage,
        kind: "character_reference",
        relatedCharacterId: characterId,
      });
      if ("error" in uploadResult) return actionError(uploadResult.error);

      await supabase
        .from("character_reference_images")
        .update({ is_primary: false })
        .eq("character_id", characterId);
      await supabase.from("character_reference_images").insert({
        character_id: characterId,
        user_id: user.id,
        asset_id: uploadResult.assetId,
        is_primary: true,
      });
      await supabase
        .from("characters")
        .update({ primary_reference_asset_id: uploadResult.assetId })
        .eq("id", characterId);
    }
  } catch (err) {
    return actionErrorFromUnknown("updateCharacter", err);
  }

  revalidatePath("/characters");
  revalidatePath(`/characters/${characterId}`);
  redirect(`/characters/${characterId}`);
}

export async function deleteCharacter(characterId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  const { error } = await supabase
    .from("characters")
    .delete()
    .eq("id", characterId)
    .eq("user_id", user.id);
  if (error) return actionErrorFromUnknown("deleteCharacter", error);

  revalidatePath("/characters");
  redirect("/characters");
}
