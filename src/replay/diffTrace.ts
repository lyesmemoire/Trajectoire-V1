import type { TickTrace } from "../common/trace";

export interface TickDiff {
  tickId: number;
  leaderChange?: { old: string; new: string };
  eventCountChange?: { old: number; new: number };
  missing?: "new" | "old";
}

export function diffTraces(traceA: TickTrace[], traceB: TickTrace[]): { diffs: TickDiff[]; traceA: TickTrace[]; traceB: TickTrace[] } {
  const diffs: TickDiff[] = [];
  const tickIdsA = new Set(traceA.map(t => t.tickId));
  const tickIdsB = new Set(traceB.map(t => t.tickId));
  const allTickIds = new Set([...tickIdsA, ...tickIdsB]);
  
  // Sort tickIds for deterministic ordering
  const sortedTickIds = Array.from(allTickIds).sort((a, b) => a - b);
  
  for (const tickId of sortedTickIds) {
    const eventsA = traceA.filter(t => t.tickId === tickId);
    const eventsB = traceB.filter(t => t.tickId === tickId);
    
    // Check for missing tick
    if (eventsA.length === 0 && eventsB.length > 0) {
      diffs.push({ tickId, missing: "old" });
      continue;
    }
    if (eventsB.length === 0 && eventsA.length > 0) {
      diffs.push({ tickId, missing: "new" });
      continue;
    }
    
    if (eventsA.length === 0 && eventsB.length === 0) {
      continue;
    }
    
    const diff: TickDiff = { tickId };
    
    // Check for leader change
    const leaderA = eventsA.find(t => t.isLeader);
    const leaderB = eventsB.find(t => t.isLeader);
    
    if (leaderA && leaderB && leaderA.nodeId !== leaderB.nodeId) {
      diff.leaderChange = { old: leaderA.nodeId, new: leaderB.nodeId };
    }
    
    // Check for event count change
    if (eventsA.length !== eventsB.length) {
      diff.eventCountChange = { old: eventsA.length, new: eventsB.length };
    }
    
    // Only add diff if there are actual changes
    if (diff.leaderChange || diff.eventCountChange) {
      diffs.push(diff);
    }
  }
  
  return { diffs, traceA, traceB };
}
