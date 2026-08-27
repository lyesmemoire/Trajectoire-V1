import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { TransactionService } from './transaction.service';

jest.mock('ioredis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    del: jest.fn(),
    expire: jest.fn(),
  })),
}));

function config(values: Record<string, unknown>): ConfigService {
  return {
    get: jest.fn((key: string, defaultValue?: unknown) =>
      Object.prototype.hasOwnProperty.call(values, key)
        ? values[key]
        : defaultValue,
    ),
  } as unknown as ConfigService;
}

describe('TransactionService Redis configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses localhost:6379 defaults outside production', () => {
    new TransactionService(
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
    expect(
      () =>
        new TransactionService(
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
    expect(
      () =>
        new TransactionService(
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
    expect(
      () =>
        new TransactionService(
          config({
            NODE_ENV: 'production',
            REDIS_HOST: 'redis.example.com',
            REDIS_PORT: port,
          }),
        ),
    ).toThrow('REDIS_PORT must be a valid TCP port');
  });

  it('constructs Redis with validated production configuration', () => {
    new TransactionService(
      config({
        NODE_ENV: 'production',
        REDIS_HOST: 'redis.example.com',
        REDIS_PORT: '6380',
        REDIS_PASSWORD: 'secret',
        REDIS_DB: 3,
      }),
    );

    expect(Redis).toHaveBeenCalledWith({
      host: 'redis.example.com',
      port: 6380,
      password: 'secret',
      db: 3,
    });
  });
});
