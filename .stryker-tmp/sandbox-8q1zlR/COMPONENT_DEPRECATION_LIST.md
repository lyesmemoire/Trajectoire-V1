# Component Deprecation List

**Generated:** 2026-07-05  
**Migration Phase:** PHASE 4 - Deprecation Marking

## Overview

This document lists all components from `components/ui` that have been deprecated in favor of the new `components/design-system`. These components are kept for backward compatibility but should not be used in new code.

## Deprecated Components

### ✅ Fully Migrated (Safe to Remove After Audit)

#### Button
- **Status:** ✅ MIGRATED
- **New Location:** `@/components/design-system`
- **Files Migrated:** 28 files
- **API Changes:**
  - `variant="destructive"` → `variant="error"`
- **Migration Date:** 2026-07-05
- **Notes:** All Button imports have been migrated to design-system. The UI button component is now deprecated.

#### Badge
- **Status:** ✅ MIGRATED
- **New Location:** `@/components/design-system`
- **Files Migrated:** 4 files
- **API Changes:** None (compatible API)
- **Migration Date:** 2026-07-05
- **Notes:** All Badge imports have been migrated to design-system. The UI badge component is now deprecated.

#### Progress
- **Status:** ✅ MIGRATED
- **New Location:** `@/components/design-system`
- **Files Migrated:** 1 file
- **API Changes:** None (compatible API)
- **Migration Date:** 2026-07-05
- **Notes:** All Progress imports have been migrated to design-system. The UI progress component is now deprecated.

#### Modal
- **Status:** ✅ MIGRATED
- **New Location:** `@/components/design-system`
- **Files Migrated:** 1 file
- **API Changes:**
  - `isOpen` → `open`
  - `onClose` → `onOpenChange`
  - Now uses sub-components: `ModalContent`, `ModalHeader`, `ModalTitle`, `ModalDescription`
- **Migration Date:** 2026-07-05
- **Notes:** All Modal imports have been migrated to design-system. The UI modal component is now deprecated.

### ⚠️ Not Migrated (Still in Use)

#### Input
- **Status:** ⚠️ NOT MIGRATED
- **Reason:** API incompatibility - UI Input includes form components (Textarea, Select, Checkbox, Radio) that are not present in design-system
- **Files Still Using:** 2 files
  - `components/marketing/ExitIntent.tsx`
  - `components/marketing/WaitlistForm.tsx`
- **Action Required:** Extract form components or keep UI Input for complex form scenarios
- **Recommendation:** Keep UI Input for now - migration too risky for current sprint

#### Empty State
- **Status:** ⚠️ PARTIALLY MIGRATED
- **Reason:** ErrorState functionality added to design-system, but UI EmptyState may still have unique features
- **Files Still Using:** 0 files (no direct imports found)
- **Action Required:** Verify no remaining usage before deprecation
- **Recommendation:** Safe to deprecate after audit

### 📋 Unique Components (Keep in UI)

The following components are unique to `components/ui` and have no equivalent in `components/design-system`:

- **alert-banner.tsx** - Alert banner with type-based styling
- **credit-badge.tsx** - Credit badge with Supabase integration
- **keyword-badge.tsx** - Keyword badge with status indicator
- **progress-steps.tsx** - Navigation progress bar with steps
- **score-ring.tsx** - Circular progress indicator for scores
- **spinner.tsx** - Spinner component with PageLoader variant
- **stat-card.tsx** - Stat card with trend indicator (design-system has metric-card)
- **tabs.tsx** - Tabs component (design-system now has tabs.tsx)
- **toast.tsx** - Toast notification component

**Note:** Some of these may be migrated in future sprints if needed.

## Migration Summary

| Component | Status | Files Migrated | API Changes |
|-----------|--------|----------------|-------------|
| Button | ✅ Migrated | 28 | destructive → error |
| Badge | ✅ Migrated | 4 | None |
| Progress | ✅ Migrated | 1 | None |
| Modal | ✅ Migrated | 1 | isOpen→open, onClose→onOpenChange |
| Input | ⚠️ Not Migrated | 0 | API incompatible |
| Empty State | ⚠️ Partial | 0 | ErrorState added to DS |

## Next Steps

1. **PHASE 5:** Run complete audit for remaining `components/ui` imports
2. **PHASE 6:** Execute full validation (lint, typecheck, build)
3. **PHASE 7:** Move `components/ui` to `deprecated/components-ui/`
4. **PHASE 8:** Generate final migration report

## Rollback Procedure

If issues arise after migration:

1. Revert import changes in affected files
2. Restore imports from `@/components/ui` instead of `@/components/design-system`
3. Verify typecheck and build pass
4. Document the issue in this file

## Notes

- All deprecated components remain in `components/ui` directory
- No components have been deleted yet
- Migration was done progressively with validation after each component
- API incompatibilities were documented and handled appropriately
