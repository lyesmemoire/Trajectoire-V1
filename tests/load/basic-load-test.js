/**
 * Basic Load Test with k6
 * 
 * Test scenario: 50 concurrent users simulating the user journey
 * - Homepage visit
 * - Registration
 * - Login
 * - Dashboard visit
 * - Evaluation page
 * 
 * Metrics to verify:
 * - No memory leaks
 * - Latency < 2s
 * - No Redis deadlocks
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '2m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.05'],    // Error rate must be below 5%
    errors: ['rate<0.05'],             // Custom error rate must be below 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Helper functions
function checkResponse(response, checks) {
  const success = check(response, checks);
  errorRate.add(!success);
  return success;
}

export function setup() {
  // Setup: create a test user
  const email = `test${Math.floor(Math.random() * 100000)}@example.com`;
  const password = 'Test123456';
  
  const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
    role: 'cadre',
    objective: 'promotion',
    plan: 'trial',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (registerRes.status !== 200) {
    console.error('Failed to create test user:', registerRes.status);
  }
  
  return { email, password };
}

export default function (data) {
  // 1. Visit homepage
  const homeRes = http.get(`${BASE_URL}/`);
  checkResponse(homeRes, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage has content': (r) => r.body.includes('Trajectoire'),
  });
  
  sleep(1);
  
  // 2. Login
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: data.email,
    password: data.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  checkResponse(loginRes, {
    'login status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
  
  // 3. Visit dashboard
  const dashboardRes = http.get(`${BASE_URL}/dashboard`);
  checkResponse(dashboardRes, {
    'dashboard status is 200': (r) => r.status === 200,
    'dashboard has content': (r) => r.body.includes('Dashboard'),
  });
  
  sleep(2);
  
  // 4. Visit evaluation page
  const evaluationRes = http.get(`${BASE_URL}/dashboard/evaluation`);
  checkResponse(evaluationRes, {
    'evaluation status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}

export function teardown(data) {
  // Cleanup: delete test user (if needed)
  console.log('Test completed for user:', data.email);
}
