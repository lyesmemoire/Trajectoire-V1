import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('openai_errors');
const openaiLatency = new Trend('openai_latency');

export const options = {
  stages: [
    { duration: '30s', target: 2 },
    { duration: '1m', target: 5 },
    { duration: '2m', target: 10 },
    { duration: '1m', target: 5 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000', 'p(99)<6000'],
    openai_errors: ['rate<0.08'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

const prompts = [
  'Analyze this CV and extract skills',
  'Generate a job description for a React developer',
  'Compare these two candidates',
  'Suggest improvements for this profile',
  'Summarize the work experience',
];

export default function () {
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  // Simple OpenAI completion
  let res = http.post(`${BASE_URL}/ai/completion`, JSON.stringify({
    prompt,
    model: 'gpt-4',
    maxTokens: 500,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  openaiLatency.add(res.timings.duration);
  check(res, {
    'openai completion status is 200': (r) => r.status === 200,
    'openai completion has text': (r) => r.json('text') !== undefined,
  });

  sleep(2);

  // OpenAI chat completion
  res = http.post(`${BASE_URL}/ai/chat`, JSON.stringify({
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    model: 'gpt-4',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  openaiLatency.add(res.timings.duration);
  check(res, {
    'openai chat status is 200': (r) => r.status === 200,
  });

  sleep(3);

  // OpenAI embedding
  res = http.post(`${BASE_URL}/ai/embedding`, JSON.stringify({
    text: 'JavaScript React Node.js developer',
    model: 'text-embedding-ada-002',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 200);
  openaiLatency.add(res.timings.duration);
  check(res, {
    'openai embedding status is 200': (r) => r.status === 200,
    'openai embedding has vector': (r) => r.json('embedding') !== undefined,
  });

  sleep(2);
}
