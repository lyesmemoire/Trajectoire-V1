import { describe, it, expect } from "vitest";
import { createTimeline } from "../timeline.js";
import { appendTick } from "../append-tick.js";
import { timelineWindow } from "../timeline-window.js";
describe("timeline-window — T4: Window integrity", () => {
    const buildTimeline = () => {
        const events = [
            { type: "TRUST_DELTA", delta: 0.1 }, // tick 1
            { type: "SUSPICION_DELTA", delta: -0.05 }, // tick 2
            { type: "PRESSURE_DELTA", delta: 10 }, // tick 3
            { type: "EMOTION_SET", emotion: "alert" }, // tick 4
            { type: "TRUST_DELTA", delta: -0.2 }, // tick 5
        ];
        let tl = createTimeline();
        for (const event of events) {
            tl = appendTick(tl, event);
        }
        return tl;
    };
    it("should extract a partial window", () => {
        const tl = buildTimeline();
        const window = timelineWindow(tl, 2, 4);
        expect(window.entries).toHaveLength(3);
        expect(window.entries[0].tick).toBe(2);
        expect(window.entries[1].tick).toBe(3);
        expect(window.entries[2].tick).toBe(4);
    });
    it("should extract the full timeline as a window", () => {
        const tl = buildTimeline();
        const window = timelineWindow(tl, 1, 5);
        expect(window.entries).toHaveLength(5);
        expect(window.entries).toEqual(tl.entries);
    });
    it("should return empty for an out-of-range window", () => {
        const tl = buildTimeline();
        const window = timelineWindow(tl, 10, 20);
        expect(window.entries).toEqual([]);
    });
    it("should return empty for an empty timeline", () => {
        const tl = createTimeline();
        const window = timelineWindow(tl, 1, 5);
        expect(window.entries).toEqual([]);
    });
    it("should concatenate adjacent windows to reconstruct the original (T4)", () => {
        const tl = buildTimeline();
        const w1 = timelineWindow(tl, 1, 2);
        const w2 = timelineWindow(tl, 3, 5);
        const reconstructed = [...w1.entries, ...w2.entries];
        expect(reconstructed).toEqual(tl.entries);
    });
    it("should extract a single-tick window", () => {
        const tl = buildTimeline();
        const window = timelineWindow(tl, 3, 3);
        expect(window.entries).toHaveLength(1);
        expect(window.entries[0].tick).toBe(3);
    });
});
//# sourceMappingURL=timeline-window.test.js.map