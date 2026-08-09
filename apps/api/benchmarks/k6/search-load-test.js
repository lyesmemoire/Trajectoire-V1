import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('search_errors');
const searchLatency = new Trend('search_latency');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 30 },
    { duration: '2m', target: 60 },
    { duration: '1m', target: 30 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<400', 'p(99)<800'],
    search_errors: ['rate<0.04'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

const searchQueries = [
  'JavaScript developer',
  'React engineer',
  'Python backend',
  'Full stack developer',
  'Node.js specialist',
  'TypeScript developer',
  'DevOps engineer',
  'Data scientist',
  'Machine learning',
  'Cloud architect',
];

export default function () {
  const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
  
  // Basic search
  let res = http.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  errorRate.add(res.status !== 200);
  searchLatency.add(res.timings.duration);
  check(res, {
    'search status is 200': (r) => r.status === 200,
    'search has results': (r) => r.json('results') !== undefined,
  });

  sleep(0.5);

  // Advanced search with filters
  res = http.post(`${BASE_URL}/search/advanced`, JSON.stringify({
    query,
    filters: {
      skills: ['JavaScript', 'React'],
      experience: 'senior',
      location: 'remote',
    },
    limit: 20,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  searchLatency.add(res.timings.duration);
  check(res, {
    'advanced search status is 200': (r) => r.status === 200,
  });

  sleep(0.5);

  // Search with pagination
  res = http.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}&page=1&limit=10`);
  errorRate.add(res.status !== 200);
  searchLatency.add(res.timings.duration);
  check(res, {
    'paginated search status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
