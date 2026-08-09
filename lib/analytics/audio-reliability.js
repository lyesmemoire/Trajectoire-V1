import { track } from "../analytics";
export const AudioReliability = {
    trackPermission: (granted) => {
        track("audio_permission", { granted });
    },
    trackSilentFailure: (sessionId) => {
        track("audio_silent_failure", { sessionId });
    },
    trackRecoverySuccess: (method) => {
        track("audio_recovery_success", { method });
    },
    trackAirPodsSwitch: () => {
        track("audio_device_changed", { type: "bluetooth_potential" });
    },
};
//# sourceMappingURL=audio-reliability.js.map