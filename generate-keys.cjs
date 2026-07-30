const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateKeys(dir, prefix) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  fs.writeFileSync(path.join(dir, `${prefix}_private.pem`), privateKey.export({ type: 'pkcs8', format: 'pem' }));
  fs.writeFileSync(path.join(dir, `${prefix}_public.pem`), publicKey.export({ type: 'spki', format: 'pem' }));
  console.log(`Generated keys for ${prefix}`);
}

generateKeys(path.join(__dirname, 'certification', 'keys'), 'pipeline');
generateKeys(path.join(__dirname, 'laboratory', 'keys'), 'lab');
