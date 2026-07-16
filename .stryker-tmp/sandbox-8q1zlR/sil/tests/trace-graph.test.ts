// @ts-nocheck
import { describe, it, expect } from "vitest";
import { MemoryEventStore } from "../services/memory-event-store";
import { DefaultEventQueryService } from "../services/query/event-query-service";
import { TraceGraphBuilder } from "../services/observability/trace-graph-builder";
import { SILEvent } from "../contracts/sil-events";

describe("Phase 2-I: Trace Graph Builder", () => {
  it("should rebuild a DAG correctly from session events", async () => {
    const store = new MemoryEventStore();
    const queryService = new DefaultEventQueryService(store);
    const graphBuilder = new TraceGraphBuilder(queryService);
    
    const tenantId = "tenant-B";
    const sessionId = "session-graph";

    const eventTypes = ["SESSION_CREATED", "USER_MESSAGE", "USER_MESSAGE", "P6_RUNTIME_COMPLETED", "P7_EVALUATION_COMPLETED", "REPORT_GENERATED"];
    
    for (let i = 0; i < eventTypes.length; i++) {
      await store.append({
        eventId: `evt-${i}`,
        type: eventTypes[i],
        tenantId,
        sessionId,
        timestamp: Date.now() + i,
        signature: "sig",
        hash: "hash",
        payload: {}
      } as SILEvent);
    }

    const graph = await graphBuilder.build(tenantId, sessionId);

    expect(graph.sessionId).toBe(sessionId);
    expect(graph.nodes.length).toBe(eventTypes.length);
    expect(graph.edges.length).toBe(eventTypes.length - 1); // Linear DAG

    expect(graph.nodes[0].type).toBe("SESSION_CREATED");
    expect(graph.nodes[graph.nodes.length - 1].type).toBe("REPORT_GENERATED");

    // Edge check
    expect(graph.edges[0].from).toBe("evt-0");
    expect(graph.edges[0].to).toBe("evt-1");
  });
});
