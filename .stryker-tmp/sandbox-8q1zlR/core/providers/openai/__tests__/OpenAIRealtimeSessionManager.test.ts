/**
 * Unit Tests for OpenAI Realtime Session Manager
 */
// @ts-nocheck


import { OpenAIRealtimeSessionManagerImpl } from "../OpenAIRealtimeSessionManagerImpl";
import { OpenAIRealtimeConfiguration } from "../OpenAIRealtimeConversationProvider";

describe("OpenAIRealtimeSessionManager", () => {
  let sessionManager: OpenAIRealtimeSessionManagerImpl;
  let mockConfig: OpenAIRealtimeConfiguration;

  beforeEach(() => {
    sessionManager = new OpenAIRealtimeSessionManagerImpl();
    mockConfig = {
      apiKey: "sk-test1234567890abcdefghijklmnopqrstuvwxyz",
      model: "gpt-4o-realtime-preview",
      options: {}
    };
  });

  test("should create session successfully", async () => {
    const sessionId = await sessionManager.createSession(mockConfig);
    expect(sessionId).toBeDefined();
    expect(sessionId).toMatch(/^session_\d+_\d+$/);
  });

  test("should get session successfully", async () => {
    const sessionId = await sessionManager.createSession(mockConfig);
    const session = sessionManager.getSession(sessionId);
    expect(session).toBeDefined();
    expect(session?.sessionId).toBe(sessionId);
  });

  test("should return null for non-existent session", () => {
    const session = sessionManager.getSession("non_existent");
    expect(session).toBeNull();
  });

  test("should close session successfully", async () => {
    const sessionId = await sessionManager.createSession(mockConfig);
    await sessionManager.closeSession(sessionId);
    const session = sessionManager.getSession(sessionId);
    expect(session?.state).toBe("Closed");
  });

  test("should throw error when closing non-existent session", async () => {
    await expect(sessionManager.closeSession("non_existent")).rejects.toThrow("Session non_existent not found");
  });

  test("should update session activity", async () => {
    const sessionId = await sessionManager.createSession(mockConfig);
    const initialSession = sessionManager.getSession(sessionId);
    const initialActivity = initialSession?.lastActivity;
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 10));
    
    sessionManager.updateSessionActivity(sessionId);
    const updatedSession = sessionManager.getSession(sessionId);
    expect(updatedSession?.lastActivity).toBeGreaterThan(initialActivity as number || 0);
  });

  test("should get all sessions", async () => {
    await sessionManager.createSession(mockConfig);
    await sessionManager.createSession(mockConfig);
    const sessions = sessionManager.getAllSessions();
    expect(sessions.length).toBe(2);
  });

  test("should get active sessions", async () => {
    const sessionId1 = await sessionManager.createSession(mockConfig);
    const sessionId2 = await sessionManager.createSession(mockConfig);
    
    await sessionManager.closeSession(sessionId1);
    
    const activeSessions = sessionManager.getActiveSessions();
    expect(activeSessions.length).toBe(1);
    expect(activeSessions[0].sessionId).toBe(sessionId2);
  });

  test("should cleanup inactive sessions", async () => {
    const sessionId = await sessionManager.createSession(mockConfig);
    await sessionManager.closeSession(sessionId);
    
    // Wait to ensure session is inactive
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const cleaned = sessionManager.cleanupInactiveSessions(5); // 5ms max age
    expect(cleaned).toBe(1);
  });
});
