// @ts-nocheck
import { track } from "../analytics";

/**
 * Tracks deep engagement metrics for the Replay experience.
 */
export const ReplayAnalytics = {
  opened: (sessionId: string, isFirstTime: boolean) => {
    track(isFirstTime ? "replay_opened" : "replay_returned", { sessionId });
  },

  momentRewatched: (
    sessionId: string,
    momentId: string,
    momentTitle: string,
  ) => {
    track("moment_rewatched", { sessionId, momentId, momentTitle });
  },

  completed: (sessionId: string, timeSpentSeconds: number) => {
    track("replay_completed", { sessionId, timeSpentSeconds });
  },

  abandoned: (sessionId: string, lastMomentSeen: number) => {
    track("replay_abandoned", { sessionId, lastMomentSeen });
  },

  nextSessionStarted: (sessionId: string, fromReplay: boolean) => {
    track("next_session_started", { sourceSessionId: sessionId, fromReplay });
  },
};
