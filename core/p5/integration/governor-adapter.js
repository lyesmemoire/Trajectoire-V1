import { normalizeDecision } from "../bridge/normalize-decision.js";
import { validateDecision } from "../bridge/validation.js";
/**
 * Adapts a RuntimeDecision into validated, normalized P5Events.
 *
 * Bridges the runtime boundary into the P5 pure engine by:
 * 1. Mapping RuntimeDecision → GovernorDecision (currently 1:1)
 * 2. Validating via P5.1 validation
 * 3. Normalizing via P5.1 normalizeDecision
 *
 * Pure function — no side effects.
 */
export function adaptDecision(decision) {
    const govDecision = {};
    if (decision.trustDelta !== undefined)
        govDecision.trustDelta = decision.trustDelta;
    if (decision.suspicionDelta !== undefined)
        govDecision.suspicionDelta = decision.suspicionDelta;
    if (decision.pressureDelta !== undefined)
        govDecision.pressureDelta = decision.pressureDelta;
    if (decision.emotion !== undefined)
        govDecision.emotion = decision.emotion;
    const validation = validateDecision(govDecision);
    if (!validation.valid) {
        return { events: [], valid: false, reasons: validation.reasons };
    }
    const events = normalizeDecision(govDecision);
    return { events, valid: true, reasons: [] };
}
//# sourceMappingURL=governor-adapter.js.map