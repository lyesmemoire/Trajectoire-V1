const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:3000',
  connections: 60,
  duration: 60,
  amount: 6000,
  pipelining: 1,
  requests: [
    {
      method: 'GET',
      path: '/search?q=JavaScript',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      method: 'POST',
      path: '/search/advanced',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'React developer',
        filters: {
          skills: ['JavaScript', 'React'],
          experience: 'senior',
          location: 'remote',
        },
        limit: 20,
      }),
    },
    {
      method: 'GET',
      path: '/search?q=Python&page=1&limit=10',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ],
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Search Load Test Results:');
    console.log(`Requests: ${result.requests.mean}`);
    console.log(`Latency (mean): ${result.latency.mean}`);
    console.log(`Latency (p95): ${result.latency.p95}`);
    console.log(`Latency (p99): ${result.latency.p99}`);
    console.log(`Throughput: ${result.requests.mean * 1000} req/sec`);
  }
});

autocannon.track(instance);
