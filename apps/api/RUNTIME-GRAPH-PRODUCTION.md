# Runtime Graph v2 - Production Readiness Guide

## Overview
This document outlines the production-ready enhancements added to Runtime Graph v2, including Redis caching, queue management, retry mechanisms, circuit breakers, rate limiting, timeouts, health checks, graceful shutdown, and memory monitoring.

## Architecture

### Core Components

#### 1. Redis Cache (`src/cache/cache.module.ts`)
- **Purpose**: Distributed caching for improved performance
- **Configuration**: 
  - Host, port, password, DB configurable via environment variables
  - Default TTL: 1 hour
  - Max items: 1000
- **Usage**: Inject `CacheService` in services

```typescript
@Injectable()
export class MyService {
  constructor(private cacheService: CacheService) {}

  async getData(id: string) {
    return this.cacheService.wrap(
      `data:${id}`,
      async () => this.fetchFromDatabase(id),
      3600 // 1 hour TTL
    );
  }
}
```

#### 2. Queue System (`src/queue/queue.module.ts`)
- **Purpose**: Asynchronous task processing with Bull
- **Queues**:
  - `cv-processing`: CV import operations (30s timeout)
  - `job-processing`: Job import operations (30s timeout)
  - `graph-operations`: Graph operations (60s timeout)
- **Configuration**:
  - Redis-backed
  - Automatic retry with exponential backoff
  - Job retention: 10 completed, 5 failed

#### 3. Retry Mechanism (`src/resilience/retry.decorator.ts`)
- **Purpose**: Automatic retry for transient failures
- **Configuration**:
  - Max attempts: 3
  - Initial delay: 1s
  - Backoff multiplier: 2
  - Max delay: 10s
- **Usage**:

```typescript
const result = await RetryService.executeWithRetry(
  async () => this.externalApiCall(),
  {
    maxAttempts: 3,
    delay: 1000,
    backoffMultiplier: 2,
    maxDelay: 10000,
  }
);
```

#### 4. Circuit Breaker (`src/resilience/circuit-breaker.service.ts`)
- **Purpose**: Prevent cascading failures
- **States**: CLOSED, OPEN, HALF_OPEN
- **Configuration**:
  - Failure threshold: 5
  - Success threshold: 2
  - Timeout: 10s
  - Reset timeout: 60s
- **Usage**:

```typescript
@Injectable()
export class MyService {
  constructor(private circuitBreaker: CircuitBreakerService) {}

  async executeOperation() {
    return this.circuitBreakerService.execute(
      'my-operation',
      async () => this.riskyOperation(),
      {
        failureThreshold: 5,
        successThreshold: 2,
        timeout: 10000,
        resetTimeout: 60000,
      }
    );
  }
}
```

#### 5. Rate Limiter (`src/resilience/rate-limiter.module.ts`)
- **Purpose**: Prevent API abuse
- **Limits**:
  - Default: 100 requests/minute
  - Strict: 20 requests/minute (sensitive endpoints)
  - Graph operations: 10 requests/minute
- **Usage**: Apply `@Throttle()` decorator to controllers

```typescript
@Controller('api')
export class ApiController {
  @Throttle(100, 60) // 100 requests per minute
  @Get('data')
  getData() {
    // ...
  }
}
```

#### 6. Timeouts (`src/config/timeout.config.ts`)
- **Purpose**: Prevent hanging operations
- **Default Timeouts**:
  - HTTP: 30s
  - Database: 10s
  - Cache: 2s
  - Queue: 60s
  - External: 15s
  - Graph import: 2min
  - Graph query: 30s
  - Graph validation: 10s
  - Matching calculate: 1min
  - Matching search: 30s
- **Usage**:

```typescript
const result = await TimeoutService.withTimeout(
  async () => this.longRunningOperation(),
  30000,
  'Operation timed out'
);
```

#### 7. Health Checks (`src/health/health.module.ts`)
- **Endpoints**:
  - `GET /health` - Full health check
  - `GET /health/liveness` - Liveness probe
  - `GET /health/readiness` - Readiness probe
- **Checks**:
  - Database connectivity
  - Redis connectivity
  - Memory usage (heap: 150MB, RSS: 150MB)
  - Disk space (90% threshold)

#### 8. Graceful Shutdown (`src/shutdown/shutdown.service.ts`)
- **Purpose**: Clean shutdown on SIGTERM/SIGINT
- **Sequence**:
  1. Stop accepting new requests
  2. Wait for in-flight requests (10s max)
  3. Drain queues (5s max)
  4. Close database connections
  5. Flush cache
  6. Close external connections
- **Timeout**: 30s total

#### 9. Memory Monitoring (`src/config/memory.config.ts`)
- **Purpose**: Monitor and prevent memory leaks
- **Configuration**:
  - Max heap: 512MB
  - Max RSS: 1GB
  - GC interval: 1min
  - Warning threshold: 70%
  - Critical threshold: 90%
- **Features**:
  - Automatic GC triggering at critical levels
  - Memory usage logging
  - Statistics reporting

#### 10. Production Configuration (`src/config/production.config.ts`)
- **Environment Variables**: All configurable via environment
- **Categories**:
  - Redis configuration
  - Cache settings
  - Rate limiting
  - Circuit breaker
  - Timeouts
  - Memory limits
  - Queue settings
  - Retry configuration
  - Health check thresholds

## Production Wrapper Service

### RuntimeGraphProductionService
A production-ready wrapper around `RuntimeGraphService` that adds:
- Redis caching with 1-hour TTL
- Circuit breaker protection
- Automatic retry with exponential backoff
- Timeout enforcement
- Cache invalidation support

**Usage**:
```typescript
@Injectable()
export class CvController {
  constructor(
    private runtimeGraphProduction: RuntimeGraphProductionService
  ) {}

  async importCV(cvData: CandidateGraphInput) {
    return this.runtimeGraphProduction.importCV(cvData, {
      autoFuseNodes: true,
      validateGraph: true,
    });
  }
}
```

**API Compatibility**: The wrapper maintains 100% compatibility with the original `RuntimeGraphService` API. No breaking changes.

## Deployment Checklist

### Prerequisites
- [ ] Redis server running
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Node.js version >= 18

### Environment Variables
```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0

# Cache
CACHE_TTL=3600
CACHE_MAX=1000

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100
STRICT_RATE_LIMIT_LIMIT=20
GRAPH_RATE_LIMIT_LIMIT=10

# Circuit Breaker
CIRCUIT_FAILURE_THRESHOLD=5
CIRCUIT_SUCCESS_THRESHOLD=2
CIRCUIT_TIMEOUT=10000
CIRCUIT_RESET_TIMEOUT=60000

# Timeouts
HTTP_TIMEOUT=30000
DATABASE_TIMEOUT=10000
CACHE_TIMEOUT=2000
QUEUE_TIMEOUT=60000
EXTERNAL_TIMEOUT=15000
GRAPH_IMPORT_TIMEOUT=120000
GRAPH_QUERY_TIMEOUT=30000
GRAPH_VALIDATION_TIMEOUT=10000
MATCHING_CALCULATE_TIMEOUT=60000
MATCHING_SEARCH_TIMEOUT=30000

# Memory
MAX_HEAP_SIZE=536870912
MAX_RSS=1073741824
GC_INTERVAL=60000
MEMORY_WARNING_THRESHOLD=0.7
MEMORY_CRITICAL_THRESHOLD=0.9

# Queue
QUEUE_REMOVE_ON_COMPLETE=10
QUEUE_REMOVE_ON_FAIL=5
QUEUE_ATTEMPTS=3
QUEUE_BACKOFF_DELAY=2000
QUEUE_BACKOFF_TYPE=exponential

# Retry
RETRY_MAX_ATTEMPTS=3
RETRY_DELAY=1000
RETRY_BACKOFF_MULTIPLIER=2
RETRY_MAX_DELAY=10000

# Health Check
HEALTH_CHECK_MEMORY_HEAP_THRESHOLD=157286400
HEALTH_CHECK_MEMORY_RSS_THRESHOLD=157286400
HEALTH_CHECK_DISK_THRESHOLD=0.9

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

### Module Installation
Add the following modules to your `AppModule`:

```typescript
import { RedisCacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';
import { RateLimiterModule } from './resilience/rate-limiter.module';
import { HealthModule } from './health/health.module';
import { GracefulShutdownService } from './shutdown/shutdown.service';

@Module({
  imports: [
    RedisCacheModule,
    QueueModule,
    RateLimiterModule,
    HealthModule,
    // ... other modules
  ],
  providers: [
    GracefulShutdownService,
    CircuitBreakerService,
    MemoryMonitorService,
  ],
})
export class AppModule {}
```

### Performance Optimization Tips

1. **Enable GC**: Run Node.js with `--expose-gc` flag for automatic garbage collection
2. **Cluster Mode**: Use Node.js cluster mode for multi-core utilization
3. **Connection Pooling**: Configure database connection pool size
4. **Compression**: Enable gzip compression for API responses
5. **CDN**: Use CDN for static assets
6. **Database Indexing**: Ensure proper database indexes
7. **Query Optimization**: Use database query optimization tools

### Monitoring

#### Metrics to Monitor
- Request rate and latency
- Error rate by endpoint
- Circuit breaker state transitions
- Cache hit/miss ratio
- Queue depth and processing time
- Memory usage trends
- CPU utilization
- Database query performance

#### Recommended Tools
- Prometheus + Grafana for metrics
- ELK Stack for logging
- Redis Insight for Redis monitoring
- Bull Board for queue monitoring

### Scaling Considerations

#### Horizontal Scaling
- Stateless design allows horizontal scaling
- Redis provides shared cache and queue
- Load balancer required for multiple instances

#### Vertical Scaling
- Increase memory limits for larger graphs
- Adjust timeout values for complex operations
- Configure database connection pool size

### Security Considerations

1. **Redis Authentication**: Always use Redis password in production
2. **Rate Limiting**: Configure appropriate rate limits per endpoint
3. **Input Validation**: Validate all inputs before processing
4. **Error Messages**: Don't expose sensitive information in errors
5. **CORS**: Configure CORS properly
6. **HTTPS**: Always use HTTPS in production

### Troubleshooting

#### Circuit Breaker Open
- Check logs for failure patterns
- Verify external service availability
- Consider adjusting thresholds
- Use `resetCircuitBreaker()` to manually reset

#### High Memory Usage
- Check memory stats via `MemoryMonitorService.getMemoryStats()`
- Review cache size and TTL
- Check for memory leaks
- Consider increasing memory limits

#### Queue Backlog
- Monitor queue depth with Bull Board
- Scale workers if needed
- Check for stuck jobs
- Review job processing time

#### Cache Issues
- Verify Redis connectivity
- Check cache hit/miss ratio
- Review TTL settings
- Flush cache if corrupted

## API Compatibility

### Guaranteed Compatibility
All existing APIs remain 100% compatible:
- `RuntimeGraphService.importCV()` - unchanged signature
- `RuntimeGraphService.importJob()` - unchanged signature
- All return types unchanged
- All interfaces unchanged

### Optional Enhancements
Use `RuntimeGraphProductionService` for production features:
- Same method signatures
- Same return types
- Adds caching, retry, circuit breaker, timeout
- Drop-in replacement

## Testing

### Unit Tests
```typescript
describe('RuntimeGraphProductionService', () => {
  it('should cache CV import results', async () => {
    // Test caching behavior
  });

  it('should retry on failure', async () => {
    // Test retry logic
  });

  it('should open circuit breaker on threshold', async () => {
    // Test circuit breaker
  });
});
```

### Integration Tests
```typescript
describe('Production Integration', () => {
  it('should handle Redis failure gracefully', async () => {
    // Test Redis failure handling
  });

  it('should respect rate limits', async () => {
    // Test rate limiting
  });

  it('should shutdown gracefully', async () => {
    // Test graceful shutdown
  });
});
```

### Load Testing
Use tools like k6 or Artillery for load testing:
- Test with realistic traffic patterns
- Monitor circuit breaker behavior
- Verify cache effectiveness
- Check memory stability

## Rollback Plan

If issues occur in production:
1. Switch to original `RuntimeGraphService` (no production features)
2. Disable Redis cache (set CACHE_TTL=0)
3. Increase timeout values
4. Disable circuit breaker (set high thresholds)
5. Scale horizontally if needed

## Support

For issues or questions:
- Check logs for detailed error messages
- Review health check endpoints
- Monitor circuit breaker states
- Review queue processing status

## Version History

- **v2.0.0** - Production-ready release
  - Added Redis caching
  - Added queue system
  - Added retry mechanism
  - Added circuit breaker
  - Added rate limiting
  - Added timeouts
  - Added health checks
  - Added graceful shutdown
  - Added memory monitoring
  - Added production configuration
  - Maintained 100% API compatibility
