/**
 * Resilient Supabase Client - SPRINT-4.4
 * 
 * Wraps Supabase client with resilience patterns
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { resilienceManager } from './ResilienceManager';

export class ResilientSupabaseClient {
  private static instance: ResilientSupabaseClient;
  private client: SupabaseClient;

  private constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      // Don't throw during build, just use a dummy client
      this.client = createClient('https://dummy.supabase.co', 'dummy-anon-key');
      return;
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  static getInstance(): ResilientSupabaseClient {
    if (!ResilientSupabaseClient.instance) {
      ResilientSupabaseClient.instance = new ResilientSupabaseClient();
    }
    return ResilientSupabaseClient.instance;
  }

  get auth() {
    return {
      getUser: () => resilienceManager.execute(
        'supabase.auth.getUser',
        () => this.client.auth.getUser()
      ),
      signUp: (credentials: any) => resilienceManager.execute(
        'supabase.auth.signUp',
        () => this.client.auth.signUp(credentials)
      ),
      signInWithPassword: (credentials: any) => resilienceManager.execute(
        'supabase.auth.signInWithPassword',
        () => this.client.auth.signInWithPassword(credentials)
      ),
      signOut: () => resilienceManager.execute(
        'supabase.auth.signOut',
        () => this.client.auth.signOut()
      ),
    };
  }

  from(table: string) {
    // Return raw Supabase query builder for now
    // Resilience pattern doesn't work well with Supabase's query builder pattern
    return this.client.from(table);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}

export const resilientSupabaseClient = ResilientSupabaseClient.getInstance();