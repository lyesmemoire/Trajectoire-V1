const fs = require('fs');

function parseCoverageFinal(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier introuvable: ${filePath}`);
  }
  
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let totalSt = 0, coveredSt = 0;
  let totalBr = 0, coveredBr = 0;
  let totalFn = 0, coveredFn = 0;

  for (const [file, data] of Object.entries(raw)) {
    if (!file.includes('execution-pipeline.ts')) continue;
    // Statements
    const stKeys = Object.keys(data.statementMap || {});
    totalSt += stKeys.length;
    for (const k of stKeys) {
      if (data.s[k] > 0) coveredSt++;
    }

    // Branches
    const brKeys = Object.keys(data.branchMap || {});
    for (const k of brKeys) {
      const locations = data.branchMap[k].locations || [];
      const hits = data.b[k] || [];
      totalBr += locations.length;
      for (let i = 0; i < locations.length; i++) {
        if (hits[i] > 0) coveredBr++;
      }
    }

    // Functions
    const fnKeys = Object.keys(data.fnMap || {});
    totalFn += fnKeys.length;
    for (const k of fnKeys) {
      if (data.f[k] > 0) coveredFn++;
    }
  }

  const pct = (cov, tot) => tot === 0 ? 100 : Math.floor((cov / tot) * 100);

  return {
    statements: pct(coveredSt, totalSt),
    branches: pct(coveredBr, totalBr),
    functions: pct(coveredFn, totalFn),
    rawMetrics: {
      statements: { total: totalSt, covered: coveredSt },
      branches: { total: totalBr, covered: coveredBr },
      functions: { total: totalFn, covered: coveredFn }
    }
  };
}

module.exports = { parseCoverageFinal };
