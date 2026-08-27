import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

jest.mock('@nestjs/bull', () => {
  const actual = jest.requireActual('@nestjs/bull');

  return {
    ...actual,
    BullModule: {
      ...actual.BullModule,
      forRootAsync: jest.fn((options: unknown) => options),
    },
  };
});

describe('QueuesModule production configuration', () => {
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
      require('./queues.module');
    });

    const forRootAsync = BullModule.forRootAsync as jest.Mock;
    const call = forRootAsync.mock.calls[forRootAsync.mock.calls.length - 1];

    if (!call) {
      throw new Error('BullModule.forRootAsync was not called');
    }

    return call[0].useFactory as (
      configService: ConfigService,
    ) => Record<string, unknown>;
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses localhost:6379 outside production', () => {
    const factory = getFactory();

    const result = factory(
      createConfig({
        NODE_ENV: 'development',
      }),
    );

    expect(result).toMatchObject({
      redis: {
        host: 'localhost',
        port: 6379,
        db: 0,
      },
    });
  });

  it('rejects missing REDIS_HOST in production', () => {
    const factory = getFactory();

    expect(() =>
      factory(
        createConfig({
          NODE_ENV: 'production',
          REDIS_PORT: '6379',
        }),
      ),
    ).toThrow(
      'REDIS_HOST and REDIS_PORT are required in production',
    );
  });

  it('rejects missing REDIS_PORT in production', () => {
    const factory = getFactory();

    expect(() =>
      factory(
        createConfig({
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
    const factory = getFactory();

    expect(() =>
      factory(
        createConfig({
          NODE_ENV: 'production',
          REDIS_HOST: 'redis.example.com',
          REDIS_PORT: port,
        }),
      ),
    ).toThrow(
      'REDIS_PORT must be a valid TCP port',
    );
  });

  it('uses explicit production Redis configuration', () => {
    const factory = getFactory();

    const result = factory(
      createConfig({
        NODE_ENV: 'production',
        REDIS_HOST: 'queue-redis.internal',
        REDIS_PORT: '6381',
        REDIS_PASSWORD: 'queue-secret',
        REDIS_DB: 5,
      }),
    );

    expect(result).toMatchObject({
      redis: {
        host: 'queue-redis.internal',
        port: 6381,
        password: 'queue-secret',
        db: 5,
      },
    });
  });

  it('configures production-safe retry defaults', () => {
    const factory = getFactory();

    const result = factory(
      createConfig({
        NODE_ENV: 'development',
      }),
    );

    expect(result).toMatchObject({
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 10,
        removeOnFail: 50,
      },
    });
  });
});
