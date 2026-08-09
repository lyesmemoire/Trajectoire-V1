import { Test, TestingModule } from '@nestjs/testing';
import { GracefulDegradationService } from './graceful-degradation.service';

describe('GracefulDegradationService', () => {
  let service: GracefulDegradationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GracefulDegradationService],
    }).compile();

    service = module.get<GracefulDegradationService>(GracefulDegradationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute successfully', async () => {
    const result = await service.executeWithFallback(
      () => Promise.resolve('success'),
      { fallbackFn: () => Promise.resolve('fallback') },
    );
    expect(result).toBe('success');
  });

  it('should use fallback on error', async () => {
    const result = await service.executeWithFallback(
      () => Promise.reject(new Error('fail')),
      { fallbackFn: () => Promise.resolve('fallback') },
    );
    expect(result).toBe('fallback');
  });

  it('should check if feature is available in full mode', () => {
    service.setDegradationLevel({ level: 'full', features: [] });
    expect(service.isFeatureAvailable('test-feature')).toBe(true);
  });

  it('should check if feature is available in degraded mode', () => {
    service.setDegradationLevel({
      level: 'degraded',
      features: ['essential-feature'],
    });
    expect(service.isFeatureAvailable('essential-feature')).toBe(true);
    expect(service.isFeatureAvailable('non-essential-feature')).toBe(false);
  });

  it('should check if feature is available in offline mode', () => {
    service.setDegradationLevel({ level: 'offline', features: [] });
    expect(service.isFeatureAvailable('any-feature')).toBe(false);
  });

  it('should execute if feature is available', async () => {
    service.setDegradationLevel({ level: 'full', features: [] });
    const result = await service.executeIfAvailable(
      'test-feature',
      () => Promise.resolve('success'),
      'fallback',
    );
    expect(result).toBe('success');
  });

  it('should return fallback if feature is not available', async () => {
    service.setDegradationLevel({ level: 'offline', features: [] });
    const result = await service.executeIfAvailable(
      'test-feature',
      () => Promise.resolve('success'),
      'fallback',
    );
    expect(result).toBe('fallback');
  });

  it('should throw if feature is not available and no fallback', async () => {
    service.setDegradationLevel({ level: 'offline', features: [] });
    await expect(
      service.executeIfAvailable(
        'test-feature',
        () => Promise.resolve('success'),
      ),
    ).rejects.toThrow('Feature test-feature is not available');
  });

  it('should return stale data when fresh fails', async () => {
    const result = await service.getStaleDataFallback(
      () => Promise.reject(new Error('fail')),
      () => Promise.resolve('stale'),
    );
    expect(result).toBe('stale');
  });
});
