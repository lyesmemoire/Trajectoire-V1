/**
 * Application Initialization
 * 
 * This file is imported early in the application lifecycle to validate
 * environment variables and perform other startup checks.
 */

import { validateEnv } from "./env-validation";

// Validate environment variables at startup
// This will throw an error if required variables are missing
try {
  validateEnv();
} catch (error) {
  // In development, log the error but don't crash
  if (process.env.NODE_ENV === "development") {
    console.error("Environment validation failed:", error);
  } else {
    // In production, crash the application
    throw error;
  }
}
