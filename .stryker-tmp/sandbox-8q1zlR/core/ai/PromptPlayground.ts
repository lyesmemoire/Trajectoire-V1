// @ts-nocheck
import { aiOrchestrator } from "./AIOrchestrator";
import { aiExecutionLogger } from "./AIExecutionLog";
import { getAIMode, setAIMode } from "./AIMode";

/**
 * Prompt Playground
 *
 * Standalone tool for testing prompts without launching the full application.
 * Allows testing input → response → JSON → cost → time.
 */

export interface PlaygroundTest {
  promptId: string;
  promptVersion: string;
  variables: Record<string, unknown>;
  provider: "openai" | "anthropic" | "mock";
  model: string;
  result: {
    success: boolean;
    data?: unknown;
    error?: string;
    metrics?: {
      latency: number;
      tokens: { prompt: number; completion: number; total: number };
      cost: number;
    };
    attempts: number;
  };
}

export class PromptPlayground {
  /**
   * Test a prompt with given variables
   */
  static async testPrompt(
    promptId: string,
    variables: Record<string, unknown>,
    options: {
      provider?: "openai" | "anthropic" | "mock";
      model?: string;
      promptVersion?: string;
      temperature?: number;
      maxTokens?: number;
      mode?: "real" | "mock";
    } = {}
  ): Promise<PlaygroundTest> {
    const {
      provider = "openai",
      model = "gpt-4-turbo",
      promptVersion = "v1",
      temperature = 0.7,
      maxTokens = 2000,
      mode,
    } = options;

    // Set mode if provided
    if (mode) {
      setAIMode(mode);
    }

    // Import the prompt dynamically based on promptId
    const promptTemplate = await this.loadPromptTemplate(promptId);

    const result = await aiOrchestrator.execute(
      promptTemplate,
      variables as import("./PromptTemplates/PromptRenderer").PromptVariables,
      {
        provider,
        model,
        promptId,
        promptVersion,
        temperature,
        maxTokens,
      }
    );

    return {
      promptId,
      promptVersion,
      variables,
      provider,
      model,
      result: {
        success: result.success,
        data: result.data,
        error: result.error,
        metrics: result.metrics
          ? {
              latency: result.metrics.latency,
              tokens: {
                prompt: result.metrics.promptTokens,
                completion: result.metrics.completionTokens,
                total: result.metrics.totalTokens,
              },
              cost: result.metrics.cost,
            }
          : undefined,
        attempts: result.attempts,
      },
    };
  }

  /**
   * Load prompt template by ID
   */
  private static async loadPromptTemplate(promptId: string) {
    // Map prompt IDs to their template imports
    const promptMap: Record<string, () => Promise<import("./PromptTemplates/PromptRenderer").PromptTemplate>> = {
      "ats-analysis": () => import("./Prompts/ats-analysis-v1").then((m) => m.atsAnalysisV1),
      "interview-analysis": () => import("./Prompts/interview-analysis-v1").then((m) => m.interviewAnalysisV1),
      "communication-analysis": () => import("./Prompts/communication-analysis-v1").then((m) => m.communicationAnalysisV1),
      "leadership-analysis": () => import("./Prompts/leadership-analysis-v1").then((m) => m.leadershipAnalysisV1),
      "executive-summary": () => import("./Prompts/executive-summary-v1").then((m) => m.executiveSummaryV1),
      "recruiter-notes": () => import("./Prompts/recruiter-notes-v1").then((m) => m.recruiterNotesV1),
      "decision-estimation": () => import("./Prompts/decision-estimation-v1").then((m) => m.decisionEstimationV1),
      "career-analysis": () => import("./Prompts/career-analysis-v1").then((m) => m.careerAnalysisV1),
      "action-plan": () => import("./Prompts/action-plan-v1").then((m) => m.actionPlanV1),
      "recommendations": () => import("./Prompts/recommendations-v1").then((m) => m.recommendationsV1),
    };

    const loader = promptMap[promptId];
    if (!loader) {
      throw new Error(`Prompt ${promptId} not found`);
    }

    return await loader();
  }

  /**
   * Get available prompts
   */
  static getAvailablePrompts(): string[] {
    return [
      "ats-analysis",
      "interview-analysis",
      "communication-analysis",
      "leadership-analysis",
      "executive-summary",
      "recruiter-notes",
      "decision-estimation",
      "career-analysis",
      "action-plan",
      "recommendations",
    ];
  }

  /**
   * Get execution logs
   */
  static getLogs() {
    return aiExecutionLogger.getAll();
  }

  /**
   * Get execution summary
   */
  static getSummary() {
    return aiExecutionLogger.getSummary();
  }

  /**
   * Clear logs
   */
  static clearLogs() {
    aiExecutionLogger.clear();
  }

  /**
   * Format test result for display
   */
  static formatResult(test: PlaygroundTest): string {
    const lines: string[] = [];
    
    lines.push("=".repeat(80));
    lines.push(`PROMPT TEST: ${test.promptId} (${test.promptVersion})`);
    lines.push("=".repeat(80));
    lines.push("");
    
    lines.push("Configuration:");
    lines.push(`  Provider: ${test.provider}`);
    lines.push(`  Model: ${test.model}`);
    lines.push(`  Mode: ${getAIMode()}`);
    lines.push("");
    
    lines.push("Input Variables:");
    for (const [key, value] of Object.entries(test.variables)) {
      const displayValue = typeof value === "string" ? value : JSON.stringify(value);
      lines.push(`  ${key}: ${displayValue.substring(0, 100)}${displayValue.length > 100 ? "..." : ""}`);
    }
    lines.push("");
    
    lines.push("Result:");
    lines.push(`  Success: ${test.result.success}`);
    lines.push(`  Attempts: ${test.result.attempts}`);
    
    if (test.result.error) {
      lines.push(`  Error: ${test.result.error}`);
    }
    
    if (test.result.metrics) {
      lines.push("");
      lines.push("Metrics:");
      lines.push(`  Latency: ${test.result.metrics.latency}ms`);
      lines.push(`  Tokens: ${test.result.metrics.tokens.total} (${test.result.metrics.tokens.prompt} + ${test.result.metrics.tokens.completion})`);
      lines.push(`  Cost: $${test.result.metrics.cost.toFixed(4)}`);
    }
    
    if (test.result.data) {
      lines.push("");
      lines.push("Response Data:");
      lines.push(JSON.stringify(test.result.data, null, 2));
    }
    
    lines.push("");
    lines.push("=".repeat(80));
    
    return lines.join("\n");
  }

  /**
   * Run batch tests
   */
  static async runBatchTests(tests: Array<{
    promptId: string;
    variables: Record<string, unknown>;
    options?: Parameters<typeof PromptPlayground.testPrompt>[2];
  }>): Promise<PlaygroundTest[]> {
    const results: PlaygroundTest[] = [];
    
    for (const test of tests) {
      const result = await this.testPrompt(test.promptId, test.variables, test.options);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Compare results between providers
   */
  static async compareProviders(
    promptId: string,
    variables: Record<string, unknown>,
    providers: Array<"openai" | "anthropic" | "mock"> = ["openai", "anthropic"]
  ): Promise<PlaygroundTest[]> {
    const results: PlaygroundTest[] = [];
    
    for (const provider of providers) {
      const result = await this.testPrompt(promptId, variables, { provider });
      results.push(result);
    }
    
    return results;
  }
}

/**
 * CLI interface for playground
 * Can be run with: npx ts-node core/ai/PromptPlayground.ts
 */
export async function runPlaygroundCLI() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "list": {
      console.log("Available prompts:");
      PromptPlayground.getAvailablePrompts().forEach((p) => console.log(`  - ${p}`));
      break;
    }

    case "test": {
      const promptId = args[1];
      if (!promptId) {
        console.error("Usage: test <promptId>");
        process.exit(1);
      }
      
      // For CLI, we'd need to parse variables from args or stdin
      // This is a simplified version
      console.log(`Testing prompt: ${promptId}`);
      console.log("(Full CLI implementation would parse variables from args/stdin)");
      break;
    }

    case "logs": {
      const logs = PromptPlayground.getLogs();
      console.log(JSON.stringify(logs, null, 2));
      break;
    }

    case "summary": {
      const summary = PromptPlayground.getSummary();
      console.log(JSON.stringify(summary, null, 2));
      break;
    }

    case "clear": {
      PromptPlayground.clearLogs();
      console.log("Logs cleared");
      break;
    }

    default:
      console.log("Usage:");
      console.log("  list                    - List available prompts");
      console.log("  test <promptId>         - Test a prompt");
      console.log("  logs                    - Show execution logs");
      console.log("  summary                 - Show execution summary");
      console.log("  clear                   - Clear execution logs");
  }
}

// Run CLI if executed directly
if (require.main === module) {
  runPlaygroundCLI().catch(console.error);
}
