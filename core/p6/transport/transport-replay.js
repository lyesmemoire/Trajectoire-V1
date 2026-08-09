import { validateTransportCommands } from "./command-validator.js";
export function serializeCommands(commands) {
    return JSON.stringify(commands);
}
export function deserializeCommands(data) {
    const parsed = JSON.parse(data);
    const validation = validateTransportCommands(parsed);
    if (!validation.valid) {
        throw new Error(`Invalid TransportCommand sequence: ${validation.errors.join(", ")}`);
    }
    return Object.freeze(parsed);
}
export function replayCommands(data) {
    return deserializeCommands(data);
}
//# sourceMappingURL=transport-replay.js.map