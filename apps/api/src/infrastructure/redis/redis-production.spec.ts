import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

jest.mock('ioredis', () => {
  const RedisMock = jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  }));

  return {
    __esModule: true,
    default: RedisMock,
  };
});

import { RedisModule } from './redis.module';

type RedisFactory = (configService: ConfigService) => unknown;

function getRedisFactory(): RedisFactory {
  const metadata = Reflect.getMetadata('providers', RedisModule) as unknown[];

  const provider = metadata.find(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'provide' in item &&
      (item as { provide?: unknown }).provide === 'REDIS_CLIENT',
  ) as
    | {
        useFactory?: RedisFactory;
      }
    | undefined;

  if (!provider?.useFactory) {
    throw new Error('REDIS_CLIENT factory metadata not found');
  }

  return provider.useFactory;
}

function config(values: Record<string, unknown>): ConfigService {
  return {
    get: jest.fn((key: string, defaultValue?: unknown) =>
      Object.prototype.hasOwnProperty.call(values, key)
        ? values[key]
        : defaultValue,
    ),
  } as unknown as ConfigService;
}

describe('RedisModule production configuration', () => {
  const factory = getRedisFactory();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses localhost:6379 defaults outside production', () => {
    factory(
      config({
        NODE_ENV: 'development',
      }),
    );

    expect(Redis).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'localhost',
        port: 6379,
      }),
    );
  });

  it('rejects missing REDIS_HOST in production', () => {
    expect(() =>
      factory(
        config({
          NODE_ENV: 'production',
          REDIS_PORT: '6379',
        }),
      ),
    ).toThrow(
      'REDIS_HOST and REDIS_PORT are required in production',
    );
  });

  it('rejects missing REDIS_PORT in production', () => {
    expect(() =>
      factory(
        config({
          NODE_ENV: 'production',
          REDIS_HOST: 'redis.example.com',
        }),
      ),
    ).toThrow(
      'REDIS_HOST and REDIS_PORT are required in production',
    );
  });

  it.each([
    'abc',
    '0',
    '-1',
    '65536',
    '1.5',
  ])('rejects invalid REDIS_PORT %s', (port) => {
    expect(() =>
      factory(
        config({
          NODE_ENV: 'production',
          REDIS_HOST: 'redis.example.com',
          REDIS_PORT: port,
        }),
      ),
    ).toThrow('REDIS_PORT must be a valid TCP port');
  });

  it('creates Redis with validated production host and port', () => {
    factory(
      config({
        NODE_ENV: 'production',
        REDIS_HOST: 'redis.example.com',
        REDIS_PORT: '6380',
        REDIS_PASSWORD: 'secret',
        REDIS_DB: 2,
      }),
    );

    expect(Redis).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'redis.example.com',
        port: 6380,
        password: 'secret',
        db: 2,
        lazyConnect: true,
        maxRetriesPerRequest: 3,
      }),
    );
  });

  it('returns null without constructing Redis when disabled', () => {
    const result = factory(
      config({
        REDIS_ENABLED: 'false',
        NODE_ENV: 'production',
      }),
    );

    expect(result).toBeNull();
    expect(Redis).not.toHaveBeenCalled();
  });
});
