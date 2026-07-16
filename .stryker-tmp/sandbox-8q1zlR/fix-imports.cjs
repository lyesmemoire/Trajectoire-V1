// @ts-nocheck
const fs = require('fs');
const path = require('path');
const files = [
  'core/p7/tests/explainability.test.ts',
  'core/p7/tests/scoring-engine.test.ts',
  'core/p7/scoring-engine/scoring-engine.ts',
  'core/p7/scoring-engine/scoring-contract.ts',
  'core/p7/scoring-engine/extractors/trust-extractor.ts',
  'core/p7/scoring-engine/extractors/stability-extractor.ts',
  'core/p7/explainability/trace-mapper.ts',
  'core/p7/explainability/evidence-builder.ts',
  'apps/realtime-gateway/src/runtime/collector/runtime-trace-collector.ts',
  'apps/realtime-gateway/src/runtime/collector/tests/collector.test.ts',
  'apps/realtime-gateway/src/runtime/runtime-bootstrap.ts',
  'core/p7/report/report-contract.ts',
  'core/p7/report/report-builder.ts'
];
for (const f of files) {
  const p = path.resolve(f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    content = content.replace(/import\s+\{\s*(RuntimeTrace|TurnTrace)(?:\s*,\s*(RuntimeTrace|TurnTrace))?\s*\}\s+from\s+['"].*?runtime-trace['"]/g, (match) => {
      let relativePath = path.relative(path.dirname(p), path.resolve('core/p7/trace-contract')).replace(/\\/g, '/');
      if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
      return `import { RuntimeTrace, TurnTrace } from "${relativePath}"`;
    });
    fs.writeFileSync(p, content);
  }
}
