const fs = require("fs");
const path = require("path");

const tsFiles = [
  "apps/realtime-gateway/src/interview/runtime/branching/branchEngine.ts",
  "apps/realtime-gateway/src/interview/runtime/branching/merge/types.ts",
  "apps/realtime-gateway/src/interview/runtime/EngineRuntimeConfig.ts",
  "apps/realtime-gateway/src/interview/runtime/integrity/DeterminismVerifier.ts",
  "apps/realtime-gateway/src/interview/runtime/integrity/hashing/createViolationHash.ts",
  "apps/realtime-gateway/src/interview/runtime/prompt-budget/PromptBudgetManager.ts",
  "apps/realtime-gateway/src/interview/runtime/question-engine/__tests__/selectorPipeline.test.ts",
  "apps/realtime-gateway/src/interview/runtime/question-engine/__tests__/TopicSelector.test.ts",
  "apps/realtime-gateway/src/interview/runtime/question-engine/pipeline/SelectorExecutionPipeline.ts",
  "apps/realtime-gateway/src/interview/runtime/question-engine/selectors/shared/selectorContext.ts",
  "apps/realtime-gateway/src/interview/runtime/question-engine/selectors/TopicSelector.ts",
  "apps/realtime-gateway/src/interview/runtime/question-engine/state/InterviewRuntimeState.ts",
  "apps/realtime-gateway/src/interview/runtime/question-engine/state/reducers/promptAssembledReducer.ts",
  "apps/realtime-gateway/src/interview/runtime/question-engine/utils/computeRuntimeStateHash.ts",
  "apps/realtime-gateway/src/interview/runtime/replay/core/__tests__/ReplayKernelReader.test.ts",
  "apps/realtime-gateway/src/interview/runtime/replay/core/ReplayKernelReader.ts",
];

for (const file of tsFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, "utf8");

  // Fixes
  content = content.replace(
    /from\s+['"]\.\.\/types\/graph['"]/g,
    "from '../../types/graph'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/types\/prompt['"]/g,
    "from '../../types/prompt'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.\/types\/prompt['"]/g,
    "from '../../../../types/prompt'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/utils\/clock['"]/g,
    "from '../../../utils/clock'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/types\/Milliseconds['"]/g,
    "from '../../../types/Milliseconds'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/types\/ConfidenceScore['"]/g,
    "from '../../../types/ConfidenceScore'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/types\/StableHash['"]/g,
    "from '@core/types/StableHash'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/types\/PipelineExecutionId['"]/g,
    "from '../../../types/PipelineExecutionId'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/utils\/hash['"]/g,
    "from '../../utils/hash'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/\.\.\/\.\.\/utils\/hash['"]/g,
    "from '../../../utils/hash'",
  );
  content = content.replace(
    /from\s+['"]\.\.\/types\/InterviewRuntimeState['"]/g,
    "from '../state/InterviewRuntimeState'",
  );

  if (file.includes("DeterminismVerifier.ts")) {
    content = content.replace(
      /from\s+['"]\.\.\/session\/ReplaySession['"]/g,
      "from '../../replay/types'",
    );
    content = content.replace(
      /from\s+['"]\.\.\/player\/ReplayPlaybackEngine['"]/g,
      "from '../../replay/player/ReplayPlaybackEngine'",
    );
  }

  // prompt-budget
  if (file.includes("PromptBudgetManager")) {
    content = content.replace(
      /from\s+['"]\.\.\/types\/runtime['"]/g,
      "from '../../types/runtime'",
    );
  }

  // merge types
  if (file.includes("merge/types")) {
    content = content.replace(
      /from\s+['"]\.\.\/\.\.\/replay\/types['"]/g,
      "from '../../../types/replay'",
    );
  }

  // replay core
  if (
    file.includes("ReplayKernelReader.ts") ||
    file.includes("ReplayKernelReader.test.ts")
  ) {
    content = content.replace(
      /from\s+['"]\.\.\/\.\.\/types['"]/g,
      "from '../../../types/replay'",
    );
    content = content.replace(
      /from\s+['"]\.\.\/types['"]/g,
      "from '../../types/replay'",
    );
  }

  // branchEngine
  if (file.includes("branchEngine.ts")) {
    content = content.replace(
      /from\s+['"]\.\.\/graph\/causalGraph['"]/g,
      "from '../../types/graph'",
    );
  }

  // EngineRuntimeConfig
  if (file.includes("EngineRuntimeConfig.ts")) {
    content = content.replace(
      /from\s+['"]\.\.\/graph\/TopicGraph['"]/g,
      "from './graph/TopicGraph'",
    );
    content = content.replace(
      /from\s+['"]\.\.\/memory\/QuestionMemory['"]/g,
      "from './memory/QuestionMemory'",
    );
    content = content.replace(
      /from\s+['"]\.\.\/conversation\/ConversationState['"]/g,
      "from './conversation/ConversationState'",
    );
    content = content.replace(
      /from\s+['"]\.\.\/time\/InterviewClock['"]/g,
      "from './time/InterviewClock'",
    );
  }

  fs.writeFileSync(file, content);
}
