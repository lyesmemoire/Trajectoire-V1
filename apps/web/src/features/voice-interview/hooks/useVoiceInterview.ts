import { useConnection } from "./useConnection";
import { useInterview } from "./useInterview";
import { useAudio } from "./useAudio";
import { useTranscript } from "./useTranscript";
import { useTelemetry } from "./useTelemetry";
import { usePermissions } from "./usePermissions";
import { useBargeIn } from "./useBargeIn";
import { useVoiceInterviewClient } from "../provider/VoiceInterviewProvider";

/**
 * Master aggregate hook for convenience.
 * Allows components to grab everything they need in one go if they prefer,
 * though finer-grained hooks are recommended for performance.
 */
export function useVoiceInterview() {
  const connection = useConnection();
  const interview = useInterview();
  const audio = useAudio();
  const transcript = useTranscript();
  const telemetry = useTelemetry();
  const permissions = usePermissions();
  const bargeIn = useBargeIn();
  const client = useVoiceInterviewClient();

  return {
    connection,
    interview,
    audio,
    transcript,
    telemetry,
    permissions,
    bargeIn,
    client, // Escape hatch for raw access
  };
}
