import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Règles de design et de fiabilité (voir .claude/decisions.md), vérifiées statiquement pour qu'une régression
 * échoue en CI plutôt qu'en production.
 *
 * Design system « Calm » (décision du 2026-10-07) : une seule ambiance claire, palette Sauge, Cormorant Garamond
 * (titres) et DM Sans, jamais de rouge vif. Les règles de couleur s'appliquent aux écrans déjà migrés :
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

describe("polices : Cormorant Garamond (titres) et DM Sans (texte)", () => {
  it("le layout racine charge Cormorant Garamond (romain et italique) et DM Sans, plus Inter", () => {
    const layout = read(all.find(f => rel(f) === "app/layout.tsx")!)
    expect(layout).toMatch(/Cormorant_Garamond\(/)
    expect(layout).toMatch(/DM_Sans\(/)
    expect(layout).toMatch(/style:\s*\["normal",\s*"italic"\]/)
    expect(layout).not.toMatch(/Inter\(/)
  })

  it("plus de Figtree, Newsreader ni Fraunces dans le code", () => {
    const offenders = all
      .filter(f => /(Figtree|Newsreader|Fraunces)/i.test(read(f)) && rel(f) !== "lib/design-invariants.test.ts")
      .map(rel)
    expect(offenders).toEqual([])
  })
})

describe("Cormorant Garamond réservée aux h1, h2 et grands chiffres", () => {
  it("la règle de base applique le serif à h1 et h2 seulement (h3 et plus petits en DM Sans)", () => {
    const css = read(all.find(f => rel(f) === "app/globals.css")!)
    const block = css.match(/([^{}]+)\{[^{}]*--font-cormorant[^{}]*font-weight:\s*500/)
    expect(block).not.toBeNull()
    expect(block![1].replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "")).toBe("h1,h2")
  })

  it("font-serif n'est utilisé que pour le logo et les prix (64 px), jamais sur un h3 ou plus petit", () => {
    const offenders: string[] = []
    for (const f of all.filter(f => /\.tsx$/.test(f))) {
      read(f).split("\n").forEach((line, i) => {
        if (!/font-serif/.test(line)) return
        const logo = rel(f) === "components/home/Logo.tsx"
        const price = rel(f) === "components/home/Sections.tsx" && /text-\[64px\]/.test(line)
        if (!logo && !price) offenders.push(`${rel(f)}:${i + 1}`)
      })
    }
    expect(offenders).toEqual([])
  })
})

describe("aucune preuve sociale inventée", () => {
  // Aucune vente à ce jour : ni nombre d'utilisateurs, ni note moyenne, ni « le plus choisi/populaire », ni « 100 % gratuit ».
  const FORBIDDEN: RegExp[] = [
    /utilisateurs actifs/i,
    /niveau bancaire/i,
    /note moyenne/i,
    /100\s?%\s?gratuit/i,
    /le plus (choisi|populaire|vendu)/i,
    /des milliers de (candidats|candidates|utilisateurs)/i,
    /\d[0-9 ,.]*\+?\s*(utilisateurs|candidats|candidates)/i,
  ]

  it("aucun fichier de l'app ne contient ces formulations", () => {
    const offenders: string[] = []
    for (const f of all.filter(f => /\.(tsx|ts)$/.test(f) && !/\.test\.tsx?$/.test(f))) {
      if (rel(f) === "lib/design-invariants.test.ts") continue
      const text = read(f)
      for (const re of FORBIDDEN) if (re.test(text)) offenders.push(`${rel(f)} : ${re}`)
    }
    expect(offenders).toEqual([])
  })
})

describe("jetons Calm : valeurs et contrastes", () => {
  const css = read(all.find(f => rel(f) === "app/globals.css")!)
  const channels = (name: string) => css.match(new RegExp(`--calm-${name}:\\s*(\\d+) (\\d+) (\\d+);`))!.slice(1).map(Number)
  const lum = ([r, g, b]: number[]) => {
    const f = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a: string, b: string) => {
    const [x, y] = [lum(channels(a)), lum(channels(b))].sort((m, n) => n - m)
    return (x + 0.05) / (y + 0.05)
  }

  it("les valeurs de la palette validée", () => {
    expect(channels("bg")).toEqual([255, 255, 255])
    expect(channels("alt")).toEqual([244, 245, 242])
    expect(channels("ink")).toEqual([22, 27, 25])
    expect(channels("secondary")).toEqual([86, 93, 89])
    expect(channels("tertiary")).toEqual([68, 76, 72])
    expect(channels("accent")).toEqual([25, 87, 71])
    expect(channels("accent-deep")).toEqual([16, 60, 49])
    expect(channels("accent-soft")).toEqual([220, 232, 223])
    expect(channels("warn")).toEqual([138, 75, 22])
  })

  it.each([
    ["ink", "bg"],
    ["ink", "alt"],
    ["secondary", "bg"],
    ["secondary", "alt"],
    ["tertiary", "bg"],
    ["accent", "bg"],
    ["accent", "alt"],
    ["accent", "accent-soft"],
    ["warn", "bg"],
    ["warn", "alt"],
    ["on-accent", "accent"],
    ["on-accent-2", "accent"],
    ["on-accent-mark", "accent"],
    ["on-accent", "accent-deep"],
  ])("contraste texte %s sur %s ≥ 4,5:1", (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5)
  })

  it("le contour de champ reste ≥ 3:1 sur blanc (WCAG 1.4.11) et le focus ≥ 3:1", () => {
    expect(ratio("input", "bg")).toBeGreaterThanOrEqual(3)
    expect(ratio("focus", "bg")).toBeGreaterThanOrEqual(3)
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
const PENDING: string[] = []

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
