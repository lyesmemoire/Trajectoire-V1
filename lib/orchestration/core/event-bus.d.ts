type EventCallback = (data: unknown) => Promise<void> | void;
/**
 * Core Event Bus for decoupled behavioral orchestration.
 */
export declare class EventBus {
    private listeners;
    on(event: string, callback: EventCallback): void;
    emit(event: string, data: unknown): Promise<void>;
}
export declare const coreEvents: EventBus;
export declare const INTERVIEW_EVENTS: {
    ANSWER_SUBMITTED: string;
    SIGNAL_DETECTED: string;
    PRESSURE_ADJUSTED: string;
    STATE_TRANSITION: string;
    INTERRUPTION_TRIGGERED: string;
    INSIGHT_GENERATED: string;
};
export {};
//# sourceMappingURL=event-bus.d.ts.map