import { useConnectionStore } from "../stores/connection.store";
import { useVoiceInterviewClient } from "../provider/VoiceInterviewProvider";

export function useConnection() {
  const status = useConnectionStore((state) => state.status);
  const latencyMs = useConnectionStore((state) => state.latencyMs);
  const retryAttempt = useConnectionStore((state) => state.retryAttempt);
  const error = useConnectionStore((state) => state.error);
  const client = useVoiceInterviewClient();

  const connect = (authToken: string) => {
    return client.connect(authToken);
  };

  const disconnect = () => {
    client.disconnect();
  };

  return {
    status,
    latencyMs,
    retryAttempt,
    error,
    connect,
    disconnect,
  };
}
