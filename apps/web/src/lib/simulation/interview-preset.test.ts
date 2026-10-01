import { describe, it, expect } from "vitest"
import { MAX_JOB_DESCRIPTION_LENGTH } from "./types"
import { DEFAULT_PRESET_DURATION_MINUTES, buildInterviewPreset } from "./interview-preset"

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
