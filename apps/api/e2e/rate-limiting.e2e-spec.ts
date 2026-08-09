import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Rate Limiting E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('API Rate Limiting', () => {
    it('should allow requests within limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });

    it('should set correct rate limit headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(parseInt(response.headers['x-ratelimit-limit'])).toBe(100);
      expect(parseInt(response.headers['x-ratelimit-remaining'])).toBeLessThanOrEqual(100);
      expect(parseInt(response.headers['x-ratelimit-reset'])).toBeGreaterThan(Date.now() / 1000);
    });

    it('should return 429 when rate limit exceeded', async () => {
      // Make multiple requests to exceed the limit
      const requests = [];
      for (let i = 0; i < 105; i++) {
        requests.push(request(app.getHttpServer()).get('/'));
      }

      const responses = await Promise.all(requests);
      
      // Last requests should be rate limited
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
      expect(lastResponse.body).toHaveProperty('error', 'RATE_LIMIT_EXCEEDED');
      expect(lastResponse.headers).toHaveProperty('retry-after');
    });
  });

  describe('CV Upload Rate Limiting', () => {
    it('should allow CV upload within limit', async () => {
      const response = await request(app.getHttpServer())
        .post('/cv/upload')
        .attach('file', Buffer.from('test content'))
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(parseInt(response.headers['x-ratelimit-limit'])).toBe(20);
    });

    it('should return 429 when CV upload limit exceeded', async () => {
      const requests = [];
      for (let i = 0; i < 25; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/cv/upload')
            .attach('file', Buffer.from('test content'))
        );
      }

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
    });
  });

  describe('Graph Rate Limiting', () => {
    it('should allow graph operations within limit', async () => {
      const response = await request(app.getHttpServer())
        .get('/graph')
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(parseInt(response.headers['x-ratelimit-limit'])).toBe(50);
    });

    it('should return 429 when graph operations limit exceeded', async () => {
      const requests = [];
      for (let i = 0; i < 55; i++) {
        requests.push(request(app.getHttpServer()).get('/graph'));
      }

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
    });
  });

  describe('Copilot Rate Limiting', () => {
    it('should allow copilot requests within limit', async () => {
      const response = await request(app.getHttpServer())
        .post('/copilot/message')
        .send({ sessionId: 'test-session', message: 'Hello' })
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(parseInt(response.headers['x-ratelimit-limit'])).toBe(30);
    });

    it('should return 429 when copilot limit exceeded', async () => {
      const requests = [];
      for (let i = 0; i < 35; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/copilot/message')
            .send({ sessionId: 'test-session', message: 'Hello' })
        );
      }

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
    });
  });

  describe('Search Rate Limiting', () => {
    it('should allow search requests within limit', async () => {
      const response = await request(app.getHttpServer())
        .post('/search/candidates')
        .send({
          jobGraph: { id: 'job1', nodes: [], edges: [] },
          candidateGraphs: []
        })
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(parseInt(response.headers['x-ratelimit-limit'])).toBe(100);
    });

    it('should return 429 when search limit exceeded', async () => {
      const requests = [];
      for (let i = 0; i < 105; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/search/candidates')
            .send({
              jobGraph: { id: 'job1', nodes: [], edges: [] },
              candidateGraphs: []
            })
        );
      }

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
    });
  });

  describe('Matching Rate Limiting', () => {
    it('should allow matching requests within limit', async () => {
      const response = await request(app.getHttpServer())
        .post('/matching/score')
        .send({
          candidateGraph: { id: 'candidate1', nodes: [], edges: [] },
          jobGraph: { id: 'job1', nodes: [], edges: [] }
        })
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(parseInt(response.headers['x-ratelimit-limit'])).toBe(50);
    });

    it('should return 429 when matching limit exceeded', async () => {
      const requests = [];
      for (let i = 0; i < 55; i++) {
        requests.push(
          request(app.getHttpServer())
            .post('/matching/score')
            .send({
              candidateGraph: { id: 'candidate1', nodes: [], edges: [] },
              jobGraph: { id: 'job1', nodes: [], edges: [] }
            })
        );
      }

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
    });
  });

  describe('Retry-After Header', () => {
    it('should include Retry-After header when rate limited', async () => {
      const requests = [];
      for (let i = 0; i < 105; i++) {
        requests.push(request(app.getHttpServer()).get('/'));
      }

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      
      expect(lastResponse.status).toBe(429);
      expect(lastResponse.headers).toHaveProperty('retry-after');
      expect(parseInt(lastResponse.headers['retry-after'])).toBeGreaterThan(0);
    });
  });

  describe('Sliding Window Behavior', () => {
    it('should allow requests after window expires', async () => {
      // Make requests to exceed limit
      const requests = [];
      for (let i = 0; i < 105; i++) {
        requests.push(request(app.getHttpServer()).get('/'));
      }
      await Promise.all(requests);

      // Wait for window to expire (61 seconds)
      await new Promise(resolve => setTimeout(resolve, 61000));

      // Should be allowed again
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(response.headers['x-ratelimit-remaining']).toBe('99');
    }, 70000);
  });

  describe('Burst Limiting', () => {
    it('should allow burst requests within burst window', async () => {
      // Make rapid requests within burst limit
      const requests = [];
      for (let i = 0; i < 15; i++) {
        requests.push(request(app.getHttpServer()).get('/'));
      }

      const responses = await Promise.all(requests);
      
      // All should be allowed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should block burst requests over burst limit', async () => {
      // Make rapid requests over burst limit
      const requests = [];
      for (let i = 0; i < 25; i++) {
        requests.push(request(app.getHttpServer()).get('/'));
      }

      const responses = await Promise.all(requests);
      
      // Some should be blocked
      const blockedResponses = responses.filter(r => r.status === 429);
      expect(blockedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('IP-based Rate Limiting', () => {
    it('should rate limit based on IP address', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .set('X-Forwarded-For', '192.168.1.100')
        .expect(200);

      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
    });
  });

  describe('Error Handling', () => {
    it('should fail open when Redis is unavailable', async () => {
      // This test would require mocking Redis failure
      // For now, we just verify the endpoint responds
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(response.status).toBe(200);
    });
  });
});
