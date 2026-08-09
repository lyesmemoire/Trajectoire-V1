import { FraudKernel } from "./fraud-kernel";
import { EvaluationContext, AgentOpinion } from "@/domain/orchestration.contract";
export declare class FraudKernelEngine {
    private kernel;
    constructor(kernel: FraudKernel);
    evaluate(ctx: EvaluationContext): AgentOpinion;
    private extractSignals;
}
//# sourceMappingURL=fraud-kernel.engine.d.ts.map