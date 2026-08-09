/**
 * Core Event Bus for decoupled behavioral orchestration.
 */
export class EventBus {
    listeners = new Map();
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }
    async emit(event, data) {
        const callbacks = this.listeners.get(event) || [];
        await Promise.all(callbacks.map((callback) => callback(data)));
    }
}
export const coreEvents = new EventBus();
// System Events constants
export const INTERVIEW_EVENTS = {
    ANSWER_SUBMITTED: "answer_submitted",
    SIGNAL_DETECTED: "signal_detected",
    PRESSURE_ADJUSTED: "pressure_adjusted",
    STATE_TRANSITION: "state_transition",
    INTERRUPTION_TRIGGERED: "interruption_triggered",
    INSIGHT_GENERATED: "insight_payload_ready",
};
//# sourceMappingURL=event-bus.js.map