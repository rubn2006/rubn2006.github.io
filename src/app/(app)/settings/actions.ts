"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  actionError,
  actionErrorFromUnknown,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validations/settings";

export async function updateProfile(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateProfileSchema.safeParse({ fullName: formData.get("fullName") });
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Champ invalide.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);
  if (error) return actionErrorFromUnknown("updateProfile", error);

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return actionSuccess(undefined);
}

/**
 * Deletes the currently authenticated user's own account. Always resolves
 * the target id from the caller's own session — never accepts a client-
 * supplied user id — before using the service role (required: deleting an
 * auth user is only possible via the Admin API).
 */
export async function deleteOwnAccount(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;
  } catch (err) {
    return actionErrorFromUnknown("deleteOwnAccount", err);
  }

  await supabase.auth.signOut();
  redirect("/");
}
