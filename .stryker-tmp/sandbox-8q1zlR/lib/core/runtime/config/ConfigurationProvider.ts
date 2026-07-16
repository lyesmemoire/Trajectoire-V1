// @ts-nocheck
export interface ConfigurationProvider {
  get<T>(key: string, defaultValue?: T): T;
  getString(key: string, defaultValue?: string): string;
  getNumber(key: string, defaultValue?: number): number;
  getBoolean(key: string, defaultValue?: boolean): boolean;
}

export class EnvConfigurationProvider implements ConfigurationProvider {
  get<T>(key: string, defaultValue?: T): T {
    const val = process.env[key];
    if (val === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Configuration key not found: ${key}`);
    }
    return val as unknown as T;
  }
  
  getString(key: string, defaultValue?: string): string {
    return this.get<string>(key, defaultValue);
  }

  getNumber(key: string, defaultValue?: number): number {
    const val = process.env[key];
    if (val === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Configuration key not found: ${key}`);
    }
    const num = Number(val);
    if (isNaN(num)) throw new Error(`Configuration key ${key} is not a valid number: ${val}`);
    return num;
  }

  getBoolean(key: string, defaultValue?: boolean): boolean {
    const val = process.env[key];
    if (val === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Configuration key not found: ${key}`);
    }
    return val === 'true' || val === '1';
  }
}
