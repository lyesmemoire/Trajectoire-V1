const fs = require('fs');

function computeIndependentDecision(thresholdsPath, coverage, mutation, regression) {
  const policy = JSON.parse(fs.readFileSync(thresholdsPath, 'utf8'));
  const levels = ['gold', 'silver', 'bronze'];
  
  let achievedLevel = null;

  for (const level of levels) {
    const t = policy[level];
    if (
      coverage.statements >= t.statements &&
      coverage.branches >= t.branches &&
      coverage.functions >= t.functions &&
      mutation.mutationScore >= t.mutationScore &&
      mutation.total >= t.minValidMutations &&
      regression.detectionRate >= t.detectionRate &&
      regression.missed <= t.maxMissed
    ) {
      achievedLevel = level;
      break; // highest level met since we check gold first
    }
  }

  const certified = achievedLevel !== null;

  return {
    certified,
    level: achievedLevel || 'none',
    reason: certified ? `Met requirements for ${achievedLevel} level` : 'Failed to meet bronze level requirements'
  };
}

module.exports = { computeIndependentDecision };
