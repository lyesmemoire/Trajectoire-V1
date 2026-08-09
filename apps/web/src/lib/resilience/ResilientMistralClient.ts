/**
 * Resilient Mistral Client - SPRINT-4.4
 * 
 * Wraps Mistral client with resilience patterns
 */

import { Mistral } from '@mistralai/mistralai';
import { resilienceManager } from './ResilienceManager';

export class ResilientMistralClient {
  private static instance: ResilientMistralClient;
  private client: Mistral;

  private constructor() {
    const apiKey = process.env.MISTRAL_API_KEY;
    
    if (!apiKey || apiKey === 'dummy') {
      // Don't throw during build, just use a dummy client
      this.client = new Mistral({ apiKey: 'dummy' });
      return;
    }

    this.client = new Mistral({ apiKey });
  }

  static getInstance(): ResilientMistralClient {
    if (!ResilientMistralClient.instance) {
      ResilientMistralClient.instance = new ResilientMistralClient();
    }
    return ResilientMistralClient.instance;
  }

  get chat() {
    return {
      complete: (params: any) => resilienceManager.execute(
        'mistral.chat.complete',
        () => this.client.chat.complete(params)
      ),
    };
  }

  get embeddings() {
    return {
      create: (params: any) => resilienceManager.execute(
        'mistral.embeddings.create',
        () => this.client.embeddings.create(params)
      ),
    };
  }

  getClient(): Mistral {
    return this.client;
  }
}

export const resilientMistralClient = ResilientMistralClient.getInstance();