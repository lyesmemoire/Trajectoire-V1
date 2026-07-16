// @ts-nocheck
import * as net from 'net';
import { EventEmitter } from 'events';
import type { FederationMessage } from './types.ts';

/**
 * TCP JSON mesh for federation communication.
 * - Handles peer reconnects with exponential backoff
 * - Validates incoming messages
 * - Enforces heartbeat timeouts
 */
export class InterNodeComm extends EventEmitter {
  private server: net.Server | null = null;
  private sockets: Map<string, net.Socket> = new Map();
  private nodeId: string;
  private listenPort: number;
  private peers: string[];
  private reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private heartbeatTimeouts: Map<string, NodeJS.Timeout> = new Map();

  private readonly maxReconnectDelay = 30000;
  private readonly heartbeatTimeoutMs = 15000;

  constructor(nodeId: string, listenPort: number, peers: string[]) {
    super();
    this.nodeId = nodeId;
    this.listenPort = listenPort;
    this.peers = peers;
  }

  start() {
    this.server = net.createServer((socket) => {
      // For inbound, we use remoteAddress:remotePort as temporary key
      const key = `inbound-${socket.remoteAddress}:${socket.remotePort}`;
      this.handleSocket(socket, key);
    });
    
    this.server.listen(this.listenPort, () => {
      console.log(`[InterNodeComm] ${this.nodeId} listening on port ${this.listenPort}`);
    });

    for (const peer of this.peers) {
      this.connectToPeer(peer);
    }
  }

  private connectToPeer(peer: string) {
    const [host, portStr] = peer.split(':');
    const port = Number(portStr);
    
    const socket = net.createConnection({ host, port }, () => {
      console.log(`[InterNodeComm] ${this.nodeId} connected to ${peer}`);
      this.reconnectAttempts.set(peer, 0); 
      this.handleSocket(socket, peer);
    });

    socket.on('error', (err) => {
      console.error(`[InterNodeComm] connection error to ${peer}:`, err.message);
      // Let 'close' handle the reconnect schedule
    });

    socket.on('close', () => {
      this.scheduleReconnect(peer);
    });
  }

  private scheduleReconnect(peer: string) {
    if (this.reconnectTimeouts.has(peer)) return;
    
    const attempts = this.reconnectAttempts.get(peer) ?? 0;
    const delay = Math.min(1000 * Math.pow(2, attempts), this.maxReconnectDelay);
    this.reconnectAttempts.set(peer, attempts + 1);

    console.log(`[InterNodeComm] scheduling reconnect to ${peer} in ${delay}ms`);
    
    const timeout = setTimeout(() => {
      this.reconnectTimeouts.delete(peer);
      this.connectToPeer(peer);
    }, delay);
    
    this.reconnectTimeouts.set(peer, timeout);
  }

  broadcast(msg: FederationMessage) {
    const payload = JSON.stringify(msg) + '\n';
    for (const s of Array.from(this.sockets.values())) {
      if (!s.destroyed) s.write(payload);
    }
  }

  onMessage(callback: (msg: FederationMessage) => void) {
    this.on('message', callback);
  }

  private validateMessage(msg: any): msg is FederationMessage {
    if (!msg || typeof msg !== 'object') return false;
    if (!msg.type || typeof msg.type !== 'string') return false;
    if (!msg.nodeId || typeof msg.nodeId !== 'string') return false;
    
    const validTypes = ['Heartbeat', 'RequestVote', 'VoteResponse', 'RestartVote', 'LeaseRenew'];
    return validTypes.includes(msg.type);
  }

  private handleSocket(socket: net.Socket, peerId: string) {
    this.sockets.set(peerId, socket);
    let buffer = '';
    socket.setEncoding('utf8');
    
    this.resetHeartbeatTimeout(peerId, socket);

    socket.on('data', (data) => {
      buffer += data;
      let idx: number;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.trim()) {
          try {
            const msg = JSON.parse(line);
            if (this.validateMessage(msg)) {
              this.resetHeartbeatTimeout(peerId, socket);
              this.emit('message', msg);
            } else {
              console.warn('[InterNodeComm] invalid message format:', line);
            }
          } catch (e) {
            console.error('[InterNodeComm] malformed json:', line);
          }
        }
      }
    });

    socket.on('close', () => {
      this.sockets.delete(peerId);
      this.clearHeartbeatTimeout(peerId);
    });
  }

  private resetHeartbeatTimeout(peerId: string, socket: net.Socket) {
    this.clearHeartbeatTimeout(peerId);
    const timeout = setTimeout(() => {
      console.warn(`[InterNodeComm] Heartbeat timeout for ${peerId}, destroying socket`);
      socket.destroy(); // Will trigger close event and reconnect logic
    }, this.heartbeatTimeoutMs);
    this.heartbeatTimeouts.set(peerId, timeout);
  }

  /**
   * Close all active sockets without destroying the server.
   * Used in testing to simulate a network partition.
   */
  public forceDisconnect() {
    for (const [key, sock] of this.sockets.entries()) {
      try {
        sock.destroy();
      } catch (_) { /* ignore */ }
    }
    this.sockets.clear();
    // clear any scheduled reconnects to avoid auto-reconnect during partition
    for (const [peer, to] of this.reconnectTimeouts.entries()) {
      clearTimeout(to);
    }
    this.reconnectTimeouts.clear();
  }

  /**
   * Re‑establish connections to all peers after a partition.
   */
  public reconnectAll() {
    for (const peer of this.peers) {
      // if not already connected, attempt connection
      if (!this.sockets.has(peer)) {
        this.connectToPeer(peer);
      }
    }
  }

  private clearHeartbeatTimeout(peerId: string) {
    const existing = this.heartbeatTimeouts.get(peerId);
    if (existing) {
      clearTimeout(existing);
      this.heartbeatTimeouts.delete(peerId);
    }
  }
}
