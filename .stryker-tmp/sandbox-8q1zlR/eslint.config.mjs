// @ts-nocheck
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
  "no-console": "off",
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
      "**/public/**",

      // Legacy code being migrated - will be cleaned up progressively
      "src/**"
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
      "no-console": "off",
    },
  },

  /**
   * ARCHITECTURAL GUARD RAILS
   */
  {
    files: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "apps/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name=/(UseCase|Repository|Adapter|Service|Orchestrator)$/]",
          message: "Aucun 'new' sur les classes métiers n'est autorisé en dehors de container.ts."
        }
      ],
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/lib/*/infrastructure/**", "@/lib/*/application/**", "@/lib/*/domain/**"],
            message: "Importation directe interdite. Importez uniquement depuis l'index.ts du domaine (ex: '@/lib/cv')."
          }
        ]
      }]
    }
  },
  {
    files: ["lib/**/container.ts"],
    rules: {
      "no-restricted-syntax": "off"
    }
  },
  {
    files: ["lib/**/application/**/*.{ts,tsx}", "lib/**/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@prisma/client", "@/lib/prisma", "@supabase/supabase-js"],
            message: "Pas d'infrastructure (Prisma/Supabase) dans le Domaine ou l'Application."
          }
        ]
      }]
    }
  },
  {
    files: ["app/api/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          {
            group: ["@/lib/prisma", "@prisma/client", "@supabase/supabase-js"],
            message: "API routes must not import Prisma/Supabase directly. Use the domain module."
          },
          {
            group: ["**/*.repository", "**/*.adapter"],
            message: "API routes must not import Repositories or Adapters directly."
          },
        ],
      }],
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
      "no-console": "off",
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
      "no-console": "off",
    },
  },

  /**
   * LEGACY ROOT DIRS (pragmatic — console & any tolérés)
   * Ces dossiers contiennent du code pré-monorepo qui sera migré progressivement.
   */
  {
    files: [
      "app/**/*.{ts,tsx}",
      "lib/**/*.{ts,js}",
      "sil/**/*.{ts,js}",
      "components/**/*.{ts,tsx}",
      "core/**/*.{ts,js}",
      "p0/**/*.{ts,js}",
      "src/**/*.{ts,tsx}",
      "services/**/*.{ts,js}",
      "hooks/**/*.{ts,tsx}",
      "providers/**/*.{ts,tsx}",
      "gateway/**/*.{ts,js}",
      "tools/**/*.{ts,js}",
      "tests/**/*.{ts,js}",
      "packages/**/*.{ts,js}",
    ],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",
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
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  /**
   * CJS / JS FILES (migration scripts, legacy tooling)
   */
  {
    files: ["**/*.cjs", "**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off",
    },
  },
];
