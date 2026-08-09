import { coreEvents, INTERVIEW_EVENTS } from "../orchestration/core/event-bus";
import { track } from "../analytics";
import prisma from "@/lib/prisma";
/**
 * Centralized Event Tracker for Behavioral Monitoring.
 */
export function initializeEventTracking() {
    // 1. Track Answer Submissions
    coreEvents.on(INTERVIEW_EVENTS.ANSWER_SUBMITTED, async (data) => {
        console.log(`[Event] Answer Submitted by ${data.userId}`);
        track(INTERVIEW_EVENTS.ANSWER_SUBMITTED, data);
    });
    // 2. Track Interruptions (CRITICAL FOR BETA)
    coreEvents.on(INTERVIEW_EVENTS.INTERRUPTION_TRIGGERED, async (data) => {
        console.log(`[Event] Interruption Triggered: ${data.type} for ${data.userId}`);
        track(INTERVIEW_EVENTS.INTERRUPTION_TRIGGERED, {
            userId: data.userId,
            sessionId: data.sessionId,
            type: data.type,
            reason: data.reason,
            pressureLevel: data.pressureLevel,
        });
        // Log to DB for Admin Heatmap
        await prisma.interviewEvent.create({
            data: {
                sessionId: data.sessionId,
                type: `interruption_${data.type}`,
                impactScore: data.pressureLevel,
            },
        });
    });
    // 3. Track Replay Engagement
    coreEvents.on(INTERVIEW_EVENTS.INSIGHT_GENERATED, async (data) => {
        track("replay_opened", data);
    });
    // 4. Track Silence/Hesitation
    coreEvents.on("silence_detected", async (data) => {
        track("silence_detected", data);
    });
}
//# sourceMappingURL=event-tracker.js.map