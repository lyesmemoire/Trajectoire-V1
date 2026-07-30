const fs = require('fs');
const { sha256Json } = require('./certification/hash.cjs');

const m1 = JSON.parse(fs.readFileSync('manifest1.json', 'utf8'));
const m2 = JSON.parse(fs.readFileSync('manifest2.json', 'utf8'));

// Delete variable fields
delete m1.metadata.manifestId;
delete m1.metadata.createdAt;
delete m1.logs;

delete m2.metadata.manifestId;
delete m2.metadata.createdAt;
delete m2.logs;

const hash1 = sha256Json(m1, ['integrity']);
const hash2 = sha256Json(m2, ['integrity']);

console.log('Hash 1:', hash1);
console.log('Hash 2:', hash2);
console.log('Identical?', hash1 === hash2);
