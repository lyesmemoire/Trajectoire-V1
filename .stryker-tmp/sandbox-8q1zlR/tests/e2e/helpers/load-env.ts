// @ts-nocheck
import * as fs from "fs";
import * as path from "path";

/**
 * Load environment variables from a .env file into process.env
 * This is used by Playwright to load test-specific environment variables
 */
export function loadEnv(envFile: string): void {
  const envPath = path.resolve(process.cwd(), envFile);

  if (!fs.existsSync(envPath)) {
    console.warn(`⚠️  Environment file not found: ${envPath}`);
    console.warn(`   Copy .env.test.example to ${envFile} and fill in the values.`);
    return;
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");

  lines.forEach((line) => {
    // Skip comments and empty lines
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    // Parse KEY=VALUE
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();

      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, "");

      process.env[key] = cleanValue;
    }
  });

  console.log(`✅ Loaded environment from ${envFile}`);
}
