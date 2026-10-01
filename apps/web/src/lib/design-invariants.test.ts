import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Règles de design et de fiabilité (voir .claude/decisions.md), vérifiées statiquement pour qu'une régression
 * échoue en CI plutôt qu'en production.
 *
 * Design system « Calm » (décision du 2026-10-07) : une seule ambiance claire, palette Sauge, Figtree et
 * Newsreader italique, jamais de rouge vif. Les règles de couleur s'appliquent aux écrans déjà migrés :
 * `PENDING` liste les préfixes qui ne le sont pas encore ; il se vide au fil des lots et sera vide à la fin.
 */

const SRC = fileURLToPath(new URL("..", import.meta.url))

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.includes(".bak")) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|css)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p)
  }
  return out
}

const rel = (f: string) => relative(SRC, f).split(sep).join("/")
const read = (f: string) => readFileSync(f, "utf-8")
const all = walk(SRC)

/** Fichiers sous un ou plusieurs préfixes (chemins relatifs à src, séparateur « / »). */
const under = (...prefixes: string[]) => all.filter(f => prefixes.some(p => rel(f).startsWith(p)))

describe("polices : Figtree et Newsreader italique", () => {
  it("aucun font-serif dans le code (les accents passent par font-accent)", () => {
    const offenders = all.filter(f => /\bfont-serif\b/.test(read(f))).map(rel)
    expect(offenders).toEqual([])
  })

  it("le layout racine charge Figtree et Newsreader (italique), plus Inter", () => {
    const layout = read(all.find(f => rel(f) === "app/layout.tsx")!)
    expect(layout).toMatch(/Figtree\(/)
    expect(layout).toMatch(/Newsreader\(/)
    expect(layout).toMatch(/style:\s*\["italic"\]/)
    expect(layout).not.toMatch(/\bInter\(/)
  })
})

describe("pas de mode sombre", () => {
  it("aucune classe dark: dans le code", () => {
    const offenders = all.filter(f => /(^|[\s"'`])dark:[a-z]/.test(read(f)) && rel(f) !== "lib/design-invariants.test.ts").map(rel)
    expect(offenders).toEqual([])
  })

  it("aucune couleur de marque violette (#7C3AED) dans le code", () => {
    const offenders = all.filter(f => /#7C3AED/i.test(read(f))).map(rel)
    expect(offenders).toEqual([])
  })
})

// ─── Couleurs : écrans migrés vers Calm ────────────────────────────────────────────────────────────
// Préfixes pas encore migrés (liste décroissante, vide à la fin du chantier).
const PENDING: string[] = [
  "app/(app)/",
  "app/onboarding/",
  "app/login/",
  "app/signup/",
  "app/signup-conversion/",
  "app/forgot-password/",
  "app/reset-password/",
  "app/pricing/",
  "app/(marketing)/",
  "app/page.tsx",
  "components/",
  "lib/theme/",
]

describe("écrans migrés : palette Calm uniquement", () => {
  const migrated = all.filter(f => {
    const r = rel(f)
    if (r.startsWith("app/api/") || r.startsWith("lib/") || r.startsWith("hooks/") || r.startsWith("e2e/")) return false
    if (/\.(ts)$/.test(r) && !r.endsWith(".tsx")) return false
    return !PENDING.some(p => r.startsWith(p))
  })

  // Familles de couleurs Tailwind interdites (on utilise `calm-*` ou les jetons sémantiques) et opacités de blanc
  // héritées du thème sombre.
  const FAMILIES = "zinc|slate|gray|neutral|stone|indigo|violet|purple|fuchsia|pink|rose|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue"
  const FORBIDDEN = new RegExp(
    `\\b(?:bg|text|border|ring|from|to|via|divide|fill|stroke|outline|placeholder|shadow)-(?:${FAMILIES})-\\d{2,3}\\b|\\b(?:bg|text|border|ring|divide)-white/\\d|\\bbg-black\\b`,
    "g",
  )

  it("aucune couleur Tailwind brute, ni blanc translucide, dans les écrans migrés", () => {
    const offenders: string[] = []
    for (const f of migrated) {
      const hits = read(f).match(FORBIDDEN)
      if (hits) offenders.push(`${rel(f)} : ${Array.from(new Set(hits)).slice(0, 6).join(", ")}`)
    }
    expect(offenders).toEqual([])
  })

  it("la liste des écrans non migrés ne contient que des chemins existants", () => {
    for (const p of PENDING) expect(all.some(f => rel(f).startsWith(p)), p).toBe(true)
  })
})

describe("aucune valeur inventée dans les scores et métriques affichés", () => {
  // Moteurs de score et pages de résultats : jamais de Math.random (décision : pas de chiffre non calculé).
  const scoring = under(
    "lib/cv-analysis/",
    "lib/cv/",
    "lib/quota/",
    "lib/plans.ts",
    "app/api/report/",
    "app/api/cv/",
    "app/(app)/dashboard/",
    "app/(app)/report/",
    "app/(app)/cv/",
    "components/dashboard/",
    "components/report/",
    "components/cv/",
  )

  it("les zones de scoring sont bien trouvées", () => {
    expect(scoring.length).toBeGreaterThan(15)
  })

  it("pas de Math.random()", () => {
    const offenders = scoring.filter(f => /Math\.random\s*\(/.test(read(f))).map(rel)
    expect(offenders).toEqual([])
  })
})

describe("états de chargement et d'erreur", () => {
  const has = (p: string) => all.some(f => rel(f) === p)

  it("l'espace connecté et le site public ont un écran de chargement et d'erreur", () => {
    for (const p of ["app/(app)/loading.tsx", "app/(app)/error.tsx", "app/loading.tsx", "app/error.tsx", "app/global-error.tsx", "app/not-found.tsx"]) {
      expect(has(p), p).toBe(true)
    }
  })

  it("global-error importe la feuille de style (il remplace le layout racine)", () => {
    const f = all.find(x => rel(x) === "app/global-error.tsx")!
    expect(read(f)).toMatch(/import\s+["']\.\/globals\.css["']/)
  })
})
