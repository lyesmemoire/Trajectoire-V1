export interface ModelVersion {
    id: string;
    name: string;
    version: number;
    active: boolean;
    weights: Record<string, number>;
}
export declare const INTERVIEW_MODEL_V1: ModelVersion;
export declare const INTERVIEW_MODEL_V2: ModelVersion;
//# sourceMappingURL=model.registry.d.ts.map