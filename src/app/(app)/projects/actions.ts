"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { actionError, actionErrorFromUnknown, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { projectFormSchema } from "@/lib/validations/project";

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

export async function createProject(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = projectFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    type: formData.get("type"),
    defaultPlatform: formData.get("defaultPlatform") || undefined,
  });
  if (!parsed.success) {
    return actionError("Merci de corriger les champs indiqués.", fieldErrorsFromZod(parsed.error));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  let projectId: string;
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        type: parsed.data.type,
        default_platform: parsed.data.defaultPlatform ?? null,
      })
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("insert failed");
    projectId = data.id;
  } catch (err) {
    return actionErrorFromUnknown("createProject", err);
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect(`/projects/${projectId}`);
}

export async function archiveProject(projectId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  const { error } = await supabase
    .from("projects")
    .update({ is_archived: true })
    .eq("id", projectId)
    .eq("user_id", user.id);
  if (error) return actionErrorFromUnknown("archiveProject", error);

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function deleteProject(projectId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionError("Ta session a expiré. Merci de te reconnecter.");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);
  if (error) return actionErrorFromUnknown("deleteProject", error);

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}
