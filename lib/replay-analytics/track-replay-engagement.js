import { track } from "../analytics";
/**
 * Tracks deep engagement metrics for the Replay experience.
 */
export const ReplayAnalytics = {
    opened: (sessionId, isFirstTime) => {
        track(isFirstTime ? "replay_opened" : "replay_returned", { sessionId });
    },
    momentRewatched: (sessionId, momentId, momentTitle) => {
        track("moment_rewatched", { sessionId, momentId, momentTitle });
    },
    completed: (sessionId, timeSpentSeconds) => {
        track("replay_completed", { sessionId, timeSpentSeconds });
    },
    abandoned: (sessionId, lastMomentSeen) => {
        track("replay_abandoned", { sessionId, lastMomentSeen });
    },
    nextSessionStarted: (sessionId, fromReplay) => {
        track("next_session_started", { sourceSessionId: sessionId, fromReplay });
    },
};
//# sourceMappingURL=track-replay-engagement.js.map