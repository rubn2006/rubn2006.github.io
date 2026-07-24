"use server";

import { redirect } from "next/navigation";

import { actionError, actionErrorFromUnknown, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";

function nullableString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function completeOnboarding(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  const answeredForReal = formData.get("intent") !== "skip";

  try {
    const { error: prefsError } = await supabase
      .from("user_preferences")
      .update({
        profile_kind: nullableString(formData.get("profile_kind")),
        content_type: nullableString(formData.get("content_type")),
        main_platform: nullableString(formData.get("main_platform")),
        experience_level: nullableString(formData.get("experience_level")),
        monthly_goal: nullableString(formData.get("monthly_goal")),
        preferred_style: nullableString(formData.get("preferred_style")),
        onboarding_completed: answeredForReal,
      })
      .eq("user_id", user.id);
    if (prefsError) throw prefsError;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ onboarding_completed_at: new Date().toISOString() })
      .eq("id", user.id);
    if (profileError) throw profileError;
  } catch (err) {
    return actionErrorFromUnknown("completeOnboarding", err);
  }

  redirect("/dashboard");
}
