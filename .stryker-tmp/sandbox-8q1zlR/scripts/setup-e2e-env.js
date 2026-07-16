#!/usr/bin/env node
// @ts-nocheck

/**
 * Setup script for E2E test environment
 * 
 * This script helps you create a .env.test file from .env.test.example
 * 
 * Usage: node scripts/setup-e2e-env.js
 */

import * as fs from "fs";
import * as path from "path";

const envExamplePath = path.resolve(process.cwd(), ".env.test.example");
const envTestPath = path.resolve(process.cwd(), ".env.test");

console.log("🔧 E2E Environment Setup\n");

// Check if .env.test already exists
if (fs.existsSync(envTestPath)) {
  console.log("⚠️  .env.test already exists.");
  console.log("   If you want to recreate it, delete it first and run this script again.\n");
  process.exit(0);
}

// Check if .env.test.example exists
if (!fs.existsSync(envExamplePath)) {
  console.error("❌ .env.test.example not found.");
  console.log("   This file should exist in the project root.\n");
  process.exit(1);
}

console.log("📋 Creating .env.test from .env.test.example...\n");

// Copy the example file
fs.copyFileSync(envExamplePath, envTestPath);

console.log("✅ .env.test created successfully!\n");
console.log("📝 Next steps:");
console.log("   1. Open .env.test and fill in the required values");
console.log("   2. Use test keys only (never production keys)");
console.log("   3. Create a dedicated Supabase test project");
console.log("   4. Use Stripe test mode keys\n");
console.log("📖 Refer to .env.test.example for documentation on each variable.\n");
console.log("🚀 Once configured, run: npx playwright test\n");
