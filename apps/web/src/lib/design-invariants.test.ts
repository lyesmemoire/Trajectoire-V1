import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Règles de design et de fiabilité décidées le 2026-10-02 (voir .claude/decisions.md), vérifiées
 * statiquement pour qu'une régression échoue en CI plutôt qu'en production.
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

describe("police unique : Inter", () => {
  it("aucun font-serif dans le code", () => {
    const offenders = all.filter(f => /\bfont-serif\b/.test(read(f))).map(rel)
    expect(offenders).toEqual([])
  })
})

describe("espace connecté : thème sombre (zinc-950 / indigo)", () => {
  // Zones rendues uniquement dans l'espace connecté ou l'onboarding.
  const zone = under(
    "app/(app)/",
    "app/onboarding/",
    "components/app/",
    "components/dashboard/",
    "components/opportunities/",
    "components/cv/",
    "components/report/",
    "components/settings/",
    "components/discovery/",
    "components/onboarding/",
  )

  // bg-white plein (les translucides bg-white/10 sont des calques sombres), slate/gray/neutral/stone, violet.
  // Exception : les pastilles d'état animées de la simulation (petits points blancs sur fond sombre).
  const FORBIDDEN =
    /\bbg-white(?![/\w-])(?!\s+animate-pulse)|\b(?:bg|text|border)-(?:slate|gray|neutral|stone)-\d+|\b(?:bg|text|border|ring|from|to)-violet-\d+/g

  it("la zone est bien trouvée", () => {
    expect(zone.length).toBeGreaterThan(20)
  })

  it("aucune classe claire ou violette dans l'espace connecté", () => {
    const offenders: string[] = []
    for (const f of zone) {
      const text = read(f).replace(/'animate-pulse bg-white'/g, "''")
      const hits = text.match(FORBIDDEN)
      if (hits) offenders.push(`${rel(f)} : ${Array.from(new Set(hits)).join(", ")}`)
    }
    expect(offenders).toEqual([])
  })
})

describe("couleur de marque", () => {
  it("#7C3AED n'est défini que dans les fichiers de tokens", () => {
    const allowed = new Set(["app/globals.css", "lib/design-tokens.ts", "components/ui/progress.tsx"])
    const offenders = all.filter(f => /#7C3AED/i.test(read(f)) && !allowed.has(rel(f))).map(rel)
    expect(offenders).toEqual([])
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
