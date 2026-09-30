import { describe, it, expect } from "vitest"
import { canonical, normalize, stem, stemSet, tokenize } from "./text"

describe("text", () => {
  it("normalise casse et accents", () => {
    expect(normalize("Développeuse — État")).toBe("developpeuse — etat")
  })

  it("garde les termes techniques entiers et sépare les alternatives", () => {
    expect(tokenize("Node.js, C++ et C#, CI/CD, SEA/SEO, front-end")).toEqual([
      "node.js",
      "c++",
      "et",
      "c#",
      "ci/cd",
      "sea",
      "seo",
      "front-end",
    ])
  })

  it("canonicalise les alias techniques", () => {
    expect(canonical("node.js")).toBe("nodejs")
    expect(canonical("js")).toBe("javascript")
    expect(canonical("postgres")).toBe("postgresql")
    expect(canonical("developer")).toBe("developpeur")
  })

  it("racines : pluriels et féminins", () => {
    expect(stem("infirmiere")).toBe(stem("infirmier"))
    expect(stem("soins")).toBe(stem("soin"))
    expect(stem("equipes")).toBe(stem("equipe"))
    expect(stem("diplomee")).toBe(stem("diplome"))
  })

  it("correspondance par mots entiers uniquement", () => {
    const set = stemSet("Google Analytics et digital")
    expect(set.has(stem("go"))).toBe(false)
    expect(set.has(stem("git"))).toBe(false)
    expect(set.has(stem("google"))).toBe(true)
  })
})
