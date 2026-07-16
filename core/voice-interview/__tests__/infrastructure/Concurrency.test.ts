import { describe, it, expect } from 'vitest';
import { ConcurrencyError } from '../../domain/errors/DomainErrors.js';
import { SupabaseInterviewRepository } from '../../infrastructure/adapters/supabase/SupabaseInterviewRepository.js';
import { InterviewSessionAggregate } from '../../domain/aggregates/InterviewSessionAggregate.js';
import { SessionId, CandidateId } from '../../domain/types.js';

describe('Concurrency - Optimistic Locking', () => {
  it('should throw ConcurrencyError if expected version does not match', async () => {
    const mockSupabaseClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: null,
              error: { code: 'PGRST116' } // simulate not found
            })
          })
        }),
        upsert: (data: any, options: any) => {
          // In a real scenario, Supabase upsert doesn't throw a conditional exception,
          // but we implemented a custom WHERE clause in our repository or we check row count.
          // The current SupabaseInterviewRepository implementation handles expectedVersion check
          // and throws ConcurrencyError. Let's mock the db response that triggers the error.
          return {
            select: () => ({
              single: async () => ({
                data: null, // No row returned = condition not met
                error: null
              })
            })
          };
        }
      })
    } as any;

    const repo = new SupabaseInterviewRepository(mockSupabaseClient);
    const session = InterviewSessionAggregate.createNew(SessionId.create('session-1'), CandidateId.create('cand-1'));
    
    // session version is 0 initially
    // If we expect version 5, it should trigger our concurrency error logic when upsert returns nothing
    const expectedVersion = 5; 
    
    await expect(repo.save(session, expectedVersion)).rejects.toThrow(ConcurrencyError);
  });
});
