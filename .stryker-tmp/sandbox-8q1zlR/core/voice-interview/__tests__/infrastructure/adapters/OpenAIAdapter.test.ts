// @ts-nocheck
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { OpenAI } from 'openai';
import { OpenAIEvaluationAdapter } from '../../../infrastructure/adapters/openai/OpenAIEvaluationAdapter.js';
import { ProviderError } from '../../../infrastructure/errors/ProviderErrors.js';

const server = setupServer(
  http.post('https://api.openai.com/v1/chat/completions', async () => {
    return HttpResponse.json({
      choices: [{
        message: {
          content: JSON.stringify({
            score: 85,
            completeness: true,
            analysis: 'Very good answer.'
          })
        }
      }]
    });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('OpenAIEvaluationAdapter (with MSW)', () => {
  it('should successfully evaluate an answer via HTTP', async () => {
    // Real SDK client, but intercepted by MSW
    const client = new OpenAI({ apiKey: 'test-key', baseURL: 'https://api.openai.com/v1' });
    const adapter = new OpenAIEvaluationAdapter(client);

    const result = await adapter.evaluateAnswer('My answer', {
      targetRole: 'Backend',
      currentPhase: 'exploration',
      historyScores: [],
      historyTurns: []
    });

    expect(result.score.value).toBe(85);
    expect(result.completeness).toBe(true);
    expect(result.analysis).toBe('Very good answer.');
  });

  it('should throw ProviderError on API failure', async () => {
    server.use(
      http.post('https://api.openai.com/v1/chat/completions', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const client = new OpenAI({ apiKey: 'test-key', baseURL: 'https://api.openai.com/v1', maxRetries: 0 });
    const adapter = new OpenAIEvaluationAdapter(client);

    await expect(adapter.evaluateAnswer('My answer', {
      targetRole: 'Backend',
      currentPhase: 'exploration',
      historyScores: [],
      historyTurns: []
    })).rejects.toThrow(ProviderError);
  });
});
