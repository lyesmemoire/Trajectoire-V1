# DESIGN SYSTEM FOUNDATION

**Date**: 2026-07-05  
**Version**: 1.0  
**Status**: ✅ Completed

---

## Overview

This document defines the official Trajectoire Design System foundation. All design tokens, conventions, and best practices are documented here to ensure consistency across the application.

**Design Philosophy**: Premium SaaS experience inspired by Stripe, Linear, Vercel, and Notion.  
**Grid System**: 8px grid  
**Typography**: Inter + Playfair Display  
**Color Palette**: Emerald primary with gold secondary  

---

## Color Palette

### Background & Surface

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#F8F6F3` | Page background, cream tone |
| `surface` | `#FFFFFF` | Card backgrounds, elevated surfaces |

### Primary Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#0F766E` | Primary actions, CTAs, links |
| `primary-hover` | `#115E59` | Primary hover state |
| `primary-light` | `rgba(15, 118, 110, 0.08)` | Primary backgrounds, badges |
| `primary-lighter` | `rgba(15, 118, 110, 0.04)` | Subtle primary accents |

### Secondary Colors

| Token | Value | Usage |
|-------|-------|-------|
| `secondary` | `#C89B3C` | Secondary actions, accents |
| `secondary-hover` | `#B8860B` | Secondary hover state |
| `secondary-light` | `rgba(200, 155, 60, 0.08)` | Secondary backgrounds |
| `secondary-lighter` | `rgba(200, 155, 60, 0.04)` | Subtle secondary accents |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#111827` | Primary text, headings |
| `text-secondary` | `#6B7280` | Secondary text, descriptions |
| `text-tertiary` | `rgba(17, 24, 39, 0.4)` | Tertiary text, placeholders |
| `text-inverse` | `#FFFFFF` | Text on dark backgrounds |

### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `border` | `#E5E7EB` | Default borders |
| `border-hover` | `rgba(17, 24, 39, 0.12)` | Hover borders |
| `border-focus` | `#0F766E` | Focus borders |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#16A34A` | Success states, confirmations |
| `success-light` | `rgba(22, 163, 74, 0.08)` | Success backgrounds |
| `warning` | `#F59E0B` | Warning states, alerts |
| `warning-light` | `rgba(245, 158, 11, 0.08)` | Warning backgrounds |
| `danger` | `#DC2626` | Error states, destructive actions |
| `danger-light` | `rgba(220, 38, 38, 0.08)` | Error backgrounds |
| `info` | `#2563EB` | Information states |
| `info-light` | `rgba(37, 99, 235, 0.08)` | Info backgrounds |

---

## Typography

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `font-sans` | Inter, system-ui, sans-serif | Body text, UI elements |
| `font-serif` | Playfair Display, Georgia, serif | Headings, display text |
| `font-mono` | JetBrains Mono, monospace | Code, numbers, technical text |

### Font Sizes

| Token | Value | Line Height | Letter Spacing | Usage |
|-------|-------|-------------|---------------|-------|
| `display-xl` | clamp(48px, 6vw, 72px) | 1.1 | -0.02em | Hero headings |
| `display-l` | clamp(40px, 5vw, 56px) | 1.1 | -0.02em | Large headings |
| `display-m` | clamp(32px, 4vw, 40px) | 1.2 | -0.02em | Section headings |
| `heading-1` | clamp(28px, 4vw, 36px) | 1.2 | -0.02em | Page headings |
| `heading-2` | clamp(24px, 3vw, 30px) | 1.2 | -0.02em | Subheadings |
| `heading-3` | clamp(20px, 3vw, 24px) | 1.3 | -0.01em | Card headings |
| `heading-4` | 20px | 1.4 | -0.01em | Small headings |
| `body-large` | 18px | 1.7 | 0 | Large body text |
| `body` | 16px | 1.6 | 0 | Default body text |
| `body-small` | 14px | 1.5 | 0 | Small body text |
| `caption` | 12px | 1.4 | 0.02em | Captions, labels |
| `button` | 15px | 1.4 | 0 | Button text |
| `label` | 14px | 1.4 | 0 | Form labels |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-regular` | 400 | Regular text |
| `font-medium` | 500 | Emphasized text |
| `font-semibold` | 600 | Headings, buttons |
| `font-bold` | 700 | Strong emphasis |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.1 | Headings |
| `leading-normal` | 1.5 | Body text |
| `leading-relaxed` | 1.7 | Long text |
| `leading-loose` | 2 | Spaced text |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `tracking-tighter` | -0.03em | Tight headings |
| `tracking-tight` | -0.02em | Headings |
| `tracking-normal` | 0 | Body text |
| `tracking-wide` | 0.02em | Uppercase text |
| `tracking-wider` | 0.05em | Spaced text |

---

## Spacing System

### 8px Grid Scale

| Token | Value | Rem | Usage |
|-------|-------|-----|-------|
| `spacing-0` | 0px | 0 | No spacing |
| `spacing-1` | 4px | 0.25rem | Micro spacing |
| `spacing-2` | 8px | 0.5rem | Small spacing |
| `spacing-3` | 12px | 0.75rem | Medium-small spacing |
| `spacing-4` | 16px | 1rem | Medium spacing |
| `spacing-5` | 20px | 1.25rem | Medium-large spacing |
| `spacing-6` | 24px | 1.5rem | Large spacing |
| `spacing-7` | 28px | 1.75rem | Extra-large spacing |
| `spacing-8` | 32px | 2rem | Section spacing |
| `spacing-10` | 40px | 2.5rem | Component spacing |
| `spacing-12` | 48px | 3rem | Section padding |
| `spacing-16` | 64px | 4rem | Large section padding |
| `spacing-20` | 80px | 5rem | Hero spacing |
| `spacing-24` | 96px | 6rem | Extra hero spacing |

### Official Spacing Scale

The official spacing scale for Trajectoire is:
`[4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]`

### Spacing Conventions

- **Card padding**: `spacing-6` (24px) or `spacing-8` (32px)
- **Button padding**: `spacing-3` (12px) horizontal, `spacing-6` (24px) vertical
- **Input padding**: `spacing-3` (12px) horizontal, `spacing-4` (16px) vertical
- **Section spacing**: `spacing-12` (48px) between sections
- **Container padding**: `spacing-6` (24px) on desktop, `spacing-4` (16px) on mobile

---

## Border Radius

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0 | No radius |
| `radius-xs` | 4px | Small elements, badges |
| `radius-sm` | 8px | Small cards, buttons |
| `radius-md` | 12px | Default cards, inputs |
| `radius-lg` | 16px | Large cards, modals |
| `radius-xl` | 20px | Extra large cards |
| `radius-2xl` | 24px | Hero cards, large modals |
| `radius-3xl` | 32px | Special elements |
| `radius-full` | 9999px | Circular elements |

### Official Radius Scale

The official radius scale for Trajectoire is:
`[4, 8, 12, 16, 20, 24]`

### Radius Conventions

- **Buttons**: `radius-md` (12px)
- **Cards**: `radius-lg` (16px)
- **Inputs**: `radius-md` (12px)
- **Badges**: `radius-full` (circular)
- **Avatars**: `radius-full` (circular)
- **Modals**: `radius-xl` (20px)

---

## Shadows

### Shadow Scale

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-xs` | 0 1px 2px rgba(0, 0, 0, 0.04) | Subtle elevation |
| `shadow-sm` | 0 2px 4px rgba(0, 0, 0, 0.04) | Small elevation |
| `shadow-md` | 0 4px 12px rgba(0, 0, 0, 0.06) | Medium elevation |
| `shadow-lg` | 0 8px 24px rgba(0, 0, 0, 0.08) | Large elevation |
| `shadow-xl` | 0 20px 40px rgba(0, 0, 0, 0.12) | Extra elevation |
| `shadow-2xl` | 0 32px 64px rgba(0, 0, 0, 0.16) | Maximum elevation |
| `shadow-focus` | 0 0 0 4px rgba(15, 118, 110, 0.1) | Focus ring |
| `shadow-focusRing` | 0 0 0 3px rgba(15, 118, 110, 0.1) | Focus ring (smaller) |
| `shadow-inner` | inset 0 2px 4px rgba(0, 0, 0, 0.04) | Inner shadow |
| `shadow-none` | none | No shadow |

### Colored Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-primary` | 0 8px 24px rgba(15, 118, 110, 0.15) | Primary elements |
| `shadow-primary-hover` | 0 12px 32px rgba(15, 118, 110, 0.2) | Primary hover |
| `shadow-secondary` | 0 8px 24px rgba(200, 155, 60, 0.15) | Secondary elements |
| `shadow-secondary-hover` | 0 12px 32px rgba(200, 155, 60, 0.2) | Secondary hover |
| `shadow-success` | 0 8px 24px rgba(22, 163, 74, 0.15) | Success elements |
| `shadow-warning` | 0 8px 24px rgba(245, 158, 11, 0.15) | Warning elements |
| `shadow-danger` | 0 8px 24px rgba(220, 38, 38, 0.15) | Danger elements |
| `shadow-info` | 0 8px 24px rgba(37, 99, 235, 0.15) | Info elements |

### Shadow Conventions

- **Cards**: `shadow-md` (default), `shadow-lg` (hover)
- **Buttons**: `shadow-sm` (default), `shadow-md` (hover)
- **Modals**: `shadow-xl`
- **Dropdowns**: `shadow-lg`
- **Tooltips**: `shadow-md`

---

## Motion & Animation

### Transition Durations

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 150ms | Micro interactions |
| `duration-base` | 300ms | Default transitions |
| `duration-slow` | 500ms | Complex animations |
| `duration-slower` | 700ms | Page transitions |

### Transition Easing

| Token | Value | Usage |
|-------|-------|-------|
| `easing-default` | cubic-bezier(0.4, 0, 0.2, 1) | Default easing |
| `easing-in` | cubic-bezier(0.4, 0, 1, 1) | Enter animations |
| `easing-out` | cubic-bezier(0, 0, 0.2, 1) | Exit animations |
| `easing-bounce` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Bouncy animations |
| `easing-smooth` | cubic-bezier(0.16, 1, 0.3, 1) | Smooth animations |

### Animation Presets

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `fade` | 0.3s | ease-out | Simple fade |
| `fade-up` | 0.5s | ease-out | Fade from bottom |
| `fade-down` | 0.5s | ease-out | Fade from top |
| `fade-left` | 0.5s | ease-out | Fade from left |
| `fade-right` | 0.5s | ease-out | Fade from right |
| `scale` | 0.3s | ease-out | Scale animation |
| `zoom` | 0.5s | ease-out | Zoom animation |
| `drawer` | 0.3s | ease-out | Drawer slide |
| `modal` | 0.3s | ease-out | Modal appear |
| `toast` | 0.3s | ease-out | Toast appear |
| `skeleton` | 1.5s | ease-in-out | Loading skeleton |
| `pulse` | 2s | ease-in-out | Pulse effect |
| `spin` | 1s | linear | Spinner |

### Stagger Delays

| Token | Value | Usage |
|-------|-------|-------|
| `stagger-1` | 100ms | First element |
| `stagger-2` | 200ms | Second element |
| `stagger-3` | 300ms | Third element |
| `stagger-4` | 400ms | Fourth element |
| `stagger-5` | 500ms | Fifth element |

### Motion Conventions

- **Hover**: `duration-fast` (150ms)
- **Focus**: `duration-base` (300ms)
- **Modal enter**: `duration-base` (300ms)
- **Page transition**: `duration-slow` (500ms)
- **Loading**: `skeleton` (1.5s infinite)

---

## Breakpoints

### Responsive Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 375px | Extra small mobile |
| `sm` | 640px | Small mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large desktop |

### Container Max Widths

| Token | Value | Usage |
|-------|-------|-------|
| `container-xs` | 100% | Full width |
| `container-sm` | 640px | Small container |
| `container-md` | 768px | Medium container |
| `container-lg` | 1024px | Desktop container |
| `container-xl` | 1280px | Large container |
| `container-2xl` | 1536px | Extra large container |
| `container-full` | 100% | Full width |

### Responsive Conventions

- **Mobile**: < 768px (xs, sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg, xl, 2xl)
- **Container max**: 1280px (xl)

---

## Z-Index Scale

### Layering Hierarchy

| Token | Value | Usage |
|-------|-------|-------|
| `z-dropdown` | 1000 | Dropdowns |
| `z-sticky` | 1020 | Sticky headers |
| `z-fixed` | 1030 | Fixed elements |
| `z-modalBackdrop` | 1040 | Modal backdrop |
| `z-modal` | 1050 | Modal content |
| `z-popover` | 1060 | Popovers |
| `z-tooltip` | 1070 | Tooltips |
| `z-notification` | 1080 | Notifications |
| `z-overlay` | 1090 | Full-screen overlays |
| `z-skipLink` | 9999 | Skip links |

### Z-Index Conventions

- Always use predefined z-index values
- Never use arbitrary z-index values
- Respect the layering hierarchy
- Use `z-index` tokens, not raw numbers

---

## Naming Conventions

### Token Naming

- **Colors**: `category-variant` (e.g., `primary-hover`)
- **Spacing**: `spacing-{number}` (e.g., `spacing-4`)
- **Radius**: `radius-{size}` (e.g., `radius-md`)
- **Shadows**: `shadow-{size}` (e.g., `shadow-lg`)
- **Animations**: `{action}-{direction}` (e.g., `fade-up`)

### Component Naming

- **PascalCase** for React components: `Button`, `Card`, `Input`
- **kebab-case** for CSS classes: `btn-primary`, `card-elevated`
- **camelCase** for props: `variant`, `size`, `disabled`

### File Naming

- **PascalCase** for component files: `Button.tsx`, `Card.tsx`
- **kebab-case** for utility files: `colors.ts`, `spacing.ts`
- **SCREAMING_SNAKE_CASE** for constants: `PRIMARY_COLOR`, `DEFAULT_SPACING`

---

## Best Practices

### Color Usage

1. **Use semantic colors** for states (success, warning, danger, info)
2. **Use primary colors** for CTAs and main actions
3. **Use secondary colors** for accents and secondary actions
4. **Use text colors** with appropriate contrast ratios
5. **Avoid hardcoding colors** - use tokens instead

### Typography Usage

1. **Use serif fonts** for headings and display text
2. **Use sans-serif fonts** for body text and UI elements
3. **Use mono fonts** for code and technical text
4. **Maintain hierarchy** with appropriate font sizes
5. **Use responsive font sizes** with clamp()

### Spacing Usage

1. **Follow the 8px grid** for all spacing
2. **Use consistent padding** within components
3. **Use consistent margins** between components
4. **Maintain visual rhythm** with spacing scale
5. **Avoid arbitrary spacing values**

### Shadow Usage

1. **Use shadows for elevation** and depth
2. **Match shadow to element importance**
3. **Use colored shadows** for semantic meaning
4. **Avoid overusing shadows** - keep it subtle
5. **Use focus shadows** for accessibility

### Animation Usage

1. **Keep animations short** (150-500ms)
2. **Use appropriate easing** for the context
3. **Respect user preferences** (prefers-reduced-motion)
4. **Avoid jarring animations**
5. **Use stagger for lists** and sequential reveals

### Responsive Design

1. **Mobile-first approach**
2. **Use appropriate breakpoints**
3. **Test on all devices**
4. **Ensure touch targets** are at least 44px
5. **Optimize images** for different sizes

---

## Usage Examples

### Colors

```tsx
// Using color tokens
import { colors } from '@/components/design-system/tokens';

<div style={{ backgroundColor: colors.background }}>
  <h1 style={{ color: colors.text.primary }}>Title</h1>
</div>

// Using Tailwind classes
<div className="bg-background text-text-primary">
  <h1>Title</h1>
</div>
```

### Typography

```tsx
// Using typography tokens
import { typography } from '@/components/design-system/tokens';

<h1 style={{ 
  fontFamily: typography.fontFamily.serif,
  fontSize: typography.fontSize.heading1,
  fontWeight: typography.fontWeight.semibold
}}>
  Heading
</h1>

// Using Tailwind classes
<h1 className="font-serif text-heading1 font-semibold">
  Heading
</h1>
```

### Spacing

```tsx
// Using spacing tokens
import { spacing } from '@/components/design-system/tokens';

<div style={{ padding: spacing[6], margin: spacing[4] }}>
  Content
</div>

// Using Tailwind classes
<div className="p-6 m-4">
  Content
</div>
```

### Animations

```tsx
// Using animation classes
<div className="animate-fade-up">
  Content
</div>

// With stagger
<div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
  Content
</div>
```

---

## Token Files Structure

```
components/design-system/tokens/
├── colors.ts          # Color tokens
├── typography.ts      # Typography tokens
├── spacing.ts        # Spacing tokens
├── radius.ts          # Border radius tokens
├── shadows.ts        # Shadow tokens
├── motion.ts          # Animation tokens
├── breakpoints.ts    # Responsive breakpoints
├── z-index.ts        # Z-index scale
├── tokens.ts         # Main export
└── index.ts          # Barrel export
```

---

## Tailwind Integration

The official tokens are integrated into `tailwind.config.ts`:

- **Colors**: Mapped to Tailwind color palette
- **Spacing**: Mapped to Tailwind spacing scale
- **Radius**: Mapped to Tailwind borderRadius
- **Shadows**: Mapped to Tailwind boxShadow
- **Animations**: Mapped to Tailwind animations
- **Typography**: Mapped to Tailwind fontFamily

### Using Tokens in Tailwind

```tsx
// Colors
className="bg-background text-text-primary border-border"

// Spacing
className="p-6 m-4 gap-8"

// Radius
className="rounded-lg rounded-xl"

// Shadows
className="shadow-md shadow-lg"

// Animations
className="animate-fade-up animate-scale"
```

---

## Accessibility

### Color Contrast

All color combinations meet WCAG AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Focus States

All interactive elements have visible focus states:
- **Focus ring**: 2px solid primary color
- **Focus offset**: 2px for better visibility
- **Focus shadow**: Colored shadow for emphasis

### Reduced Motion

Respect `prefers-reduced-motion` for users who prefer less animation:
- Disable or simplify animations
- Use instant transitions
- Maintain functionality without motion

---

## Migration Guide

### From Old Tokens

If migrating from old tokens:

1. **Replace old color values** with new color tokens
2. **Update spacing** to use 8px grid
3. **Update shadows** to use new shadow scale
4. **Update animations** to use new animation presets
5. **Test thoroughly** after migration

### Legacy Support

Legacy tokens are kept for backward compatibility:
- Old color names still work
- Old shadow names still work
- Old animation names still work
- Gradual migration is possible

---

## Validation

### Build Validation

Run `pnpm build` to ensure:
- All tokens are properly exported
- Tailwind config is valid
- No TypeScript errors
- No build errors

### Typecheck Validation

Run `pnpm typecheck` to ensure:
- All token types are correct
- No type errors
- Proper TypeScript integration

### Lint Validation

Run `pnpm lint` to ensure:
- Code follows conventions
- No linting errors
- Consistent formatting

---

## Maintenance

### Adding New Tokens

When adding new tokens:

1. **Add to appropriate token file** (colors.ts, spacing.ts, etc.)
2. **Update Tailwind config** if needed
3. **Update this documentation**
4. **Run validation** (build, typecheck, lint)
5. **Test in components**

### Updating Tokens

When updating existing tokens:

1. **Consider backward compatibility**
2. **Update all usages**
3. **Update Tailwind config**
4. **Update documentation**
5. **Run validation**
6. **Test thoroughly**

---

## Summary

The Trajectoire Design System foundation provides:

✅ **Official color palette** with semantic colors  
✅ **Typography system** with responsive font sizes  
✅ **8px grid spacing** for consistent layouts  
✅ **Border radius scale** for rounded elements  
✅ **Shadow system** for elevation and depth  
✅ **Animation presets** for smooth interactions  
✅ **Responsive breakpoints** for all devices  
✅ **Z-index scale** for proper layering  
✅ **Naming conventions** for consistency  
✅ **Best practices** for quality code  

**Status**: ✅ Foundation Complete  
**Next Step**: Sprint UI 3 - Design System Merge  

---

**Foundation completed on 2026-07-05**  
**Design System Foundation**: Complete  
**Token Files**: 10 files created  
**Tailwind Config**: Updated  
**Documentation**: Complete  
**Validation**: Pending
