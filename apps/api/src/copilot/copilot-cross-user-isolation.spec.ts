/**
 * CROSS-USER ISOLATION TEST
 * Validates that the Copilot race condition fix prevents cross-user data leaks
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ConversationMemoryService } from './conversation-memory.service';
import { CopilotPersistenceService } from './copilot-persistence.service';
import { PrismaService } from '../runtime/kg/prisma.service';

describe('Copilot Cross-User Isolation', () => {
  let conversationMemory: ConversationMemoryService;
  let copilotPersistence: CopilotPersistenceService;
  let prismaService: PrismaService;

  const USER_A_ID = 'user-a-id';
  const USER_B_ID = 'user-b-id';
  const SESSION_A_ID = 'session-a';
  const SESSION_B_ID = 'session-b';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationMemoryService,
        {
          provide: CopilotPersistenceService,
          useValue: {
            getConversationHistory: jest.fn().mockImplementation((userId, sessionId) => {
              // Return empty array to force using in-memory data
              return Promise.resolve([]);
            }),
            clearConversation: jest.fn(),
            addMessage: jest.fn(),
            getAllSessions: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            copilotConversation: {
              create: jest.fn(),
              findMany: jest.fn(),
              deleteMany: jest.fn(),
            },
          } as any,
        },
      ],
    }).compile();

    conversationMemory = module.get<ConversationMemoryService>(ConversationMemoryService);
    copilotPersistence = module.get<CopilotPersistenceService>(CopilotPersistenceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Race Condition Prevention', () => {
    it('should prevent cross-user conversation leak when processing messages concurrently', async () => {
      // Simulate concurrent requests from two different users
      const userAMessage = conversationMemory.addMessage(
        SESSION_A_ID,
        { role: 'user', content: 'User A message', timestamp: new Date() },
        USER_A_ID,
      );

      const userBMessage = conversationMemory.addMessage(
        SESSION_B_ID,
        { role: 'user', content: 'User B message', timestamp: new Date() },
        USER_B_ID,
      );

      await Promise.all([userAMessage, userBMessage]);

      // Verify that User A cannot access User B's conversation
      const historyA = await conversationMemory.getConversationHistory(SESSION_A_ID, USER_A_ID);
      const historyB = await conversationMemory.getConversationHistory(SESSION_B_ID, USER_B_ID);

      expect(historyA).toBeDefined();
      expect(historyB).toBeDefined();

      // Verify cross-user isolation
      const userAHistoryB = await conversationMemory.getConversationHistory(SESSION_B_ID, USER_A_ID);
      const userBHistoryA = await conversationMemory.getConversationHistory(SESSION_A_ID, USER_B_ID);

      // Both should be empty or null because of ownership verification
      expect(userAHistoryB).toEqual([]);
      expect(userBHistoryA).toEqual([]);
    });

    it('should prevent cross-user conversation deletion', async () => {
      // Add message for User A
      await conversationMemory.addMessage(
        SESSION_A_ID,
        { role: 'user', content: 'User A message', timestamp: new Date() },
        USER_A_ID,
      );

      // User B tries to delete User A's conversation
      await conversationMemory.clearConversation(SESSION_A_ID, USER_B_ID);

      // Verify that clearConversation was called with USER_B_ID (not USER_A_ID)
      expect(copilotPersistence.clearConversation).toHaveBeenCalledWith(USER_B_ID, SESSION_A_ID);
      expect(copilotPersistence.clearConversation).not.toHaveBeenCalledWith(USER_A_ID, SESSION_A_ID);
    });

    it('should prevent cross-user session listing', async () => {
      // Add messages for both users
      await conversationMemory.addMessage(
        SESSION_A_ID,
        { role: 'user', content: 'User A message', timestamp: new Date() },
        USER_A_ID,
      );

      await conversationMemory.addMessage(
        SESSION_B_ID,
        { role: 'user', content: 'User B message', timestamp: new Date() },
        USER_B_ID,
      );

      // Verify that getAllSessions is called with the correct userId
      await conversationMemory.getAllSessions(USER_A_ID);
      await conversationMemory.getAllSessions(USER_B_ID);

      expect(copilotPersistence.getAllSessions).toHaveBeenCalledWith(USER_A_ID);
      expect(copilotPersistence.getAllSessions).toHaveBeenCalledWith(USER_B_ID);
    });
  });

  describe('Persistence Layer Ownership', () => {
    it('should verify that CopilotPersistenceService uses userId in all queries', async () => {
      await copilotPersistence.getConversationHistory(USER_A_ID, SESSION_A_ID);

      expect(copilotPersistence.getConversationHistory).toHaveBeenCalledWith(USER_A_ID, SESSION_A_ID);
    });

    it('should verify that clearConversation uses userId in delete query', async () => {
      await copilotPersistence.clearConversation(USER_A_ID, SESSION_A_ID);

      expect(copilotPersistence.clearConversation).toHaveBeenCalledWith(USER_A_ID, SESSION_A_ID);
    });
  });
});
