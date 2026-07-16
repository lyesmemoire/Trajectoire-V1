# Homepage Comparison Report

**Generated:** 2026-07-05  
**Phase:** Étape 1 - Comparaison Arena vs Actuel

## Pages Comparées

- **Arena Reference:** `ui-sources/arena/index.html`
- **Current Implementation:** `app/(marketing)/page.tsx`

---

## UI Comparison

### Arena Design System

**Typography:**
- Headings: Playfair Display (serif, premium feel)
- Body: Inter (clean, modern)
- H1: 56px, H2: 42px, H3: 24-28px

**Color Palette:**
- Background: #F8F6F3 (warm off-white)
- Card: #FFFFFF
- Text Primary: #111827
- Text Secondary: #6B7280
- Blue Primary: #1E40AF (deep blue)
- Blue Hover: #2563EB
- Gold Accent: #D4AF37 (luxury touch)
- Border: #E5E7EB
- Success: #16A34A
- Error: #DC2626

**Spacing:**
- Container: max-width 1280px, padding 24px
- Sections: 120px vertical padding
- Cards: 32-40px padding

**Radius:**
- Standard: 12px
- Consistent across all elements

**Shadows:**
- Small: 0 1px 2px rgba(0,0,0,0.05)
- Medium: 0 4px 6px rgba(0,0,0,0.07)
- Large: 0 10px 15px rgba(0,0,0,0.08)

### Current Design System

**Typography:**
- Uses Design System tokens (not hardcoded)
- Sans-serif only (Inter/system fonts)
- H1: ~48px, H2: 36-40px, H3: 20-24px

**Color Palette:**
- Uses Design System semantic tokens
- Background: white (#FFFFFF)
- Gray scale: gray-50, gray-900, etc.
- Blue: blue-600, violet-600
- No gold accent

**Spacing:**
- Container: max-w-7xl (1280px), px-6
- Sections: py-24 (96px)
- Cards: p-6 to p-12

**Radius:**
- Uses Design System radius tokens
- rounded-2xl (16px) for cards
- rounded-lg (8px) for smaller elements

**Shadows:**
- shadow-xl, shadow-2xl
- Not using semantic shadow tokens

---

## UX Comparison

### Arena UX

**Navigation:**
- Fixed navbar with backdrop blur
- Logo left, menu center, actions right
- Smooth scroll behavior
- Scrolled state with shadow

**Hero:**
- Two-column layout (text left, image right)
- Primary CTA: "Commencer maintenant"
- Secondary CTA: "Découvrir la méthode"
- Trust indicators below buttons (3 items)

**Content Flow:**
1. Hero
2. Stats (3 metrics)
3. Why section (3 cards)
4. Process (timeline)
5. Skills (3 cards)
6. Types (4 cards)
7. Trust (quote)
8. About (founder)
9. FAQ (accordion)
10. Final CTA
11. Footer

**Interactions:**
- Hover effects on cards (border color change, lift)
- Button hover states (color change, transform)
- FAQ accordion with smooth animation
- Fade-in animations on scroll

### Current UX

**Navigation:**
- No visible navbar in current implementation
- Hero acts as primary navigation point

**Hero:**
- Uses Design System Hero component
- Badge: "Nouvelle méthode 2026"
- Title: "Enfin une préparation qui change vraiment la donne."
- Primary CTA: "Réserver mon accompagnement"
- Secondary CTA: "Voir comment ça marche"

**Content Flow:**
1. Hero
2. Stats (3 metrics with StatCard)
3. Problem (pain points list)
4. Solution (3-step method)
5. Trust (logos grid)
6. Testimonials (3 cards)
7. CTA (gradient background)
8. FAQ (static cards, not accordion)

**Interactions:**
- Framer Motion animations (fade, slide)
- Hover effects on cards
- No accordion functionality in FAQ

---

## Animations Comparison

### Arena Animations

**CSS-based:**
- `.fade-in` class with opacity and transform
- JavaScript Intersection Observer for scroll triggers
- Smooth transitions (0.3s cubic-bezier)
- Hover effects with transform translateY

**Performance:**
- Lightweight CSS animations
- No JavaScript animation library
- Hardware-accelerated transforms

### Current Animations

**Framer Motion:**
- `initial={{ opacity: 0, x/y: ±20 }}`
- `whileInView={{ opacity: 1, x/y: 0 }}`
- `viewport={{ once: true }}`
- Staggered delays for lists

**Performance:**
- JavaScript-based animations
- More flexible but heavier
- Good for complex sequences

---

## Responsive Comparison

### Arena Responsive

**Breakpoints:**
- Desktop: >1024px
- Tablet: 768px-1024px
- Mobile: <768px

**Mobile Adaptations:**
- Hero: single column, smaller H1 (36px)
- Nav: menu hidden (hamburger implied)
- Stats: single column
- Grids: 1 column
- Footer: single column
- Buttons: stacked vertically

### Current Responsive

**Breakpoints:**
- Uses Tailwind breakpoints (md, lg)
- Grid: md:grid-cols-3, lg:grid-cols-2

**Mobile Adaptations:**
- Hero: responsive text sizing
- Stats: single column on mobile
- Grids: responsive with Tailwind
- No specific mobile navigation shown

---

## Content Comparison

### Arena Content

**Hero:**
- Title: "Préparez vos entretiens stratégiques avec méthode."
- Subtitle: "Préparez vos entretiens de management grâce à une approche structurée, des simulations réalistes et des retours personnalisés."
- Trust: Confidentialité, Accompagnement premium, Résultats mesurables

**Stats:**
- +1800 cadres accompagnés
- 94% déclarent être arrivés plus confiants
- 100% Préparation adaptée à tous les niveaux de management

**Sections:**
- Why (3 benefits)
- Process (timeline)
- Skills (3 skill cards)
- Types (4 interview types)
- Trust (quote)
- About (founder section)
- FAQ (accordion)

### Current Content

**Hero:**
- Title: "Enfin une préparation qui change vraiment la donne."
- Subtitle: "Arrêtez de préparer vos entretiens au hasard. Développez une narrative irrésistible, maîtrisez chaque interaction, et obtenez l'offre que vous méritez."
- Badge: "Nouvelle méthode 2026"

**Stats:**
- +1,200 Professionnels accompagnés
- 92% Taux de réussite
- 4.9/5 Satisfaction client

**Sections:**
- Problem (4 pain points)
- Solution (3-step method)
- Trust (company logos)
- Testimonials (3 testimonials)
- CTA (gradient)
- FAQ (static)

---

## Navigation Comparison

### Arena Navigation

**Structure:**
- Fixed top navbar
- Logo: "Trajectoire"
- Menu: Accueil, Méthode, Accompagnement, Tarifs, Ressources, À propos, Contact
- Actions: Connexion (ghost), Créer mon espace (primary)

**Behavior:**
- Smooth scroll to sections
- Backdrop blur on scroll
- Responsive menu (hidden on mobile)

### Current Navigation

**Structure:**
- No visible navbar component
- Hero CTAs link to /auth/signup and #methode
- No navigation menu

**Behavior:**
- Standard anchor links
- No smooth scroll implementation visible

---

## Key Differences Summary

| Aspect | Arena | Current | Gap |
|--------|-------|---------|-----|
| Typography | Playfair + Inter (premium) | Inter only (modern) | Serif headings missing |
| Colors | Warm off-white + gold accent | White + blue/violet | Premium feel missing |
| Navigation | Fixed navbar with blur | No navbar | Navigation missing |
| Hero | Two-column with image | Single column text | Visual element missing |
| Stats | Simple numbers | StatCard with trends | Both good, different style |
| Content | 11 sections | 8 sections | Process, Skills, Types, About missing |
| FAQ | Accordion | Static cards | Interactivity missing |
| Animations | CSS fade-in | Framer Motion | Both good, different approach |
| Responsive | Comprehensive | Basic | Mobile nav missing |

---

## Recommendations for Migration

### Must Implement

1. **Navigation Bar**
   - Fixed navbar with backdrop blur
   - Logo, menu items, auth actions
   - Responsive hamburger menu

2. **Hero Enhancement**
   - Add visual element (image/illustration)
   - Trust indicators below CTAs
   - Two-column layout on desktop

3. **Typography**
   - Add Playfair Display for headings
   - Implement premium typography hierarchy

4. **Color System**
   - Use warm off-white background (#F8F6F3)
   - Add gold accent for premium feel
   - Implement Arena color palette via Design System tokens

5. **Missing Sections**
   - Process timeline
   - Skills cards
   - Interview types
   - About/founder section

6. **FAQ Enhancement**
   - Implement accordion functionality
   - Add smooth expand/collapse

### Should Implement

1. **Animations**
   - Consider CSS-based fade-in for better performance
   - Keep Framer Motion for complex sequences

2. **Trust Section**
   - Add quote/testimonial from founder
   - Company logos (already present)

3. **Footer**
   - Implement comprehensive footer with links
   - Social media links

### Nice to Have

1. **Micro-interactions**
   - Button hover states with transform
   - Card lift effects

2. **Scroll Behavior**
   - Smooth scroll to sections
   - Navbar state change on scroll

---

## Migration Priority

**High Priority:**
- Navigation bar
- Hero visual enhancement
- Typography (Playfair Display)
- Color system (warm background, gold accent)

**Medium Priority:**
- Missing sections (Process, Skills, Types, About)
- FAQ accordion
- Footer implementation

**Low Priority:**
- Micro-interactions
- Scroll behavior refinements

---

## Next Step

Proceed to **Étape 2: Réécrire JSX avec Design System** incorporating the above recommendations while maintaining the Design System architecture and using Framer Motion for animations.
