export type TaskType = "interruption" | "scoring" | "replay" | "dna_analysis" | "coaching";
/**
 * Intelligent Model Router to optimize costs and performance.
 */
export declare function getModelForTask(task: TaskType): any;
export interface InferenceConfig {
    maxTokens: number;
    temperature: number;
}
export declare function getConfigForTask(task: TaskType): InferenceConfig;
//# sourceMappingURL=model-router.d.ts.map