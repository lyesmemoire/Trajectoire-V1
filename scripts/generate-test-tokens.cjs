const jwt = require('../apps/api/node_modules/jsonwebtoken');
require('dotenv').config();
require('dotenv').config({ path: '.env.security-test' });

const secret = process.env.SUPABASE_ANON_KEY;
const userAId = process.env.TEST_USER_A_ID;
const userBId = process.env.TEST_USER_B_ID;

const tokenA = jwt.sign(
  { sub: userAId, email: 'security-test-a@example.com', aud: 'authenticated', role: 'authenticated' },
  secret,
  { expiresIn: '1h' }
);

const tokenB = jwt.sign(
  { sub: userBId, email: 'security-test-b@example.com', aud: 'authenticated', role: 'authenticated' },
  secret,
  { expiresIn: '1h' }
);

console.log('TEST_USER_A_TOKEN=' + tokenA);
console.log('TEST_USER_B_TOKEN=' + tokenB);
