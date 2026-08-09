const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:3000',
  connections: 20,
  duration: 60,
  amount: 2000,
  pipelining: 1,
  requests: [
    {
      method: 'POST',
      path: '/copilot',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'What jobs match my profile?',
        context: {
          candidateId: 'test-candidate',
        },
      }),
    },
    {
      method: 'POST',
      path: '/copilot',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Analyze my knowledge graph',
        context: {
          candidateId: 'test-candidate',
          includeGraph: true,
        },
      }),
    },
    {
      method: 'POST',
      path: '/copilot/stream',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Help me improve my CV',
        context: {},
      }),
    },
  ],
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Copilot Load Test Results:');
    console.log(`Requests: ${result.requests.mean}`);
    console.log(`Latency (mean): ${result.latency.mean}`);
    console.log(`Latency (p95): ${result.latency.p95}`);
    console.log(`Latency (p99): ${result.latency.p99}`);
    console.log(`Throughput: ${result.requests.mean * 1000} req/sec`);
  }
});

autocannon.track(instance);
