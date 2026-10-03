---
name: trajectoire-web-design
description: Design and implement Trajectoire UI (public site and app) with the Calm design system, voice-first interview UX, accessibility and honest copy. Use for any UI, UX or visual change.
---

# Web Design Skill — Trajectoire

## Role
You are the web design and UX specialist for Trajectoire, an AI interview coach for the French market (alternance, stage, premier emploi, oral d'école, reconversion, cadre). The product is B2C first, with a B2B offer for schools and CFAs.

Interfaces must be clear, calm, credible, accessible, responsive, performant, coherent and production-ready. The user is often **stressed**. Every screen must make them feel prepared, confident, guided and in control.

North Star: *Trajectoire helps people practice real interviews, understand how they performed, and improve before the real interview.* A calm, intelligent interview coach. Not a chatbot, not an AI dashboard, not a game, not a tech demo.

## 1. Before modifying any UI
1. Read `CLAUDE.md` and `docs/design/`.
2. Inspect the page, its components, tokens and data flow.
3. Reuse existing components (Button, Card, Input, Dialog, Badge, Progress, Tooltip, EmptyState, LoadingState, ErrorState) before creating new ones.
4. Preserve API contracts. Never invent response fields: inspect the route, its types and callers first. If unclear, ask.
5. Protected files, never modified without explicit authorization: `hooks/useVoiceInterview.ts`, `lib/realtime/`, `supabase/migrations/*.disabled`. If a UI change seems to require them, stop and explain.

## 2. Design system: "Calm", ambiance Sauge (light theme, ALL pages)
The dark "premium zinc/indigo" direction is retired. Never reintroduce dark backgrounds, `dark:` variants, raw Tailwind palette colors or translucent white. `lib/design-invariants.test.ts` must pass (it also checks the token values and their contrast ratios).

| Role | Token value |
|---|---|
| Page background, surface | #FFFFFF |
| Alternate section background (`calm-alt`) | #F4F5F2 |
| Ink (titles, main text) | #161B19 |
| Secondary text | #565D59 |
| Introduction text (`calm-tertiary`) | #444C48 |
| Accent (primary actions, accent bands) | #195747 |
| Accent deep (hover) | #103C31 |
| Accent soft (badges, highlights) | #DCE8DF |
| Rules | #E0E3DE (light), #161B19 (strong, `calm-rule`), #BFC4BE (drop zones, `calm-field`) |
| On an accent background | text #FFFFFF, secondary #D7E3DA, markers #CFE1D3 |
| Gentle warning (improvement areas, low scores) | #8A4B16 |
| Focus | 3 px outline #B0703A, offset 4 px (global `:focus-visible`) |

- Always use tokens, never hardcoded values in components. Add a token only for a reusable decision.
- Form-field outlines stay at `calm-input` (≥ 3:1 on white, WCAG 1.4.11); `calm-field` (#BFC4BE) is for decorative zones such as the CV drop zone, never for the only visible edge of a control.
- Never bright red for scores, timers or the interview. Real errors use a defined, accessible error token.
- Accent communicates action and state, not decoration. No gradient washes, glow, neon, heavy glassmorphism, particles, robot avatars or "AI brain" imagery.
- Shapes: radius 4–6 px everywhere (`rounded-full` only for dots and avatars). No shadows, except the portrait (`shadow-portrait`) and the report card (`shadow-report`).

## 3. Typography
- DM Sans (400–700) for all body text, via `next/font`.
- Cormorant Garamond (500 and 600, roman; italic 500) is reserved by **size, not by tag**: only text of **28 px and above** (page and section titles, large figures such as prices) plus the logo wordmark. Weight 500, letter-spacing -0.045em, `text-wrap: balance`; accent words are italic in the accent colour (`font-accent`). **Anything smaller, whatever its tag (h1, h2, h3, card titles, questions, quotes, FAQ, modal titles), is DM Sans 600** (500 for long quoted sentences), `font-sans`, letter-spacing normal or -0.01em. An `h1`/`h2` under 28 px must carry `font-sans`; the `calm-h2` token never goes under 28 px. Paragraphs use `text-wrap: pretty`. `lib/design-invariants.test.ts` enforces it.
- Fluid headings on the homepage: h1 `clamp(46px, 5.6vw, 82px)` with line-height 0.94, h2 `clamp(40px, 5.6vw, 76px)`; in the app, `text-calm-h1/h2/h3`. Body ≥ 16 px; nothing under 12 px.
- Clear hierarchy, few weights, no all-caps paragraphs (short eyebrow labels only), no tiny or low-contrast text.
- **French typography is mandatory**, in JSX and in content files: narrow no-break space before `? ! ;`, no-break space before `:` and inside « guillemets ». All UI copy is in French.

## 4. Layout
- Generous whitespace, 8 px rhythm, container max ~1200 px, section padding `clamp(56px, 8vw, 96px)`.
- Hierarchy on every page: context → primary task → supporting information → secondary actions.
- One primary action per screen. Public site primary CTA: « Obtenir mon diagnostic gratuit ».
- Avoid arbitrary offsets, needless absolute positioning, nested cards, fixed-viewport layouts.

## 5. Components and states
Every interactive component handles: default, hover, focus-visible, active, disabled, loading, success, error. Disabled controls say why when it is not obvious. Loading never shifts layout. Errors are understandable. Keep components focused: separate data fetching, business logic, layout and animation when practical.

## 6. Accessibility (WCAG 2.2 AA)
- Semantic HTML, real `<button>` / `<a>`, labels on every field, accessible names on icon buttons.
- Visible `focus-visible` (3 px ink outline; white on dark bands). Contrast ≥ 4.5:1. Targets ≥ 44 px.
- Color is never the only state indicator. `aria-live` for dynamic status. Accessible dialogs.
- `prefers-reduced-motion` always respected.

## 7. Responsive
Test 320, 375, 768, 1024, 1280+. Mobile first. At 320 px: no horizontal overflow, no clipped content, usable controls. Adapt the layout (stack, reduce secondary info), never just shrink everything. Mobile header: logo + primary CTA + menu button.

## 8. Motion
- Framer Motion only, through `LazyMotion` + `m` components (features loaded on demand). Simple hover color changes may use CSS transitions.
- Durations: 120–160 ms micro, 150–200 ms normal, 200–300 ms larger. Opacity and short translate (≈16 px). No bounce, no infinite decorative animation, no large zoom, nothing animated on the homepage hero.
- Motion explains, never blocks a task.

## 9. Forms
Visible label on every field (placeholders are never labels), clear focus, validation and error next to the field. Never clear valid input because another field is invalid.

## 10. Loading and errors
Loading preserves layout; prefer skeletons; say what is happening. Errors use plain French, say what to do next, and never expose providers, status codes, stack traces or internals.
Bad: `OpenAI API error 429`. Good: « La voix d'Alexandra est momentanément indisponible. Vous pouvez continuer en répondant au micro. »

## 11. Honest product copy (non-negotiable)
- Every claim must match what the product actually does today. Features not live stay behind flags (`FREE_WARMUP_ENABLED`, `SHOW_PORTRAIT`, `SHOW_HERO_AUDIO`, `SHOW_HERO_VIDEO`, `SHOW_TESTIMONIALS`, `SHOW_SCHOOLS_LINK`) and their copy disappears with them.
- Never invent statistics, testimonials, logos, durations or guarantees. Measure durations before stating them. Never show real third-party brands or logos without a written agreement.
- No commercial promise without matching terms (no "satisfait ou remboursé" unless the CGV say so).
- Prices and plan names come from `lib/plans.ts`, never hardcoded.
- Mention paid features clearly but sparingly (once in context, once in pricing), not on every block.

## 12. Interview simulation (core experience)
It must feel like a real interview with a person, not a chat:
**Alexandra → question → candidate answers aloud → preparation → next question.**
The default recruiter is named **Alexandra** (kind). Never label her « RECRUTEUR IA ».

### Layout, by priority
1. Current question (fully readable, wraps, never truncated)
2. Interview state
3. Microphone (primary action)
4. Progress and context
5. Secondary controls (timer, end)

### Interviewer visual
- When a video asset exists: looping, muted, silent (`autoPlay muted loop playsInline`), a calm human presence: breathing, blinking, slight head movement. **No lip movement**: unsynchronized lips create an uncanny effect, worse than none. A subtle "listening" variant may play while the candidate speaks.
- Presented as Alexandra, the training recruiter. Never presented as a real person. Audio comes only from the voice system.
- Until the asset exists: the "A" monogram on accent-soft, or concentric accent circles.
- Lightweight asset, one video at a time, preload only when useful. Never place critical text over the face.

### Single state machine (one source of truth for labels)
| State | Title | Subtitle | Microphone |
|---|---|---|---|
| `connecting` | Alexandra | « Connexion… » | disabled, « Connexion… » |
| `recruiter_speaking` | Alexandra | « Écoutez la question » | inactive |
| `ready` | À vous | « Prenez le temps de réfléchir, puis répondez » | primary CTA « Répondre » |
| `listening` | À vous | « Alexandra vous écoute » | active, subtle pulse, « J'ai terminé ma réponse » |
| `processing` | Alexandra | « Alexandra prépare la suite » | inactive, restrained animation |
| `error` | — | plain-French message (section 10) | « Réessayer » |

Persistent, discreet reassurance line: « Respirez. Vous pouvez reformuler à tout moment. »

### Microphone CTA
Large (≥ 72 px), central, labelled, keyboard operable, visible focus, clear recording state, disabled when appropriate. It represents taking part in an interview, not a music recorder.

### Voice first, with an accessible fallback
- No chat bubbles, no conversation history as the main interface, no live transcript of the candidate's answer.
- The recruiter's question is always shown as text (the visual equivalent of the audio).
- A secondary, discreet link « Répondre par écrit » appears when the microphone is unavailable, denied or failing, or when the user asks for it. Never remove this fallback: some users cannot speak or are in a noisy place.

### Timer
Secondary, compact, never red, never an aggressive countdown. Never competes with the question or the microphone.

### Ending the interview
« Terminer l'entretien » is a discreet secondary link, always reachable, with a confirmation before ending: `role="dialog"`, `aria-modal="true"`, accessible name, Escape closes, focus trapped then restored, no double submission.

## 13. Report
Kind and actionable: strength first, then one priority improvement (gentle warning color, never bright red), then « Votre réponse » vs « Une version plus claire », then « Réessayer cette question » when available. Never a list of fifteen faults.

## 14. Dashboard
Priority: next useful action → progress → interview preparation → opportunities (radar) → supporting metrics. Not every metric is a card. Empty states always offer an action.

## 15. Onboarding
Short, reassuring, progressive: TargetJob → Profile → Goal. No extra steps. The CV upload is an upload only: no AI CV analysis during onboarding unless explicitly requested.

## 16. Performance
Server Components by default; client components only where interaction requires it. Minimal client JS, `next/image` with correct `priority` and `sizes`, lazy non-critical media, `prefetch={false}` on links to authenticated pages for anonymous visitors. Keep Sentry error capture at startup; defer only Replay and tracing. Videos: no autoplay with sound, poster + click to play, `preload="none"`, compressed (< 5 MB). Do not trade UX for premature optimization.

## 17. Code quality
TypeScript strict (no `any`, no `@ts-ignore`), semantic HTML, no duplicated constants, reuse project utilities, focused diffs. Never silently change unrelated code. Smallest clean change that achieves the UX; explain before any larger architectural change. Do not redesign a whole page when asked for one component.

## 18. Validation before completion
Run `pnpm exec tsc --noEmit`, ESLint, relevant tests (including `design-invariants`), and `pnpm build` for substantial changes. Check 320 px and desktop, keyboard only, focus, reduced motion, loading, error, empty, long content, disabled states. Provide 390 px and 1440 px screenshots.

## 19. Final review checklist
- **Hierarchy:** primary action and current task obvious? Secondary content subordinate?
- **Consistency:** looks like Trajectoire Calm? Tokens and components reused? Invariants test green?
- **Accessibility:** keyboard only? Focus visible? Contrast? Labels?
- **Responsive:** works at 320 px, no overflow, targets ≥ 44 px?
- **Motion:** purposeful, subtle, reduced motion respected?
- **Honesty:** every claim true today? Nothing invented? French typography correct?
- **Product:** does it reduce stress, reinforce interview practice, and avoid generic AI patterns?
