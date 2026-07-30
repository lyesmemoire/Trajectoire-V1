import { execSync } from "child_process";
import { writeFileSync } from "fs";

try {
  const output = execSync("pnpm lint 2>&1", { encoding: "utf-8", cwd: process.cwd() });
  const lines = output.split("\n");
  
  const errorCounts: Record<string, number> = {};
  const warningCounts: Record<string, number> = {};
  
  for (const line of lines) {
    if (line.includes("error")) {
      const match = line.match(/@typescript-eslint\/(\w+)/);
      if (match) {
        errorCounts[match[1]] = (errorCounts[match[1]] || 0) + 1;
      }
    }
    if (line.includes("warning")) {
      const match = line.match(/@typescript-eslint\/(\w+)/);
      if (match) {
        warningCounts[match[1]] = (warningCounts[match[1]] || 0) + 1;
      }
    }
  }
  
  const report = {
    errors: errorCounts,
    warnings: warningCounts,
    totalErrors: Object.values(errorCounts).reduce((a, b) => a + b, 0),
    totalWarnings: Object.values(warningCounts).reduce((a, b) => a + b, 0),
  };
  
  writeFileSync("C:/Temp/eslint-analysis.json", JSON.stringify(report, null, 2));
  console.log("ESLint analysis saved to C:/Temp/eslint-analysis.json");
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error("Error analyzing ESLint:", error);
}
