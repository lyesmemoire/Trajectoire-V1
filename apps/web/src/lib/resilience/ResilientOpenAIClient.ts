/**
 * Resilient OpenAI Client - SPRINT-4.4
 * 
 * Wraps OpenAI client with resilience patterns
 */

import OpenAI from 'openai';
import { resilienceManager } from './ResilienceManager';

export class ResilientOpenAIClient {
  private static instance: ResilientOpenAIClient;
  private client: OpenAI;

  private constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'dummy') {
      // Don't throw during build, just use a dummy client
      this.client = new OpenAI({
        apiKey: 'sk-dummy',
        timeout: 30000,
      });
      return;
    }

    this.client = new OpenAI({
      apiKey,
      timeout: 30000, // Default timeout
    });
  }

  static getInstance(): ResilientOpenAIClient {
    if (!ResilientOpenAIClient.instance) {
      ResilientOpenAIClient.instance = new ResilientOpenAIClient();
    }
    return ResilientOpenAIClient.instance;
  }

  get chat() {
    return {
      completions: {
        create: (params: any) => resilienceManager.execute(
          'openai.chat.completions.create',
          () => this.client.chat.completions.create(params)
        ),
      },
    };
  }

  get embeddings() {
    return {
      create: (params: any) => resilienceManager.execute(
        'openai.embeddings.create',
        () => this.client.embeddings.create(params)
      ),
    };
  }

  getClient(): OpenAI {
    return this.client;
  }
}

export const resilientOpenAIClient = ResilientOpenAIClient.getInstance();