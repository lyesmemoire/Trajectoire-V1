import { TransportCommand } from "./transport-contract.js";
export interface TransportCommandValidationResult {
    valid: boolean;
    errors: readonly string[];
}
export declare function validateTransportCommands(commands: readonly TransportCommand[]): TransportCommandValidationResult;
//# sourceMappingURL=command-validator.d.ts.map