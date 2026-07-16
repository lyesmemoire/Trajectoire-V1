// @ts-nocheck
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Montée progressive
    { duration: '1m', target: 50 },    // Charge nominale
    { duration: '30s', target: 100 },  // Pic
    { duration: '30s', target: 0 },    // Descente
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% des requêtes < 2s
    errors: ['rate<0.05'],              // < 5% d'erreurs
  },
};

export default function () {
  // 1. Health check
  const healthRes = http.get(`${__ENV.TARGET_URL}/api/health`);
  check(healthRes, {
    'health status 200': (r) => r.status === 200,
    'health response < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(1);

  // 2. Création session interview
  const sessionRes = http.post(
    `${__ENV.TARGET_URL}/api/interview/start`,
    JSON.stringify({ userId: `load-test-${__VU}` }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(sessionRes, {
    'session status 200': (r) => r.status === 200,
    'session response < 3s': (r) => r.timings.duration < 3000,
  }) || errorRate.add(1);

  sleep(2);
}
