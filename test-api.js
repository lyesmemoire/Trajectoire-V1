import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  const tests = [
    {
      name: 'POST /api/upload',
      method: 'POST',
      url: `${BASE_URL}/api/upload`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    },
    {
      name: 'POST /api/job-offer',
      method: 'POST',
      url: `${BASE_URL}/api/job-offer`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Test job offer', source: 'manual', sourceType: 'direct' })
    },
    {
      name: 'POST /api/ats/analyze',
      method: 'POST',
      url: `${BASE_URL}/api/ats/analyze`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvId: 'test-cv-id', jobOfferId: 'test-job-id' })
    },
    {
      name: 'POST /api/optimize',
      method: 'POST',
      url: `${BASE_URL}/api/optimize`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvId: 'test-cv-id', atsAnalysisId: 'test-ats-id' })
    },
    {
      name: 'POST /api/interview/start',
      method: 'POST',
      url: `${BASE_URL}/api/interview/start`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvId: 'test-cv-id', jobOfferId: 'test-job-id' })
    },
    {
      name: 'POST /api/interview/chat',
      method: 'POST',
      url: `${BASE_URL}/api/interview/chat`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'test-session-id', message: 'Hello' })
    },
    {
      name: 'GET /api/interview/report',
      method: 'GET',
      url: `${BASE_URL}/api/interview/report?sessionId=test-session-id`,
      headers: {}
    },
    {
      name: 'GET /api/dashboard',
      method: 'GET',
      url: `${BASE_URL}/api/dashboard`,
      headers: {}
    }
  ];

  console.log('Testing APIs...\n');

  for (const test of tests) {
    const startTime = Date.now();
    try {
      const response = await fetch(test.url, {
        method: test.method,
        headers: test.headers,
        body: test.body
      });
      const duration = Date.now() - startTime;
      const status = response.status;
      let payload = '';
      try {
        payload = await response.text();
      } catch (e) {
        payload = 'No response body';
      }
      
      console.log(`${test.name}`);
      console.log(`  HTTP Status: ${status}`);
      console.log(`  Temps: ${duration}ms`);
      console.log(`  Payload: ${payload.substring(0, 200)}${payload.length > 200 ? '...' : ''}`);
      console.log(`  Erreur: ${status >= 400 ? 'YES' : 'NO'}`);
      console.log('');
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`${test.name}`);
      console.log(`  HTTP Status: ERROR`);
      console.log(`  Temps: ${duration}ms`);
      console.log(`  Payload: -`);
      console.log(`  Erreur: ${error.message}`);
      console.log('');
    }
  }
}

testAPI();
