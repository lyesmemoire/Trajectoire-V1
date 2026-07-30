const { generateProvenance } = require('./certification/provenance.cjs');
const path = require('path');
const runDir = process.argv[2];
generateProvenance(runDir, path.join(__dirname, 'certification', 'logs'));
