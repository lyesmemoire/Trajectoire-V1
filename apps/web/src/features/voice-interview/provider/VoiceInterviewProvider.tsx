import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { VoiceInterviewClient, type VoiceClientConfig, type DeepPartial } from "@voice-interview/client";
import { ClientEventBinder } from "../sdk/ClientEventBinder";
import { useConnectionStore } from "../stores/connection.store";
import { useInterviewStore } from "../stores/interview.store";
import { useAudioStore } from "../stores/audio.store";
import { useTelemetryStore } from "../stores/telemetry.store";

interface VoiceInterviewContextValue {
  client: VoiceInterviewClient;
  isReady: boolean; // True once the client is instantiated and bound
}

const VoiceInterviewContext = createContext<VoiceInterviewContextValue | null>(null);

export interface VoiceInterviewProviderProps {
  children: React.ReactNode;
  config?: DeepPartial<VoiceClientConfig>;
}

export const VoiceInterviewProvider: React.FC<VoiceInterviewProviderProps> = ({
  children,
  config,
}) => {
  const [isReady, setIsReady] = useState(false);
  const clientRef = useRef<VoiceInterviewClient | null>(null);
  const binderRef = useRef<ClientEventBinder | null>(null);

  useEffect(() => {
    // 1. Instantiate the client
    const client = new VoiceInterviewClient(config ?? {});
    clientRef.current = client;

    // 2. Create and bind the event adapter
    const binder = new ClientEventBinder(client);
    binder.bind();
    binderRef.current = binder;

    setIsReady(true);

    // 3. Cleanup on unmount
    return () => {
      binder.unbind();
      client.destroy();
      
      // Reset stores
      useConnectionStore.getState().reset();
      useInterviewStore.getState().reset();
      useAudioStore.getState().reset();
      useTelemetryStore.getState().reset();
      
      clientRef.current = null;
      binderRef.current = null;
      setIsReady(false);
    };
  }, [config]);

  if (!clientRef.current) {
    return null; // Or a loading spinner if preferred, but usually it's synchronous enough
  }

  return (
    <VoiceInterviewContext.Provider value={{ client: clientRef.current, isReady }}>
      {children}
    </VoiceInterviewContext.Provider>
  );
};

/**
 * Internal hook to access the client instance.
 * Exposed to the feature's custom hooks, NOT directly to components.
 */
export function useVoiceInterviewClient(): VoiceInterviewClient {
  const context = useContext(VoiceInterviewContext);
  if (!context) {
    throw new Error("useVoiceInterviewClient must be used within a VoiceInterviewProvider");
  }
  return context.client;
}
