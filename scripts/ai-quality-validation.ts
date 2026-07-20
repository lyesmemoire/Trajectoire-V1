/**
 * AI Quality Validation Script
 * Runs automated quality validation for CI/CD pipeline
 */

import { regressionSuite } from "../apps/web/src/application/ai-quality/RegressionSuite";
import { qualityMetricsEngine } from "../apps/web/src/application/ai-quality/QualityMetricsEngine";
import { goldenDataset } from "../apps/web/src/application/ai-quality/GoldenDataset";

// ============================================================================
// VALIDATION CONFIGURATION
// ============================================================================

const VALIDATION_CONFIG = {
  currentVersion: process.env.CURRENT_VERSION || "1.0.0",
  previousVersion: process.env.PREVIOUS_VERSION || "1.0.0",
  totalSimulations: parseInt(process.env.SIMULATIONS || "1000"),
  failOnRegression: process.env.FAIL_ON_REGRESSION !== "false",
  outputFormat: process.env.OUTPUT_FORMAT || "json", // json, text
};

// ============================================================================
// VALIDATION RESULTS
// ============================================================================

interface ValidationResult {
  success: boolean;
  version: string;
  previousVersion: string;
  overallScore: number;
  previousScore: number;
  scoreDelta: number;
  passed: boolean;
  failures: string[];
  metrics: any;
  criteria: any;
  timestamp: Date;
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

async function runValidation(): Promise<ValidationResult> {
  console.log("🚀 Starting AI Quality Validation");
  console.log(`📊 Current Version: ${VALIDATION_CONFIG.currentVersion}`);
  console.log(`📊 Previous Version: ${VALIDATION_CONFIG.previousVersion}`);
  console.log(`📊 Simulations: ${VALIDATION_CONFIG.totalSimulations}`);
  console.log("");

  // Set versions
  regressionSuite.setCurrentVersion(VALIDATION_CONFIG.currentVersion);
  regressionSuite.setPreviousVersion(VALIDATION_CONFIG.previousVersion);

  // Run regression test
  console.log("🔄 Running regression tests...");
  const regressionResult = await regressionSuite.runRegressionTest({
    totalSimulations: VALIDATION_CONFIG.totalSimulations,
    failOnRegression: VALIDATION_CONFIG.failOnRegression,
  });

  console.log(`✅ Regression tests completed`);
  console.log(`📊 Overall Score: ${regressionResult.overallScore.toFixed(2)}`);
  console.log(`📊 Previous Score: ${regressionResult.previousScore.toFixed(2)}`);
  console.log(`📊 Score Delta: ${regressionResult.scoreDelta.toFixed(2)}`);
  console.log(`📊 Passed: ${regressionResult.passed}`);
  console.log(`📊 Failures: ${regressionResult.failures.length}`);
  console.log("");

  // Collect failures
  const failures: string[] = [];
  regressionResult.failures.forEach(failure => {
    failures.push(`${failure.scenarioId}: ${failure.reason}`);
  });

  if (failures.length > 0) {
    console.log("❌ Failures detected:");
    failures.forEach(failure => {
      console.log(`   - ${failure}`);
    });
    console.log("");
  }

  // Get metrics comparison
  const metricsComparison = regressionResult.metricsComparison;
  const criteriaComparison = regressionResult.criteriaComparison;

  console.log("📈 Metrics Comparison:");
  Object.entries(metricsComparison.deltas).forEach(([key, delta]) => {
    const symbol = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
    console.log(`   ${symbol} ${key}: ${delta.toFixed(4)}`);
  });
  console.log("");

  console.log("📊 Criteria Comparison:");
  Object.entries(criteriaComparison.deltas).forEach(([key, delta]) => {
    const symbol = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
    console.log(`   ${symbol} ${key}: ${delta.toFixed(2)}`);
  });
  console.log("");

  // Build result
  const result: ValidationResult = {
    success: regressionResult.passed,
    version: VALIDATION_CONFIG.currentVersion,
    previousVersion: VALIDATION_CONFIG.previousVersion,
    overallScore: regressionResult.overallScore,
    previousScore: regressionResult.previousScore,
    scoreDelta: regressionResult.scoreDelta,
    passed: regressionResult.passed,
    failures,
    metrics: metricsComparison,
    criteria: criteriaComparison,
    timestamp: new Date(),
  };

  // Output result
  if (VALIDATION_CONFIG.outputFormat === "json") {
    console.log(JSON.stringify(result, null, 2));
  }

  // Final decision
  if (result.success) {
    console.log("✅ Validation PASSED - Deployment approved");
    console.log(`📊 Quality improvement: ${result.scoreDelta > 0 ? "+" : ""}${result.scoreDelta.toFixed(2)}`);
  } else {
    console.log("❌ Validation FAILED - Deployment blocked");
    console.log(`📊 Quality degradation: ${result.scoreDelta < 0 ? "" : "+"}${result.scoreDelta.toFixed(2)}`);
  }

  return result;
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export { runValidation, VALIDATION_CONFIG };

// ============================================================================
// RUN IF EXECUTED DIRECTLY
// ============================================================================

if (require.main === module) {
  runValidation()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error("❌ Validation error:", error);
      process.exit(1);
    });
}
