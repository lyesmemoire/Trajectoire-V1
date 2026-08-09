import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('redis_errors');
const redisLatency = new Trend('redis_latency');

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<100', 'p(99)<200'],
    redis_errors: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  const key = `test-key-${Math.random().toString(36).substring(7)}`;
  const value = JSON.stringify({ data: Math.random(), timestamp: Date.now() });

  // Set operation
  let res = http.post(`${BASE_URL}/cache/set`, JSON.stringify({
    key,
    value,
    ttl: 3600,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  redisLatency.add(res.timings.duration);
  check(res, {
    'cache set status is 200': (r) => r.status === 200,
  });

  sleep(0.1);

  // Get operation
  res = http.get(`${BASE_URL}/cache/get?key=${key}`);
  errorRate.add(res.status !== 200);
  redisLatency.add(res.timings.duration);
  check(res, {
    'cache get status is 200': (r) => r.status === 200,
    'cache get has value': (r) => r.json('value') !== undefined,
  });

  sleep(0.1);

  // Delete operation
  res = http.del(`${BASE_URL}/cache/delete?key=${key}`);
  errorRate.add(res.status !== 200);
  redisLatency.add(res.timings.duration);
  check(res, {
    'cache delete status is 200': (r) => r.status === 200,
  });

  sleep(0.1);

  // Batch set
  const batchData = Array.from({ length: 5 }, (_, i) => ({
    key: `batch-key-${i}-${Date.now()}`,
    value: { data: Math.random(), index: i },
  }));

  res = http.post(`${BASE_URL}/cache/batch-set`, JSON.stringify(batchData), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  redisLatency.add(res.timings.duration);
  check(res, {
    'batch set status is 200': (r) => r.status === 200,
  });

  sleep(0.2);

  // Rate limiting check
  res = http.get(`${BASE_URL}/rate-limit/check?scope=test&identifier=test-user`);
  errorRate.add(res.status !== 200);
  redisLatency.add(res.timings.duration);
  check(res, {
    'rate limit check status is 200': (r) => r.status === 200,
  });

  sleep(0.2);
}
