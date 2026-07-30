/**
 * Realtime Gateway V2 - Fastify + WebRTC + OpenAI Realtime
 * 
 * RESPONSIBILITIES:
 * - WebRTC signaling
 * - Session management
 * - JWT verification
 * - Audio processing
 * - OpenAI Realtime connection
 * - Heartbeat monitoring
 * - Metrics collection
 * - Logging
 * 
 * NO BUSINESS LOGIC - All business logic is in Interview Orchestrator
 */

import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { verifyJWT } from './auth/jwt-verifier';
import { SessionManager } from './session/session-manager';
import { WebRTCManager } from './webrtc/webrtc-manager';
import { AudioProcessor } from './audio/audio-processor';
import { OpenAIRealtimeAdapter } from './openai/openai-adapter';
import { TelemetryService } from './telemetry/telemetry-service';
import { GatewayLogger } from './logging/gateway-logger';

export interface GatewayConfig {
  port: number;
  host: string;
  jwtSecret: string;
  openAIAPIKey: string;
  redisUrl: string;
  enableMetrics: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export class RealtimeGateway {
  private app: Fastify.Instance;
  private sessionManager: SessionManager;
  private webrtcManager: WebRTCManager;
  private audioProcessor: AudioProcessor;
  private openaiAdapter: OpenAIRealtimeAdapter;
  private telemetry: TelemetryService;
  private logger: GatewayLogger;
  private config: GatewayConfig;

  constructor(config: GatewayConfig) {
    this.config = config;
    this.app = Fastify({
      logger: {
        level: config.logLevel,
      },
    });

    this.logger = new GatewayLogger(config.logLevel);
    this.telemetry = new TelemetryService(config.enableMetrics);
    this.sessionManager = new SessionManager(config.redisUrl, this.logger);
    this.webrtcManager = new WebRTCManager(this.logger);
    this.audioProcessor = new AudioProcessor(this.logger);
    this.openaiAdapter = new OpenAIRealtimeAdapter(config.openAIAPIKey, this.logger);

    this.setupPlugins();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private async setupPlugins(): Promise<void> {
    await this.app.register(fastifyWebsocket);
    
    // CORS
    await this.app.register(require('@fastify/cors'), {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    });

    // Rate limiting
    await this.app.register(require('@fastify/rate-limit'), {
      max: 100,
      timeWindow: '1 minute',
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', async (request, reply) => {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        activeSessions: this.sessionManager.getActiveSessionCount(),
      };
    });

    // WebSocket endpoint for interview sessions
    this.app.register(async function (fastify) {
      fastify.get('/ws/interview/:sessionId', { websocket: true }, async (connection, request) => {
        try {
          const { sessionId } = request.params as { sessionId: string };
          const token = request.headers['authorization']?.replace('Bearer ', '');

          if (!token) {
            connection.socket.close(1008, 'Missing authorization token');
            return;
          }

          // Verify JWT
          const payload = await verifyJWT(token, this.config.jwtSecret);
          
          // Initialize session
          await this.sessionManager.initializeSession(sessionId, payload.userId);

          // Setup WebRTC
          const webrtcConnection = await this.webrtcManager.createConnection(sessionId);

          // Setup audio processing
          const audioStream = this.audioProcessor.createStream(sessionId);

          // Connect to OpenAI Realtime
          const openaiConnection = await this.openaiAdapter.connect(sessionId);

          // Handle WebSocket messages
          connection.socket.on('message', async (data: Buffer) => {
            try {
              const message = JSON.parse(data.toString());

              switch (message.type) {
                case 'audio':
                  // Process audio from candidate
                  const processedAudio = await this.audioProcessor.process(message.data);
                  await openaiConnection.sendAudio(processedAudio);
                  break;

                case 'webrtc_offer':
                  await webrtcConnection.handleOffer(message.data);
                  break;

                case 'webrtc_answer':
                  await webrtcConnection.handleAnswer(message.data);
                  break;

                case 'webrtc_ice':
                  await webrtcConnection.handleICECandidate(message.data);
                  break;

                case 'heartbeat':
                  await this.sessionManager.updateHeartbeat(sessionId);
                  connection.socket.send(JSON.stringify({ type: 'heartbeat_ack' }));
                  break;

                default:
                  this.logger.warn(`Unknown message type: ${message.type}`);
              }
            } catch (error) {
              this.logger.error(`Error processing message: ${error}`);
            }
          });

          // Handle OpenAI responses
          openaiConnection.on('audio', async (audioData) => {
            await connection.socket.send(JSON.stringify({
              type: 'audio',
              data: audioData,
            }));
          });

          openaiConnection.on('transcript', async (transcript) => {
            await connection.socket.send(JSON.stringify({
              type: 'transcript',
              data: transcript,
            }));
          });

          openaiConnection.on('event', async (event) => {
            await connection.socket.send(JSON.stringify({
              type: 'event',
              data: event,
            }));
          });

          // Handle connection close
          connection.socket.on('close', async () => {
            await this.sessionManager.cleanupSession(sessionId);
            await webrtcManager.closeConnection(sessionId);
            await openaiAdapter.disconnect(sessionId);
            this.audioProcessor.destroyStream(sessionId);
          });

          // Send ready signal
          connection.socket.send(JSON.stringify({
            type: 'ready',
            sessionId,
          }));

          this.telemetry.incrementCounter('websocket_connections');
          this.logger.info(`WebSocket connection established for session ${sessionId}`);

        } catch (error) {
          this.logger.error(`WebSocket connection error: ${error}`);
          connection.socket.close(1011, 'Internal server error');
        }
      });
    });

    // REST API for session management
    this.app.post('/api/sessions', async (request, reply) => {
      try {
        const { userId, planId } = request.body as { userId: string; planId: string };
        
        // This would call the Interview Orchestrator to create a session
        // For now, we'll create a session ID and return it
        const sessionId = await this.sessionManager.createSession(userId, planId);

        const token = await this.sessionManager.generateSessionToken(sessionId, userId);

        return reply.code(201).send({
          sessionId,
          token,
          wsUrl: `ws://localhost:${this.config.port}/ws/interview/${sessionId}`,
        });
      } catch (error) {
        this.logger.error(`Error creating session: ${error}`);
        return reply.code(500).send({ error: 'Failed to create session' });
      }
    });

    this.app.get('/api/sessions/:sessionId', async (request, reply) => {
      try {
        const { sessionId } = request.params as { sessionId: string };
        const session = await this.sessionManager.getSession(sessionId);

        if (!session) {
          return reply.code(404).send({ error: 'Session not found' });
        }

        return session;
      } catch (error) {
        this.logger.error(`Error getting session: ${error}`);
        return reply.code(500).send({ error: 'Failed to get session' });
      }
    });

    this.app.delete('/api/sessions/:sessionId', async (request, reply) => {
      try {
        const { sessionId } = request.params as { sessionId: string };
        await this.sessionManager.cleanupSession(sessionId);

        return reply.code(204).send();
      } catch (error) {
        this.logger.error(`Error deleting session: ${error}`);
        return reply.code(500).send({ error: 'Failed to delete session' });
      }
    });
  }

  private setupErrorHandling(): void {
    this.app.setErrorHandler((error, request, reply) => {
      this.logger.error(`Unhandled error: ${error}`);
      this.telemetry.incrementCounter('errors');

      reply.code(500).send({
        error: 'Internal server error',
        requestId: request.id,
      });
    });

    this.app.setNotFoundHandler((request, reply) => {
      reply.code(404).send({
        error: 'Not found',
        path: request.url,
      });
    });
  }

  async start(): Promise<void> {
    try {
      await this.app.listen({ port: this.config.port, host: this.config.host });
      this.logger.info(`Realtime Gateway listening on ${this.config.host}:${this.config.port}`);
      this.telemetry.recordGauge('gateway_start_time', Date.now());
    } catch (error) {
      this.logger.error(`Failed to start gateway: ${error}`);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await this.app.close();
      await this.sessionManager.shutdown();
      await this.openaiAdapter.shutdown();
      this.logger.info('Realtime Gateway stopped');
    } catch (error) {
      this.logger.error(`Error stopping gateway: ${error}`);
      throw error;
    }
  }

  getApp(): Fastify.Instance {
    return this.app;
  }
}
