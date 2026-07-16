import { useAudioStore } from "../stores/audio.store";

export function useAudio() {
  const microphoneLevel = useAudioStore((state) => state.microphoneLevel);
  const isSpeaking = useAudioStore((state) => state.isSpeaking);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const isMuted = useAudioStore((state) => state.isMuted);

  return {
    microphoneLevel,
    isSpeaking,
    isPlaying,
    isMuted,
  };
}
