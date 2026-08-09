import { buildTransportCommands } from "./command-builder.js";
export function buildCommandBatch(plans) {
    const allCommands = [];
    for (const plan of plans) {
        const commands = buildTransportCommands(plan);
        allCommands.push(...commands);
    }
    return Object.freeze(allCommands);
}
//# sourceMappingURL=command-batch.js.map