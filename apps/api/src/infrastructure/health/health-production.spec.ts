import { ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';

const pingMock = jest.fn();
const quitMock = jest.fn();

jest.mock('ioredis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    ping: pingMock,
    quit: quitMock,
  })),
}));

import Redis from 'ioredis';

describe('HealthController production Redis health', () => {
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

  function createController(
    values: Record<string, unknown>,
  ): HealthController {
    return new HealthController(
      {} as never,
      {} as never,
      {} as never,
      createConfig(values),
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
    pingMock.mockResolvedValue('PONG');
    quitMock.mockResolvedValue('OK');
  });

  it('uses localhost:6379 outside production', async () => {
    const controller = createController({
      NODE_ENV: 'development',
    });

    await controller.checkRedis();

    expect(Redis).toHaveBeenCalledWith({
      host: 'localhost',
      port: 6379,
      password: undefined,
      db: 0,
    });
  });

  it('rejects missing REDIS_HOST in production before connecting', async () => {
    const controller = createController({
      NODE_ENV: 'production',
      REDIS_PORT: '6379',
    });

    await expect(
      controller.checkRedis(),
    ).rejects.toThrow(
      'REDIS_HOST and REDIS_PORT are required in production',
    );

    expect(Redis).not.toHaveBeenCalled();
  });

  it('rejects missing REDIS_PORT in production before connecting', async () => {
    const controller = createController({
      NODE_ENV: 'production',
      REDIS_HOST: 'redis.example.com',
    });

    await expect(
      controller.checkRedis(),
    ).rejects.toThrow(
      'REDIS_HOST and REDIS_PORT are required in production',
    );

    expect(Redis).not.toHaveBeenCalled();
  });

  it.each([
    'abc',
    '0',
    '-1',
    '65536',
    '1.5',
  ])('rejects invalid REDIS_PORT %s before connecting', async (port) => {
    const controller = createController({
      NODE_ENV: 'production',
      REDIS_HOST: 'redis.example.com',
      REDIS_PORT: port,
    });

    await expect(
      controller.checkRedis(),
    ).rejects.toThrow(
      'REDIS_PORT must be a valid TCP port',
    );

    expect(Redis).not.toHaveBeenCalled();
  });

  it('reports Redis as up after a successful ping', async () => {
    const controller = createController({
      NODE_ENV: 'production',
      REDIS_HOST: 'redis.internal',
      REDIS_PORT: '6380',
      REDIS_PASSWORD: 'secret',
      REDIS_DB: 2,
    });

    await expect(
      controller.checkRedis(),
    ).resolves.toEqual({
      status: 'up',
      redis: {
        status: 'up',
        ping: 'PONG',
      },
    });

    expect(Redis).toHaveBeenCalledWith({
      host: 'redis.internal',
      port: 6380,
      password: 'secret',
      db: 2,
    });

    expect(pingMock).toHaveBeenCalledTimes(1);
    expect(quitMock).toHaveBeenCalledTimes(1);
  });

  it('reports Redis as down and closes the client when ping fails', async () => {
    pingMock.mockRejectedValueOnce(
      new Error('redis unavailable'),
    );

    const controller = createController({
      NODE_ENV: 'production',
      REDIS_HOST: 'redis.internal',
      REDIS_PORT: '6380',
    });

    await expect(
      controller.checkRedis(),
    ).resolves.toEqual({
      status: 'down',
      redis: {
        status: 'down',
        error: 'redis unavailable',
      },
    });

    expect(pingMock).toHaveBeenCalledTimes(1);
    expect(quitMock).toHaveBeenCalledTimes(1);
  });
});
