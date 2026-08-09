import { Test, TestingModule } from '@nestjs/testing';
import { RedMetricsService } from './red-metrics.service';

describe('RedMetricsService', () => {
  let service: RedMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedMetricsService],
    }).compile();

    service = module.get<RedMetricsService>(RedMetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should record HTTP request', () => {
    service.recordHttpRequest('GET', '/test', 200, 100);
    // Should not throw
  });

  it('should record GraphQL request', () => {
    service.recordGraphqlRequest('query', 'testQuery', 200, 150);
    // Should not throw
  });

  it('should record database query', () => {
    service.recordDatabaseQuery('SELECT', 'users', 50, false);
    // Should not throw
  });

  it('should record cache operation', () => {
    service.recordCacheOperation('get', 'test-key', true, 10);
    // Should not throw
  });

  it('should record external service call', () => {
    service.recordExternalServiceCall('openai', '/completions', 200, 500);
    // Should not throw
  });
});
