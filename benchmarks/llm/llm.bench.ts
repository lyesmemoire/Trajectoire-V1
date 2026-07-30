import { bench, describe } from 'vitest';
import { ProviderManager } from '../../compiler/cpr/provider-manager';

describe('LLM Benchmarks', () => {
  bench('LLM - prepare request', () => {
    const manager = new ProviderManager();
    manager.addProvider({ id: 'provider1', type: 'openai', apiKey: 'test' });
    manager.prepareRequest('test prompt', 'gpt-4');
  });

  bench('LLM - prepare 100 requests', () => {
    const manager = new ProviderManager();
    manager.addProvider({ id: 'provider1', type: 'openai', apiKey: 'test' });
    for (let i = 0; i < 100; i++) {
      manager.prepareRequest(`prompt ${i}`, 'gpt-4');
    }
  });

  bench('LLM - parse response', () => {
    const manager = new ProviderManager();
    manager.parseResponse({ text: 'response', usage: { tokens: 100 } });
  });

  bench('LLM - calculate tokens', () => {
    const manager = new ProviderManager();
    manager.calculateTokens('This is a test prompt for token calculation.');
  });
});
