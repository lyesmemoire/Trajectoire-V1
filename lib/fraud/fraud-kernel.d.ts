import { FraudAssessment, FraudKernelConfig, FraudSignal } from "@/domain/fraud-kernel.contract";
export declare class FraudKernel {
    private config;
    constructor(config: FraudKernelConfig);
    evaluate(signals: FraudSignal[], userId: string): FraudAssessment;
    private computeRisk;
    private getWeight;
    private explain;
}
//# sourceMappingURL=fraud-kernel.d.ts.map