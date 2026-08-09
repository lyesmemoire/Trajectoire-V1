/**
 * Minimal in-memory snapshot store.
 *
 * No disk. No database. No network.
 * Exists solely to support snapshot lifecycle in tests and future runtime use.
 */
export class SnapshotStore {
    snapshots = new Map();
    /** Save a snapshot under a given id. Overwrites if id already exists. */
    save(id, snapshot) {
        this.snapshots.set(id, snapshot);
    }
    /** Load a snapshot by id. Returns undefined if not found. */
    load(id) {
        return this.snapshots.get(id);
    }
    /** Remove all stored snapshots. */
    clear() {
        this.snapshots.clear();
    }
    /** Number of snapshots currently stored. */
    get size() {
        return this.snapshots.size;
    }
}
//# sourceMappingURL=snapshot-store.js.map