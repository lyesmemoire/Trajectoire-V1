import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RateLimitingService, RateLimitScope } from './rate-limiting.service';
import Redis from 'ioredis';

describe('RateLimitingService', () => {
  let service: RateLimitingService;
  let redis: Redis;

  const mockRedis = {
    zremrangebyscore: jest.fn(),
    zcard: jest.fn(),
    zrange: jest.fn(),
    zadd: jest.fn(),
    expire: jest.fn(),
    del: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue: any) => defaultValue),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitingService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<RateLimitingService>(RateLimitingService);
    redis = module.get<Redis>('REDIS_CLIENT');

    jest.clearAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkRateLimit', () => {
    it('should allow request when under limit', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(5);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        '127.0.0.1',
        'api',
      );

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
      expect(mockRedis.zadd).toHaveBeenCalled();
    });

    it('should deny request when over limit', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(100);
      mockRedis.zrange.mockResolvedValue(['1234567890-0.123', '1234567890']);

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        '127.0.0.1',
        'api',
      );

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeDefined();
      expect(mockRedis.zadd).not.toHaveBeenCalled();
    });

    it('should check burst limit first when configured', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(25); // Over burst limit

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        '127.0.0.1',
        'api',
      );

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should fail open when Redis error occurs', async () => {
      mockRedis.zremrangebyscore.mockRejectedValue(new Error('Redis error'));

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        '127.0.0.1',
        'api',
      );

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(100);
    });

    it('should use correct Redis key format', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(5);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      await service.checkRateLimit(RateLimitScope.USER, 'user123', 'graph');

      expect(mockRedis.zremrangebyscore).toHaveBeenCalledWith(
        expect.stringContaining('ratelimit:user:user123:graph'),
        expect.any(Number),
        expect.any(Number),
      );
    });
  });

  describe('resetRateLimit', () => {
    it('should reset rate limit for specific scope and identifier', async () => {
      mockRedis.del.mockResolvedValue(1);

      await service.resetRateLimit(RateLimitScope.IP, '127.0.0.1', 'api');

      expect(mockRedis.del).toHaveBeenCalledWith('ratelimit:ip:127.0.0.1:api');
      expect(mockRedis.del).toHaveBeenCalledWith(
        'ratelimit:ip:127.0.0.1:api:burst',
      );
    });
  });

  describe('getRateLimitStatus', () => {
    it('should return current rate limit status', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(50);

      const status = await service.getRateLimitStatus(
        RateLimitScope.IP,
        '127.0.0.1',
        'api',
      );

      expect(status.count).toBe(50);
      expect(status.remaining).toBe(50);
      expect(status.resetTime).toBeInstanceOf(Date);
    });

    it('should calculate remaining correctly', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(95);

      const status = await service.getRateLimitStatus(
        RateLimitScope.IP,
        '127.0.0.1',
        'api',
      );

      expect(status.remaining).toBe(5);
    });
  });

  describe('configureRoute', () => {
    it('should configure custom rate limit for route type', () => {
      service.configureRoute('custom', {
        limit: 50,
        windowMs: 30000,
        burstLimit: 10,
        burstWindowMs: 5000,
      });

      // This would need to be tested by checking the internal configuration
      // For now, we just verify it doesn't throw
      expect(() =>
        service.configureRoute('custom', {
          limit: 50,
          windowMs: 30000,
        }),
      ).not.toThrow();
    });
  });

  describe('Sliding Window Algorithm', () => {
    it('should remove entries outside the window', async () => {
      const now = Date.now();
      mockRedis.zremrangebyscore.mockResolvedValue(5);
      mockRedis.zcard.mockResolvedValue(10);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      await service.checkRateLimit(RateLimitScope.IP, '127.0.0.1', 'api');

      expect(mockRedis.zremrangebyscore).toHaveBeenCalledWith(
        expect.any(String),
        0,
        expect.any(Number),
      );
    });

    it('should set correct expiry for the key', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(5);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      await service.checkRateLimit(RateLimitScope.IP, '127.0.0.1', 'api');

      expect(mockRedis.expire).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Number),
      );
    });
  });

  describe('Burst Management', () => {
    it('should allow burst requests within burst window', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(5); // Under burst limit
      mockRedis.zcard.mockResolvedValue(5); // Under main limit
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        '127.0.0.1',
        'api',
      );

      expect(result.allowed).toBe(true);
    });

    it('should deny burst requests over burst limit', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(25); // Over burst limit

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        '127.0.0.1',
        'api',
      );

      expect(result.allowed).toBe(false);
    });
  });

  describe('Different Scopes', () => {
    it('should handle IP scope', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(5);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        '192.168.1.1',
        'api',
      );

      expect(result.allowed).toBe(true);
    });

    it('should handle USER scope', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(5);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      const result = await service.checkRateLimit(
        RateLimitScope.USER,
        'user123',
        'api',
      );

      expect(result.allowed).toBe(true);
    });

    it('should handle SESSION scope', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(5);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      const result = await service.checkRateLimit(
        RateLimitScope.SESSION,
        'session456',
        'api',
      );

      expect(result.allowed).toBe(true);
    });

    it('should handle ORGANISATION scope', async () => {
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(5);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);

      const result = await service.checkRateLimit(
        RateLimitScope.ORGANISATION,
        'org789',
        'api',
      );

      expect(result.allowed).toBe(true);
    });
  });

  describe('Route Types', () => {
    const routeTypes = [
      'api',
      'auth',
      'upload',
      'graph',
      'copilot',
      'search',
      'matching',
      'simulation',
      'dashboard',
      'stripe',
    ];

    it.each(routeTypes)('should handle %s route type', async (routeType) => {
      // Mock burst check (returns count less than burst limit)
      mockRedis.zremrangebyscore.mockResolvedValue(0);
      mockRedis.zcard.mockResolvedValue(0);
      mockRedis.zadd.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);
      mockRedis.zrange.mockResolvedValue([]);

      const result = await service.checkRateLimit(
        RateLimitScope.IP,
        '127.0.0.1',
        routeType,
      );

      expect(result.allowed).toBe(true);
    });
  });
});
