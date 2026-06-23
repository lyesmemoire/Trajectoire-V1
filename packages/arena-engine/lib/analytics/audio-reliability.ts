import { track } from "../analytics";

export const AudioReliability = {
  trackPermission: (granted: boolean) => {
    track("audio_permission", { granted });
  },

  trackSilentFailure: (sessionId: string) => {
    track("audio_silent_failure", { sessionId });
  },

  trackRecoverySuccess: (method: string) => {
    track("audio_recovery_success", { method });
  },

  trackAirPodsSwitch: () => {
    track("audio_device_changed", { type: "bluetooth_potential" });
  },
};
