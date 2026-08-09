const fs = require('fs');
const jwt = require('../apps/api/node_modules/jsonwebtoken');
require('dotenv').config();

const secret = process.env.SUPABASE_ANON_KEY;
const userAId = 'd2b0147f-0c7b-4231-b73c-785fdc202215';
const userBId = '43d6a7f6-d8f9-41fb-b247-f4e6b073abce';

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

const content = `TEST_USER_A_TOKEN=${tokenA}
TEST_USER_B_TOKEN=${tokenB}
TEST_USER_A_ID=${userAId}
TEST_USER_B_ID=${userBId}
`;

fs.writeFileSync('.env.security-test', content);
console.log('Updated .env.security-test with new valid tokens');
