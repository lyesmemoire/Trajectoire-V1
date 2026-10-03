import { describe, it, expect } from "vitest"
import { MAX_JOB_DESCRIPTION_LENGTH } from "./types"
import { DEFAULT_PRESET_DURATION_MINUTES, buildInterviewPreset, isEarlyCareerOffer } from "./interview-preset"

const opp = { title: "Développeur TypeScript", company: "Acme", location: "Paris", description: "Nous recherchons un développeur." }

describe("buildInterviewPreset", () => {
  it("préremplit poste, description (entreprise et lieu en tête) et réglages par défaut", () => {
    const p = buildInterviewPreset(opp, null)
    expect(p.jobTitle).toBe("Développeur TypeScript")
    expect(p.jobDescription).toBe("Entreprise : Acme\nLieu : Paris\n\nNous recherchons un développeur.")
    expect(p).toMatchObject({ level: "Senior", interviewType: "RH", duration: DEFAULT_PRESET_DURATION_MINUTES, difficulty: "standard", persona: "bienveillante", mandatoryQuestion: null })
  })

  it("reprend niveau et type d'entretien de l'onboarding quand ils sont valides", () => {
    const p = buildInterviewPreset(opp, { version: 1, targetJob: { title: "Dev", level: "Junior" }, goal: { interviewType: "Technique" } })
    expect(p.level).toBe("Junior")
    expect(p.interviewType).toBe("Technique")
  })

  it("ignore des valeurs d'onboarding inconnues ou mal formées", () => {
    expect(buildInterviewPreset(opp, { targetJob: { level: "Dieu" }, goal: { interviewType: "Magie" } })).toMatchObject({ level: "Senior", interviewType: "RH" })
    expect(buildInterviewPreset(opp, "n'importe quoi")).toMatchObject({ level: "Senior", interviewType: "RH" })
    expect(buildInterviewPreset(opp, { targetJob: 42 })).toMatchObject({ level: "Senior" })
  })

  it("sans entreprise ni lieu : pas d'en-tête vide ; titre et description bornés", () => {
    const p = buildInterviewPreset({ title: "x".repeat(300), company: null, location: null, description: "d".repeat(MAX_JOB_DESCRIPTION_LENGTH + 500) }, null)
    expect(p.jobDescription.startsWith("d")).toBe(true)
    expect(p.jobDescription.length).toBe(MAX_JOB_DESCRIPTION_LENGTH)
    expect(p.jobTitle.length).toBe(100)
  })
})

describe("niveau par défaut d'une alternance ou d'un stage", () => {
  it("Junior quand l'onboarding n'a pas de niveau valide et que l'offre est une alternance ou un stage", () => {
    expect(buildInterviewPreset({ ...opp, title: "Développeur web en alternance" }, null).level).toBe("Junior")
    expect(buildInterviewPreset({ ...opp, title: "Stage développeur" }, { targetJob: { level: "Dieu" } }).level).toBe("Junior")
    expect(buildInterviewPreset({ ...opp, description: "Contrat d'apprentissage de 24 mois dans une équipe produit." }, null).level).toBe("Junior")
    expect(buildInterviewPreset({ ...opp, metadata: { contractType: "ALTERNANCE" } }, null).level).toBe("Junior")
    expect(buildInterviewPreset({ ...opp, metadata: { contractType: "STAGE" } }, null).level).toBe("Junior")
  })

  it("le niveau de l'onboarding reste prioritaire", () => {
    expect(buildInterviewPreset({ ...opp, title: "Stage développeur" }, { targetJob: { level: "Lead" } }).level).toBe("Lead")
  })

  it("Senior pour une offre ordinaire (CDI, CDD…), métadonnées absentes ou invalides", () => {
    expect(buildInterviewPreset({ ...opp, metadata: { contractType: "CDI" } }, null).level).toBe("Senior")
    expect(buildInterviewPreset({ ...opp, metadata: "n'importe quoi" }, null).level).toBe("Senior")
    expect(buildInterviewPreset(opp, null).level).toBe("Senior")
  })

  it("isEarlyCareerOffer : mots entiers seulement, début de description seulement", () => {
    expect(isEarlyCareerOffer({ title: "Ingénieur", description: "x".repeat(700) + " alternance", metadata: null })).toBe(false)
    expect(isEarlyCareerOffer({ title: "Responsable stagiaires", description: "", metadata: null })).toBe(false)
    expect(isEarlyCareerOffer({ title: "Alternant(e) comptable", description: "", metadata: null })).toBe(true)
  })
})
