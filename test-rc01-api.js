// RC-01 API Validation Script
const BASE_URL = 'http://localhost:3000';

const results = [];

async function testApi(name, method, endpoint, body = null, headers = {}) {
  const startTime = Date.now();
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const duration = Date.now() - startTime;
    const data = await response.json().catch(() => null);
    
    results.push({
      api: name,
      method,
      endpoint,
      status: response.status,
      duration,
      ok: response.ok,
      data
    });
    
    console.log(`✅ ${name}: ${response.status} (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime;
    results.push({
      api: name,
      method,
      endpoint,
      status: 'ERROR',
      duration,
      ok: false,
      error: error.message
    });
    console.log(`❌ ${name}: ${error.message} (${duration}ms)`);
  }
}

async function runTests() {
  console.log('=== RC-01 API Validation ===\n');
  
  // Test 1: POST /api/journey (start)
  await testApi('POST /api/journey (start)', 'POST', '/api/journey', {
    action: 'start'
  });
  
  // Test 2: GET /api/journey
  // Note: Requires journeyId from previous test
  // await testApi('GET /api/journey', 'GET', '/api/journey?journeyId=test-id');
  
  // Test 3: PATCH /api/journey (resume)
  await testApi('PATCH /api/journey (resume)', 'PATCH', '/api/journey', {
    journeyId: 'test-id',
    action: 'resume'
  });
  
  // Test 4: POST /api/upload (CV upload)
  // Note: Requires actual file and auth
  // await testApi('POST /api/upload', 'POST', '/api/upload', formData, headers);
  
  // Test 5: POST /api/cv/rewrite
  await testApi('POST /api/cv/rewrite', 'POST', '/api/cv/rewrite', {
    action: 'improve_experience',
    content: 'Développeur web avec 5 ans d\'expérience',
    context: 'Poste senior'
  });
  
  // Test 6: POST /api/interview/start
  await testApi('POST /api/interview/start', 'POST', '/api/interview/start', {
    job_title: 'Développeur Full Stack',
    job_description: 'Nous recherchons un développeur expérimenté...',
    cv_id: null
  });
  
  // Test 7: POST /api/interview/chat
  await testApi('POST /api/interview/chat', 'POST', '/api/interview/chat', {
    sessionId: 'test-session',
    message: 'Bonjour, je suis prêt pour l\'entretien',
    questionIndex: 0
  });
  
  // Test 8: GET /api/interview/report
  await testApi('GET /api/interview/report', 'GET', '/api/interview/report?sessionId=test-session');
  
  // Test 9: GET /api/dashboard
  await testApi('GET /api/dashboard', 'GET', '/api/dashboard');
  
  // Test 10: POST /api/job-offer (MISSING)
  await testApi('POST /api/job-offer', 'POST', '/api/job-offer', {
    title: 'Développeur Full Stack',
    description: 'Poste description'
  });
  
  // Test 11: POST /api/ats/analyze (MISSING)
  await testApi('POST /api/ats/analyze', 'POST', '/api/ats/analyze', {
    cvText: 'CV content',
    jobDescription: 'Job description'
  });
  
  console.log('\n=== Results Summary ===');
  console.table(results);
  
  const successCount = results.filter(r => r.ok).length;
  const totalCount = results.length;
  console.log(`\nSuccess: ${successCount}/${totalCount}`);
  
  return results;
}

runTests().catch(console.error);
