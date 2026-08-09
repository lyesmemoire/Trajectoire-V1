import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('graph_errors');
const graphLatency = new Trend('graph_latency');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 20 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<600'],
    graph_errors: ['rate<0.03'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export default function () {
  // Create graph
  const graphPayload = {
    nodes: Array.from({ length: 10 }, (_, i) => ({
      id: `node-${i}-${Date.now()}`,
      type: i % 2 === 0 ? 'skill' : 'experience',
      properties: {
        name: `Test ${i}`,
        value: Math.random() * 100,
      },
    })),
    edges: Array.from({ length: 5 }, (_, i) => ({
      id: `edge-${i}-${Date.now()}`,
      source: `node-${i}-${Date.now()}`,
      target: `node-${i + 1}-${Date.now()}`,
      type: 'has_skill',
    })),
  };

  let res = http.post(`${BASE_URL}/graph`, JSON.stringify(graphPayload), {
    headers: { 'Content-Type': 'application/json' },
  });
  errorRate.add(res.status !== 201);
  graphLatency.add(res.timings.duration);
  check(res, {
    'graph creation status is 201': (r) => r.status === 201,
    'graph creation has id': (r) => r.json('id') !== undefined,
  });

  if (res.status === 201) {
    const graphId = res.json('id');

    sleep(0.5);

    // Get graph
    res = http.get(`${BASE_URL}/graph/${graphId}`);
    errorRate.add(res.status !== 200);
    graphLatency.add(res.timings.duration);
    check(res, {
      'graph retrieval status is 200': (r) => r.status === 200,
    });

    sleep(0.5);

    // Query graph
    res = http.post(`${BASE_URL}/graph/query`, JSON.stringify({
      graphId,
      query: {
        type: 'neighbors',
        nodeId: `node-0-${Date.now()}`,
        depth: 2,
      },
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    errorRate.add(res.status !== 200);
    graphLatency.add(res.timings.duration);
    check(res, {
      'graph query status is 200': (r) => r.status === 200,
    });

    sleep(0.5);

    // Update graph
    res = http.patch(`${BASE_URL}/graph/${graphId}`, JSON.stringify({
      nodes: [{
        id: `node-new-${Date.now()}`,
        type: 'skill',
        properties: { name: 'New Skill' },
      }],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    errorRate.add(res.status !== 200);
    graphLatency.add(res.timings.duration);
    check(res, {
      'graph update status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);
}
