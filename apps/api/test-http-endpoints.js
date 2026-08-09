const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const tests = {
  'GET /': async () => {
    const res = await axios.get(`${BASE_URL}/`);
    console.log('GET / - Status:', res.status);
  },
  'GET /health': async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    console.log('GET /health - Status:', res.status, 'Has status property:', !!res.body?.status);
  },
  'GET /health/liveness': async () => {
    const res = await axios.get(`${BASE_URL}/health/liveness`);
    console.log('GET /health/liveness - Status:', res.status);
  },
  'GET /health/readiness': async () => {
    const res = await axios.get(`${BASE_URL}/health/readiness`);
    console.log('GET /health/readiness - Status:', res.status);
  },
  'GET /health/circuit-breakers': async () => {
    const res = await axios.get(`${BASE_URL}/health/circuit-breakers`);
    console.log('GET /health/circuit-breakers - Status:', res.status);
  },
  'GET /metrics': async () => {
    const res = await axios.get(`${BASE_URL}/metrics`);
    console.log('GET /metrics - Status:', res.status, 'Has metrics:', !!res.data?.metrics);
  },
  'GET /copilot/sessions': async () => {
    const res = await axios.get(`${BASE_URL}/copilot/sessions`);
    console.log('GET /copilot/sessions - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /cv/upload': async () => {
    const formData = new FormData();
    formData.append('file', new Blob(['test cv content']), 'test.pdf');
    const res = await axios.post(`${BASE_URL}/cv/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('POST /cv/upload - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /cv/extract': async () => {
    const res = await axios.post(`${BASE_URL}/cv/extract`, { text: 'Software engineer with 5 years experience' });
    console.log('POST /cv/extract - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /cv/normalize': async () => {
    const res = await axios.post(`${BASE_URL}/cv/normalize`, { knowledge: { skills: ['JavaScript', 'TypeScript'] } });
    console.log('POST /cv/normalize - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /job/upload': async () => {
    const formData = new FormData();
    formData.append('file', new Blob(['test job content']), 'test.pdf');
    const res = await axios.post(`${BASE_URL}/job/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('POST /job/upload - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /job/extract': async () => {
    const res = await axios.post(`${BASE_URL}/job/extract`, { text: 'Senior Software Engineer position' });
    console.log('POST /job/extract - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /matching/calculate-score': async () => {
    const res = await axios.post(`${BASE_URL}/matching/calculate-score`, {
      candidateGraph: { id: 'c1', nodes: [], edges: [] },
      jobGraph: { id: 'j1', nodes: [], edges: [] },
    });
    console.log('POST /matching/calculate-score - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /search/candidates': async () => {
    const res = await axios.post(`${BASE_URL}/search/candidates`, {
      jobGraph: { id: 'j1', nodes: [], edges: [] },
      candidateGraphs: [],
    });
    console.log('POST /search/candidates - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /dashboard/match-score': async () => {
    const res = await axios.post(`${BASE_URL}/dashboard/match-score`, {
      candidateGraph: { id: 'c1', nodes: [], edges: [] },
      jobGraph: { id: 'j1', nodes: [], edges: [] },
    });
    console.log('POST /dashboard/match-score - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'DELETE /copilot/conversation/:sessionId': async () => {
    const res = await axios.delete(`${BASE_URL}/copilot/conversation/test-session-id`);
    console.log('DELETE /copilot/conversation/test-session-id - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'OPTIONS /': async () => {
    const res = await axios.options(`${BASE_URL}/`);
    console.log('OPTIONS / - Status:', res.status);
  },
  'HEAD /health': async () => {
    const res = await axios.head(`${BASE_URL}/health`);
    console.log('HEAD /health - Status:', res.status);
  },
  'HEAD /metrics': async () => {
    const res = await axios.head(`${BASE_URL}/metrics`);
    console.log('HEAD /metrics - Status:', res.status);
  },
  'POST /copilot/message': async () => {
    const res = await axios.post(`${BASE_URL}/copilot/message`, { sessionId: 'test-session', message: 'Hello' });
    console.log('POST /copilot/message - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /copilot/compare-candidates': async () => {
    const res = await axios.post(`${BASE_URL}/copilot/compare-candidates`, {
      candidate1: { id: 'c1', nodes: [], edges: [] },
      candidate2: { id: 'c2', nodes: [], edges: [] },
    });
    console.log('POST /copilot/compare-candidates - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /copilot/explain-matching': async () => {
    const res = await axios.post(`${BASE_URL}/copilot/explain-matching`, {
      candidateGraph: { id: 'c1', nodes: [], edges: [] },
      jobGraph: { id: 'j1', nodes: [], edges: [] },
    });
    console.log('POST /copilot/explain-matching - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'GET /dashboard/:userId': async () => {
    const res = await axios.get(`${BASE_URL}/dashboard/test-user-id`);
    console.log('GET /dashboard/test-user-id - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /dashboard/match-explanation': async () => {
    const res = await axios.post(`${BASE_URL}/dashboard/match-explanation`, {
      candidateGraph: { id: 'c1', nodes: [], edges: [] },
      jobGraph: { id: 'j1', nodes: [], edges: [] },
    });
    console.log('POST /dashboard/match-explanation - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /search/similar-candidates': async () => {
    const res = await axios.post(`${BASE_URL}/search/similar-candidates`, {
      targetGraph: { id: 'c1', nodes: [], edges: [] },
      candidateGraphs: [],
    });
    console.log('POST /search/similar-candidates - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /search/similar-jobs': async () => {
    const res = await axios.post(`${BASE_URL}/search/similar-jobs`, {
      targetGraph: { id: 'j1', nodes: [], edges: [] },
      jobGraphs: [],
    });
    console.log('POST /search/similar-jobs - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /search/career-path': async () => {
    const res = await axios.post(`${BASE_URL}/search/career-path`, {
      candidateGraph: { id: 'c1', nodes: [], edges: [] },
      jobGraphs: [],
    });
    console.log('POST /search/career-path - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /search/recruiter': async () => {
    const res = await axios.post(`${BASE_URL}/search/recruiter`, {
      query: 'software engineer',
      graphs: [],
    });
    console.log('POST /search/recruiter - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /matching/explain': async () => {
    const res = await axios.post(`${BASE_URL}/matching/explain`, {
      candidateGraph: { id: 'c1', nodes: [], edges: [] },
      jobGraph: { id: 'j1', nodes: [], edges: [] },
    });
    console.log('POST /matching/explain - Status:', res.status, 'Has success:', !!res.data?.success);
  },
  'POST /matching/report': async () => {
    const res = await axios.post(`${BASE_URL}/matching/report`, {
      candidateGraph: { id: 'c1', nodes: [], edges: [] },
      jobGraph: { id: 'j1', nodes: [], edges: [] },
    });
    console.log('POST /matching/report - Status:', res.status, 'Has success:', !!res.data?.success);
  },
};

async function runTests() {
  console.log('Starting API endpoint tests...\n');
  
  for (const [name, test] of Object.entries(tests)) {
    try {
      await test();
    } catch (error) {
      console.error(`${name} - ERROR:`, error.message);
    }
  }
  
  console.log('\nAll tests completed.');
}

runTests().catch(console.error);
