import { describe, it, expect } from "vitest";
import { serializeCommands, deserializeCommands } from "../transport-replay.js";
describe("P6.3 - T3 Replay", () => {
    it("should perfectly serialize and deserialize transport commands", () => {
        const commands = [
            { type: "WAIT", ms: 250 },
            { type: "INTERRUPT" },
            { type: "SPEAK", text: "Replay this", speechRate: 1.0 },
            { type: "START_LISTENING" },
        ];
        const serialized = serializeCommands(commands);
        const deserialized = deserializeCommands(serialized);
        expect(deserialized).toEqual(commands);
    });
    it("should fail deserialization on invalid data", () => {
        const badData = JSON.stringify([{ type: "WAIT", ms: -100 }]);
        expect(() => deserializeCommands(badData)).toThrow(/Invalid TransportCommand sequence/);
    });
});
//# sourceMappingURL=replay.test.js.map