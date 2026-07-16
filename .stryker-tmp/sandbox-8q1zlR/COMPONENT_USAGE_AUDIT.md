# Component Usage Audit

**Date:** 2026-07-05  
**Scope:** Complete audit of component imports across the Trajectoire project  
**Sources:** `components/ui` and `components/design-system`

---

## Executive Summary

- **Total files scanned:** Entire codebase
- **components/ui imports found:** 57+ occurrences across 25+ files
- **components/design-system imports found:** 400+ occurrences (mostly in documentation)
- **Duplicate components identified:** 9
- **Unique components in ui:** 7
- **Unique components in design-system:** 38+

---

## Étape 1: Import Analysis

### components/ui Usage

#### Button (40+ occurrences)

| File | Module | Component | Usage Count |
|------|--------|-----------|-------------|
| `app/onboarding/page.tsx` | Onboarding | Button | 1 |
| `app/cv-templates/page.tsx` | CV Templates | Button | 1 |
| `app/cv/components/CVEditor.tsx` | CV Editor | Button | 1 |
| `app/cv/components/CVAnalyzer.tsx` | CV Analyzer | Button | 1 |
| `components/shared/PrivacyConsent.tsx` | Shared | Button | 1 |
| `components/landing/InstantInterviewDemo.tsx` | Landing | Button | 1 |
| `components/marketing/ExitIntent.tsx` | Marketing | Button | 1 |
| `components/interview/mobile/MobileVoiceInterface.tsx` | Interview | Button | 1 |
| `components/marketing/hero-section.tsx` | Marketing | Button | 1 |
| `components/marketing/WaitlistForm.tsx` | Marketing | Button | 1 |
| `components/marketing/pricing.tsx` | Marketing | Button | 1 |
| `components/marketing/pricing-preview.tsx` | Marketing | Button | 1 |
| `components/marketing/final-cta.tsx` | Marketing | Button | 1 |
| `components/interview/InterviewResults.tsx` | Interview | Button | 1 |
| `components/marketing-old/Pricing.tsx` | Marketing (old) | Button | 1 |
| `components/marketing-old/Hero.tsx` | Marketing (old) | Button | 1 |
| `components/marketing-old/FinalCTA.tsx` | Marketing (old) | Button | 1 |
| `components/cv/PDFPreviewModal.tsx` | CV | Button | 1 |
| `components/cv/ExportButton.tsx` | CV | Button | 1 |
| `components/challenges/challenge-banner.tsx` | Challenges | Button | 1 |
| `components/audio/MicrophoneRecoveryModal.tsx` | Audio | Button | 1 |
| `components/audio/MicrophoneCheck.tsx` | Audio | Button | 1 |
| `components/billing/UpgradeGate.tsx` | Billing | Button | 1 |
| `components/cv-editor/CVEditorShell.tsx` | CV Editor | Button | 1 |
| `components/cv-editor/ExperienceEditor.tsx` | CV Editor | Button | 1 |
| `app/admin/users/page.tsx` | Admin | Button | 1 |
| `app/admin/recovery-dashboard/page.tsx` | Admin | Button | 1 |
| `app/admin/prompts/page.tsx` | Admin | Button | 1 |

**Total Button imports:** 28 files

#### Badge (4 occurrences)

| File | Module | Component | Usage Count |
|------|--------|-----------|-------------|
| `app/cv/components/CVAnalyzer.tsx` | CV Analyzer | Badge | 1 |
| `components/marketing/pricing.tsx` | Marketing | Badge | 1 |
| `app/admin/users/page.tsx` | Admin | Badge | 1 |
| `app/admin/prompts/page.tsx` | Admin | Badge | 1 |

**Total Badge imports:** 4 files

#### Input (2 occurrences)

| File | Module | Component | Usage Count |
|------|--------|-----------|-------------|
| `components/marketing/ExitIntent.tsx` | Marketing | Input | 1 |
| `components/marketing/WaitlistForm.tsx` | Marketing | Input | 1 |

**Total Input imports:** 2 files

#### Modal (1 occurrence)

| File | Module | Component | Usage Count |
|------|--------|-----------|-------------|
| `components/billing/UpgradeGate.tsx` | Billing | Modal | 1 |

**Total Modal imports:** 1 file

#### Progress (1 occurrence)

| File | Module | Component | Usage Count |
|------|--------|-----------|-------------|
| `app/cv/components/CVAnalyzer.tsx` | CV Analyzer | Progress | 1 |

**Total Progress imports:** 1 file

### components/design-system Usage

#### Navigation Components (8 occurrences)

| File | Module | Components | Usage Count |
|------|--------|------------|-------------|
| `components/navigation/marketing-navigation.tsx` | Navigation | Navbar, NavbarLogo, NavbarLink, NavbarActions, Button | 5 |
| `components/navigation/main-navigation.tsx` | Navigation | Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter, Avatar, Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, Button | 13 |
| `components/navigation/dashboard-navigation.tsx` | Navigation | Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter, Avatar | 8 |
| `components/navigation/back-button.tsx` | Navigation | Button | 1 |

**Total navigation imports:** 27 components across 4 files

#### Layout Foundation Components (7 occurrences)

| File | Module | Components | Usage Count |
|------|--------|------------|-------------|
| `components/layouts/foundation/top-navigation.tsx` | Layouts | Navbar, NavbarLogo, NavbarLink, NavbarActions, Button, Avatar | 6 |
| `components/layouts/foundation/sidebar-layout.tsx` | Layouts | Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter, Avatar | 8 |
| `components/layouts/foundation/page-header.tsx` | Layouts | Button | 1 |
| `components/layouts/foundation/marketing-layout.tsx` | Layouts | Navbar, NavbarLogo, NavbarLink, NavbarActions, Footer, Button | 6 |
| `components/layouts/foundation/dashboard-layout.tsx` | Layouts | Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter, Avatar | 8 |
| `components/layouts/foundation/index.ts` | Layouts | Container | 1 |

**Total layout imports:** 30 components across 6 files

#### Performance Components (1 occurrence)

| File | Module | Components | Usage Count |
|------|--------|------------|-------------|
| `components/performance/dynamic-imports.tsx` | Performance | Loader | 1 |

#### Documentation Usage (400+ occurrences)

The `docs/DESIGN_SYSTEM.md` file contains extensive examples and documentation for all design-system components, accounting for the majority of design-system imports.

---

## Étape 2: Component Inventory

### components/ui (16 components)

| Component | File | Size | Status |
|-----------|------|------|--------|
| alert-banner | alert-banner.tsx | 1,310 bytes | Unique |
| badge | badge.tsx | 905 bytes | **Duplicate** |
| button | button.tsx | 2,169 bytes | **Duplicate** |
| credit-badge | credit-badge.tsx | 2,095 bytes | Unique |
| empty-state | empty-state.tsx | 1,552 bytes | **Duplicate** |
| input | input.tsx | 9,207 bytes | **Duplicate** |
| keyword-badge | keyword-badge.tsx | 587 bytes | Unique |
| modal | modal.tsx | 4,050 bytes | **Duplicate** |
| progress-steps | progress-steps.tsx | 1,580 bytes | Unique |
| progress | progress.tsx | 3,883 bytes | **Duplicate** |
| score-ring | score-ring.tsx | 2,443 bytes | Unique |
| skeleton | skeleton.tsx | 840 bytes | **Duplicate** |
| spinner | spinner.tsx | 1,239 bytes | Unique |
| stat-card | stat-card.tsx | 2,054 bytes | **Duplicate** |
| tabs | tabs.tsx | 1,679 bytes | Unique |
| toast | toast.tsx | 5,108 bytes | **Duplicate** |

### components/design-system (47 components)

| Component | File | Size | Status |
|-----------|------|------|--------|
| alert | alert.tsx | 2,760 bytes | Unique |
| avatar | avatar.tsx | 1,930 bytes | Unique |
| badge | badge.tsx | 1,398 bytes | **Duplicate** |
| button | button.tsx | 2,709 bytes | **Duplicate** |
| card | card.tsx | 2,744 bytes | Unique |
| charts | charts.tsx | 5,320 bytes | Unique |
| confetti | confetti.tsx | 4,055 bytes | Unique |
| container | container.tsx | 745 bytes | Unique |
| cta | cta.tsx | 1,819 bytes | Unique |
| dashboard-card | dashboard-card.tsx | 1,759 bytes | Unique |
| drawer | drawer.tsx | 4,306 bytes | Unique |
| dropdown | dropdown.tsx | 7,316 bytes | Unique |
| empty-state | empty-state.tsx | 1,345 bytes | **Duplicate** |
| faq | faq.tsx | 1,484 bytes | Unique |
| footer | footer.tsx | 3,902 bytes | Unique |
| hero | hero.tsx | 4,337 bytes | Unique |
| hero-card | hero-card.tsx | 2,056 bytes | Unique |
| hover-focus | hover-focus.tsx | 7,028 bytes | Unique |
| input | input.tsx | 2,844 bytes | **Duplicate** |
| keyboard-navigation | keyboard-navigation.tsx | 11,854 bytes | Unique |
| loader | loader.tsx | 4,925 bytes | Unique |
| logo-cloud | logo-cloud.tsx | 1,444 bytes | Unique |
| metric-card | metric-card.tsx | 3,931 bytes | Unique |
| micro-interactions | micro-interactions.tsx | 9,458 bytes | Unique |
| mobile-optimization | mobile-optimization.tsx | 8,381 bytes | Unique |
| modal | modal.tsx | 3,908 bytes | **Duplicate** |
| navbar | navbar.tsx | 4,952 bytes | Unique |
| notification | notification.tsx | 4,556 bytes | Unique |
| page-transition | page-transition.tsx | 4,129 bytes | Unique |
| preloader | preloader.tsx | 9,312 bytes | Unique |
| pricing-card | pricing-card.tsx | 3,855 bytes | Unique |
| progress | progress.tsx | 6,334 bytes | **Duplicate** |
| scroll-animation | scroll-animation.tsx | 6,351 bytes | Unique |
| section | section.tsx | 1,134 bytes | Unique |
| sidebar | sidebar.tsx | 3,401 bytes | Unique |
| skeleton | skeleton.tsx | 1,849 bytes | **Duplicate** |
| stat-card | stat-card.tsx | 2,321 bytes | **Duplicate** |
| table | table.tsx | 2,823 bytes | Unique |
| testimonial | testimonial.tsx | 1,551 bytes | Unique |
| textarea | textarea.tsx | 1,803 bytes | Unique |
| timeline | timeline.tsx | 3,461 bytes | Unique |
| toast | toast.tsx | 6,466 bytes | **Duplicate** |
| wcag-compliance | wcag-compliance.tsx | 13,497 bytes | Unique |
| tokens/ | directory | - | Token files |

---

## Étape 3: Duplicate Component Analysis

### 1. Badge

**components/ui/badge.tsx** (905 bytes)
- Props: children, variant (default|secondary|success|warning|danger|info), size (sm|md), className
- Variants: 6 (default, secondary, success, warning, danger, info)
- Sizes: 2 (sm, md)
- Features: Simple badge with color variants
- Dependencies: cn utility
- Hardcoded colors: slate, green, amber, red, blue

**components/design-system/badge.tsx** (1,398 bytes)
- Props: children, variant (default|primary|success|warning|danger|info), size (sm|md|lg), className
- Variants: 6 (default, primary, success, warning, danger, info)
- Sizes: 3 (sm, md, lg)
- Features: More size options, primary variant
- Dependencies: cn utility, cva
- Hardcoded colors: gray, primary, success, warning, danger, info

**Comparison:** design-system has more size options (lg) and uses cva for better variant management.

### 2. Button

**components/ui/button.tsx** (2,169 bytes)
- Props: asChild, variant (default|primary|destructive|outline|secondary|ghost|link), size (default|sm|lg|icon)
- Variants: 7
- Sizes: 4
- Features: Radix Slot support, rounded-2xl, shadow-lg
- Dependencies: @radix-ui/react-slot, cva, clsx, tailwind-merge
- Hardcoded colors: slate, blue, red
- Custom cn function included

**components/design-system/button.tsx** (2,709 bytes)
- Props: asChild, variant (default|primary|secondary|destructive|outline|ghost|link), size (default|sm|md|lg|icon), loading, leftIcon, rightIcon
- Variants: 7
- Sizes: 5
- Features: Radix Slot support, loading state, icons, rounded-lg, motion animations
- Dependencies: @radix-ui/react-slot, cva, framer-motion, lucide-react
- Hardcoded colors: primary, secondary, destructive, gray
- Framer Motion animations

**Comparison:** design-system has more size options (md), loading state, icon support, and Framer Motion animations.

### 3. Empty State

**components/ui/empty-state.tsx** (1,552 bytes)
- Props: icon, title, description, action, className
- Features: EmptyState and ErrorState components
- Hardcoded colors: slate, red
- Simple implementation

**components/design-system/empty-state.tsx** (1,345 bytes)
- Props: icon, title, description, action, variant (default|muted), size (sm|md|lg), className
- Features: More variants and sizes
- Hardcoded colors: gray
- Uses design-system tokens

**Comparison:** design-system has more variants and sizes, uses tokens.

### 4. Input

**components/ui/input.tsx** (9,207 bytes)
- Props: label, error, hint, leftIcon, rightIcon
- Features: Input, Textarea, Select, Checkbox, Radio components
- Hardcoded colors: slate, blue, red
- Password toggle built-in
- Comprehensive form components

**components/design-system/input.tsx** (2,844 bytes)
- Props: label, error, hint, leftIcon, rightIcon, variant (default|filled|outlined)
- Features: Input component only
- Hardcoded colors: gray, primary, danger
- Uses design-system tokens
- Simpler implementation

**Comparison:** ui has more form components (Textarea, Select, Checkbox, Radio) in one file. design-system has better token integration but fewer components.

### 5. Modal

**components/ui/modal.tsx** (4,050 bytes)
- Props: isOpen, onClose, title, description, children, size (sm|md|lg|xl), showClose
- Features: Modal and ConfirmModal components
- Hardcoded colors: slate, red, amber, blue
- ConfirmModal with variants

**components/design-system/modal.tsx** (3,908 bytes)
- Props: isOpen, onClose, title, description, children, size (sm|md|lg|xl), showClose
- Features: Modal component with Framer Motion animations
- Hardcoded colors: gray
- Framer Motion animations
- Uses design-system tokens

**Comparison:** design-system has Framer Motion animations and better token integration. ui has ConfirmModal component.

### 6. Progress

**components/ui/progress.tsx** (3,883 bytes)
- Props: value, max, label, showValue, size (sm|md|lg), color (blue|green|amber|red|violet)
- Features: Progress and CircularProgress components
- Hardcoded colors: blue, green, amber, red, violet
- Gradient fills
- Circular progress with SVG

**components/design-system/progress.tsx** (6,334 bytes)
- Props: value, max, variant (default|success|warning|error), size (sm|md|lg), className, showLabel, animated
- Features: Progress, CircularProgress, SteppedProgress, LoadingBar components
- Hardcoded colors: gray, primary, success, warning, error
- Framer Motion animations
- More component types (SteppedProgress, LoadingBar)

**Comparison:** design-system has more component types, Framer Motion animations, and better token integration.

### 7. Skeleton

**components/ui/skeleton.tsx** (840 bytes)
- Props: className
- Features: Skeleton and CardSkeleton components
- Hardcoded colors: slate
- Simple implementation

**components/design-system/skeleton.tsx** (1,849 bytes)
- Props: className, variant (default|circular|text), count
- Features: More variants, count support
- Hardcoded colors: gray
- Uses design-system tokens

**Comparison:** design-system has more variants and count support.

### 8. Stat Card

**components/ui/stat-card.tsx** (2,054 bytes)
- Props: value, label, icon, trend, color (blue|green|amber|violet|slate)
- Features: Trend display
- Hardcoded colors: blue, green, amber, violet, slate
- Simple implementation

**components/design-system/stat-card.tsx** (2,321 bytes)
- Props: value, label, icon, trend, color (default|primary|success|warning|danger)
- Features: Trend display
- Hardcoded colors: gray, primary, success, warning, danger
- Uses design-system tokens

**Comparison:** design-system has better token integration and semantic color names.

### 9. Toast

**components/ui/toast.tsx** (5,108 bytes)
- Props: Not analyzed in detail
- Features: Toast notification system
- Hardcoded colors: likely present

**components/design-system/toast.tsx** (6,466 bytes)
- Props: Not analyzed in detail
- Features: Toast notification system with Framer Motion
- Hardcoded colors: likely present
- Framer Motion animations

**Comparison:** design-system likely has Framer Motion animations and better token integration.

---

## Étape 4: Unique Components Analysis

### components/ui Unique Components (7)

| Component | Purpose | Migration Strategy |
|-----------|---------|-------------------|
| alert-banner | Simple alert banner with emoji icons | **MERGE** into design-system alert |
| credit-badge | Credit display with real-time Supabase updates | **KEEP** - Business logic specific |
| keyword-badge | CV keyword matching badge | **KEEP** - CV-specific component |
| progress-steps | Step progress indicator | **MERGE** into design-system progress (SteppedProgress exists) |
| score-ring | Score display with color-coded levels | **MERGE** into design-system (similar to CircularProgress) |
| spinner | Loading spinner with PageLoader | **MERGE** into design-system (Loader exists) |
| tabs | Tab navigation system | **MERGE** into design-system (unique component) |

### components/design-system Unique Components (38+)

| Component | Purpose | Status |
|-----------|---------|--------|
| alert | Alert component | Keep |
| avatar | Avatar component | Keep |
| card | Card component | Keep |
| charts | Charts component | Keep |
| confetti | Confetti animation | Keep |
| container | Container component | Keep |
| cta | Call-to-action component | Keep |
| dashboard-card | Dashboard card | Keep |
| drawer | Drawer component | Keep |
| dropdown | Dropdown component | Keep |
| faq | FAQ component | Keep |
| footer | Footer component | Keep |
| hero | Hero component | Keep |
| hero-card | Hero card | Keep |
| hover-focus | Hover/focus utilities | Keep |
| keyboard-navigation | Keyboard navigation utilities | Keep |
| loader | Loader component | Keep |
| logo-cloud | Logo cloud | Keep |
| metric-card | Metric card | Keep |
| micro-interactions | Micro-interaction utilities | Keep |
| mobile-optimization | Mobile optimization utilities | Keep |
| navbar | Navbar component | Keep |
| notification | Notification component | Keep |
| page-transition | Page transition | Keep |
| preloader | Preloader component | Keep |
| pricing-card | Pricing card | Keep |
| scroll-animation | Scroll animation utilities | Keep |
| section | Section component | Keep |
| sidebar | Sidebar component | Keep |
| table | Table component | Keep |
| testimonial | Testimonial component | Keep |
| textarea | Textarea component | Keep |
| timeline | Timeline component | Keep |
| wcag-compliance | WCAG compliance utilities | Keep |
| tokens/ | Token files | Keep |

---

## Étape 5: Usage by Module

### High Usage Modules

**Marketing (8 files)**
- Button: 8 occurrences
- Input: 2 occurrences
- Badge: 1 occurrence

**Admin (3 files)**
- Button: 3 occurrences
- Badge: 2 occurrences

**CV (4 files)**
- Button: 4 occurrences
- Badge: 1 occurrence
- Progress: 1 occurrence

**Interview (2 files)**
- Button: 2 occurrences

**Audio (2 files)**
- Button: 2 occurrences

**Navigation (4 files)**
- All design-system components

**Layouts (6 files)**
- All design-system components

---

## Étape 6: Critical Dependencies

### components/ui Dependencies

- @radix-ui/react-slot (Button)
- class-variance-authority (Button)
- clsx (Button)
- tailwind-merge (Button)
- lucide-react (various)
- supabase (credit-badge)

### components/design-system Dependencies

- @radix-ui/react-slot (Button)
- class-variance-authority (Button, MetricCard)
- framer-motion (many components)
- lucide-react (many components)
- @/lib/utils (cn utility)

---

## Étape 7: Hardcoded Values Analysis

### components/ui Hardcoded Values

**Colors:**
- slate (gray-50, gray-100, gray-200, gray-300, gray-400, gray-500, gray-600, gray-700, gray-800, gray-900)
- blue (blue-50, blue-100, blue-200, blue-500, blue-600, blue-700)
- red (red-50, red-100, red-200, red-300, red-500, red-600, red-700)
- green (green-50, green-100, green-200, green-500, green-600, green-700)
- amber (amber-50, amber-100, amber-200, amber-500, amber-600, amber-700)
- violet (violet-50, violet-100, violet-200, violet-500, violet-600)
- emerald (emerald-50, emerald-100, emerald-200, emerald-400, emerald-500, emerald-600, emerald-700)

**Spacing:**
- px-2, px-3, px-4, px-6, px-10
- py-0.5, py-1, py-2, py-3
- p-4, p-6
- gap-1, gap-2, gap-3, gap-4

**Radius:**
- rounded-full, rounded-xl, rounded-2xl, rounded-3xl

**Shadows:**
- shadow-sm, shadow-lg, shadow-2xl, shadow-soft-sm

### components/design-system Hardcoded Values

**Colors:**
- gray (gray-50, gray-100, gray-200, gray-300, gray-400, gray-500, gray-600, gray-700, gray-800, gray-900)
- primary (primary, primary-light, primary-hover)
- secondary (secondary, secondary-light, secondary-hover)
- success (success, success-light)
- warning (warning, warning-light)
- danger (danger, danger-light)
- info (info, info-light)

**Spacing:**
- Uses Tailwind utilities, some hardcoded values

**Radius:**
- rounded-lg, rounded-xl, rounded-2xl, rounded-3xl

**Shadows:**
- shadow-sm, shadow-md, shadow-lg, shadow-premium

---

## Étape 8: Token Compliance

### components/ui Token Compliance

**Status:** ❌ **NON COMPLIANT**

- All colors are hardcoded Tailwind classes
- No use of official design-system tokens
- No integration with colors.ts, spacing.ts, radius.ts, shadows.ts, motion.ts

### components/design-system Token Compliance

**Status:** ⚠️ **PARTIALLY COMPLIANT**

- Some components use semantic color names (primary, secondary, success, warning, danger, info)
- Still uses hardcoded Tailwind classes in many places
- Not fully integrated with official tokens
- Needs migration to use colors.ts, spacing.ts, radius.ts, shadows.ts, motion.ts

---

## Étape 9: Migration Complexity Assessment

### Low Complexity (Simple replacements)

- Button: Direct replacement, props compatible
- Badge: Direct replacement, props compatible
- Skeleton: Direct replacement, props compatible
- Stat Card: Direct replacement, props compatible

### Medium Complexity (Props mapping needed)

- Input: ui has more form components, need to extract
- Modal: ui has ConfirmModal, need to add to design-system
- Progress: Both have similar features, need to map props
- Empty State: Props slightly different, need mapping
- Toast: Need detailed analysis

### High Complexity (Business logic)

- Credit Badge: Has Supabase integration, keep as-is
- Keyword Badge: CV-specific, keep as-is

---

## Étape 10: Risk Assessment

### High Risk

- **Input component:** ui has 4 form components in one file (Input, Textarea, Select, Checkbox, Radio). Breaking this apart could break many imports.

### Medium Risk

- **Modal component:** ui has ConfirmModal which is used in billing. Need to ensure this functionality is preserved.

### Low Risk

- **Button, Badge, Skeleton, Stat Card:** Simple replacements with compatible props.

---

## Recommendations

1. **Keep components/ui for now** as a legacy layer
2. **Gradually migrate** to design-system component by component
3. **Extract form components** from ui/input.tsx into separate files
4. **Add missing components** to design-system (Tabs, ConfirmModal)
5. **Update design-system** to use official tokens
6. **Create migration guide** for each component
7. **Test thoroughly** after each migration

---

## Next Steps

1. Create detailed comparison for each duplicate component
2. Determine reference component for each duplicate
3. Create decision matrix
4. Create COMPONENT_MERGE_PLAN.md with migration strategy
5. Execute migration component by component
6. Validate after each migration
