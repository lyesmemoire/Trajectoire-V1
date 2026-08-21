import {
  OpenAIProvider,
} from "./providers/OpenAIProvider";

import type {
  AIProvider,
} from "./providers/Provider";

import {
  InfrastructureError,
} from "@/core/errors";

function normalizeOptionalString(
  value?: string,
): string | undefined {
  const normalized =
    value?.trim();

  return normalized
    ? normalized
    : undefined;
}

function isPlaceholderApiKey(
  apiKey: string,
): boolean {
  const normalized =
    apiKey
      .trim()
      .toLowerCase();

  return (
    normalized === "dummy" ||
    normalized === "sk-dummy" ||
    normalized === "test" ||
    normalized === "sk-test" ||
    normalized.includes(
      "your-openai",
    ) ||
    normalized.includes(
      "placeholder",
    )
  );
}

export class AIClient {
  private static instance:
    | AIProvider
    | null = null;

  private constructor() {}

  public static getInstance():
    AIProvider {
    if (
      AIClient.instance
    ) {
      return AIClient.instance;
    }

    const apiKey =
      process.env
        .OPENAI_API_KEY
        ?.trim();

    if (!apiKey) {
      throw new InfrastructureError(
        "OPENAI_API_KEY environment variable is not set",
        "AIClient",
      );
    }

    if (
      isPlaceholderApiKey(
        apiKey,
      )
    ) {
      throw new InfrastructureError(
        "OPENAI_API_KEY contains a placeholder value",
        "AIClient",
      );
    }

    const organization =
      normalizeOptionalString(
        process.env
          .OPENAI_ORGANIZATION,
      );

    const baseURL =
      normalizeOptionalString(
        process.env
          .OPENAI_BASE_URL,
      );

    AIClient.instance =
      new OpenAIProvider({
        apiKey,
        organization,
        baseURL,
      });

    return AIClient.instance;
  }

  /**
   * Réinitialise le singleton.
   *
   * Utile pour :
   * - les tests ;
   * - le rechargement explicite d'une configuration runtime ;
   * - le remplacement temporaire du provider.
   */
  public static reset():
    void {
    AIClient.instance =
      null;
  }

  /**
   * Injection explicite d'un provider.
   *
   * Principalement destiné aux tests
   * et aux scénarios de remplacement contrôlé.
   */
  public static setInstance(
    provider: AIProvider,
  ): void {
    AIClient.instance =
      provider;
  }
}

/**
 * Compatibilité avec les imports existants :
 *
 * import AIClient from "../client";
 *
 * ainsi qu'avec :
 *
 * import { AIClient } from "../client";
 */
export default AIClient;