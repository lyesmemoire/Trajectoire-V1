const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:3000',
  connections: 50,
  duration: 60,
  amount: 5000,
  pipelining: 1,
  requests: [
    {
      method: 'POST',
      path: '/graph',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodes: Array.from({ length: 10 }, (_, i) => ({
          id: `node-${i}`,
          type: i % 2 === 0 ? 'skill' : 'experience',
          properties: { name: `Test ${i}`, value: Math.random() * 100 },
        })),
        edges: Array.from({ length: 5 }, (_, i) => ({
          id: `edge-${i}`,
          source: `node-${i}`,
          target: `node-${i + 1}`,
          type: 'has_skill',
        })),
      }),
    },
    {
      method: 'GET',
      path: '/graph/test-graph-id',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      method: 'POST',
      path: '/graph/query',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        graphId: 'test-graph-id',
        query: {
          type: 'neighbors',
          nodeId: 'node-0',
          depth: 2,
        },
      }),
    },
  ],
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Graph Load Test Results:');
    console.log(`Requests: ${result.requests.mean}`);
    console.log(`Latency (mean): ${result.latency.mean}`);
    console.log(`Latency (p95): ${result.latency.p95}`);
    console.log(`Latency (p99): ${result.latency.p99}`);
    console.log(`Throughput: ${result.requests.mean * 1000} req/sec`);
  }
});

autocannon.track(instance);
