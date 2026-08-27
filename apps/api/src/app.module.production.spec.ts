import { validateEnvironment } from './config/validate-environment';

describe('production environment validation', () => {
  const validProductionConfig: Record<string, unknown> = {
    NODE_ENV: 'production',
    DATABASE_URL: 'postgresql://user:password@db.example.com:5432/app',
    REDIS_HOST: 'redis.example.com',
    REDIS_PORT: '6379',
    OPENAI_API_KEY: 'sk-production-test-key',
    ALLOWED_ORIGINS: 'https://app.example.com',
  };

  function config(
    overrides: Record<string, unknown> = {},
  ): Record<string, unknown> {
    return {
      ...validProductionConfig,
      ...overrides,
    };
  }

  it('accepts a valid production configuration', () => {
    const value = config();

    expect(validateEnvironment(value)).toBe(value);
  });

  it.each([
    'DATABASE_URL',
    'REDIS_HOST',
    'REDIS_PORT',
    'OPENAI_API_KEY',
    'ALLOWED_ORIGINS',
  ])('rejects production when %s is missing', (key) => {
    const value = config();

    delete value[key];

    expect(() => validateEnvironment(value)).toThrow(
      /Missing required production environment variables/,
    );
  });

  it.each([
    'abc',
    '0',
    '-1',
    '65536',
    '1.5',
  ])('rejects invalid production REDIS_PORT %s', (port) => {
    expect(() =>
      validateEnvironment(
        config({
          REDIS_PORT: port,
        }),
      ),
    ).toThrow(
      'REDIS_PORT must be an integer between 1 and 65535 in production',
    );
  });

  it('rejects an invalid ALLOWED_ORIGINS URL', () => {
    expect(() =>
      validateEnvironment(
        config({
          ALLOWED_ORIGINS: 'not-a-url',
        }),
      ),
    ).toThrow(
      'ALLOWED_ORIGINS contains an invalid URL in production',
    );
  });

  it('rejects a non-http ALLOWED_ORIGINS URL', () => {
    expect(() =>
      validateEnvironment(
        config({
          ALLOWED_ORIGINS: 'ftp://example.com',
        }),
      ),
    ).toThrow(
      'ALLOWED_ORIGINS must contain only http(s) origins in production',
    );
  });

  it.each([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://[::1]:3000',
  ])('rejects local production origin %s', (origin) => {
    expect(() =>
      validateEnvironment(
        config({
          ALLOWED_ORIGINS: origin,
        }),
      ),
    ).toThrow(
      'ALLOWED_ORIGINS must not contain localhost in production',
    );
  });

  it('accepts multiple valid remote production origins', () => {
    const value = config({
      ALLOWED_ORIGINS:
        'https://app.example.com,https://admin.example.com',
    });

    expect(validateEnvironment(value)).toBe(value);
  });

  it('does not require production-only variables in development', () => {
    const value: Record<string, unknown> = {
      NODE_ENV: 'development',
    };

    expect(validateEnvironment(value)).toBe(value);
  });

  it('treats missing NODE_ENV as development', () => {
    const value: Record<string, unknown> = {};

    expect(validateEnvironment(value)).toBe(value);
  });
});
