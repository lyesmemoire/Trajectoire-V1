import { bench, describe } from 'vitest';
import { ProviderManager } from '../../compiler/cpr/provider-manager';

describe('Provider Benchmarks', () => {
  bench('Provider - add provider', () => {
    const manager = new ProviderManager();
    manager.addProvider({ id: 'provider1', type: 'openai', apiKey: 'test' });
  });

  bench('Provider - add 10 providers', () => {
    const manager = new ProviderManager();
    for (let i = 0; i < 10; i++) {
      manager.addProvider({ id: `provider${i}`, type: 'openai', apiKey: 'test' });
    }
  });

  bench('Provider - select provider', () => {
    const manager = new ProviderManager();
    manager.addProvider({ id: 'provider1', type: 'openai', apiKey: 'test' });
    manager.selectProvider('openai');
  });

  bench('Provider - balance load', () => {
    const manager = new ProviderManager();
    for (let i = 0; i < 5; i++) {
      manager.addProvider({ id: `provider${i}`, type: 'openai', apiKey: 'test' });
    }
    manager.balanceLoad();
  });
});
