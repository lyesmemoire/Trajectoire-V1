# Technical Debt Register

**Date:** 2026-07-14  
**Sprint:** 6.30  
**Scope:** Real Technical Debt  
**Objective:** List real technical debt with impact, priority, and effort

## Real Technical Debt

### TD001: Template Errors Blocking Build

**Location:** `lib/_templates/ai-domain/`

**Description:** Template directory references non-existent modules, blocking build and typecheck

**Impact:** High - Blocks production build and CI/CD

**Priority:** P1 - Critical

**Evidence:**
- RC1_BUILD_STATUS.md: 7 TypeScript errors
- Missing modules: domain.factory, domain-stream.adapter, domain.errors, domain.dto
- AsyncGenerator type error

**Effort:** 1 hour (remove template directory)

**Resolution:** Remove lib/_templates/ai-domain directory

---

### TD002: Anthropic Provider Not Implemented

**Location:** `lib/intelligence-core/infrastructure/providers/`

**Description:** Anthropic provider not implemented, engines use provider: "anthropic" will fail

**Impact:** High - Engines using Anthropic will fail at runtime

**Priority:** P1 - Critical

**Evidence:**
- RC1_RUNTIME_STATUS.md: Anthropic provider not implemented
- RC1_CONFIGURATION_STATUS.md: Anthropic provider not configured
- Engines use provider: "anthropic" in options

**Effort:** 4 hours (implement Anthropic provider)

**Resolution:** Implement Anthropic provider implementing IntelligenceProviderPort

---

### TD003: Environment Variables Not Verified

**Location:** Root directory

**Description:** Environment variables not verified, API keys required for providers

**Impact:** High - Providers will fail without API keys

**Priority:** P1 - Critical

**Evidence:**
- RC1_CONFIGURATION_STATUS.md: Environment variables not verified
- OPENAI_API_KEY required
- ANTHROPIC_API_KEY required (not configured)

**Effort:** 0.5 hours (manual verification)

**Resolution:** Verify environment variables are configured

---

### TD004: Secrets Management Not Verified

**Location:** Root directory

**Description:** Secrets management not verified, API keys may be exposed

**Impact:** High - Security risk if API keys exposed

**Priority:** P1 - Critical

**Evidence:**
- RC1_PRODUCTION_CHECKLIST.md: Secrets not verified
- API keys required for providers

**Effort:** 2 hours (verify secrets management)

**Resolution:** Verify secrets management and API key security

---

### TD005: Engine Test Coverage 0%

**Location:** `core/intelligence/engines/`

**Description:** 54 engines have 0 test coverage

**Impact:** Medium - No regression testing for engines

**Priority:** P2 - Medium

**Evidence:**
- TEST_CERTIFICATION.md: 0 test files for 54 engines
- 0 test suites for engines
- 0 tests for engines

**Effort:** 40 hours (create engine tests)

**Resolution:** Create test files for all 54 engines

---

### TD006: Lint Problems (10,425)

**Location:** Throughout codebase

**Description:** 10,425 lint problems (3,113 errors, 7,312 warnings)

**Impact:** Low - Code quality, not blocking

**Priority:** P3 - Low

**Evidence:**
- RC1_BUILD_STATUS.md: 10,425 lint problems
- 3,113 errors
- 7,312 warnings
- 148 errors and 1,762 warnings potentially fixable with --fix

**Effort:** 40 hours (full cleanup)

**Resolution:** Fix lint errors and warnings

---

### TD007: Unused Runtime Components (3)

**Location:** `lib/intelligence-runtime/application/`

**Description:** 3 runtime components exist but are unused by engines

**Impact:** Low - Unused code, maintenance burden

**Priority:** P3 - Low

**Evidence:**
- RC1_RUNTIME_STATUS.md: MetricsAdapter unused
- RC1_RUNTIME_STATUS.md: DependencyManager unused
- RC1_RUNTIME_STATUS.md: ContextBuilder unused

**Effort:** 4 hours (remove or document unused components)

**Resolution:** Remove unused components or document their purpose

---

### TD008: Deprecated Intelligence Factory

**Location:** `lib/intelligence-core/composition/intelligence.factory.ts`

**Description:** Intelligence factory marked as @deprecated but not removed

**Impact:** Low - Deprecated code, maintenance burden

**Priority:** P3 - Low

**Evidence:**
- RC1_CONFIGURATION_STATUS.md: Intelligence factory deprecated
- Delegates to intelligenceCoreModule

**Effort:** 0.5 hours (remove deprecated factory)

**Resolution:** Remove deprecated factory

---

### TD009: Obsolete Documentation (6)

**Location:** `docs/`, root directory

**Description:** 6 documentation files are obsolete or potentially obsolete

**Impact:** Medium - Documentation contradicts code

**Priority:** P2 - Medium

**Evidence:**
- RC1_DOCUMENTATION_STATUS.md: 2 definitely obsolete
- RC1_DOCUMENTATION_STATUS.md: 4 potentially obsolete
- ADR-020 has 6 divergences
- ARCHITECTURE.md scope mismatch

**Effort:** 26 hours (update or deprecate obsolete documentation)

**Resolution:** Update or deprecate obsolete documentation

---

### TD010: Monitoring Not Set Up

**Location:** Root directory

**Description:** Monitoring not set up for production

**Impact:** Medium - No observability in production

**Priority:** P2 - Medium

**Evidence:**
- RC1_PRODUCTION_CHECKLIST.md: Monitoring not verified
- MetricsAdapter exists but unused

**Effort:** 8 hours (set up monitoring)

**Resolution:** Set up monitoring for production

---

### TD011: Logging Not Set Up

**Location:** Root directory

**Description:** Logging not set up for production

**Impact:** Medium - No logging in production

**Priority:** P2 - Medium

**Evidence:**
- RC1_PRODUCTION_CHECKLIST.md: Logging not verified
- EventPublisher has event history but no structured logging

**Effort:** 4 hours (set up logging)

**Resolution:** Set up logging for production

---

### TD012: Mistral Provider Not Implemented

**Location:** `lib/intelligence-core/infrastructure/providers/`

**Description:** Mistral provider not implemented

**Impact:** Low - Not used by engines

**Priority:** P3 - Low

**Evidence:**
- RC1_RUNTIME_STATUS.md: Mistral provider not implemented
- RC1_CONFIGURATION_STATUS.md: Mistral provider not configured
- Not used by engines

**Effort:** 4 hours (implement Mistral provider)

**Resolution:** Implement Mistral provider if needed

---

## Summary

**Total Technical Debt Items:** 12

**Priority P1 (Critical):** 4
- TD001: Template errors blocking build
- TD002: Anthropic provider not implemented
- TD003: Environment variables not verified
- TD004: Secrets management not verified

**Priority P2 (Medium):** 4
- TD005: Engine test coverage 0%
- TD009: Obsolete documentation (6)
- TD010: Monitoring not set up
- TD011: Logging not set up

**Priority P3 (Low):** 4
- TD006: Lint problems (10,425)
- TD007: Unused runtime components (3)
- TD008: Deprecated intelligence factory
- TD012: Mistral provider not implemented

**Total Effort:** 134 hours

**Critical Effort:** 7.5 hours

**Medium Effort:** 78 hours

**Low Effort:** 48.5 hours

---

## Excluded Items

**Future Improvements (Not Technical Debt):**
- Add more runtime components
- Improve architecture
- Refactor code
- Add new features
- Improve performance beyond current baseline

**Reason:** These are improvements, not debt

---

**Register Created:** 2026-07-14  
**Created By:** Cascade AI Assistant  
**Sprint:** 6.30  
**Methodology:** Real technical debt identification only
