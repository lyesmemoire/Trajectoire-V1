/**
 * Legacy CV editor completion guard.
 *
 * Historical implementation queried:
 *
 *   public.profiles.cv_editor_completed
 *
 * That database contract no longer exists in the canonical schema.
 *
 * IMPORTANT:
 * `users.onboardingCompleted` is NOT treated as an equivalent field because
 * onboarding completion and CV-editor completion are different business
 * concepts.
 *
 * No current application caller depends on this guard.
 *
 * The function is deliberately kept for compatibility and fails closed.
 * If CV-editor gating is reintroduced, add an explicit canonical field or
 * domain model and update this implementation accordingly.
 */
export async function requireCVEditor(
  _userId: string,
): Promise<{
  success: boolean;
}> {
  return {
    success: false,
  };
}
