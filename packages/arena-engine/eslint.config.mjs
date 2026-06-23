import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import reactHooksPlugin from "eslint-plugin-react-hooks";

/**
 * ENV DETECTION
 */
const isCI = process.env.CI === "true";

/**
 * SHARED RULES (baseline propre SaaS)
 */
const baseRules = {
  "no-console": isCI ? "error" : "warn",
  "no-debugger": "error",
  "no-undef": "off", // Handled by TypeScript
  "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }],

  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": [
    isCI ? "error" : "warn",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],

  "unused-imports/no-unused-imports": isCI ? "error" : "warn",

  "prefer-const": "error",
  "no-var": "error",

  "@typescript-eslint/no-explicit-any": isCI ? "error" : "warn",
};

/**
 * EXPORT CONFIG
 */
export default [
  /**
   * GLOBAL IGNORES (CRITICAL MONOREPO SAFETY)
   */
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",

      "**/coverage/**",

      "**/playwright-report/**",
      "**/test-results/**",

      "**/.turbo/**",
      "**/.cache/**",

      "**/*.min.js",
      "**/*.bundle.js",

      "**/generated/**",
      "**/public/**"
    ],
  },

  /**
   * GLOBAL PLUGINS & LANGUAGE OPTIONS
   */
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
      },
    },
  },

  /**
   * BASE JS/TS RULES
   */
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    rules: {
      ...baseRules,
    },
  },

  /**
   * NEXT.JS FRONTEND (apps/web ou root Next)
   */
  {
    files: ["apps/web/**/*.{ts,tsx}", "app/**/*.{ts,tsx}"],
    rules: {
      ...baseRules,

      // Next / React safety
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": isCI ? "error" : "warn",
    },
  },

  /**
   * BACKEND API (strict runtime correctness)
   */
  {
    files: ["apps/api/**/*.{ts,js}"],
    rules: {
      ...baseRules,

      // backend stricter
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": isCI ? "error" : "warn",
    },
  },

  /**
   * REALTIME GATEWAY (ultra strict runtime)
   */
  {
    files: ["apps/realtime-gateway/**/*.{ts,js}"],
    rules: {
      ...baseRules,

      "@typescript-eslint/no-explicit-any": "error",
      "no-console": "warn",
    },
  },

  /**
   * SCRIPTS / TOOLS (permissif contrôlé)
   */
  {
    files: ["scripts/**/*.{ts,js}"],
    rules: {
      ...baseRules,
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
    },
  },

  /**
   * ARENA ENGINE DOMAIN (STRICT DETERMINISM)
   */
  {
    files: ["src/**/*.{ts,js}"],
    rules: {
      ...baseRules,
      "no-restricted-globals": [
        "error",
        {
          name: "setTimeout",
          message: "Do not use global setTimeout. Inject ITimer from IInfra for deterministic time control.",
        },
        {
          name: "setInterval",
          message: "Do not use global setInterval. Inject ITimer from IInfra for deterministic time control.",
        },
        {
          name: "clearTimeout",
          message: "Do not use global clearTimeout. Inject ITimer from IInfra for deterministic time control.",
        },
        {
          name: "clearInterval",
          message: "Do not use global clearInterval. Inject ITimer from IInfra for deterministic time control.",
        }
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message: "Do not use Date.now(). Inject IClock from IInfra for deterministic time control."
        },
        {
          selector: "CallExpression[callee.object.name='Math'][callee.property.name='random']",
          message: "Do not use Math.random(). Inject IRandomProvider from IInfra for deterministic entropy."
        }
      ]
    },
  },
];
