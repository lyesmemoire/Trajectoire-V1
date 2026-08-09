import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('copilot_errors');
const copilotLatency = new Trend('copilot_latency');

export const options = {
  stages: [
    { duration: '30s', target: 3 },
    { duration: '1m', target: 10 },
    { duration: '2m', target: 20 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<4000'],
    copilot_errors: ['rate<0.06'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

const copilotMessages = [
  'What jobs match my profile?',
  'Help me improve my CV',
  'What skills should I learn?',
  'Analyze my JavaScript skills',
  'Find remote React positions',
  'How can I improve my matching score?',
  'What are the trending skills?',
  'Compare me to other candidates',
  'Suggest career paths',
  'Review my experience',
];

export default function () {
  const message = copilotMessages[Math.floor(Math.random() * copilotMessages.length)];

  // Simple copilot query
  let res = http.post(`${BASE_URL}/copilot`, JSON.stringify({
    message,
    context: {
      candidateId: 'test-candidate',
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  copilotLatency.add(res.timings.duration);
  check(res, {
    'copilot status is 200': (r) => r.status === 200,
    'copilot has response': (r) => r.json('response') !== undefined,
  });

  sleep(1);

  // Copilot with graph context
  res = http.post(`${BASE_URL}/copilot`, JSON.stringify({
    message: 'Analyze my knowledge graph',
    context: {
      candidateId: 'test-candidate',
      includeGraph: true,
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  copilotLatency.add(res.timings.duration);
  check(res, {
    'copilot with graph status is 200': (r) => r.status === 200,
  });

  sleep(2);

  // Copilot streaming (if supported)
  res = http.post(`${BASE_URL}/copilot/stream`, JSON.stringify({
    message,
    context: {},
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  copilotLatency.add(res.timings.duration);
  check(res, {
    'copilot stream status is 200': (r) => r.status === 200,
  });

  sleep(2);
}
