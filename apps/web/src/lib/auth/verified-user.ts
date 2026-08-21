import { createClient } from "@/lib/supabase/server";

const DEFAULT_ATTEMPTS = 2;
const DEFAULT_DELAY_MS = 400;

export class AuthServiceUnavailableError extends Error {
  readonly causeValue: unknown;

  constructor(cause?: unknown) {
    super("Authentication service temporarily unavailable");
    this.name = "AuthServiceUnavailableError";
    this.causeValue = cause;
  }
}

function getErrorText(error: unknown): string {
  if (error instanceof Error) {
    const cause =
      "cause" in error
        ? String(error.cause ?? "")
        : "";

    return `${error.name} ${error.message} ${cause}`.toLowerCase();
  }

  return String(error).toLowerCase();
}

function isRetryableNetworkError(error: unknown): boolean {
  const text = getErrorText(error);

  return (
    text.includes("und_err_connect_timeout") ||
    text.includes("connecttimeouterror") ||
    text.includes("connect timeout") ||
    text.includes("fetch failed") ||
    text.includes("econnreset") ||
    text.includes("econnrefused") ||
    text.includes("enetunreach") ||
    text.includes("etimedout")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getVerifiedUserWithRetry(
  attempts = DEFAULT_ATTEMPTS,
  delayMs = DEFAULT_DELAY_MS,
) {
  const supabase = await createClient();

  let lastNetworkError: unknown;

  for (
    let attempt = 1;
    attempt <= attempts;
    attempt += 1
  ) {
    try {
      const result =
        await supabase.auth.getUser();

      if (!result.error) {
        return {
          supabase,
          user: result.data.user,
          authError: null,
        };
      }

      if (
        !isRetryableNetworkError(
          result.error,
        )
      ) {
        return {
          supabase,
          user: null,
          authError: result.error,
        };
      }

      lastNetworkError =
        result.error;
    } catch (error) {
      if (
        !isRetryableNetworkError(error)
      ) {
        throw error;
      }

      lastNetworkError = error;
    }

    if (attempt < attempts) {
      await sleep(delayMs * attempt);
    }
  }

  throw new AuthServiceUnavailableError(
    lastNetworkError,
  );
}