import { TransportCommand } from "./transport-contract.js";
export declare function serializeCommands(commands: readonly TransportCommand[]): string;
export declare function deserializeCommands(data: string): readonly TransportCommand[];
export declare function replayCommands(data: string): readonly TransportCommand[];
//# sourceMappingURL=transport-replay.d.ts.map