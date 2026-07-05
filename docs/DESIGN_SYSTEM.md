# Design System Documentation

**Version:** 1.0.0  
**Date:** 2026-07-04  
**Style:** Premium, Minimalist, Cabinet de Conseil

---

## Overview

The Trajectoire Design System is a premium, minimalist design system inspired by Apple, Linear, Notion, Stripe, and Vercel. It focuses on clean typography, subtle animations, and a refined color palette suitable for a high-end career consulting platform.

### Design Principles

- **Minimalist:** Clean, uncluttered interfaces with purposeful white space
- **Premium:** High-quality typography, subtle shadows, and refined interactions
- **Accessible:** WCAG AA compliant color contrasts and keyboard navigation
- **Responsive:** Mobile-first approach with fluid breakpoints
- **Consistent:** Unified design language across all components

---

## Color Palette

### Background Colors

```css
--background: #F8F6F3  /* Main background - warm off-white */
--surface: #FFFFFF     /* Card backgrounds - pure white */
--elevated: #FFFFFF    /* Elevated elements - pure white */
```

### Text Colors

```css
--text: #111827           /* Primary text - dark gray */
--text-secondary: #6B7280 /* Secondary text - medium gray */
--text-muted: #9CA3AF     /* Muted text - light gray */
```

### Brand Colors

```css
--primary: #1E40AF        /* Primary blue - deep blue */
--primary-light: #3B82F6   /* Light blue - bright blue */
--primary-dark: #1E3A8A    /* Dark blue - very dark blue */
```

### Semantic Colors

```css
--success: #10B981  /* Success - emerald green */
--warning: #F59E0B  /* Warning - amber */
--error: #DC2626    /* Error - red */
```

### Usage Guidelines

- **Background:** Use `bg-background` for main page backgrounds
- **Surface:** Use `bg-surface` for cards and elevated elements
- **Text:** Use `text-text` for primary content
- **Text Secondary:** Use `text-text-secondary` for supporting text
- **Primary:** Use `text-primary` or `bg-primary` for CTAs and highlights
- **Success:** Use for positive feedback and validation
- **Warning:** Use for cautionary messages
- **Error:** Use for errors and destructive actions

---

## Typography

### Font Families

- **Sans:** Inter (primary body text)
- **Serif:** Playfair Display (headings, premium feel)
- **Mono:** JetBrains Mono (code, technical content)

### Typography Scale

```css
h1: text-4xl md:text-5xl lg:text-6xl (36px / 48px / 60px)
h2: text-3xl md:text-4xl (30px / 36px)
h3: text-2xl md:text-3xl (24px / 30px)
h4: text-xl md:text-2xl (20px / 24px)
p: leading-relaxed (1.625)
```

### Usage Guidelines

- **H1:** Page titles, hero sections
- **H2:** Section titles
- **H3:** Card titles, subsections
- **H4:** Small section titles
- **Body:** Leading-relaxed for readability
- **Tracking:** Tight tracking for headings (tracking-tight)
- **Letter-spacing:** 0.01em for body text (cabinet style)

---

## Spacing

### Spacing Scale

```css
sm: 0.5rem   (8px)
md: 1rem     (16px)
lg: 1.5rem   (24px)
xl: 2rem     (32px)
2xl: 3rem    (48px)
3xl: 4rem    (64px)
```

### Usage Guidelines

- **Padding:** Use consistent padding for cards (p-6 default)
- **Margins:** Use margins for spacing between elements
- **Gap:** Use gap for flex/grid layouts
- **Section padding:** py-20 for default sections

---

## Border Radius

### Radius Scale

```css
DEFAULT: 16px   (Default for most elements)
sm: 8px         (Small elements)
md: 12px        (Medium elements)
lg: 16px        (Large elements)
xl: 20px        (Extra large)
2xl: 24px       (Cards, buttons)
3xl: 32px       (Hero cards)
```

### Usage Guidelines

- **Buttons:** rounded-lg (16px)
- **Cards:** rounded-lg (16px)
- **Inputs:** rounded-lg (16px)
- **Badges:** rounded-full
- **Hero cards:** rounded-3xl (32px)

---

## Shadows

### Shadow Scale

```css
soft: 0 2px 8px 0 rgba(17, 24, 39, 0.04)
card: 0 1px 3px 0 rgba(17, 24, 39, 0.08), 0 1px 2px -1px rgba(17, 24, 39, 0.04)
elevated: 0 4px 6px -1px rgba(17, 24, 39, 0.08), 0 2px 4px -2px rgba(17, 24, 39, 0.04)
premium: 0 8px 30px rgba(0, 0, 0, 0.04)
```

### Usage Guidelines

- **Default cards:** shadow-card
- **Elevated cards:** shadow-elevated
- **Hero elements:** shadow-premium
- **Subtle elements:** shadow-soft

---

## Animations

### Animation Scale

```css
fade-in: 0.3s ease-out
slide-up: 0.4s ease-out
slide-down: 0.4s ease-out
scale-in: 0.3s ease-out
scale-out: 0.3s ease-out
pulse-slow: 3s cubic-bezier(0.4, 0, 0.6, 1) infinite
```

### Usage Guidelines

- **Page load:** fade-in
- **Content reveal:** slide-up
- **Modal open:** scale-in
- **Modal close:** scale-out
- **Loading states:** pulse-slow

---

## Components

### Button

**Purpose:** Primary action component

**Variants:**
- `default` - Primary blue background
- `primary` - Same as default
- `secondary` - White with border
- `outline` - Transparent with border
- `ghost` - Transparent with hover
- `link` - Text link with underline
- `success` - Green background
- `warning` - Amber background
- `error` - Red background

**Sizes:**
- `default` - h-[52px] px-6
- `sm` - h-10 px-4
- `lg` - h-14 px-8
- `xl` - h-16 px-10
- `icon` - h-[52px] w-[52px]

**Props:**
- `variant` - Button variant
- `size` - Button size
- `loading` - Show loading spinner
- `disabled` - Disable button
- `asChild` - Render as child component

**Example:**
```tsx
import { Button } from "@/components/design-system";

<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>
```

---

### Input

**Purpose:** Text input component

**Variants:**
- `default` - Standard input
- `elevated` - With shadow

**Props:**
- `label` - Input label
- `error` - Error message
- `hint` - Helper text
- `leftIcon` - Left icon
- `rightIcon` - Right icon
- `type` - Input type (supports password toggle)

**Example:**
```tsx
import { Input } from "@/components/design-system";
import { Mail } from "lucide-react";

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  leftIcon={<Mail className="h-5 w-5" />}
  error="Invalid email format"
/>
```

---

### Textarea

**Purpose:** Multi-line text input

**Variants:**
- `default` - Standard textarea
- `elevated` - With shadow

**Props:**
- `label` - Textarea label
- `error` - Error message
- `hint` - Helper text
- `resize` - Resize behavior (none, vertical, horizontal, both)

**Example:**
```tsx
import { Textarea } from "@/components/design-system";

<Textarea
  label="Message"
  placeholder="Enter your message"
  resize="vertical"
/>
```

---

### Badge

**Purpose:** Small status indicator

**Variants:**
- `default` - Primary blue
- `primary` - Primary blue
- `secondary` - Gray
- `success` - Green
- `warning` - Amber
- `error` - Red
- `outline` - Outlined
- `ghost` - Transparent

**Sizes:**
- `default` - px-3 py-1 text-xs
- `sm` - px-2 py-0.5 text-[10px]
- `lg` - px-4 py-1.5 text-sm

**Example:**
```tsx
import { Badge } from "@/components/design-system";

<Badge variant="success">Active</Badge>
```

---

### Card

**Purpose:** Container component

**Variants:**
- `default` - Standard card
- `elevated` - With shadow
- `outlined` - Outlined
- `ghost` - Transparent
- `premium` - Premium shadow

**Padding:**
- `none` - No padding
- `sm` - p-4
- `default` - p-6
- `lg` - p-8
- `xl` - p-10

**Sub-components:**
- `CardHeader` - Card header
- `CardTitle` - Card title
- `CardDescription` - Card description
- `CardContent` - Card content
- `CardFooter` - Card footer

**Example:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/design-system";

<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

---

### HeroCard

**Purpose:** Hero section card

**Props:**
- `title` - Hero title
- `description` - Hero description
- `primaryCTA` - Primary CTA
- `secondaryCTA` - Secondary CTA
- `badge` - Badge text

**Example:**
```tsx
import { HeroCard } from "@/components/design-system";

<HeroCard
  title="Transform Your Career"
  description="AI-powered interview preparation"
  primaryCTA={{ label: "Get Started", href: "/onboarding" }}
  secondaryCTA={{ label: "Learn More", href: "/about" }}
  badge="New Feature"
/>
```

---

### PricingCard

**Purpose:** Pricing display card

**Props:**
- `title` - Plan title
- `description` - Plan description
- `price` - Plan price
- `period` - Price period
- `features` - Feature list
- `cta` - CTA button
- `variant` - default or highlighted
- `badge` - Badge text

**Example:**
```tsx
import { PricingCard } from "@/components/design-system";

<PricingCard
  title="Pro"
  description="For professionals"
  price="$29"
  period="/month"
  features={[
    { name: "Feature 1", included: true },
    { name: "Feature 2", included: true },
    { name: "Feature 3", included: false },
  ]}
  cta={{ label: "Subscribe", href: "/pricing" }}
  variant="highlighted"
  badge="Most Popular"
/>
```

---

### DashboardCard

**Purpose:** Dashboard metric card

**Props:**
- `title` - Card title
- `value` - Card value
- `change` - Change indicator
- `icon` - Lucide icon
- `description` - Card description

**Example:**
```tsx
import { DashboardCard } from "@/components/design-system";
import { Users } from "lucide-react";

<DashboardCard
  title="Total Users"
  value="1,234"
  change={{ value: 12, trend: "up" }}
  icon={Users}
  description="Active users this month"
/>
```

---

### Section

**Purpose:** Section container

**Variants:**
- `default` - Background color
- `muted` - Gray background
- `primary` - Primary background with white text

**Padding:**
- `none` - No padding
- `sm` - py-12
- `default` - py-20
- `lg` - py-28
- `xl` - py-36

**Props:**
- `container` - Wrap in max-w-7xl container

**Example:**
```tsx
import { Section } from "@/components/design-system";

<Section variant="muted" padding="lg" container>
  <h2>Section Title</h2>
  <p>Section content</p>
</Section>
```

---

### Container

**Purpose:** Content container

**Sizes:**
- `sm` - max-w-4xl
- `default` - max-w-7xl
- `lg` - max-w-7xl
- `xl` - max-w-[1400px]
- `full` - max-w-full

**Example:**
```tsx
import { Container } from "@/components/design-system";

<Container size="lg">
  <p>Content</p>
</Container>
```

---

### Navbar

**Purpose:** Navigation bar

**Variants:**
- `default` - Standard navbar
- `transparent` - Transparent with blur on scroll
- `floating` - Floating card style

**Props:**
- `logo` - Logo component
- `navItems` - Navigation items
- `cta` - CTA button

**Example:**
```tsx
import { Navbar } from "@/components/design-system";

<Navbar
  logo={<Logo />}
  navItems={[
    { label: "Features", href: "/features", active: true },
    { label: "Pricing", href: "/pricing" },
  ]}
  cta={{ label: "Get Started", href: "/signup" }}
  variant="default"
/>
```

---

### Footer

**Purpose:** Page footer

**Props:**
- `sections` - Footer sections
- `copyright` - Copyright text
- `logo` - Logo component

**Example:**
```tsx
import { Footer } from "@/components/design-system";

<Footer
  logo={<Logo />}
  sections={[
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
  ]}
  copyright="© 2026 Trajectoire"
/>
```

---

### CTA

**Purpose:** Call-to-action component

**Variants:**
- `default` - Background color
- `primary` - Primary background
- `muted` - Gray background

**Align:**
- `left` - Left aligned
- `center` - Center aligned
- `right` - Right aligned

**Props:**
- `title` - CTA title
- `description` - CTA description
- `primaryCTA` - Primary CTA
- `secondaryCTA` - Secondary CTA

**Example:**
```tsx
import { CTA } from "@/components/design-system";

<CTA
  title="Ready to get started?"
  description="Join thousands of professionals transforming their careers"
  primaryCTA={{ label: "Start Free Trial", href: "/signup" }}
  secondaryCTA={{ label: "Contact Sales", href: "/contact" }}
  align="center"
/>
```

---

### Timeline

**Purpose:** Timeline display

**Variants:**
- `default` - Vertical timeline
- `vertical` - Vertical timeline
- `horizontal` - Horizontal timeline

**Props:**
- `items` - Timeline items

**Example:**
```tsx
import { Timeline } from "@/components/design-system";

<Timeline
  variant="vertical"
  items={[
    { title: "Step 1", description: "Description", icon: <Icon /> },
    { title: "Step 2", description: "Description" },
  ]}
/>
```

---

### FAQ

**Purpose:** FAQ accordion

**Props:**
- `items` - FAQ items

**Example:**
```tsx
import { FAQ } from "@/components/design-system";

<FAQ
  items={[
    { question: "Question 1", answer: "Answer 1" },
    { question: "Question 2", answer: "Answer 2" },
  ]}
/>
```

---

### Testimonial

**Purpose:** Testimonial card

**Variants:**
- `default` - Standard card
- `elevated` - With shadow

**Props:**
- `quote` - Testimonial quote
- `author` - Author name
- `role` - Author role
- `company` - Company name
- `avatar` - Avatar URL

**Example:**
```tsx
import { Testimonial } from "@/components/design-system";

<Testimonial
  quote="Amazing product!"
  author="John Doe"
  role="CEO"
  company="Acme Inc"
  avatar="/avatar.jpg"
/>
```

---

### LogoCloud

**Purpose:** Logo grid display

**Variants:**
- `default` - Full color
- `grayscale` - Grayscale with hover

**Props:**
- `logos` - Logo items
- `columns` - Number of columns (2-6)

**Example:**
```tsx
import { LogoCloud } from "@/components/design-system";

<LogoCloud
  columns={5}
  logos={[
    { name: "Company 1", logo: <Logo1 /> },
    { name: "Company 2", logo: <Logo2 /> },
  ]}
/>
```

---

### StatCard

**Purpose:** Statistics card

**Variants:**
- `default` - Standard
- `success` - Green accent
- `warning` - Amber accent
- `error` - Red accent

**Props:**
- `title` - Card title
- `value` - Card value
- `change` - Change indicator
- `icon` - Lucide icon

**Example:**
```tsx
import { StatCard } from "@/components/design-system";
import { TrendingUp } from "lucide-react";

<StatCard
  title="Revenue"
  value="$12,345"
  change={{ value: 12, period: "vs last month" }}
  icon={TrendingUp}
  variant="success"
/>
```

---

### EmptyState

**Purpose:** Empty state display

**Variants:**
- `default` - Standard
- `muted` - Gray background

**Props:**
- `icon` - Lucide icon
- `title` - Title
- `description` - Description
- `action` - Action button

**Example:**
```tsx
import { EmptyState } from "@/components/design-system";
import { Inbox } from "lucide-react";

<EmptyState
  icon={Inbox}
  title="No items found"
  description="Get started by creating your first item"
  action={{ label: "Create Item", onClick: () => {} }}
/>
```

---

## Usage Guidelines

### Importing Components

```tsx
// Import individual components
import { Button } from "@/components/design-system/button";
import { Input } from "@/components/design-system/input";

// Or import all from index
import { Button, Input, Card } from "@/components/design-system";
```

### Component Composition

```tsx
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/design-system";

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
    <Button variant="primary">Action</Button>
  </CardContent>
</Card>
```

### Responsive Design

All components are mobile-first and responsive. Use Tailwind's responsive prefixes (`md:`, `lg:`, `xl:`) to adjust layouts at different breakpoints.

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

### Accessibility

All components follow WCAG AA guidelines:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

---

## Best Practices

### DO

- Use consistent spacing (multiples of 4px)
- Use semantic HTML elements
- Provide meaningful alt text for images
- Use appropriate heading hierarchy
- Test with keyboard navigation
- Ensure color contrast compliance

### DON'T

- Hardcode colors (use design tokens)
- Use arbitrary values (use spacing scale)
- Skip accessibility attributes
- Override component styles unnecessarily
- Use deprecated components
- Break the component API

---

## Migration Guide

### From Old Components

**Old Button:**
```tsx
import { Button } from "@/components/ui/button";
```

**New Button:**
```tsx
import { Button } from "@/components/design-system";
// API is the same, just update import
```

**Old Input:**
```tsx
import { Input } from "@/components/ui/input";
```

**New Input:**
```tsx
import { Input } from "@/components/design-system";
// API is the same, just update import
```

### Theme Migration

**Old Theme:**
```css
bg-[#0b0f14] text-[#e5e7eb]
```

**New Theme:**
```css
bg-background text-text
```

---

## Contributing

When adding new components:

1. Follow the existing component structure
2. Use TypeScript with proper typing
3. Include JSDoc comments for props
4. Add responsive variants
5. Ensure accessibility
6. Add examples to documentation
7. Update this file

---

## Changelog

### Version 1.0.0 (2026-07-04)

**Added:**
- Core components: Button, Input, Textarea, Badge
- Card components: Card, HeroCard, PricingCard, DashboardCard
- Layout components: Section, Container, Navbar, Footer
- Marketing components: CTA, Timeline, FAQ, Testimonial, LogoCloud
- Utility components: StatCard, EmptyState
- Design tokens: Colors, typography, spacing, shadows, animations
- Documentation

---

## Support

For questions or issues with the design system, contact the design team or refer to this documentation.
