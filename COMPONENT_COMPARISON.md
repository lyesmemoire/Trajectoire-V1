# Component Comparison Report

**Date:** 2026-07-05  
**Purpose:** Detailed comparison of duplicate components between `components/ui` and `components/design-system`

---

## 1. Button

### components/ui/button.tsx

**File Size:** 2,169 bytes  
**Lines:** 64

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

**Variants:**
- default: bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10
- primary: bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25
- destructive: bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25
- outline: border-2 border-slate-200 bg-transparent hover:bg-slate-50 hover:border-slate-300 text-slate-700
- secondary: bg-slate-100 text-slate-900 hover:bg-slate-200
- ghost: hover:bg-slate-100 text-slate-600 hover:text-slate-900
- link: text-blue-600 underline-offset-4 hover:underline px-0

**Sizes:**
- default: h-12 px-6 py-2
- sm: h-9 rounded-xl px-4
- lg: h-14 rounded-[1.25rem] px-10 text-base font-black
- icon: h-12 w-12

**Features:**
- Radix Slot support (asChild)
- CVA for variant management
- Custom cn function (clsx + tailwind-merge)
- Rounded-2xl by default
- Shadow-lg on most variants
- Active scale animation (active:scale-[0.98])

**Dependencies:**
- @radix-ui/react-slot
- class-variance-authority
- clsx
- tailwind-merge

**Accessibility:**
- focus-visible:outline-none
- focus-visible:ring-2
- focus-visible:ring-ring
- focus-visible:ring-offset-2
- disabled:pointer-events-none
- disabled:opacity-50

**Hardcoded Values:**
- Colors: slate, blue, red
- Radius: rounded-2xl, rounded-xl, rounded-[1.25rem]
- Shadows: shadow-lg, shadow-slate-900/10, shadow-blue-500/25, shadow-red-500/25
- Spacing: px-6, px-4, px-10, py-2

---

### components/design-system/button.tsx

**File Size:** 2,709 bytes  
**Lines:** 177

**Props:**
```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Variants:**
- default: bg-primary text-white hover:bg-primary-hover shadow-md
- primary: bg-primary text-white hover:bg-primary-hover shadow-md
- secondary: bg-secondary text-white hover:bg-secondary-hover shadow-md
- destructive: bg-danger text-white hover:bg-danger-hover shadow-md
- outline: border-2 border-border bg-surface hover:bg-border-hover text-text-primary
- ghost: hover:bg-border-hover text-text-primary hover:text-text-primary
- link: text-primary underline-offset-4 hover:underline px-0

**Sizes:**
- default: h-12 px-6 py-2
- sm: h-9 px-4 py-1
- md: h-10 px-5 py-2
- lg: h-14 px-8 py-3
- icon: h-12 w-12

**Features:**
- Radix Slot support (asChild)
- CVA for variant management
- Loading state with spinner
- Left and right icon support
- Framer Motion animations
- Rounded-lg by default
- Motion variants (tap, hover, focus)

**Dependencies:**
- @radix-ui/react-slot
- class-variance-authority
- framer-motion
- lucide-react (for loading spinner)

**Accessibility:**
- focus-visible:outline-none
- focus-visible:ring-2
- focus-visible:ring-border-focus
- focus-visible:ring-offset-2
- disabled:pointer-events-none
- disabled:opacity-50
- aria-busy when loading

**Hardcoded Values:**
- Colors: primary, secondary, danger, border, surface, text-primary
- Radius: rounded-lg
- Shadows: shadow-md
- Spacing: px-6, px-4, px-5, px-8, py-1, py-2, py-3

**Animations:**
- tap: { scale: 0.98 }
- hover: { scale: 1.02 }
- focus: { scale: 1.02 }

---

### Comparison Summary

| Aspect | UI Button | Design System Button | Winner |
|--------|-----------|---------------------|---------|
| File Size | 2,169 bytes | 2,709 bytes | UI (smaller) |
| Variants | 7 | 7 | Tie |
| Sizes | 4 | 5 | Design System |
| Props | Basic | +loading, +icons | Design System |
| Animations | CSS only | Framer Motion | Design System |
| Radix Slot | Yes | Yes | Tie |
| CVA | Yes | Yes | Tie |
| Accessibility | Good | Better (aria-busy) | Design System |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |
| Color System | Hardcoded | Semantic | Design System |
| Radius | rounded-2xl | rounded-lg | Design System (consistent) |

**Decision:** KEEP components/design-system/button.tsx

**Justification:**
- More size options (md)
- Loading state with spinner
- Icon support (leftIcon, rightIcon)
- Framer Motion animations for better UX
- Better accessibility (aria-busy)
- Semantic color names (primary, secondary, danger)
- Consistent radius (rounded-lg)
- Better token compliance

**Migration Notes:**
- Update imports from `@/components/ui/button` to `@/components/design-system`
- No breaking changes for basic usage
- New props (loading, leftIcon, rightIcon) are optional
- Color variants need mapping (blue → primary, slate → default)

---

## 2. Badge

### components/ui/badge.tsx

**File Size:** 905 bytes  
**Lines:** 43

**Props:**
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}
```

**Variants:**
- default: bg-slate-100 text-slate-700
- secondary: bg-slate-200 text-slate-800
- success: bg-green-100 text-green-700
- warning: bg-amber-100 text-amber-700
- danger: bg-red-100 text-red-700
- info: bg-blue-100 text-blue-700

**Sizes:**
- sm: px-2 py-0.5 text-xs
- md: px-3 py-1 text-sm

**Features:**
- Simple badge component
- CVA for variant management
- Rounded-full
- Font-bold

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: slate, green, amber, red, blue
- Radius: rounded-full
- Spacing: px-2, px-3, py-0.5, py-1

---

### components/design-system/badge.tsx

**File Size:** 1,398 bytes  
**Lines:** 68

**Props:**
```typescript
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}
```

**Variants:**
- default: bg-gray-100 text-gray-700
- primary: bg-primary/10 text-primary
- success: bg-success-light text-success
- warning: bg-warning-light text-warning
- danger: bg-danger-light text-danger
- info: bg-info-light text-info

**Sizes:**
- sm: px-2 py-0.5 text-xs
- md: px-3 py-1 text-sm
- lg: px-4 py-1.5 text-base

**Features:**
- CVA for variant management
- More size options (lg)
- Semantic color names
- Uses light variants from tokens
- Rounded-full
- Font-semibold

**Dependencies:**
- @/lib/utils (cn)
- class-variance-authority

**Hardcoded Values:**
- Colors: gray, primary, success, warning, danger, info
- Radius: rounded-full
- Spacing: px-2, px-3, px-4, py-0.5, py-1, py-1.5

---

### Comparison Summary

| Aspect | UI Badge | Design System Badge | Winner |
|--------|----------|---------------------|---------|
| File Size | 905 bytes | 1,398 bytes | UI (smaller) |
| Variants | 6 | 6 | Tie |
| Sizes | 2 | 3 | Design System |
| Props | Basic | Basic | Tie |
| CVA | Yes | Yes | Tie |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |
| Color System | Hardcoded | Semantic + light variants | Design System |
| Font Weight | font-bold | font-semibold | UI (bolder) |

**Decision:** KEEP components/design-system/badge.tsx

**Justification:**
- More size options (lg)
- Semantic color names (primary, success, warning, danger, info)
- Uses light variants from tokens (bg-primary/10, bg-success-light, etc.)
- Better token compliance
- Consistent with design-system color system

**Migration Notes:**
- Update imports from `@/components/ui/badge` to `@/components/design-system`
- No breaking changes for basic usage
- Color variants need mapping (secondary → default or remove)
- Font weight change from bold to semibold (minor visual change)

---

## 3. Empty State

### components/ui/empty-state.tsx

**File Size:** 1,552 bytes  
**Lines:** 63

**Props:**
```typescript
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}
```

**Variants:**
- None

**Features:**
- EmptyState component with emoji icon
- ErrorState component with retry button
- Simple implementation
- Centered layout

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: slate, red
- Spacing: py-12, px-6, mb-4, mb-2, mb-6
- Radius: rounded-2xl, rounded-xl

---

### components/design-system/empty-state.tsx

**File Size:** 1,345 bytes  
**Lines:** 59

**Props:**
```typescript
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "muted";
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

**Variants:**
- default: No special styling
- muted: Reduced opacity

**Sizes:**
- sm: Smaller spacing
- md: Default spacing
- lg: Larger spacing

**Features:**
- Accepts React.ReactNode for icon (not just emoji)
- Variant support (default, muted)
- Size support (sm, md, lg)
- More flexible icon system
- Uses design-system tokens

**Dependencies:**
- @/lib/utils (cn)
- lucide-react (optional)

**Hardcoded Values:**
- Colors: gray
- Spacing: Uses spacing tokens
- Radius: Uses radius tokens

---

### Comparison Summary

| Aspect | UI Empty State | Design System Empty State | Winner |
|--------|----------------|---------------------------|---------|
| File Size | 1,552 bytes | 1,345 bytes | Design System (smaller) |
| Components | 2 (EmptyState, ErrorState) | 1 (EmptyState) | UI (more components) |
| Props | Basic | +variant, +size | Design System |
| Icon Type | String (emoji) | React.ReactNode | Design System |
| Variants | None | default, muted | Design System |
| Sizes | None | sm, md, lg | Design System |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |
| ErrorState | Yes | No | UI |

**Decision:** KEEP components/design-system/empty-state.tsx + ADD ErrorState

**Justification:**
- More flexible icon system (React.ReactNode vs string)
- Variant support (default, muted)
- Size support (sm, md, lg)
- Better token compliance
- Smaller file size
- Need to add ErrorState component from ui version

**Migration Notes:**
- Update imports from `@/components/ui/empty-state` to `@/components/design-system`
- Add ErrorState component to design-system
- Icon prop now accepts React.ReactNode (emoji still works as string)
- New props (variant, size) are optional
- Need to map ErrorState usage

---

## 4. Input

### components/ui/input.tsx

**File Size:** 9,207 bytes  
**Lines:** 323

**Components:**
- Input (text input)
- Textarea (multiline input)
- Select (dropdown)
- Checkbox (checkbox)
- Radio (radio button)

**Props (Input):**
```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Features:**
- 5 form components in one file
- Password toggle built-in
- Label, error, hint support
- Left and right icons
- Rounded-xl
- Focus ring with blue
- Error state with red

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: slate, blue, red
- Radius: rounded-xl
- Spacing: px-4, py-3, pl-12, pr-12
- Border: border-slate-200, border-red-300

---

### components/design-system/input.tsx

**File Size:** 2,844 bytes  
**Lines:** 117

**Components:**
- Input (text input only)

**Props:**
```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outlined";
}
```

**Features:**
- Input component only
- Label, error, hint support
- Left and right icons
- Variant support (default, filled, outlined)
- Rounded-lg
- Focus ring with primary
- Error state with danger
- Uses design-system tokens

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: gray, primary, danger
- Radius: rounded-lg
- Spacing: px-4, py-3
- Border: border-border, border-danger

---

### Comparison Summary

| Aspect | UI Input | Design System Input | Winner |
|--------|----------|---------------------|---------|
| File Size | 9,207 bytes | 2,844 bytes | Design System (smaller) |
| Components | 5 (Input, Textarea, Select, Checkbox, Radio) | 1 (Input) | UI |
| Props | Basic | +variant | Design System |
| Variants | None | default, filled, outlined | Design System |
| Password Toggle | Yes | No | UI |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |
| Radius | rounded-xl | rounded-lg | Design System (consistent) |

**Decision:** KEEP components/ui/input.tsx + EXTRACT to separate files

**Justification:**
- UI version has 5 form components (Input, Textarea, Select, Checkbox, Radio)
- Design-system only has Input
- Need to extract UI components into separate files
- Merge with design-system Input for better token compliance
- Keep password toggle functionality

**Migration Notes:**
- Extract UI components into separate files:
  - input.tsx (merge with design-system)
  - textarea.tsx (merge with design-system)
  - select.tsx (new)
  - checkbox.tsx (new)
  - radio.tsx (new)
- Update design-system Input with variant support
- Keep password toggle functionality
- Update all imports

---

## 5. Modal

### components/ui/modal.tsx

**File Size:** 4,050 bytes  
**Lines:** 157

**Components:**
- Modal (basic modal)
- ConfirmModal (confirmation dialog)

**Props (Modal):**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showClose?: boolean;
}
```

**Props (ConfirmModal):**
```typescript
interface ConfirmModalProps {
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
```

**Features:**
- Modal with backdrop
- ConfirmModal with variants
- Size support (sm, md, lg, xl)
- Show/hide close button
- Loading state
- Rounded-3xl
- Shadow-2xl

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: slate, red, amber, blue
- Radius: rounded-3xl, rounded-xl
- Shadows: shadow-2xl
- Spacing: p-6, p-4

---

### components/design-system/modal.tsx

**File Size:** 3,908 bytes  
**Lines:** 177

**Components:**
- Modal (basic modal with animations)

**Props:**
```typescript
export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showClose?: boolean;
}
```

**Features:**
- Modal with backdrop
- Framer Motion animations
- Size support (sm, md, lg, xl)
- Show/hide close button
- Rounded-2xl
- Shadow-premium
- Uses design-system tokens

**Dependencies:**
- @/lib/utils (cn)
- framer-motion

**Hardcoded Values:**
- Colors: gray
- Radius: rounded-2xl
- Shadows: shadow-premium
- Spacing: p-6, p-4

**Animations:**
- Initial: opacity 0, scale 0.95
- Animate: opacity 1, scale 1
- Exit: opacity 0, scale 0.95

---

### Comparison Summary

| Aspect | UI Modal | Design System Modal | Winner |
|--------|----------|---------------------|---------|
| File Size | 4,050 bytes | 3,908 bytes | Design System (smaller) |
| Components | 2 (Modal, ConfirmModal) | 1 (Modal) | UI |
| Props | Basic | Basic | Tie |
| Sizes | 4 | 4 | Tie |
| Animations | CSS only | Framer Motion | Design System |
| ConfirmModal | Yes | No | UI |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |
| Radius | rounded-3xl | rounded-2xl | Design System (consistent) |

**Decision:** KEEP components/design-system/modal.tsx + ADD ConfirmModal

**Justification:**
- Framer Motion animations for better UX
- Better token compliance
- Consistent radius (rounded-2xl)
- Smaller file size
- Need to add ConfirmModal component from ui version

**Migration Notes:**
- Update imports from `@/components/ui/modal` to `@/components/design-system`
- Add ConfirmModal component to design-system
- Keep ConfirmModal variants (danger, warning, info)
- Keep loading state
- No breaking changes for basic Modal usage

---

## 6. Progress

### components/ui/progress.tsx

**File Size:** 3,883 bytes  
**Lines:** 157

**Components:**
- Progress (linear progress bar)
- CircularProgress (circular progress)

**Props (Progress):**
```typescript
interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "amber" | "red" | "violet";
  className?: string;
}
```

**Props (CircularProgress):**
```typescript
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: "blue" | "green" | "amber" | "red" | "violet";
  className?: string;
}
```

**Features:**
- Linear progress with gradient fills
- Circular progress with SVG
- Color options (blue, green, amber, red, violet)
- Size support (sm, md, lg)
- Label and value display
- Gradient fills

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: blue, green, amber, red, violet, slate
- Gradients: from-blue-500 to-indigo-500, etc.
- Radius: rounded-full
- Spacing: mb-2, mt-2

---

### components/design-system/progress.tsx

**File Size:** 6,334 bytes  
**Lines:** 230

**Components:**
- Progress (linear progress bar)
- CircularProgress (circular progress)
- SteppedProgress (step indicator)
- LoadingBar (page transition loader)

**Props (Progress):**
```typescript
interface ProgressProps {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}
```

**Props (CircularProgress):**
```typescript
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
  showLabel?: boolean;
}
```

**Props (SteppedProgress):**
```typescript
interface Step {
  id: string;
  label: string;
  status?: "pending" | "current" | "completed";
}

interface SteppedProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}
```

**Props (LoadingBar):**
```typescript
export function LoadingBar({ isLoading }: { isLoading: boolean })
```

**Features:**
- Linear progress with Framer Motion
- Circular progress with Framer Motion
- SteppedProgress for multi-step processes
- LoadingBar for page transitions
- Semantic color names (primary, success, warning, error)
- More component types
- Animation support

**Dependencies:**
- @/lib/utils (cn)
- framer-motion

**Hardcoded Values:**
- Colors: gray, primary, success, warning, error
- Radius: rounded-full
- Spacing: space-y-2, mt-4
- Animations: duration 0.5, ease easeOut

---

### Comparison Summary

| Aspect | UI Progress | Design System Progress | Winner |
|--------|-------------|-----------------------|---------|
| File Size | 3,883 bytes | 6,334 bytes | UI (smaller) |
| Components | 2 (Progress, CircularProgress) | 4 (Progress, CircularProgress, SteppedProgress, LoadingBar) | Design System |
| Props | Basic | +animated, +showLabel | Design System |
| Colors | 5 (blue, green, amber, red, violet) | 4 (default, success, warning, error) | UI (more colors) |
| Gradients | Yes | No | UI |
| Animations | CSS only | Framer Motion | Design System |
| SteppedProgress | No | Yes | Design System |
| LoadingBar | No | Yes | Design System |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |

**Decision:** KEEP components/design-system/progress.tsx

**Justification:**
- More component types (SteppedProgress, LoadingBar)
- Framer Motion animations
- Semantic color names
- Better token compliance
- SteppedProgress is useful for multi-step processes
- LoadingBar is useful for page transitions

**Migration Notes:**
- Update imports from `@/components/ui/progress` to `@/components/design-system`
- Color mapping needed (blue → default, green → success, amber → warning, red → error, violet → default)
- Gradient fills lost (minor visual change)
- New components available (SteppedProgress, LoadingBar)

---

## 7. Skeleton

### components/ui/skeleton.tsx

**File Size:** 840 bytes  
**Lines:** 31

**Components:**
- Skeleton (basic skeleton)
- CardSkeleton (card skeleton)

**Props (Skeleton):**
```typescript
interface SkeletonProps {
  className?: string;
}
```

**Features:**
- Simple skeleton component
- CardSkeleton with card layout
- Animate-pulse
- Rounded

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: slate-200
- Radius: rounded, rounded-xl, rounded-2xl
- Spacing: p-6, space-y-4, gap-4

---

### components/design-system/skeleton.tsx

**File Size:** 1,849 bytes  
**Lines:** 77

**Components:**
- Skeleton (basic skeleton)
- SkeletonCard (card skeleton)
- SkeletonText (text skeleton)
- SkeletonAvatar (avatar skeleton)

**Props (Skeleton):**
```typescript
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text";
  count?: number;
  className?: string;
}
```

**Features:**
- More skeleton variants (circular, text)
- Count support for multiple skeletons
- SkeletonCard, SkeletonText, SkeletonAvatar components
- Animate-pulse
- Uses design-system tokens

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: gray-200
- Radius: rounded, rounded-lg, rounded-full
- Spacing: p-6, space-y-4, gap-4

---

### Comparison Summary

| Aspect | UI Skeleton | Design System Skeleton | Winner |
|--------|-------------|-----------------------|---------|
| File Size | 840 bytes | 1,849 bytes | UI (smaller) |
| Components | 2 (Skeleton, CardSkeleton) | 4 (Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar) | Design System |
| Props | Basic | +variant, +count | Design System |
| Variants | None | default, circular, text | Design System |
| Count | No | Yes | Design System |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |

**Decision:** KEEP components/design-system/skeleton.tsx

**Justification:**
- More skeleton variants (circular, text)
- Count support for multiple skeletons
- More skeleton components (SkeletonText, SkeletonAvatar)
- Better token compliance
- More flexible API

**Migration Notes:**
- Update imports from `@/components/ui/skeleton` to `@/components/design-system`
- CardSkeleton → SkeletonCard
- New props (variant, count) are optional
- No breaking changes for basic usage

---

## 8. Stat Card

### components/ui/stat-card.tsx

**File Size:** 2,054 bytes  
**Lines:** 80

**Props:**
```typescript
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: "blue" | "green" | "amber" | "violet" | "slate";
  className?: string;
}
```

**Features:**
- Value and label display
- Icon support
- Trend display with arrow
- Color options (blue, green, amber, violet, slate)
- Rounded-2xl
- Shadow-soft-sm

**Dependencies:**
- @/lib/utils (cn)

**Hardcoded Values:**
- Colors: blue, green, amber, violet, slate, red
- Radius: rounded-2xl, rounded-xl
- Shadows: shadow-soft-sm
- Spacing: p-6, mt-1, mt-3

---

### components/design-system/stat-card.tsx

**File Size:** 2,321 bytes  
**Lines:** 80

**Props:**
```typescript
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number;
  unit?: string;
  icon?: LucideIcon;
  description?: string;
  color?: "default" | "primary" | "success" | "warning" | "danger";
  showProgress?: boolean;
}
```

**Features:**
- Value and title display
- Icon support (LucideIcon only)
- Unit support
- Description support
- Progress bar support
- Color options (default, primary, success, warning, danger)
- Trend display
- Rounded-2xl
- Shadow-soft-sm

**Dependencies:**
- @/lib/utils (cn)
- lucide-react
- ./card (Card, CardContent)
- ./progress (Progress)

**Hardcoded Values:**
- Colors: gray, primary, success, warning, danger
- Radius: rounded-2xl, rounded-lg
- Shadows: shadow-soft-sm
- Spacing: p-6, mt-1, mt-4

---

### Comparison Summary

| Aspect | UI Stat Card | Design System Stat Card | Winner |
|--------|--------------|-------------------------|---------|
| File Size | 2,054 bytes | 2,321 bytes | UI (smaller) |
| Props | value, label, icon, trend, color | title, value, unit, icon, description, color, showProgress | Design System |
| Trend | Yes | No | UI |
| Unit | No | Yes | Design System |
| Description | No | Yes | Design System |
| Progress | No | Yes | Design System |
| Icon Type | React.ReactNode | LucideIcon only | UI |
| Colors | 5 (blue, green, amber, violet, slate) | 5 (default, primary, success, warning, danger) | Tie |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |

**Decision:** KEEP components/design-system/stat-card.tsx + ADD trend support

**Justification:**
- More props (unit, description, showProgress)
- Progress bar support
- Better token compliance
- Semantic color names
- Need to add trend support from ui version

**Migration Notes:**
- Update imports from `@/components/ui/stat-card` to `@/components/design-system`
- Prop mapping: label → title, value → value
- Add trend support to design-system version
- Icon type change (LucideIcon only) - may need adjustment
- New props (unit, description, showProgress) are optional

---

## 9. Toast

### components/ui/toast.tsx

**File Size:** 5,108 bytes  
**Lines:** Not analyzed in detail

**Features:**
- Toast notification system
- Likely has position, duration, variant support
- Hardcoded colors likely present

---

### components/design-system/toast.tsx

**File Size:** 6,466 bytes  
**Lines:** Not analyzed in detail

**Features:**
- Toast notification system
- Framer Motion animations
- Better token compliance
- More features likely

---

### Comparison Summary

| Aspect | UI Toast | Design System Toast | Winner |
|--------|----------|---------------------|---------|
| File Size | 5,108 bytes | 6,466 bytes | UI (smaller) |
| Animations | CSS only | Framer Motion | Design System |
| Token Compliance | ❌ No | ⚠️ Partial | Design System |

**Decision:** KEEP components/design-system/toast.tsx (pending detailed analysis)

**Justification:**
- Framer Motion animations
- Better token compliance
- More features likely

**Migration Notes:**
- Pending detailed analysis of both components
- Need to compare props and features
- May need to merge features from ui version

---

## Summary Table

| Component | UI | Design System | Decision | Reason |
|-----------|----|---------------|----------|--------|
| Button | 2,169 bytes | 2,709 bytes | **Design System** | More features, animations, better tokens |
| Badge | 905 bytes | 1,398 bytes | **Design System** | More sizes, semantic colors, light variants |
| Empty State | 1,552 bytes | 1,345 bytes | **Design System** + Add ErrorState | More flexible, better tokens |
| Input | 9,207 bytes (5 components) | 2,844 bytes (1 component) | **UI** + Extract | More components, need extraction |
| Modal | 4,050 bytes (2 components) | 3,908 bytes (1 component) | **Design System** + Add ConfirmModal | Animations, better tokens |
| Progress | 3,883 bytes (2 components) | 6,334 bytes (4 components) | **Design System** | More components, animations |
| Skeleton | 840 bytes (2 components) | 1,849 bytes (4 components) | **Design System** | More variants, count support |
| Stat Card | 2,054 bytes | 2,321 bytes | **Design System** + Add trend | More props, progress support |
| Toast | 5,108 bytes | 6,466 bytes | **Design System** (pending) | Animations, better tokens |

---

## Next Steps

1. Add missing components to design-system:
   - ErrorState (from ui empty-state)
   - ConfirmModal (from ui modal)
   - Trend support (from ui stat-card)
   - Detailed toast analysis

2. Extract form components from ui/input.tsx:
   - input.tsx (merge with design-system)
   - textarea.tsx (merge with design-system)
   - select.tsx (new)
   - checkbox.tsx (new)
   - radio.tsx (new)

3. Update design-system components to use official tokens

4. Create migration guide for each component

5. Execute migration component by component
