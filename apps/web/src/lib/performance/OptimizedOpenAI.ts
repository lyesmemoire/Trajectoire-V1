/**
 * Optimized OpenAI Client
 *
 * Performance monitoring and caching for OpenAI operations.
 *
 * Important:
 * - never creates a dummy OpenAI client
 * - lazily initializes OpenAI
 * - fails clearly when OpenAI is not configured
 * - preserves deterministic-response caching
 * - preserves embeddings caching
 */

import OpenAI from "openai";

import {
  measurePerformance,
} from "./PerformanceMonitor";

import {
  InfrastructureError,
} from "@/core/errors";

type CacheEntry<T = unknown> = {
  data: T;
  timestamp: number;
};

type ChatCompletionParams = {
  model: string;

  messages:
    OpenAI.Chat.ChatCompletionMessageParam[];

  temperature?: number;

  max_tokens?: number;
};

type EmbeddingParams = {
  model: string;

  input:
    | string
    | string[];
};

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
      "placeholder",
    ) ||
    normalized.includes(
      "your-openai",
    )
  );
}

function getConfiguredClient():
  OpenAI {
  const apiKey =
    process.env
      .OPENAI_API_KEY
      ?.trim();

  if (!apiKey) {
    throw new InfrastructureError(
      "OPENAI_API_KEY environment variable is not set",
      "OptimizedOpenAI",
    );
  }

  if (
    isPlaceholderApiKey(
      apiKey,
    )
  ) {
    throw new InfrastructureError(
      "OPENAI_API_KEY contains a placeholder value",
      "OptimizedOpenAI",
    );
  }

  const baseURL =
    process.env
      .OPENAI_BASE_URL
      ?.trim();

  const organization =
    process.env
      .OPENAI_ORGANIZATION
      ?.trim();

  const project =
    process.env
      .OPENAI_PROJECT
      ?.trim();

  return new OpenAI({
    apiKey,

    baseURL:
      baseURL || undefined,

    organization:
      organization || undefined,

    project:
      project || undefined,
  });
}

export class OptimizedOpenAI {
  private static instance:
    | OptimizedOpenAI
    | null = null;

  private readonly responseCache =
    new Map<
      string,
      CacheEntry
    >();

  private readonly cacheTTL =
    300_000;

  private client:
    | OpenAI
    | null = null;

  private constructor() {}

  public static getInstance():
    OptimizedOpenAI {
    if (
      !OptimizedOpenAI.instance
    ) {
      OptimizedOpenAI.instance =
        new OptimizedOpenAI();
    }

    return OptimizedOpenAI.instance;
  }

  public static reset():
    void {
    OptimizedOpenAI.instance =
      null;
  }

  private getClient():
    OpenAI {
    if (!this.client) {
      this.client =
        getConfiguredClient();
    }

    return this.client;
  }

  private generateCacheKey(
    model: string,
    messages:
      OpenAI.Chat.ChatCompletionMessageParam[],
    temperature: number,
  ): string {
    return [
      model,
      temperature,
      JSON.stringify(
        messages,
      ),
    ].join(":");
  }

  private getFromCache<T>(
    key: string,
  ): T | null {
    const cached =
      this.responseCache.get(
        key,
      );

    if (!cached) {
      return null;
    }

    const expired =
      Date.now() -
        cached.timestamp >
      this.cacheTTL;

    if (expired) {
      this.responseCache.delete(
        key,
      );

      return null;
    }

    return cached.data as T;
  }

  private setCache<T>(
    key: string,
    data: T,
  ): void {
    this.responseCache.set(
      key,
      {
        data,
        timestamp:
          Date.now(),
      },
    );
  }

  @measurePerformance(
    "openai.chat.completions",
  )
  public async chatCompletion(
    params:
      ChatCompletionParams,
  ): Promise<
    OpenAI.Chat.ChatCompletion
  > {
    const temperature =
      params.temperature ??
      0.7;

    const cacheKey =
      this.generateCacheKey(
        params.model,
        params.messages,
        temperature,
      );

    if (
      temperature === 0
    ) {
      const cached =
        this.getFromCache<
          OpenAI.Chat.ChatCompletion
        >(
          cacheKey,
        );

      if (cached) {
        return cached;
      }
    }

    const client =
      this.getClient();

    const response =
      await client
        .chat
        .completions
        .create({
          model:
            params.model,

          messages:
            params.messages,

          temperature,

          max_tokens:
            params.max_tokens,
        });

    if (
      temperature === 0
    ) {
      this.setCache(
        cacheKey,
        response,
      );
    }

    return response;
  }

  @measurePerformance(
    "openai.embeddings",
  )
  public async embeddings(
    params:
      EmbeddingParams,
  ): Promise<
    OpenAI.Embeddings.CreateEmbeddingResponse
  > {
    const normalizedInput =
      Array.isArray(
        params.input,
      )
        ? params.input
        : [
            params.input,
          ];

    const cacheKey =
      [
        params.model,
        JSON.stringify(
          normalizedInput,
        ),
      ].join(":");

    const cached =
      this.getFromCache<
        OpenAI.Embeddings.CreateEmbeddingResponse
      >(
        cacheKey,
      );

    if (cached) {
      return cached;
    }

    const client =
      this.getClient();

    const response =
      await client
        .embeddings
        .create({
          model:
            params.model,

          input:
            params.input,
        });

    this.setCache(
      cacheKey,
      response,
    );

    return response;
  }

  @measurePerformance(
    "openai.embeddings.batch",
  )
  public async batchEmbeddings(
    inputs: string[],
    model:
      string =
      "text-embedding-3-small",
  ): Promise<
    OpenAI.Embeddings.Embedding[]
  > {
    if (
      inputs.length === 0
    ) {
      return [];
    }

    const batchSize =
      100;

    const results:
      OpenAI.Embeddings.Embedding[] =
      [];

    for (
      let index = 0;
      index < inputs.length;
      index += batchSize
    ) {
      const batch =
        inputs.slice(
          index,
          index +
            batchSize,
        );

      const response =
        await this.embeddings({
          model,
          input:
            batch,
        });

      results.push(
        ...response.data,
      );
    }

    return results;
  }

  public clearCache():
    void {
    this.responseCache.clear();
  }

  public getCacheStats(): {
    size: number;
    keys: string[];
  } {
    return {
      size:
        this.responseCache.size,

      keys:
        Array.from(
          this.responseCache.keys(),
        ),
    };
  }
}

/**
 * Lazy compatibility facade.
 *
 * Importing this module does not initialize OpenAI.
 * The client is only created when a real AI operation is invoked.
 */
export const optimizedOpenAI = {
  chatCompletion(
    params:
      ChatCompletionParams,
  ) {
    return OptimizedOpenAI
      .getInstance()
      .chatCompletion(
        params,
      );
  },

  embeddings(
    params:
      EmbeddingParams,
  ) {
    return OptimizedOpenAI
      .getInstance()
      .embeddings(
        params,
      );
  },

  batchEmbeddings(
    inputs: string[],
    model?:
      string,
  ) {
    return OptimizedOpenAI
      .getInstance()
      .batchEmbeddings(
        inputs,
        model,
      );
  },

  clearCache() {
    return OptimizedOpenAI
      .getInstance()
      .clearCache();
  },

  getCacheStats() {
    return OptimizedOpenAI
      .getInstance()
      .getCacheStats();
  },
};