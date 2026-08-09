import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const latency = new Trend('latency');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  // Health check
  let res = http.get(`${BASE_URL}/health`);
  errorRate.add(res.status !== 200);
  latency.add(res.timings.duration);
  check(res, {
    'health check status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Graph endpoint
  res = http.post(`${BASE_URL}/graph`, JSON.stringify({
    nodes: [{ id: '1', type: 'skill', properties: { name: 'JavaScript' } }],
    edges: [],
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 201);
  latency.add(res.timings.duration);
  check(res, {
    'graph creation status is 201': (r) => r.status === 201,
  });

  sleep(1);

  // Search endpoint
  res = http.get(`${BASE_URL}/search?q=JavaScript`);
  errorRate.add(res.status !== 200);
  latency.add(res.timings.duration);
  check(res, {
    'search status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Matching endpoint
  res = http.post(`${BASE_URL}/matching`, JSON.stringify({
    candidateId: 'test-candidate',
    jobId: 'test-job',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  latency.add(res.timings.duration);
  check(res, {
    'matching status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Copilot endpoint
  res = http.post(`${BASE_URL}/copilot`, JSON.stringify({
    message: 'What jobs match my profile?',
    context: {},
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  latency.add(res.timings.duration);
  check(res, {
    'copilot status is 200': (r) => r.status === 200,
  });

  sleep(2);
}
