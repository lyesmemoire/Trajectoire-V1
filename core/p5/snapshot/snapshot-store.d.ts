import { MindSnapshot } from "./snapshot-contract.js";
/**
 * Minimal in-memory snapshot store.
 *
 * No disk. No database. No network.
 * Exists solely to support snapshot lifecycle in tests and future runtime use.
 */
export declare class SnapshotStore {
    private readonly snapshots;
    /** Save a snapshot under a given id. Overwrites if id already exists. */
    save(id: string, snapshot: MindSnapshot): void;
    /** Load a snapshot by id. Returns undefined if not found. */
    load(id: string): MindSnapshot | undefined;
    /** Remove all stored snapshots. */
    clear(): void;
    /** Number of snapshots currently stored. */
    get size(): number;
}
//# sourceMappingURL=snapshot-store.d.ts.map