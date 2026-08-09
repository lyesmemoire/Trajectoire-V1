import { DecisionGraph } from "@/domain/decision-graph.contract";
export declare class DecisionGraphRepository {
    save(graph: DecisionGraph): Promise<any>;
    get(traceId: string): Promise<DecisionGraph | null>;
}
//# sourceMappingURL=decision-graph.repository.d.ts.map