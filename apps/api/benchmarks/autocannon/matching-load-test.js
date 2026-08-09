const autocannon = require('autocannon');

const instance = autocannon({
  url: 'http://localhost:3000',
  connections: 30,
  duration: 60,
  amount: 3000,
  pipelining: 1,
  requests: [
    {
      method: 'POST',
      path: '/matching',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidateId: 'candidate-1',
        jobId: 'job-1',
      }),
    },
    {
      method: 'POST',
      path: '/matching/batch',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidateId: 'candidate-1',
        jobIds: ['job-1', 'job-2', 'job-3'],
      }),
    },
    {
      method: 'POST',
      path: '/matching/filtered',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidateId: 'candidate-1',
        jobId: 'job-1',
        filters: {
          minScore: 0.5,
          skills: ['JavaScript', 'React'],
          experience: 'senior',
        },
      }),
    },
  ],
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Matching Load Test Results:');
    console.log(`Requests: ${result.requests.mean}`);
    console.log(`Latency (mean): ${result.latency.mean}`);
    console.log(`Latency (p95): ${result.latency.p95}`);
    console.log(`Latency (p99): ${result.latency.p99}`);
    console.log(`Throughput: ${result.requests.mean * 1000} req/sec`);
  }
});

autocannon.track(instance);
