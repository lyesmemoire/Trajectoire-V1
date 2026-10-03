import { z } from "zod"
import { RADAR_SOURCES } from "./types"

/** Nombre maximal de recherches sauvegardées par utilisateur (borne le coût des synchronisations). */
export const MAX_RADAR_SEARCHES_PER_USER = 5

/** Code département français : 01-95, 2A, 2B, 971-976. */
const DEPARTMENT = z.string().regex(/^(0[1-9]|[1-8]\d|9[0-5]|2[AB]|97[1-6])$/, "Code département invalide")

/** Code ROME : une lettre de A à N suivie de quatre chiffres. */
const ROME = z.string().regex(/^[A-N]\d{4}$/, "Code ROME invalide")

/** Types de contrat acceptés (libellés courts ; la correspondance avec chaque source est faite dans son client). */
export const CONTRACT_TYPES = ["CDI", "CDD", "MIS", "ALTERNANCE", "STAGE", "FREELANCE"] as const

export const RadarSearchInputSchema = z
  .object({
    name: z.string().trim().min(1, "Nom requis").max(80),
    keywords: z.string().trim().min(2, "Au moins 2 caractères").max(120),
    romeCodes: z.array(ROME).max(5).default([]),
    departments: z.array(DEPARTMENT).max(10).default([]),
    latitude: z.number().min(-90).max(90).nullable().default(null),
    longitude: z.number().min(-180).max(180).nullable().default(null),
    radiusKm: z.number().int().min(1).max(200).nullable().default(null),
    contractTypes: z.array(z.enum(CONTRACT_TYPES)).max(CONTRACT_TYPES.length).default([]),
    sources: z.array(z.enum(RADAR_SOURCES)).min(1, "Au moins une source").max(RADAR_SOURCES.length).default([...RADAR_SOURCES]),
    enabled: z.boolean().default(true),
  })
  .strict()
  .refine(v => (v.latitude === null) === (v.longitude === null), {
    message: "Latitude et longitude vont ensemble",
    path: ["latitude"],
  })
  .refine(v => v.radiusKm === null || v.latitude !== null, {
    message: "Un rayon demande un point de départ",
    path: ["radiusKm"],
  })

export type RadarSearchInput = z.infer<typeof RadarSearchInputSchema>

/** Mise à jour partielle : mêmes règles, tous les champs facultatifs, rien d'inconnu accepté. */
export const RadarSearchPatchSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    keywords: z.string().trim().min(2).max(120),
    enabled: z.boolean(),
  })
  .partial()
  .strict()
  .refine(v => Object.keys(v).length > 0, { message: "Aucune modification" })

export const MatchStatePatchSchema = z.object({ state: z.enum(["SEEN", "SAVED", "DISMISSED"]) }).strict()
