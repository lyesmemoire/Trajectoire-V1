import { DomainModule } from "@/lib/core/application/DomainModule";
import { Container } from "@/lib/core/runtime/container/Container";

import { OpenAiAdapter } from "./infrastructure/adapters/openai.adapter";
import { GenerateCompletionUseCase } from "./application/use-cases/generate-completion.use-case";
import { SummarizeUseCase } from "./application/use-cases/summarize-text.use-case";
import { RewriteUseCase } from "./application/use-cases/rewrite-text.use-case";
import { AnalyzeUseCase } from "./application/use-cases/analyze-text.use-case";

export class AiModule extends DomainModule {
  register(container: Container): void {
    // 1. Adapters (Providers)
    const openaiAdapter = new OpenAiAdapter();
    // Par défaut, nous branchons LlmProviderPort et EmbeddingProviderPort sur OpenAI
    // On pourrait injecter ici GroqAdapter, MistralAdapter, ou AnthropicAdapter selon la configuration
    container.registerSingleton("LlmProviderPort", () => openaiAdapter);
    container.registerSingleton("EmbeddingProviderPort", () => openaiAdapter);
    container.registerSingleton("StreamingProviderPort", () => openaiAdapter);

    // 2. UseCases
    container.registerSingleton("GenerateCompletionUseCase", () => new GenerateCompletionUseCase(
      container.resolve("LlmProviderPort")
    ));
    
    container.registerSingleton("SummarizeUseCase", () => new SummarizeUseCase(
      container.resolve("LlmProviderPort")
    ));

    container.registerSingleton("RewriteUseCase", () => new RewriteUseCase(
      container.resolve("LlmProviderPort")
    ));

    container.registerSingleton("AnalyzeUseCase", () => new AnalyzeUseCase(
      container.resolve("LlmProviderPort")
    ));
  }
}
