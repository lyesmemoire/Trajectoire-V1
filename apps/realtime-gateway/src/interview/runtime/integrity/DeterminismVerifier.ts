// @ts-nocheck
import { ReplaySession } from "../types/replay";
import { ReplayPlaybackEngine } from "../replay/player/ReplayPlaybackEngine";
import { assertDeterministic } from "./RuntimeAssertions";

/**
 * Verifies that playback of a given session is deterministic.
 *
 * It runs the ReplayPlaybackEngine `iterations` times with the same
 * `speed` and `startFrame` and asserts that every emitted playback
 * state (snapshot, logical time, frame order) is identical across runs.
 *
 * This function throws if any mismatch is detected.
 */
export async function verifyDeterministicPlayback({
  session,
  speed = 1,
  startFrame = 0,
  iterations = 3,
}: {
  session: ReplaySession;
  speed?: number;
  startFrame?: number;
  iterations?: number;
}): Promise<void> {
  // Capture playback states from the first run
  const referenceStates: any[] = [];

  const capture = (engine: ReplayPlaybackEngine) => {
    const unsubscribe = engine.onStateChange((state) => {
      referenceStates.push({
        frame: state.currentFrame,
        snapshotHash: state.currentSnapshot.hash,
        logicalTime: state.logicalTime,
        playbackSpeed: state.playbackSpeed,
      });
    });
    return unsubscribe;
  };

  // First run – populate referenceStates
  const engine0 = new ReplayPlaybackEngine({ session, speed, startFrame });
  const unsubscribe0 = capture(engine0);
  await engine0.play();
  unsubscribe0();

  // Subsequent runs – compare against reference
  for (let i = 1; i < iterations; i++) {
    const engine = new ReplayPlaybackEngine({ session, speed, startFrame });
    const observed: any[] = [];
    const unsub = engine.onStateChange((state) => {
      observed.push({
        frame: state.currentFrame,
        snapshotHash: state.currentSnapshot.hash,
        logicalTime: state.logicalTime,
        playbackSpeed: state.playbackSpeed,
      });
    });
    await engine.play();
    unsub();

    assertDeterministic(
      observed.length === referenceStates.length,
      `Iteration ${i}: playback length mismatch`,
    );
    for (let j = 0; j < observed.length; j++) {
      const ref = referenceStates[j];
      const cur = observed[j];
      assertDeterministic(
        ref.frame === cur.frame &&
          ref.snapshotHash === cur.snapshotHash &&
          ref.logicalTime === cur.logicalTime &&
          ref.playbackSpeed === cur.playbackSpeed,
        `Iteration ${i}, step ${j}: nondeterministic playback state`,
      );
    }
  }
}
