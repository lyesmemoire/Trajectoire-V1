const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:3000',
  connections: 100,
  duration: 60,
  amount: 10000,
  pipelining: 1,
  requests: [
    {
      method: 'GET',
      path: '/health',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      method: 'POST',
      path: '/graph',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodes: [{ id: '1', type: 'skill', properties: { name: 'JavaScript' } }],
        edges: [],
      }),
    },
    {
      method: 'GET',
      path: '/search?q=JavaScript',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      method: 'POST',
      path: '/matching',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidateId: 'test-candidate',
        jobId: 'test-job',
      }),
    },
    {
      method: 'POST',
      path: '/copilot',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What jobs match my profile?',
        context: {},
      }),
    },
  ],
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('API Load Test Results:');
    console.log(`Requests: ${result.requests.mean}`);
    console.log(`Latency (mean): ${result.latency.mean}`);
    console.log(`Latency (p95): ${result.latency.p95}`);
    console.log(`Latency (p99): ${result.latency.p99}`);
    console.log(`Throughput: ${result.requests.mean * 1000} req/sec`);
  }
});

autocannon.track(instance);
