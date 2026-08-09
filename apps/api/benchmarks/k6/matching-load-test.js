import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('matching_errors');
const matchingLatency = new Trend('matching_latency');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 15 },
    { duration: '2m', target: 30 },
    { duration: '1m', target: 15 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<600', 'p(99)<1200'],
    matching_errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

const candidateIds = ['candidate-1', 'candidate-2', 'candidate-3', 'candidate-4', 'candidate-5'];
const jobIds = ['job-1', 'job-2', 'job-3', 'job-4', 'job-5'];

export default function () {
  const candidateId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
  const jobId = jobIds[Math.floor(Math.random() * jobIds.length)];

  // Basic matching
  let res = http.post(`${BASE_URL}/matching`, JSON.stringify({
    candidateId,
    jobId,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  matchingLatency.add(res.timings.duration);
  check(res, {
    'matching status is 200': (r) => r.status === 200,
    'matching has score': (r) => r.json('score') !== undefined,
  });

  sleep(0.5);

  // Batch matching
  res = http.post(`${BASE_URL}/matching/batch`, JSON.stringify({
    candidateId,
    jobIds: jobIds.slice(0, 3),
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  matchingLatency.add(res.timings.duration);
  check(res, {
    'batch matching status is 200': (r) => r.status === 200,
    'batch matching has results': (r) => r.json('results') !== undefined,
  });

  sleep(0.5);

  // Matching with filters
  res = http.post(`${BASE_URL}/matching/filtered`, JSON.stringify({
    candidateId,
    jobId,
    filters: {
      minScore: 0.5,
      skills: ['JavaScript', 'React'],
      experience: 'senior',
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  matchingLatency.add(res.timings.duration);
  check(res, {
    'filtered matching status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
