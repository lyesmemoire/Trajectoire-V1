import { describe, it, expect } from "vitest";
import { validateTransportCommands } from "../command-validator.js";
describe("P6.3 - T4 Validity", () => {
    it("should accept valid commands", () => {
        const commands = [
            { type: "WAIT", ms: 500 },
            { type: "INTERRUPT" },
            { type: "SPEAK", text: "Hello", speechRate: 1.0 },
            { type: "START_LISTENING" },
        ];
        const result = validateTransportCommands(commands);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });
    it("should reject invalid WAIT commands", () => {
        const commands = [{ type: "WAIT", ms: -10 }];
        const result = validateTransportCommands(commands);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toMatch(/invalid 'ms'/);
    });
    it("should reject invalid SPEAK commands", () => {
        const commands1 = [{ type: "SPEAK", text: "  ", speechRate: 1.0 }];
        expect(validateTransportCommands(commands1).valid).toBe(false);
        const commands2 = [{ type: "SPEAK", text: "Hello", speechRate: 5.0 }];
        expect(validateTransportCommands(commands2).valid).toBe(false);
    });
    it("should reject unknown commands", () => {
        const commands = [{ type: "UNKNOWN" }];
        const result = validateTransportCommands(commands);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toMatch(/unknown type/);
    });
});
//# sourceMappingURL=validator.test.js.map