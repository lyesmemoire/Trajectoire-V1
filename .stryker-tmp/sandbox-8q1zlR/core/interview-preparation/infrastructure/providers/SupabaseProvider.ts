/**
 * SupabaseProvider
 *
 * Infrastructure Supabase provider.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY Supabase configuration abstraction.
 */
// @ts-nocheck


import { ConfigurationService, SupabaseConfig } from "../configuration/ConfigurationService";

export interface ISupabaseProvider {
  getConfig(): SupabaseConfig;
}

export class SupabaseProvider implements ISupabaseProvider {
  constructor(private readonly configurationService: ConfigurationService) {}

  getConfig(): SupabaseConfig {
    return this.configurationService.getSupabaseConfig();
  }
}
