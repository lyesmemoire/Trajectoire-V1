const fs = require("fs");
const path = require("path");

// 1. Create stubs for integrity validators
const stubs = [
  "apps/realtime-gateway/src/interview/runtime/integrity/RuntimeAssertions.ts",
  "apps/realtime-gateway/src/interview/runtime/integrity/SnapshotEquivalence.ts",
  "apps/realtime-gateway/src/interview/runtime/replay/player/ReplayPlaybackEngine.ts",
  "apps/realtime-gateway/src/interview/runtime/types/Milliseconds.ts",
  "apps/realtime-gateway/src/interview/runtime/types/ConfidenceScore.ts",
  "apps/realtime-gateway/src/interview/runtime/types/PipelineExecutionId.ts",
  "apps/realtime-gateway/src/interview/runtime/types/runtime.ts",
];

for (const file of stubs) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, "export {};\n");
  }
}

// 2. Fix imports in specific files
let content;

const pbFile =
  "apps/realtime-gateway/src/interview/runtime/prompt-budget/PromptBudgetManager.ts";
if (fs.existsSync(pbFile)) {
  content = fs.readFileSync(pbFile, "utf8");
  content = content.replace(
    /from\s+['"]\.\.\/types\/runtime['"]/g,
    "from '../../types/runtime'",
  );
  fs.writeFileSync(pbFile, content);
}

const rcFile =
  "apps/realtime-gateway/src/interview/runtime/question-engine/selectors/shared/selectorContext.ts";
if (fs.existsSync(rcFile)) {
  content = fs.readFileSync(rcFile, "utf8");
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/types\/Milliseconds['"]/g,
    "from '../../../types/Milliseconds'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/types\/ConfidenceScore['"]/g,
    "from '../../../types/ConfidenceScore'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/types\/PipelineExecutionId['"]/g,
    "from '../../../types/PipelineExecutionId'",
  );
  fs.writeFileSync(rcFile, content);
}

const parFile =
  "apps/realtime-gateway/src/interview/runtime/question-engine/state/reducers/promptAssembledReducer.ts";
if (fs.existsSync(parFile)) {
  content = fs.readFileSync(parFile, "utf8");
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/types\/prompt['"]/g,
    "from '../../../types/prompt'",
  );
  fs.writeFileSync(parFile, content);
}

const testFile =
  "apps/realtime-gateway/src/interview/runtime/replay/core/__tests__/ReplayKernelReader.test.ts";
if (fs.existsSync(testFile)) {
  content = fs.readFileSync(testFile, "utf8");
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/types\/replay['"]/g,
    "from '../../../types/replay'",
  );
  fs.writeFileSync(testFile, content);
}

const readerFile =
  "apps/realtime-gateway/src/interview/runtime/replay/core/ReplayKernelReader.ts";
if (fs.existsSync(readerFile)) {
  content = fs.readFileSync(readerFile, "utf8");
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/types\/replay\/StableHash['"]/g,
    "from '@core/types/StableHash'",
  );
  fs.writeFileSync(readerFile, content);
}
