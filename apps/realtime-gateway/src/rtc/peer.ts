// @ts-nocheck
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from "werift";
import WebSocket from "ws";
import { logger } from "../telemetry/logger.js";

export class RtcPeer {
  private readonly ws: WebSocket;
  private readonly pc: RTCPeerConnection;

  constructor(ws: WebSocket, turnServers: unknown[]) {
    this.ws = ws;
    this.pc = new RTCPeerConnection({ iceServers: turnServers });

    this.pc.connectionStateChange.subscribe((state: unknown) => {
      logger.info({ state }, "Peer connection state changed");
    });
  }

  async processOffer(offer: unknown) {
    await this.pc.setRemoteDescription(
      new RTCSessionDescription(offer.sdp, offer.type),
    );
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    this.ws.send(JSON.stringify({ type: "answer", payload: answer }));
  }

  async processAnswer(answer: unknown) {
    await this.pc.setRemoteDescription(
      new RTCSessionDescription(answer.sdp, answer.type),
    );
  }

  async addIceCandidate(candidate: unknown) {
    await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

  close() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    this.pc.close();
  }
}
