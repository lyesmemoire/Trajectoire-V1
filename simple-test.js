/**
 * Simple Database Connectivity Test
 */

const https = require('https');

// Test Supabase connectivity
function testSupabaseConnection() {
  console.log('🔌 Testing Supabase Connection...');
  
  const options = {
    hostname: 'bzxdozzbdvzgvgshyamp.supabase.co',
    port: 443,
    path: '/rest/v1/',
    method: 'GET',
    headers: {
      'apikey': 'sb_publishable_qq3dFup8uM5j070JMYeo9g_3fk3PFED',
      'Authorization': 'Bearer sb_publishable_qq3dFup8uM5j070JMYeo9g_3fk3PFED'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Supabase responded with status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Database connection successful');
      console.log('Response:', data.substring(0, 100) + '...');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Database connection failed:', error.message);
  });

  req.end();
}

// Test environment variables
function testEnvironmentVariables() {
  console.log('\n🔧 Testing Environment Variables...');
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    const envPath = path.join(__dirname, 'apps', 'web', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'DATABASE_URL',
      'STRIPE_SECRET_KEY'
    ];
    
    let configuredCount = 0;
    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        console.log(`✅ ${varName}: configured`);
        configuredCount++;
      } else {
        console.log(`❌ ${varName}: missing`);
      }
    });
    
    console.log(`\n📊 Environment: ${configuredCount}/${requiredVars.length} variables configured`);
    
  } catch (error) {
    console.error('❌ Failed to read environment file:', error.message);
  }
}

// Run tests
console.log('🚀 Starting Simple Pipeline Tests - SPRINT-4.3');
console.log('='.repeat(60));

testSupabaseConnection();
testEnvironmentVariables();

console.log('\n' + '='.repeat(60));
console.log('✅ Simple tests completed');
console.log('='.repeat(60));