import { describe, it, expect } from "vitest"
import { CvDocumentSchema, type CvDocument } from "./document"
import { documentFromForm, formFromDocument, parseBullets, parseList } from "./form"

const DOC: CvDocument = {
  personal: { name: "Marie Dupont", email: "m@exemple.test", phone: "", location: "Lyon", linkedin: "" },
  headline: "Développeuse",
  summary: "Profil.",
  experiences: [
    { title: "Dev", company: "Acme", startDate: "2020", endDate: "", current: true, bullets: ["A", "B"] },
    { title: "Dev", company: "Beta", startDate: "2018", endDate: "2020", current: false, bullets: [] },
  ],
  education: [{ degree: "Master", institution: "Univ", year: "2018" }],
  skills: { technical: ["TS", "React"], languages: ["Français"], soft: [] },
}

describe("modèle de formulaire", () => {
  it("aller-retour document → formulaire → document sans perte", () => {
    expect(documentFromForm(formFromDocument(DOC))).toEqual(DOC)
  })

  it("les puces se saisissent une par ligne, marqueurs collés retirés", () => {
    expect(parseBullets("- Un\n• Deux\n  * Trois\n\n   \nQuatre")).toEqual(["Un", "Deux", "Trois", "Quatre"])
  })

  it("les compétences se séparent par virgule, point-virgule ou ligne, sans doublon", () => {
    expect(parseList("TS, React; Node\nTS,  ,")).toEqual(["TS", "React", "Node"])
  })

  it("un poste actuel n'a pas de date de fin", () => {
    const form = formFromDocument(DOC)
    form.experiences[0].endDate = "2099"
    expect(documentFromForm(form).experiences[0].endDate).toBe("")
  })

  it("le document produit respecte le schéma de l'API", () => {
    expect(CvDocumentSchema.safeParse(documentFromForm(formFromDocument(DOC))).success).toBe(true)
  })
})
