import { describe, it, expect, vi, afterEach } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"
import {
  PUBLISHER,
  REQUIRED_PUBLISHER_FIELDS,
  LEGACY_CONTACT_EMAIL,
  canShowLegalNotice,
  contactEmail,
  describePublisher,
  getMissingPublisherFields,
  isPublisherComplete,
  type PublisherInfo,
} from "./publisher"

const EMPTY: PublisherInfo = {
  companyName: "",
  legalForm: "",
  shareCapital: "",
  registeredAddress: "",
  registryName: "",
  registrationNumber: "",
  vatNumber: "",
  publicationDirector: "",
  contactEmail: "",
  contactPhone: "",
  dataProtectionEmail: "",
  host: { name: "", address: "", phone: "", website: "" },
  mediator: { name: "", address: "", website: "" },
}

/** Valeurs de test manifestement fictives (jamais dans PUBLISHER). */
const FILLED: PublisherInfo = {
  companyName: "Société Exemple",
  legalForm: "SAS",
  shareCapital: "1 000 €",
  registeredAddress: "1 rue de l'Exemple, 00000 Ville",
  registryName: "RCS Exemple",
  registrationNumber: "000 000 000",
  vatNumber: "XX00000000000",
  publicationDirector: "Prénom Nom",
  contactEmail: "contact@exemple.test",
  contactPhone: "+00 0 00 00 00 00",
  dataProtectionEmail: "donnees@exemple.test",
  host: { name: "Hébergeur Exemple", address: "2 avenue de l'Exemple", phone: "+00 0 00 00 00 01", website: "" },
  mediator: { name: "Médiateur Exemple", address: "", website: "https://mediateur.exemple.test" },
}

afterEach(() => vi.unstubAllEnvs())

describe("champs obligatoires", () => {
  it("une identité vide liste tous les champs obligatoires", () => {
    expect(getMissingPublisherFields(EMPTY)).toHaveLength(REQUIRED_PUBLISHER_FIELDS.length)
    expect(isPublisherComplete(EMPTY)).toBe(false)
  })

  it("capital, site de l'hébergeur et adresse du médiateur sont facultatifs", () => {
    expect(getMissingPublisherFields(FILLED)).toEqual([])
    expect(isPublisherComplete({ ...FILLED, shareCapital: "" })).toBe(true)
  })

  it("un champ d'espaces compte comme manquant", () => {
    expect(getMissingPublisherFields({ ...FILLED, vatNumber: "   " })).toEqual([expect.stringContaining("vatNumber")])
  })

  it("chaque champ obligatoire manquant est signalé sous son nom", () => {
    for (const spec of REQUIRED_PUBLISHER_FIELDS) {
      const broken = structuredClone(FILLED)
      // Vider uniquement ce champ : on retrouve lequel en comparant les libellés manquants.
      const missingBefore = getMissingPublisherFields(broken)
      expect(missingBefore).toEqual([])
      const mutate = (path: string) => {
        if (path.startsWith("host.")) broken.host[path.slice(5) as keyof PublisherInfo["host"]] = ""
        else if (path.startsWith("mediator.")) broken.mediator[path.slice(9) as keyof PublisherInfo["mediator"]] = ""
        else (broken as unknown as Record<string, string>)[path] = ""
      }
      mutate(/\(([^)]+)\)$/.exec(spec.label)![1])
      expect(getMissingPublisherFields(broken)).toEqual([spec.label])
    }
  })
})

describe("affichage conditionnel", () => {
  it("incomplet : visible hors production, jamais en production", () => {
    vi.stubEnv("NODE_ENV", "development")
    expect(canShowLegalNotice(EMPTY)).toBe(true)
    vi.stubEnv("NODE_ENV", "production")
    expect(canShowLegalNotice(EMPTY)).toBe(false)
  })

  it("complet : toujours visible", () => {
    vi.stubEnv("NODE_ENV", "production")
    expect(canShowLegalNotice(FILLED)).toBe(true)
  })

  it("phrase d'identification : absente si incomplet, complète sinon, capital facultatif", () => {
    expect(describePublisher(EMPTY)).toBeNull()
    const sentence = describePublisher(FILLED)!
    for (const part of ["Société Exemple", "SAS", "1 000 €", "RCS Exemple", "000 000 000", "XX00000000000", "1 rue de l'Exemple"]) {
      expect(sentence).toContain(part)
    }
    expect(describePublisher({ ...FILLED, shareCapital: "" })).not.toContain("capital")
  })

  it("e-mail de contact : la valeur renseignée, sinon l'adresse provisoire actuelle", () => {
    expect(contactEmail(EMPTY)).toBe(LEGACY_CONTACT_EMAIL)
    expect(contactEmail(FILLED)).toBe("contact@exemple.test")
  })
})

describe("source unique", () => {
  const SRC = fileURLToPath(new URL("../..", import.meta.url))
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const name of readdirSync(dir)) {
      if (name === "node_modules" || name.includes(".bak")) continue
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p, out)
      else if (/\.(tsx?|css)$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(p)
    }
    return out
  }

  it("aucune adresse personnelle (gmail) codée en dur hors de lib/legal/publisher.ts", () => {
    const offenders = walk(SRC)
      .filter(f => /@gmail\.com/i.test(readFileSync(f, "utf-8")))
      .map(f => relative(SRC, f).split(sep).join("/"))
      .filter(f => f !== "lib/legal/publisher.ts")
    expect(offenders).toEqual([])
  })
})

// Contrôle de lancement : LEGAL_REQUIRED=1 pnpm --dir apps/web exec vitest run src/lib/legal
describe("avant lancement", () => {
  it.runIf(process.env.LEGAL_REQUIRED === "1")("les mentions légales sont complètes (lib/legal/publisher.ts)", () => {
    expect(getMissingPublisherFields(PUBLISHER)).toEqual([])
  })
})
