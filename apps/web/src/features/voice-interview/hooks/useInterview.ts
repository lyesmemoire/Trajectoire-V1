import { useInterviewStore } from "../stores/interview.store";
import { useVoiceInterviewClient } from "../provider/VoiceInterviewProvider";

export function useInterview() {
  const currentState = useInterviewStore((state) => state.currentState);
  const previousState = useInterviewStore((state) => state.previousState);
  const sessionId = useInterviewStore((state) => state.sessionId);
  const currentQuestion = useInterviewStore((state) => state.currentQuestion);
  const feedbackSignal = useInterviewStore((state) => state.feedbackSignal);
  const isCompleted = useInterviewStore((state) => state.isCompleted);
  const client = useVoiceInterviewClient();

  const startInterview = (candidateId: string, targetRole: string) => {
    return client.startInterview(candidateId, targetRole);
  };

  const pause = () => client.pause();
  const resume = () => client.resume();
  const stop = () => client.stop();

  return {
    currentState,
    previousState,
    sessionId,
    currentQuestion,
    feedbackSignal,
    isCompleted,
    startInterview,
    pause,
    resume,
    stop,
  };
}
