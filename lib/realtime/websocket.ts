import io from "socket.io-client";
import { envClient } from "@/lib/env.client";

// Export a singleton Socket.IO client for realtime audio.
export const socket = io(envClient.NEXT_PUBLIC_API_URL!, {
  transports: ['websocket'],
  autoConnect: false,
});
