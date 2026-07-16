import { useState, useCallback } from "react";
import { useAudioStore } from "../stores/audio.store";

export function usePermissions() {
  const permission = useAudioStore((state) => state.microphonePermission);
  const setPermission = useAudioStore((state) => state.setPermission);
  const [isRequesting, setIsRequesting] = useState(false);

  const requestMicrophoneAccess = useCallback(async () => {
    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // If we get here, permission is granted
      setPermission("granted");
      // Stop the stream since we only wanted to request permission
      for (const track of stream.getTracks()) {
        track.stop();
      }
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setPermission("denied");
      }
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [setPermission]);

  return {
    permission,
    isRequesting,
    requestMicrophoneAccess,
  };
}
