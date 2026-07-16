# ARENA COMPONENT CATALOG

**Date**: 2026-07-05  
**Sprint**: UI 1 - Audit Arena  
**Status**: ✅ Completed

---

## Overview

This catalog documents all components, patterns, and design tokens found in the Arena reference implementation (`ui-sources/arena`). Arena serves as a visual reference only - no code is copied directly.

**Total Files Analyzed**: 28 HTML files  
**Total Components Identified**: 20+  
**Design Tokens**: 50+ CSS variables  

---

## Design Tokens

### Colors

#### Primary Colors
- **Background**: `#F8F6F3` (cream)
- **Card**: `#FFFFFF` (white)
- **Text Primary**: `#111827` (near black)
- **Text Secondary**: `rgba(17, 24, 39, 0.6)` (60% opacity)
- **Text Tertiary**: `rgba(17, 24, 39, 0.4)` (40% opacity)

#### Accent Colors
- **Accent**: `#0F766E` (emerald green)
- **Accent Hover**: `#0D6558` (darker emerald)
- **Accent Light**: `rgba(15, 118, 110, 0.08)` (8% opacity)
- **Accent Lighter**: `rgba(15, 118, 110, 0.04)` (4% opacity)

#### Secondary Colors
- **Secondary**: `#C89B3C` (gold)
- **Secondary Hover**: `#B8892F` (darker gold)
- **Secondary Light**: `rgba(200, 155, 60, 0.08)` (8% opacity)
- **Secondary Lighter**: `rgba(200, 155, 60, 0.04)` (4% opacity)

#### Semantic Colors
- **Success**: `#10B981` (green)
- **Success Light**: `rgba(16, 185, 129, 0.08)`
- **Warning**: `#F59E0B` (orange)
- **Warning Light**: `rgba(245, 158, 11, 0.08)`
- **Error**: `#EF4444` (red)
- **Error Light**: `rgba(239, 68, 68, 0.08)`

#### Border Colors
- **Border**: `rgba(17, 24, 39, 0.08)` (8% opacity)
- **Border Hover**: `rgba(17, 24, 39, 0.12)` (12% opacity)

---

### Spacing System (8px Grid)

- **space-1**: 4px
- **space-2**: 8px
- **space-3**: 12px
- **space-4**: 16px
- **space-5**: 20px
- **space-6**: 24px
- **space-7**: 28px
- **space-8**: 32px
- **space-10**: 40px
- **space-12**: 48px
- **space-16**: 64px
- **space-20**: 80px
- **space-24**: 96px

---

### Shadows

- **shadow-xs**: `0 1px 2px rgba(0, 0, 0, 0.04)`
- **shadow-sm**: `0 2px 4px rgba(0, 0, 0, 0.04)`
- **shadow-md**: `0 4px 12px rgba(0, 0, 0, 0.06)`
- **shadow-lg**: `0 8px 24px rgba(0, 0, 0, 0.08)`
- **shadow-xl**: `0 20px 40px rgba(0, 0, 0, 0.12)`
- **shadow-focus**: `0 0 0 4px rgba(15, 118, 110, 0.1)`

---

### Border Radius

- **radius-xs**: 4px
- **radius-sm**: 8px
- **radius-md**: 12px
- **radius-lg**: 16px
- **radius-xl**: 24px
- **radius-full**: 9999px

---

### Typography

#### Font Families
- **Sans-serif**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Serif**: `'Playfair Display', Georgia, serif`

#### Font Sizes (Responsive with clamp)
- **h1**: `clamp(32px, 5vw, 56px)`
- **h2**: `clamp(28px, 4vw, 36px)`
- **h3**: `clamp(20px, 3vw, 24px)`
- **h4**: 20px
- **h5**: 18px
- **h6**: 16px
- **body**: 14px (base), 15px (inputs), 18px (hero text)

#### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

#### Line Heights
- **Headings**: 1.2
- **Body**: 1.6-1.7
- **Compact**: 1.4

#### Letter Spacing
- **Headings**: -0.02em
- **Uppercase**: 0.5px

---

### Transitions

- **transition-fast**: `0.15s cubic-bezier(0.4, 0, 0.2, 1)`
- **transition-base**: `0.3s cubic-bezier(0.16, 1, 0.3, 1)`
- **transition-slow**: `0.5s cubic-bezier(0.16, 1, 0.3, 1)`

---

## Components

### 1. Button

**Variants**:
- **btn-primary**: Accent background, white text, hover with elevation
- **btn-secondary**: Background color, border, hover with color change
- **btn-ghost**: Transparent, hover with gray background
- **btn-danger**: Error light background, error text

**Sizes**:
- Default: `padding: var(--space-3) var(--space-6)` (12px 24px)
- Icon: 16px × 16px

**States**:
- **Hover**: `transform: translateY(-2px)`, shadow elevation
- **Active**: `transform: translateY(0)`
- **Disabled**: `opacity: 0.5`, `cursor: not-allowed`

**Features**:
- SVG icon support (16px × 16px)
- Flex layout with gap
- White-space nowrap
- Relative positioning for overflow effects

---

### 2. Card

**Variants**:
- **card**: Standard with shadow-md
- **card-elevated**: Permanent shadow-xl

**Styling**:
- Background: `var(--card)` (white)
- Border radius: `var(--radius-lg)` (16px)
- Padding: `var(--space-8)` (32px)
- Shadow: `var(--shadow-md)`

**States**:
- **Hover**: `transform: translateY(-4px)`, `box-shadow: var(--shadow-xl)`
- **Transition**: `transition-base`

---

### 3. Input

**Styling**:
- Width: 100%
- Padding: `var(--space-3) var(--space-4)` (12px 16px)
- Font size: 15px
- Font weight: 500
- Background: `var(--bg)` (cream)
- Border: `1.5px solid var(--border)`
- Border radius: `var(--radius-md)` (12px)

**States**:
- **Focus**: Border color accent, shadow-focus ring
- **Error**: Border color error
- **Transition**: `transition-base`

**Features**:
- Form label support
- Error message support
- Helper text support

---

### 4. Badge

**Variants**:
- **badge-success**: Success light background, success text
- **badge-warning**: Warning light background, warning text
- **badge-error**: Error light background, error text
- **badge-accent**: Accent light background, accent text

**Styling**:
- Display: inline-flex
- Padding: `var(--space-1) var(--space-3)` (4px 12px)
- Border radius: `var(--radius-full)`
- Font size: 12px
- Font weight: 600
- Gap: `var(--space-2)` (8px)

---

### 5. Table

**Structure**:
- **table-wrapper**: Container with shadow-md, border-radius-lg
- **table**: Width 100%, border-collapse collapse
- **thead**: Background var(--bg)
- **tbody**: Rows with border-bottom

**Styling**:
- **th**: Padding `var(--space-4) var(--space-8)`, uppercase, letter-spacing 0.5px
- **td**: Padding `var(--space-5) var(--space-8)`, font-size 14px
- **tr hover**: Background rgba(17, 24, 39, 0.02)
- **Transition**: `transition-fast`

---

### 6. Form Elements

**Form Group**:
- Margin bottom: `var(--space-5)` (20px)

**Form Label**:
- Display: block
- Font size: 14px
- Font weight: 600
- Margin bottom: `var(--space-2)` (8px)
- Color: var(--text)

**Form Error**:
- Font size: 13px
- Color: var(--error)
- Margin top: `var(--space-2)` (8px)

---

### 7. Navigation

**Navbar**:
- Position: fixed, top 0, left 0, right 0
- Z-index: 1000
- Background: rgba(248, 246, 243, 0.8)
- Backdrop-filter: blur(12px)
- Border bottom: 1px solid var(--border)
- Transition: `transition-base`

**Navbar Container**:
- Max-width: 1280px
- Padding: 16px 24px
- Display: flex, align-items center, justify-between

**Logo**:
- Font: Playfair Display
- Font size: 24px
- Font weight: 700
- Letter-spacing: -0.02em

**Nav Menu**:
- Display: flex
- Gap: 32px
- Font size: 15px
- Font weight: 500

**Nav Actions**:
- Display: flex
- Gap: 16px
- Align-items center

---

### 8. Hero Section

**Structure**:
- **hero**: Padding 140px 0 80px
- **hero-grid**: Grid 2 columns, gap 80px, align-items center
- **hero-content**: Left column with text
- **hero-image**: Right column with image

**Styling**:
- Background: linear-gradient(180deg, var(--bg) 0%, rgba(248,246,243,0) 100%)
- h1: font-size 56px, line-height 1.1, margin-bottom 24px
- p: font-size 18px, line-height 1.7, max-width 520px
- hero-buttons: flex, gap 16px, margin-bottom 48px
- trust-indicators: flex, gap 32px, padding-top 32px, border-top

---

### 9. Loading States

**Skeleton**:
- Background: linear-gradient(90deg, var(--border) 0%, var(--border-hover) 50%, var(--border) 100%)
- Background-size: 200% 100%
- Animation: skeleton-loading 1.5s ease-in-out infinite
- Border-radius: var(--radius-sm)

**Animation**:
```css
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Variants**:
- **skeleton-text**: Height 16px, margin-bottom 8px
- **skeleton-title**: Height 32px, width 60%, margin-bottom 16px
- **skeleton-card**: Height 200px

---

### 10. Empty States

**Structure**:
- **empty-state**: Text-align center, padding var(--space-16) var(--space-8)
- **empty-state-icon**: Width 80px, height 80px, circular, accent-light background
- Title: Font-size 24px, margin-bottom var(--space-3)
- Description: Font-size 15px, margin-bottom var(--space-6)

**Features**:
- Icon: 40px × 40px, accent color
- Action button support
- Centered layout

---

### 11. Error States

**Structure**:
- **error-state**: Text-align center, padding var(--space-16) var(--space-8)
- **error-state-icon**: Width 80px, height 80px, circular, error-light background
- Icon: 40px × 40px, error color

**Features**:
- Clear error messages
- Actionable recovery options
- Centered layout

---

### 12. Success States

**Structure**:
- **success-state**: Text-align center, padding var(--space-16) var(--space-8)
- **success-state-icon**: Width 80px, height 80px, circular, success-light background
- Icon: 40px × 40px, success color

**Features**:
- Clear success messages
- Confirmation visual
- Centered layout

---

## Animations

### Entry Animations

**fadeInUp**:
- From: opacity 0, translateY 20px
- To: opacity 1, translateY 0
- Duration: 0.8s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

**fadeIn**:
- From: opacity 0
- To: opacity 1
- Duration: 0.8s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

**slideInRight**:
- From: opacity 0, translateX 20px
- To: opacity 1, translateX 0
- Duration: 0.8s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

### Stagger Animations

- **stagger-1**: animation-delay 0.1s
- **stagger-2**: animation-delay 0.2s
- **stagger-3**: animation-delay 0.3s
- **stagger-4**: animation-delay 0.4s
- **stagger-5**: animation-delay 0.5s

---

## Layout Patterns

### Container

**container**:
- Max-width: 1200px (or 1280px in some pages)
- Margin: 0 auto
- Padding: 0 var(--space-6) (24px)

### Page Wrapper

**page-wrapper**:
- Min-height: 100vh
- Padding: var(--space-12) 0 (48px 0)

### Grid Layouts

**hero-grid**: 2 columns, gap 80px, align-items center
**dashboard-grid**: 3 columns, gap 24px
**card-grid**: Responsive 1-2-3 columns

---

## Responsive Breakpoints

### Desktop (> 1024px)
- Container padding: var(--space-6) (24px)
- Page wrapper padding: var(--space-12) (48px)
- Grid layouts: 2-3 columns
- Full navigation

### Tablet (≤ 1024px)
- Container padding: var(--space-5) (20px)
- Page wrapper padding: var(--space-10) (40px)
- Grid layouts: 2 columns
- Adapted navigation

### Mobile (≤ 768px)
- Container padding: var(--space-4) (16px)
- Page wrapper padding: var(--space-8) (32px)
- Card padding: var(--space-6) (24px)
- Button width: 100%
- Grid layouts: 1 column
- Hamburger navigation

---

## Accessibility Features

### Focus Management

- **focus-visible**: Outline 2px solid var(--accent), outline-offset 2px
- Focus ring on all interactive elements
- Logical tab order

### Screen Reader Support

- **sr-only**: Position absolute, width 1px, height 1px, overflow hidden, clip
- Semantic HTML structure
- ARIA attributes on interactive elements

### Color Contrast

- Text: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- WCAG AA compliant

---

## Pages Identified

### Marketing Pages (3)
1. **index.html** - Homepage with hero, features, testimonials
2. **signup.html** - Signup with split layout (image + form)
3. **connexion/index.html** - Login page

### Application Pages (11)
4. **dashboard/index.html** - Main dashboard
5. **dashboard/cv/index.html** - CV management
6. **simulations/index.html** - Simulations list
7. **debrief/index.html** - Performance debrief
8. **progression/index.html** - Progress tracking
9. **historique/index.html** - Activity history
10. **abonnement/index.html** - Subscription management
11. **profil/index.html** - User profile
12. **parametres.html** - Settings
13. **notifications.html** - Notifications center
14. **facturation.html** - Billing history
15. **credits.html** - Credits management

### Support Pages (1)
16. **aide.html** - Help center

### History Pages (3)
17. **historique-simulations.html** - Simulations history
18. **historique-ats.html** - ATS analysis history
19. **historique-cv.html** - CV version history

### Progression Pages (1)
20. **plan-progression.html** - Progress plan

---

## Design Patterns

### Split Layout (Signup/Login)
- Left panel: 45% width, image with overlay
- Right panel: 55% width, form content
- Quote on left panel with author attribution
- Gradient overlay on image

### Dashboard Layout
- Sidebar navigation (260px width)
- Main content area
- Cards grid layout
- Stats widgets
- Timeline widgets

### Card Grid
- Responsive 1-2-3 columns
- Consistent card styling
- Hover elevation effect
- Gap: 24px

### Timeline
- Vertical line with dots
- Date/time labels
- Content cards
- Status indicators

---

## Micro-interactions

### Hover Effects
- **Cards**: translateY(-4px) + shadow-xl
- **Buttons**: translateY(-2px) + shadow/border change
- **Links**: Color change smooth
- **List items**: translateX(8px)

### Focus States
- Outline 2px accent
- Offset 2px
- Transition smooth

### Transitions
- All interactions: cubic-bezier(0.16, 1, 0.3, 1)
- Duration: 0.3s for base
- Natural and professional feel

---

## Typography Patterns

### Headings
- Font: Playfair Display
- Weight: 600
- Letter-spacing: -0.02em
- Line-height: 1.2

### Body Text
- Font: Inter
- Line-height: 1.6-1.7
- Color: var(--text-secondary)

### Labels
- Font-size: 14px
- Font-weight: 600
- Color: var(--text)

### Helper Text
- Font-size: 13px
- Color: var(--text-secondary)

---

## Icon Usage

- Size: 16px (buttons), 40px (states), 80px (large icons)
- SVG format
- Consistent stroke-width
- Color: inherit or semantic colors

---

## Validation

✅ **No code modified** - Arena is reference only  
✅ **All components documented** - 20+ components  
✅ **Design tokens cataloged** - 50+ CSS variables  
✅ **Patterns identified** - Layout, animation, interaction  
✅ **Pages mapped** - 28 HTML files analyzed  

---

## Next Steps

This catalog serves as the foundation for Sprint UI 2: Design System creation. All components and patterns documented here will be re-implemented in the existing Trajectoire architecture using:

- Next.js 15
- React 19
- TypeScript Strict
- TailwindCSS
- Framer Motion
- Radix UI
- Lucide React

**No Arena code will be copied directly.** All implementations will follow the existing DDD architecture and use the established query/presenter patterns.

---

**Catalog completed on 2026-07-05**  
**Sprint UI 1**: ✅ Completed  
**Arena Analysis**: Complete  
**Component Catalog**: Complete  
**Design Tokens**: Documented  
**Next Sprint**: UI 2 - Design System
