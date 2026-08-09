import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const latencyMetric = new Rate('latency');
const cacheHitRate = new Rate('cache_hits');
const graphQueryTime = new Rate('graph_query_time');
const dbQueryTime = new Rate('db_query_time');

export const options = {
  stages: [
    { duration: '10m', target: 10000 }, // Ramp up to 10000 users
    { duration: '10m', target: 10000 }, // Stay at 10000 users
    { duration: '10m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests must complete below 3s
    errors: ['rate<0.05'],             // Error rate must be below 5%
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Test 1: Landing page
  let landingRes = http.get(`${BASE_URL}/`);
  errorRate.add(!check(landingRes, { 'status is 200': (r) => r.status === 200 }));
  latencyMetric.add(landingRes.timings.duration);
  sleep(1);

  // Test 2: API health check
  let healthRes = http.get(`${BASE_URL}/health`);
  errorRate.add(!check(healthRes, { 'status is 200': (r) => r.status === 200 }));
  latencyMetric.add(healthRes.timings.duration);
  sleep(1);

  // Test 3: Graph query (simulated)
  let graphRes = http.get(`${BASE_URL}/api/graph/nodes`);
  errorRate.add(!check(graphRes, { 'status is 200': (r) => r.status === 200 }));
  graphQueryTime.add(graphRes.timings.duration);
  latencyMetric.add(graphRes.timings.duration);
  sleep(1);

  // Test 4: Database query (simulated via API)
  let dbRes = http.get(`${BASE_URL}/api/candidates`);
  errorRate.add(!check(dbRes, { 'status is 200': (r) => r.status === 200 }));
  dbQueryTime.add(dbRes.timings.duration);
  latencyMetric.add(dbRes.timings.duration);
  sleep(1);

  // Test 5: Cache hit (simulated)
  let cacheRes = http.get(`${BASE_URL}/api/cached-data`);
  errorRate.add(!check(cacheRes, { 'status is 200': (r) => r.status === 200 }));
  cacheHitRate.add(cacheRes.headers['X-Cache-Status'] === 'HIT');
  latencyMetric.add(cacheRes.timings.duration);
  sleep(1);

  // Test 6: Matching API
  let matchRes = http.post(`${BASE_URL}/api/matching`, JSON.stringify({
    candidateId: `candidate-${__VU}`,
    jobId: 'job-1',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(!check(matchRes, { 'status is 200': (r) => r.status === 200 }));
  latencyMetric.add(matchRes.timings.duration);
  sleep(1);

  // Test 7: Search API
  let searchRes = http.post(`${BASE_URL}/api/search`, JSON.stringify({
    query: 'javascript developer',
    limit: 10,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(!check(searchRes, { 'status is 200': (r) => r.status === 200 }));
  latencyMetric.add(searchRes.timings.duration);
  sleep(1);

  // Test 8: Copilot API
  let copilotRes = http.post(`${BASE_URL}/api/copilot/message`, JSON.stringify({
    sessionId: `session-${__VU}`,
    message: 'Find candidates for software engineer position',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(!check(copilotRes, { 'status is 200': (r) => r.status === 200 }));
  latencyMetric.add(copilotRes.timings.duration);
  sleep(1);

  // Test 9: Analytics API (additional for extreme load)
  let analyticsRes = http.get(`${BASE_URL}/api/analytics/statistics`);
  errorRate.add(!check(analyticsRes, { 'status is 200': (r) => r.status === 200 }));
  latencyMetric.add(analyticsRes.timings.duration);
  sleep(1);
}
