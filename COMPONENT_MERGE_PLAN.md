# Component Merge Plan

**Date:** 2026-07-05  
**Purpose:** Official migration plan for merging components/ui into components/design-system  
**Status:** READY FOR EXECUTION

---

## Executive Summary

This document provides the official migration plan for consolidating the two design systems (`components/ui` and `components/design-system`) into a single, unified design system using official tokens.

**Key Decisions:**
- Keep `components/design-system` as the primary location
- Merge unique components from `components/ui` into `components/design-system`
- Extract form components from `components/ui/input.tsx` into separate files
- Update all imports to use `@/components/design-system`
- Delete `components/ui` directory after migration

**Migration Strategy:** Component-by-component with validation after each step

---

## Decision Matrix

| Component | UI | Design System | Decision | Action | Priority |
|-----------|----|---------------|----------|--------|----------|
| **Button** | button.tsx | button.tsx | **KEEP Design System** | Migrate imports | High |
| **Badge** | badge.tsx | badge.tsx | **KEEP Design System** | Migrate imports | High |
| **Empty State** | empty-state.tsx | empty-state.tsx | **KEEP Design System + Add ErrorState** | Add ErrorState, migrate imports | High |
| **Input** | input.tsx (5 components) | input.tsx (1 component) | **EXTRACT UI + Merge** | Extract to separate files, merge | High |
| **Modal** | modal.tsx (2 components) | modal.tsx (1 component) | **KEEP Design System + Add ConfirmModal** | Add ConfirmModal, migrate imports | High |
| **Progress** | progress.tsx (2 components) | progress.tsx (4 components) | **KEEP Design System** | Migrate imports | High |
| **Skeleton** | skeleton.tsx (2 components) | skeleton.tsx (4 components) | **KEEP Design System** | Migrate imports | High |
| **Stat Card** | stat-card.tsx | stat-card.tsx | **KEEP Design System + Add trend** | Add trend support, migrate imports | High |
| **Toast** | toast.tsx | toast.tsx | **KEEP Design System** | Detailed analysis, migrate | Medium |

### Unique Components from components/ui

| Component | Decision | Action | Priority |
|-----------|----------|--------|----------|
| alert-banner | **MERGE** | Merge into design-system alert | Medium |
| credit-badge | **KEEP** | Keep as-is (business logic) | Low |
| keyword-badge | **KEEP** | Keep as-is (CV-specific) | Low |
| progress-steps | **MERGE** | Design-system has SteppedProgress, deprecate | Low |
| score-ring | **MERGE** | Design-system has CircularProgress, deprecate | Low |
| spinner | **MERGE** | Design-system has Loader, deprecate | Low |
| tabs | **MERGE** | Add to design-system | Medium |

---

## Phase 1: Preparation

### 1.1 Add Missing Components to Design System

**Action:** Add ErrorState component to `components/design-system/empty-state.tsx`

```typescript
// Add to empty-state.tsx
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Une erreur est survenue",
  message = "Veuillez réessayer ou contacter le support.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("text-center py-12 px-6", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-danger-light flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Réessayer
        </Button>
      )}
    </div>
  );
}
```

**Action:** Add ConfirmModal component to `components/design-system/modal.tsx`

```typescript
// Add to modal.tsx
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const variantStyles = {
    danger: "bg-danger hover:bg-danger-hover",
    warning: "bg-warning hover:bg-warning-hover",
    info: "bg-info hover:bg-info-hover",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-text-secondary mb-6">{message}</p>
      <div className="flex gap-3">
        <Button onClick={onClose} variant="outline" disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          className={variantStyles[variant]}
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
```

**Action:** Add trend support to `components/design-system/stat-card.tsx`

```typescript
// Add to stat-card.tsx
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number;
  unit?: string;
  icon?: LucideIcon;
  description?: string;
  trend?: { value: number; isPositive: boolean };
  color?: "default" | "primary" | "success" | "warning" | "danger";
  showProgress?: boolean;
}

// Update component to render trend
{trend && (
  <div className={cn("mt-3 flex items-center gap-1 text-sm font-bold", trend.isPositive ? "text-success" : "text-danger")}>
    <svg className={cn("w-4 h-4", !trend.isPositive && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
    {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
  </div>
)}
```

**Action:** Add Tabs component to `components/design-system/tabs.tsx`

```typescript
// Create new file tabs.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

export function Tabs({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex rounded-xl bg-border-hover p-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <button
      onClick={() => context?.onValueChange(value)}
      className={cn(
        "flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-all",
        isActive ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(TabsContext);
  if (context?.value !== value) return null;

  return <div className={cn("mt-2", className)}>{children}</div>;
}
```

---

## Phase 2: Extract Form Components

### 2.1 Extract components/ui/input.tsx

**Action:** Create separate form component files in `components/design-system/`

**Files to create:**

1. **input.tsx** - Merge UI Input with design-system Input
2. **textarea.tsx** - Extract from UI, merge with design-system Textarea
3. **select.tsx** - Extract from UI, create new
4. **checkbox.tsx** - Extract from UI, create new
5. **radio.tsx** - Extract from UI, create new

**Implementation details:**

- Keep password toggle functionality from UI Input
- Use design-system tokens (colors, spacing, radius)
- Maintain label, error, hint support
- Maintain leftIcon, rightIcon support
- Update to use official tokens from colors.ts, spacing.ts, radius.ts

---

## Phase 3: Update Design System Components with Official Tokens

### 3.1 Token Migration Priority

**High Priority (High Usage):**
- Button - Update all hardcoded colors to use colors.ts
- Input - Update all hardcoded colors to use colors.ts
- Badge - Update all hardcoded colors to use colors.ts
- Modal - Update all hardcoded colors to use colors.ts

**Medium Priority (Medium Usage):**
- Progress - Update all hardcoded colors to use colors.ts
- Skeleton - Update all hardcoded colors to use colors.ts
- Stat Card - Update all hardcoded colors to use colors.ts

**Low Priority (Low Usage):**
- Empty State - Update all hardcoded colors to use colors.ts
- Toast - Update all hardcoded colors to use colors.ts

### 3.2 Token Migration Pattern

**Before:**
```typescript
className="bg-blue-600 text-white hover:bg-blue-700"
```

**After:**
```typescript
import { colors } from "./tokens/colors";

// In component
className="bg-primary text-white hover:bg-primary-hover"
// Or use CSS variables
style={{ backgroundColor: colors.primary }}
```

**Target:** All components should use semantic color names (primary, secondary, success, warning, danger, info) instead of hardcoded Tailwind classes.

---

## Phase 4: Import Migration

### 4.1 Files to Update (28 files)

**Button imports (28 files):**
1. app/onboarding/page.tsx
2. app/cv-templates/page.tsx
3. app/cv/components/CVEditor.tsx
4. app/cv/components/CVAnalyzer.tsx
5. components/shared/PrivacyConsent.tsx
6. components/landing/InstantInterviewDemo.tsx
7. components/marketing/ExitIntent.tsx
8. components/interview/mobile/MobileVoiceInterface.tsx
9. components/marketing/hero-section.tsx
10. components/marketing/WaitlistForm.tsx
11. components/marketing/pricing.tsx
12. components/marketing/pricing-preview.tsx
13. components/marketing/final-cta.tsx
14. components/interview/InterviewResults.tsx
15. components/marketing-old/Pricing.tsx
16. components/marketing-old/Hero.tsx
17. components/marketing-old/FinalCTA.tsx
18. components/cv/PDFPreviewModal.tsx
19. components/cv/ExportButton.tsx
20. components/challenges/challenge-banner.tsx
21. components/audio/MicrophoneRecoveryModal.tsx
22. components/audio/MicrophoneCheck.tsx
23. components/billing/UpgradeGate.tsx
24. components/cv-editor/CVEditorShell.tsx
25. components/cv-editor/ExperienceEditor.tsx
26. app/admin/users/page.tsx
27. app/admin/recovery-dashboard/page.tsx
28. app/admin/prompts/page.tsx

**Badge imports (4 files):**
1. app/cv/components/CVAnalyzer.tsx
2. components/marketing/pricing.tsx
3. app/admin/users/page.tsx
4. app/admin/prompts/page.tsx

**Input imports (2 files):**
1. components/marketing/ExitIntent.tsx
2. components/marketing/WaitlistForm.tsx

**Modal imports (1 file):**
1. components/billing/UpgradeGate.tsx

**Progress imports (1 file):**
1. app/cv/components/CVAnalyzer.tsx

### 4.2 Import Migration Pattern

**Before:**
```typescript
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
```

**After:**
```typescript
import { Button } from "@/components/design-system";
import { Badge } from "@/components/design-system";
import { Input } from "@/components/design-system";
import { Modal } from "@/components/design-system";
import { Progress } from "@/components/design-system";
```

**Note:** Use barrel export from `@/components/design-system` for cleaner imports.

---

## Phase 5: Component-by-Component Migration

### 5.1 Migration Order

**Phase 5.1: Low Risk Components**
1. Badge (4 files, simple replacement)
2. Skeleton (no direct imports found, but used in design-system)
3. Stat Card (no direct imports found, but used in design-system)

**Phase 5.2: Medium Risk Components**
4. Progress (1 file, props mapping needed)
5. Empty State (no direct imports found)
6. Modal (1 file, add ConfirmModal)

**Phase 5.3: High Risk Components**
7. Input (2 files, extract form components)
8. Button (28 files, color mapping needed)

### 5.2 Validation After Each Component

After each component migration:
1. Run `pnpm typecheck` - Ensure no TypeScript errors
2. Run `pnpm build` - Ensure build succeeds
3. Manual testing - Verify component renders correctly
4. Only proceed to next component if validation passes

---

## Phase 6: Cleanup

### 6.1 Delete components/ui Directory

**Action:** After successful migration and validation, delete `components/ui/` directory

**Files to delete:**
- components/ui/alert-banner.tsx
- components/ui/badge.tsx
- components/ui/button.tsx
- components/ui/credit-badge.tsx (KEEP - move to components/cv/)
- components/ui/empty-state.tsx
- components/ui/input.tsx
- components/ui/keyword-badge.tsx (KEEP - move to components/cv/)
- components/ui/modal.tsx
- components/ui/progress-steps.tsx
- components/ui/progress.tsx
- components/ui/score-ring.tsx
- components/ui/skeleton.tsx
- components/ui/spinner.tsx
- components/ui/stat-card.tsx
- components/ui/tabs.tsx
- components/ui/toast.tsx

**Special handling:**
- `credit-badge.tsx` → Move to `components/cv/credit-badge.tsx` (business logic specific)
- `keyword-badge.tsx` → Move to `components/cv/keyword-badge.tsx` (CV-specific)

### 6.2 Update components/design-system/index.ts

**Action:** Ensure all new components are exported from barrel file

```typescript
// Add to index.ts
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export { ErrorState } from "./empty-state";
export { ConfirmModal } from "./modal";
export { Select, Checkbox, Radio } from "./input"; // After extraction
```

---

## Phase 7: Final Validation

### 7.1 Validation Checklist

- [ ] All components/ui imports updated to components/design-system
- [ ] All components/ui directory deleted (except business logic components)
- [ ] All design-system components use official tokens
- [ ] No hardcoded colors in design-system components
- [ ] No hardcoded spacing in design-system components
- [ ] No hardcoded radius in design-system components
- [ ] No hardcoded shadows in design-system components
- [ ] No inline animations in design-system components
- [ ] `pnpm typecheck` passes with no errors
- [ ] `pnpm build` passes with no errors
- [ ] `pnpm lint` passes with no errors

### 7.2 Testing Checklist

- [ ] Button renders correctly in all variants
- [ ] Badge renders correctly in all variants
- [ ] Input renders correctly with all features
- [ ] Modal renders correctly with animations
- [ ] Progress renders correctly with animations
- [ ] Skeleton renders correctly in all variants
- [ ] Stat Card renders correctly with trend
- [ ] Empty State renders correctly
- [ ] Error State renders correctly
- [ ] ConfirmModal renders correctly
- [ ] Tabs render correctly

---

## Phase 8: Documentation

### 8.1 Update docs/DESIGN_SYSTEM.md

**Action:** Update documentation to reflect merged design system

- Remove references to components/ui
- Update import examples to use components/design-system
- Document new components (Tabs, ErrorState, ConfirmModal)
- Document form components (Input, Textarea, Select, Checkbox, Radio)

### 8.2 Create Migration Guide

**Action:** Create MIGRATION_GUIDE.md with before/after examples

```markdown
# Migration Guide

## Button Migration

**Before:**
```typescript
import { Button } from "@/components/ui/button";
<Button variant="primary">Click me</Button>
```

**After:**
```typescript
import { Button } from "@/components/design-system";
<Button variant="primary">Click me</Button>
```

## Color Mapping

- blue → primary
- slate → default
- red → danger
- green → success
- amber → warning
```

---

## Risk Assessment

### High Risk Items

1. **Input component extraction**
   - Risk: Breaking form functionality
   - Mitigation: Thorough testing of all form components
   - Rollback plan: Keep UI input.tsx as backup

2. **Button color mapping**
   - Risk: Visual changes in production
   - Mitigation: Visual regression testing
   - Rollback plan: Revert color mapping if issues

### Medium Risk Items

1. **Modal ConfirmModal**
   - Risk: Breaking billing flow
   - Mitigation: Test billing flow specifically
   - Rollback plan: Keep UI modal.tsx as backup

2. **Progress component**
   - Risk: Breaking CV analyzer
   - Mitigation: Test CV analyzer specifically
   - Rollback plan: Keep UI progress.tsx as backup

### Low Risk Items

1. **Badge, Skeleton, Stat Card**
   - Risk: Minimal
   - Mitigation: Standard testing
   - Rollback plan: Quick revert

---

## Timeline Estimate

**Phase 1: Preparation** - 2 hours
- Add missing components to design-system
- Test new components

**Phase 2: Extract Form Components** - 3 hours
- Extract UI input.tsx components
- Merge with design-system
- Test form components

**Phase 3: Update Design System Tokens** - 4 hours
- Update all components to use official tokens
- Test each component
- Validate with typecheck and build

**Phase 4: Import Migration** - 2 hours
- Update all imports (28 files)
- Test each file
- Validate with typecheck and build

**Phase 5: Component-by-Component Migration** - 4 hours
- Migrate each component
- Validate after each migration
- Fix issues as they arise

**Phase 6: Cleanup** - 1 hour
- Delete components/ui directory
- Update barrel exports
- Final validation

**Phase 7: Final Validation** - 2 hours
- Run full validation suite
- Manual testing
- Fix remaining issues

**Phase 8: Documentation** - 2 hours
- Update documentation
- Create migration guide
- Final review

**Total Estimated Time:** 20 hours

---

## Success Criteria

### Must Have

- [ ] Single design system location (components/design-system)
- [ ] All components use official tokens
- [ ] No hardcoded values in design-system components
- [ ] All imports updated to components/design-system
- [ ] components/ui directory deleted (except business logic)
- [ ] pnpm typecheck passes
- [ ] pnpm build passes
- [ ] pnpm lint passes

### Should Have

- [ ] All components have Framer Motion animations
- [ ] All components have proper accessibility
- [ ] Documentation updated
- [ ] Migration guide created

### Nice to Have

- [ ] Visual regression tests
- [ ] Component storybook
- [ ] Automated testing

---

## Rollback Plan

If critical issues arise during migration:

1. **Stop migration immediately**
2. **Revert last change**
3. **Run validation**
4. **Assess issue**
5. **Fix issue or skip component**
6. **Continue migration**

**Rollback commands:**
```bash
git checkout components/design-system
git checkout components/ui
git checkout app components
```

---

## Next Steps

1. **Review this plan** with team
2. **Get approval** to proceed
3. **Start Phase 1** - Preparation
4. **Execute migration** component by component
5. **Validate** after each phase
6. **Complete cleanup**
7. **Final validation**
8. **Update documentation**

---

## Appendix A: Component Usage Summary

### Button Usage by Module

| Module | Files | Usage |
|--------|-------|-------|
| Marketing | 8 | High |
| Admin | 3 | Medium |
| CV | 4 | High |
| Interview | 2 | Medium |
| Audio | 2 | Medium |
| Billing | 1 | Low |
| Challenges | 1 | Low |
| Shared | 1 | Low |
| Landing | 1 | Low |
| Onboarding | 1 | Low |

### Priority Migration Order

1. **Marketing** (8 files) - High visibility, test thoroughly
2. **CV** (4 files) - Critical functionality, test thoroughly
3. **Admin** (3 files) - Admin functionality, test thoroughly
4. **Interview** (2 files) - Critical functionality, test thoroughly
5. **Audio** (2 files) - Medium priority
6. **Others** (5 files) - Low priority

---

## Appendix B: Token Mapping Reference

### Color Mapping

| UI Color | Design System Color | Token |
|-----------|---------------------|-------|
| slate-900 | text-primary | colors.textPrimary |
| slate-600 | text-secondary | colors.textSecondary |
| blue-600 | primary | colors.primary |
| blue-700 | primary-hover | colors.primaryHover |
| red-600 | danger | colors.danger |
| green-600 | success | colors.success |
| amber-600 | warning | colors.warning |
| violet-600 | info | colors.info |

### Spacing Mapping

| UI Spacing | Design System Spacing | Token |
|------------|----------------------|-------|
| px-2 | spacing-xs | spacing.spacingXs |
| px-3 | spacing-sm | spacing.spacingSm |
| px-4 | spacing-md | spacing.spacingMd |
| px-6 | spacing-lg | spacing.spacingLg |
| py-2 | spacing-sm | spacing.spacingSm |
| py-3 | spacing-md | spacing.spacingMd |

### Radius Mapping

| UI Radius | Design System Radius | Token |
|-----------|---------------------|-------|
| rounded-xl | radius-lg | radius.radiusLg |
| rounded-2xl | radius-xl | radius.radiusXl |
| rounded-3xl | radius-2xl | radius.radius2xl |

### Shadow Mapping

| UI Shadow | Design System Shadow | Token |
|-----------|---------------------|-------|
| shadow-sm | shadow-xs | shadows.shadowXs |
| shadow-lg | shadow-lg | shadows.shadowLg |
| shadow-2xl | shadow-2xl | shadows.shadow2xl |

---

**Document Status:** READY FOR EXECUTION  
**Last Updated:** 2026-07-05  
**Next Review:** After Phase 1 completion
