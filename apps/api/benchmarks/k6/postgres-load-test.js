import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('postgres_errors');
const postgresLatency = new Trend('postgres_latency');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 30 },
    { duration: '2m', target: 60 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<400'],
    postgres_errors: ['rate<0.03'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  const candidateId = `candidate-${Math.random().toString(36).substring(7)}`;

  // Create candidate
  let res = http.post(`${BASE_URL}/candidates`, JSON.stringify({
    id: candidateId,
    name: 'Test Candidate',
    email: `test${Date.now()}@example.com`,
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 'senior',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 201);
  postgresLatency.add(res.timings.duration);
  check(res, {
    'candidate creation status is 201': (r) => r.status === 201,
  });

  sleep(0.5);

  // Get candidate
  res = http.get(`${BASE_URL}/candidates/${candidateId}`);
  errorRate.add(res.status !== 200);
  postgresLatency.add(res.timings.duration);
  check(res, {
    'candidate retrieval status is 200': (r) => r.status === 200,
  });

  sleep(0.3);

  // Update candidate
  res = http.patch(`${BASE_URL}/candidates/${candidateId}`, JSON.stringify({
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  postgresLatency.add(res.timings.duration);
  check(res, {
    'candidate update status is 200': (r) => r.status === 200,
  });

  sleep(0.3);

  // List candidates with pagination
  res = http.get(`${BASE_URL}/candidates?page=1&limit=20`);
  errorRate.add(res.status !== 200);
  postgresLatency.add(res.timings.duration);
  check(res, {
    'candidate list status is 200': (r) => r.status === 200,
  });

  sleep(0.3);

  // Search candidates
  res = http.get(`${BASE_URL}/candidates/search?skill=JavaScript`);
  errorRate.add(res.status !== 200);
  postgresLatency.add(res.timings.duration);
  check(res, {
    'candidate search status is 200': (r) => r.status === 200,
  });

  sleep(0.3);

  // Delete candidate
  res = http.del(`${BASE_URL}/candidates/${candidateId}`);
  errorRate.add(res.status !== 200 && res.status !== 404);
  postgresLatency.add(res.timings.duration);
  check(res, {
    'candidate deletion status is 200 or 404': (r) => r.status === 200 || r.status === 404,
  });

  sleep(0.5);
}
