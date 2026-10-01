"use client"

import { useState } from "react"
import Link from "next/link"
import { csrfFetch } from "@/lib/security/csrf-client"
import { CvDocumentSchema, type CvDocument } from "@/lib/cv-export/document"
import { documentFromForm, formFromDocument, type CvForm, type EducationForm, type ExperienceForm } from "@/lib/cv-export/form"

type Summary = { id: string; text: string; date: string }
type Format = "docx" | "pdf"

const MAX_EXPERIENCES = 20
const MAX_EDUCATION = 10

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-calm-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-calm-bg"
const inputClass = `w-full rounded-xl border border-calm-line bg-calm-bg px-3 py-2.5 text-sm text-calm-ink placeholder:text-calm-tertiary ${focusRing}`
const buttonGhost = `inline-flex min-h-11 items-center justify-center rounded-xl border border-calm-line bg-calm-accent-wash px-4 text-sm font-medium text-calm-ink transition-colors hover:bg-calm-accent-soft disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`

const EMPTY_EXPERIENCE: ExperienceForm = { title: "", company: "", startDate: "", endDate: "", current: false, bulletsText: "" }
const EMPTY_EDUCATION: EducationForm = { degree: "", institution: "", year: "" }

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-calm-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-calm-secondary">{hint}</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-calm-line bg-calm-surface p-6">
      <h2 className="mb-4 text-lg font-semibold text-calm-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

/** Nom du fichier annoncé par le serveur (en-tête Content-Disposition), sinon un nom par défaut. */
function downloadName(response: Response, format: Format): string {
  const match = /filename="([^"]+)"/.exec(response.headers.get("content-disposition") ?? "")
  return match?.[1] ?? `CV.${format}`
}

/**
 * Éditeur d'export du CV : pré-rempli depuis l'extraction automatique, relu et corrigé par l'utilisateur,
 * puis envoyé à /api/cv/export (DOCX ou PDF). Rien n'est enregistré : le fichier est généré à la volée.
 */
export function CvExportEditor({
  analysisId,
  initialDocument,
  summaries,
}: {
  analysisId: string
  initialDocument: CvDocument
  summaries: Summary[]
}) {
  const [form, setForm] = useState<CvForm>(() => formFromDocument(initialDocument))
  const [busy, setBusy] = useState<Format | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [planRequired, setPlanRequired] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  const patch = (changes: Partial<CvForm>) => setForm((f) => ({ ...f, ...changes }))
  const setPersonal = (key: keyof CvForm["personal"], value: string) =>
    setForm((f) => ({ ...f, personal: { ...f.personal, [key]: value } }))
  const setExperience = (index: number, changes: Partial<ExperienceForm>) =>
    setForm((f) => ({ ...f, experiences: f.experiences.map((e, i) => (i === index ? { ...e, ...changes } : e)) }))
  const setEducation = (index: number, changes: Partial<EducationForm>) =>
    setForm((f) => ({ ...f, education: f.education.map((e, i) => (i === index ? { ...e, ...changes } : e)) }))

  async function download(format: Format) {
    if (busy) return
    setError(null)
    setDone(null)
    setPlanRequired(false)

    const document = documentFromForm(form)
    if (!document.personal.name.trim()) {
      setError("Renseignez votre nom : il sert de titre au CV et au nom du fichier.")
      return
    }
    const check = CvDocumentSchema.safeParse(document)
    if (!check.success) {
      const path = check.error.issues[0]?.path.join(" › ") ?? ""
      setError(`Un champ dépasse la longueur autorisée${path ? ` (${path})` : ""}. Raccourcissez-le puis réessayez.`)
      return
    }

    setBusy(format)
    try {
      const response = await csrfFetch("/api/cv/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, format, document }),
      })

      if (response.status === 403) {
        setPlanRequired(true)
        return
      }
      if (response.status === 429) {
        setError("Trop de téléchargements en peu de temps. Patientez quelques minutes puis réessayez.")
        return
      }
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setError(payload?.error ?? "Le téléchargement a échoué. Réessayez dans un instant.")
        return
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = window.document.createElement("a")
      link.href = url
      link.download = downloadName(response, format)
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      setDone(`${link.download} téléchargé.`)
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau puis réessayez.")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      <Section title="Identité">
        <Field id="cv-name" label="Nom complet *">
          <input id="cv-name" className={inputClass} maxLength={120} value={form.personal.name} onChange={(e) => setPersonal("name", e.target.value)} autoComplete="name" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="cv-email" label="E-mail">
            <input id="cv-email" type="email" className={inputClass} maxLength={160} value={form.personal.email} onChange={(e) => setPersonal("email", e.target.value)} autoComplete="email" />
          </Field>
          <Field id="cv-phone" label="Téléphone">
            <input id="cv-phone" type="tel" className={inputClass} maxLength={40} value={form.personal.phone} onChange={(e) => setPersonal("phone", e.target.value)} autoComplete="tel" />
          </Field>
          <Field id="cv-location" label="Ville">
            <input id="cv-location" className={inputClass} maxLength={120} value={form.personal.location} onChange={(e) => setPersonal("location", e.target.value)} />
          </Field>
          <Field id="cv-linkedin" label="LinkedIn ou site">
            <input id="cv-linkedin" className={inputClass} maxLength={200} value={form.personal.linkedin} onChange={(e) => setPersonal("linkedin", e.target.value)} />
          </Field>
        </div>
        <Field id="cv-headline" label="Titre professionnel" hint="Par exemple : « Développeuse full stack ».">
          <input id="cv-headline" className={inputClass} maxLength={160} value={form.headline} onChange={(e) => patch({ headline: e.target.value })} />
        </Field>
      </Section>

      <Section title="Profil">
        <Field id="cv-summary" label="Résumé" hint="Facultatif. Deux à quatre phrases.">
          <textarea id="cv-summary" rows={5} className={`${inputClass} resize-y leading-relaxed`} maxLength={2000} value={form.summary} onChange={(e) => patch({ summary: e.target.value })} />
        </Field>
        {summaries.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-calm-ink">Utiliser une version réécrite</p>
            <ul className="space-y-2">
              {summaries.map((s) => (
                <li key={s.id} className="rounded-xl border border-calm-line bg-calm-bg/50 p-3">
                  <p className="line-clamp-3 whitespace-pre-wrap text-sm text-calm-ink">{s.text}</p>
                  <button type="button" className={`${buttonGhost} mt-2`} onClick={() => patch({ summary: s.text.slice(0, 2000) })}>
                    Insérer dans le profil
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Expérience professionnelle">
        {form.experiences.length === 0 && <p className="text-sm text-calm-secondary">Aucune expérience. Ajoutez-en une si elle figure sur votre CV.</p>}
        {form.experiences.map((e, i) => (
          <fieldset key={i} className="space-y-4 rounded-xl border border-calm-line bg-calm-bg/40 p-4">
            <legend className="px-1 text-sm font-medium text-calm-ink">Expérience {i + 1}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id={`exp-title-${i}`} label="Poste">
                <input id={`exp-title-${i}`} className={inputClass} maxLength={160} value={e.title} onChange={(ev) => setExperience(i, { title: ev.target.value })} />
              </Field>
              <Field id={`exp-company-${i}`} label="Entreprise">
                <input id={`exp-company-${i}`} className={inputClass} maxLength={160} value={e.company} onChange={(ev) => setExperience(i, { company: ev.target.value })} />
              </Field>
              <Field id={`exp-start-${i}`} label="Début" hint="Ex. : 2019 ou 03/2019">
                <input id={`exp-start-${i}`} className={inputClass} maxLength={40} value={e.startDate} onChange={(ev) => setExperience(i, { startDate: ev.target.value })} />
              </Field>
              <Field id={`exp-end-${i}`} label="Fin">
                <input id={`exp-end-${i}`} className={`${inputClass} disabled:opacity-50`} maxLength={40} value={e.current ? "" : e.endDate} disabled={e.current} onChange={(ev) => setExperience(i, { endDate: ev.target.value })} />
              </Field>
            </div>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-calm-ink">
              <input type="checkbox" className="size-5 accent-calm-accent" checked={e.current} onChange={(ev) => setExperience(i, { current: ev.target.checked })} />
              Poste actuel
            </label>
            <Field id={`exp-bullets-${i}`} label="Missions et réalisations" hint="Une ligne par point. Conservez vos chiffres et résultats.">
              <textarea id={`exp-bullets-${i}`} rows={5} className={`${inputClass} resize-y leading-relaxed`} value={e.bulletsText} onChange={(ev) => setExperience(i, { bulletsText: ev.target.value })} />
            </Field>
            <button type="button" className={buttonGhost} onClick={() => setForm((f) => ({ ...f, experiences: f.experiences.filter((_, k) => k !== i) }))}>
              Supprimer cette expérience
            </button>
          </fieldset>
        ))}
        <button type="button" className={buttonGhost} disabled={form.experiences.length >= MAX_EXPERIENCES} onClick={() => setForm((f) => ({ ...f, experiences: [...f.experiences, EMPTY_EXPERIENCE] }))}>
          Ajouter une expérience
        </button>
      </Section>

      <Section title="Formation">
        {form.education.length === 0 && <p className="text-sm text-calm-secondary">Aucune formation.</p>}
        {form.education.map((e, i) => (
          <fieldset key={i} className="space-y-4 rounded-xl border border-calm-line bg-calm-bg/40 p-4">
            <legend className="px-1 text-sm font-medium text-calm-ink">Formation {i + 1}</legend>
            <Field id={`edu-degree-${i}`} label="Diplôme">
              <input id={`edu-degree-${i}`} className={inputClass} maxLength={200} value={e.degree} onChange={(ev) => setEducation(i, { degree: ev.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
              <Field id={`edu-inst-${i}`} label="Établissement">
                <input id={`edu-inst-${i}`} className={inputClass} maxLength={200} value={e.institution} onChange={(ev) => setEducation(i, { institution: ev.target.value })} />
              </Field>
              <Field id={`edu-year-${i}`} label="Année">
                <input id={`edu-year-${i}`} className={inputClass} maxLength={10} inputMode="numeric" value={e.year} onChange={(ev) => setEducation(i, { year: ev.target.value })} />
              </Field>
            </div>
            <button type="button" className={buttonGhost} onClick={() => setForm((f) => ({ ...f, education: f.education.filter((_, k) => k !== i) }))}>
              Supprimer cette formation
            </button>
          </fieldset>
        ))}
        <button type="button" className={buttonGhost} disabled={form.education.length >= MAX_EDUCATION} onClick={() => setForm((f) => ({ ...f, education: [...f.education, EMPTY_EDUCATION] }))}>
          Ajouter une formation
        </button>
      </Section>

      <Section title="Compétences">
        <Field id="skills-tech" label="Techniques" hint="Séparées par des virgules.">
          <input id="skills-tech" className={inputClass} value={form.skills.technical} onChange={(e) => setForm((f) => ({ ...f, skills: { ...f.skills, technical: e.target.value } }))} />
        </Field>
        <Field id="skills-lang" label="Langues">
          <input id="skills-lang" className={inputClass} value={form.skills.languages} onChange={(e) => setForm((f) => ({ ...f, skills: { ...f.skills, languages: e.target.value } }))} />
        </Field>
        <Field id="skills-soft" label="Savoir-être">
          <input id="skills-soft" className={inputClass} value={form.skills.soft} onChange={(e) => setForm((f) => ({ ...f, skills: { ...f.skills, soft: e.target.value } }))} />
        </Field>
      </Section>

      <section className="rounded-2xl border border-calm-line bg-calm-surface p-6">
        <h2 className="mb-2 text-lg font-semibold text-calm-ink">Télécharger</h2>
        <p className="mb-4 text-sm text-calm-secondary">
          Une seule colonne, titres standards, texte sélectionnable : le format attendu par les logiciels de recrutement. Le PDF ne gère
          pas les alphabets non latins (utilisez alors le DOCX).
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy !== null} onClick={() => download("docx")} className={`inline-flex min-h-11 items-center justify-center rounded-xl bg-calm-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-calm-accent disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}>
            {busy === "docx" ? "Génération…" : "Télécharger en DOCX"}
          </button>
          <button type="button" disabled={busy !== null} onClick={() => download("pdf")} className={buttonGhost}>
            {busy === "pdf" ? "Génération…" : "Télécharger en PDF"}
          </button>
        </div>

        <div aria-live="polite" className="mt-4 space-y-3">
          {done && <p className="rounded-xl border border-calm-accent-line bg-calm-accent-soft p-3 text-sm text-calm-accent">{done}</p>}
          {error && (
            <p role="alert" className="rounded-xl border border-calm-warn-line bg-calm-warn-soft p-3 text-sm text-calm-warn">
              {error}
            </p>
          )}
          {planRequired && (
            <div role="alert" className="rounded-xl border border-calm-accent-line bg-calm-accent-soft p-4 text-sm text-calm-accent">
              <p className="font-medium">L&apos;export est inclus dans le Pack Entretien et dans Pro.</p>
              <Link href="/pricing" className={`mt-2 inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-calm-accent underline underline-offset-4 ${focusRing}`}>
                Voir les formules
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
