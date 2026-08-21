/**
 * Resilient OpenAI Client
 *
 * Centralized resilient access to the OpenAI SDK.
 *
 * Responsibilities:
 * - use the centralized AI configuration
 * - never create dummy / placeholder clients
 * - preserve resilienceManager execution
 * - lazily instantiate the OpenAI client
 * - expose chat completions and embeddings
 *
 * This client is intentionally infrastructure-only.
 * Business services should depend on higher-level AI abstractions.
 */

import OpenAI from "openai";

import {
  getAIConfig,
} from "@/lib/ai/config/ai.config";

import {
  resilienceManager,
} from "./ResilienceManager";

export class ResilientOpenAIClient {
  private static instance:
    | ResilientOpenAIClient
    | null = null;

  private readonly client: OpenAI;

  private constructor(
    client?: OpenAI,
  ) {
    if (client) {
      this.client = client;
      return;
    }

    const config =
      getAIConfig();

    this.client =
      new OpenAI({
        apiKey:
          config.openaiApiKey,

        organization:
          config.openaiOrganization,

        project:
          config.openaiProject,

        timeout:
          config.aiTimeout,
      });
  }

  /**
   * Lazily creates the singleton.
   *
   * No OpenAI client is instantiated merely because this module
   * was imported.
   */
  public static getInstance():
    ResilientOpenAIClient {
    if (
      !ResilientOpenAIClient.instance
    ) {
      ResilientOpenAIClient.instance =
        new ResilientOpenAIClient();
    }

    return ResilientOpenAIClient.instance;
  }

  /**
   * Reset is useful for tests and explicit runtime reconfiguration.
   */
  public static reset():
    void {
    ResilientOpenAIClient.instance =
      null;
  }

  /**
   * Explicit dependency injection for tests.
   */
  public static setInstance(
    client: OpenAI,
  ): void {
    ResilientOpenAIClient.instance =
      new ResilientOpenAIClient(
        client,
      );
  }

  /**
   * Resilient chat-completion facade.
   *
   * The OpenAI request parameters are forwarded untouched,
   * including signal/options supported by the SDK payload.
   */
  public get chat() {
    return {
      completions: {
        create: <
          TParams extends
            OpenAI.Chat.ChatCompletionCreateParams
        >(
          params: TParams,
        ) =>
          resilienceManager.execute(
            "openai.chat.completions.create",

            () =>
              this.client
                .chat
                .completions
                .create(
                  params,
                ),
          ),
      },
    };
  }
  /**
   * Resilient embeddings facade.
   */
  public get embeddings() {
    return {
      create: (
        params:
          OpenAI.Embeddings.EmbeddingCreateParams,
      ) =>
        resilienceManager.execute(
          "openai.embeddings.create",

          () =>
            this.client
              .embeddings
              .create(
                params,
              ),
        ),
    };
  }

  /**
   * Low-level escape hatch.
   *
   * Prefer the resilient facades above whenever possible.
   */
  public getClient():
    OpenAI {
    return this.client;
  }
}

/**
 * Lazy compatibility facade.
 *
 * Previous code could use:
 *
 * resilientOpenAIClient.chat.completions.create(...)
 *
 * We preserve that API without instantiating OpenAI during module load.
 */
export const resilientOpenAIClient = {
  get chat() {
    return ResilientOpenAIClient
      .getInstance()
      .chat;
  },

  get embeddings() {
    return ResilientOpenAIClient
      .getInstance()
      .embeddings;
  },

  getClient():
    OpenAI {
    return ResilientOpenAIClient
      .getInstance()
      .getClient();
  },
};