// @ts-nocheck
const fs = require("fs");
const path = require("path");

function replaceDeepFreezeImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceDeepFreezeImports(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf8");
      const importRegex =
        /import\s+\{\s*deepFreeze\s*\}\s+from\s+['"][^'"]*deepFreeze['"];?/g;

      if (
        importRegex.test(content) &&
        !content.includes("@core/freeze/deepFreeze")
      ) {
        content = content.replace(
          importRegex,
          "import { deepFreeze } from '@core/freeze/deepFreeze';",
        );
        fs.writeFileSync(fullPath, content);
        console.log("Updated imports in:", fullPath);
      }
    }
  }
}

replaceDeepFreezeImports("apps/realtime-gateway/src/interview/runtime");
