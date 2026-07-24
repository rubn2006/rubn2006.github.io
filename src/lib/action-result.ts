/**
 * Shared server-action result shape. Every Server Action in the app returns
 * this instead of throwing, so client components always get a typed,
 * user-safe message — raw errors (Postgres, Supabase, provider SDKs) are
 * logged server-side only and never forwarded to the client.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function actionError(
  error: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult<never> {
  return { success: false, error, fieldErrors };
}

/** Log the real error server-side, return a safe generic message to the client. */
export function actionErrorFromUnknown(context: string, err: unknown): ActionResult<never> {
  console.error(`[${context}]`, err);
  return actionError("Une erreur inattendue est survenue. Merci de réessayer.");
}
