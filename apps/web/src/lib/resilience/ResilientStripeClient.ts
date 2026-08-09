/**
 * Resilient Stripe Client - SPRINT-4.4
 * 
 * Wraps Stripe client with resilience patterns
 */

import Stripe from 'stripe';
import { resilienceManager } from './ResilienceManager';

export class ResilientStripeClient {
  private static instance: ResilientStripeClient;
  private client: Stripe;

  private constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey || secretKey.includes('dummy')) {
      // Don't throw during build, just use a dummy client
      this.client = new Stripe('sk_test_dummy', {
        apiVersion: '2025-02-24.acacia',
        timeout: 30000,
      });
      return;
    }

    this.client = new Stripe(secretKey, {
      apiVersion: '2025-02-24.acacia',
      timeout: 30000, // Default timeout
    });
  }

  static getInstance(): ResilientStripeClient {
    if (!ResilientStripeClient.instance) {
      ResilientStripeClient.instance = new ResilientStripeClient();
    }
    return ResilientStripeClient.instance;
  }

  get checkout() {
    return {
      sessions: {
        create: (params: any) => resilienceManager.execute(
          'stripe.checkout.sessions.create',
          () => this.client.checkout.sessions.create(params)
        ),
      },
    };
  }

  get billingPortal() {
    return {
      sessions: {
        create: (params: any) => resilienceManager.execute(
          'stripe.billingPortal.sessions.create',
          () => this.client.billingPortal.sessions.create(params)
        ),
      },
    };
  }

  get customers() {
    return {
      create: (params: any) => resilienceManager.execute(
        'stripe.customers.create',
        () => this.client.customers.create(params)
      ),
      list: (params: any) => resilienceManager.execute(
        'stripe.customers.list',
        () => this.client.customers.list(params)
      ),
    };
  }

  get webhooks() {
    return {
      constructEvent: (payload: string, signature: string, secret: string) => {
        const event = this.client.webhooks.constructEvent(payload, signature, secret);
        return Promise.resolve(event);
      },
    };
  }

  getClient(): Stripe {
    return this.client;
  }
}

export const resilientStripeClient = ResilientStripeClient.getInstance();