import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

jest.mock('@nestjs/cache-manager', () => {
  const actual = jest.requireActual('@nestjs/cache-manager');

  return {
    ...actual,
    CacheModule: {
      ...actual.CacheModule,
      registerAsync: jest.fn((options: unknown) => options),
    },
  };
});

describe('RedisCacheModule production configuration', () => {
  function createConfig(
    values: Record<string, unknown>,
  ): ConfigService {
    return {
      get: jest.fn(
        (
          key: string,
          defaultValue?: unknown,
        ): unknown => {
          return Object.prototype.hasOwnProperty.call(values, key)
            ? values[key]
            : defaultValue;
        },
      ),
    } as unknown as ConfigService;
  }

  function getFactory() {
    jest.isolateModules(() => {
      require('./cache.module');
    });

    const registerAsync = CacheModule.registerAsync as jest.Mock;
    const call = registerAsync.mock.calls[registerAsync.mock.calls.length - 1];

    if (!call) {
      throw new Error('CacheModule.registerAsync was not called');
    }

    return call[0].useFactory as (
      configService: ConfigService,
    ) => Promise<Record<string, unknown>>;
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses localhost:6379 outside production', async () => {
    const factory = getFactory();

    const result = await factory(
      createConfig({
        NODE_ENV: 'development',
      }),
    );

    expect(result).toMatchObject({
      host: 'localhost',
      port: 6379,
      db: 0,
      ttl: 3600,
      max: 1000,
    });
  });

  it('rejects missing REDIS_HOST in production', async () => {
    const factory = getFactory();

    await expect(
      factory(
        createConfig({
          NODE_ENV: 'production',
          REDIS_PORT: '6379',
        }),
      ),
    ).rejects.toThrow(
      'REDIS_HOST and REDIS_PORT are required in production',
    );
  });

  it('rejects missing REDIS_PORT in production', async () => {
    const factory = getFactory();

    await expect(
      factory(
        createConfig({
          NODE_ENV: 'production',
          REDIS_HOST: 'redis.example.com',
        }),
      ),
    ).rejects.toThrow(
      'REDIS_HOST and REDIS_PORT are required in production',
    );
  });

  it.each([
    'abc',
    '0',
    '-1',
    '65536',
    '1.5',
  ])('rejects invalid REDIS_PORT %s', async (port) => {
    const factory = getFactory();

    await expect(
      factory(
        createConfig({
          NODE_ENV: 'production',
          REDIS_HOST: 'redis.example.com',
          REDIS_PORT: port,
        }),
      ),
    ).rejects.toThrow(
      'REDIS_PORT must be a valid TCP port',
    );
  });

  it('uses explicit production Redis and cache configuration', async () => {
    const factory = getFactory();

    const result = await factory(
      createConfig({
        NODE_ENV: 'production',
        REDIS_HOST: 'redis.internal',
        REDIS_PORT: '6380',
        REDIS_PASSWORD: 'secret',
        REDIS_DB: 4,
        CACHE_TTL: 120,
        CACHE_MAX: 250,
      }),
    );

    expect(result).toMatchObject({
      host: 'redis.internal',
      port: 6380,
      password: 'secret',
      db: 4,
      ttl: 120,
      max: 250,
    });
  });

  it('does not cache null or undefined values', async () => {
    const factory = getFactory();

    const result = await factory(
      createConfig({
        NODE_ENV: 'development',
      }),
    );

    const isCacheableValue = result.isCacheableValue as (
      value: unknown,
    ) => boolean;

    expect(isCacheableValue(undefined)).toBe(false);
    expect(isCacheableValue(null)).toBe(false);
    expect(isCacheableValue(false)).toBe(true);
    expect(isCacheableValue(0)).toBe(true);
    expect(isCacheableValue('')).toBe(true);
  });
});
