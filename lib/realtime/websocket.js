import io from "socket.io-client";
// Export a singleton Socket.IO client for realtime audio.
export const socket = io(process.env.NEXT_PUBLIC_API_URL, {
    transports: ['websocket'],
    autoConnect: false,
});
//# sourceMappingURL=websocket.js.map