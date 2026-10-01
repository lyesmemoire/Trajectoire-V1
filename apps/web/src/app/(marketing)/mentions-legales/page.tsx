// Mentions légales : contenu piloté par lib/legal/publisher.ts (aucune donnée écrite ici).
//
// Tant que les champs obligatoires ne sont pas renseignés, la page répond 404 en production
// (jamais d'identité vide ou inventée) ; en développement elle s'affiche avec les champs à compléter.

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  PUBLISHER,
  canShowLegalNotice,
  getMissingPublisherFields,
} from "@/lib/legal/publisher"

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, directeur de la publication, hébergeur et médiation de la consommation.",
}

const IS_PRODUCTION = process.env.NODE_ENV === "production"

/** Valeur renseignée, ou (hors production seulement) un repère « À compléter ». */
function Value({ value, optional = false }: { value: string; optional?: boolean }) {
  const v = value.trim()
  if (v) return <>{v}</>
  if (IS_PRODUCTION) return null
  if (optional) return <span className="text-xs text-ink-600">Facultatif</span>
  return (
    <mark className="rounded bg-calm-warn-soft px-1.5 py-0.5 text-xs font-semibold text-calm-warn">À compléter</mark>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-2 sm:flex-row sm:gap-6">
      <dt className="w-56 shrink-0 font-medium text-ink-900">{label}</dt>
      <dd className="text-ink-700">{children}</dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-ink-900">{title}</h2>
      {children}
    </section>
  )
}

export default function LegalNoticePage() {
  if (!canShowLegalNotice()) notFound()

  const p = PUBLISHER
  const missing = getMissingPublisherFields()

  return (
    <div className="min-h-screen bg-ivoire-50">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <Link
          href="/"
          className="mb-8 inline-flex min-h-11 items-center text-sm text-ink-600 transition-colors hover:text-ink-900"
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="mb-8 text-4xl font-black text-ink-900">Mentions légales</h1>

        {missing.length > 0 && (
          <div role="note" className="mb-10 rounded-xl border border-calm-warn-line bg-calm-warn-soft p-5 text-sm text-calm-warn">
            <p className="font-semibold">Brouillon : cette page n&apos;est pas publiée en production.</p>
            <p className="mt-1">
              {missing.length} champ(s) obligatoire(s) à renseigner dans <code>src/lib/legal/publisher.ts</code> :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {missing.map(label => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-10">
          <Section title="1. Éditeur du site">
            <dl className="divide-y divide-ivoire-200">
              <Row label="Dénomination sociale">
                <Value value={p.companyName} />
              </Row>
              <Row label="Forme juridique">
                <Value value={p.legalForm} />
              </Row>
              {(p.shareCapital.trim() || !IS_PRODUCTION) && (
                <Row label="Capital social">
                  <Value value={p.shareCapital} optional />
                </Row>
              )}
              <Row label="Siège social">
                <Value value={p.registeredAddress} />
              </Row>
              <Row label="Immatriculation">
                <Value value={p.registryName} /> · n° <Value value={p.registrationNumber} />
              </Row>
              <Row label="TVA intracommunautaire">
                <Value value={p.vatNumber} />
              </Row>
              <Row label="Directeur de la publication">
                <Value value={p.publicationDirector} />
              </Row>
            </dl>
          </Section>

          <Section title="2. Contact">
            <dl className="divide-y divide-ivoire-200">
              <Row label="E-mail">
                <Value value={p.contactEmail} />
              </Row>
              <Row label="Téléphone">
                <Value value={p.contactPhone} />
              </Row>
            </dl>
          </Section>

          <Section title="3. Hébergement">
            <dl className="divide-y divide-ivoire-200">
              <Row label="Hébergeur">
                <Value value={p.host.name} />
              </Row>
              <Row label="Adresse">
                <Value value={p.host.address} />
              </Row>
              <Row label="Téléphone">
                <Value value={p.host.phone} />
              </Row>
              {(p.host.website.trim() || !IS_PRODUCTION) && (
                <Row label="Site web">
                  <Value value={p.host.website} optional />
                </Row>
              )}
            </dl>
          </Section>

          <Section title="4. Médiation de la consommation">
            <p className="mb-4 text-ink-700">
              Conformément aux articles L.611-1 et suivants du Code de la consommation, le consommateur a le droit
              de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d&apos;un
              litige qui l&apos;oppose au professionnel, après une réclamation écrite préalable auprès de celui-ci.
            </p>
            <dl className="divide-y divide-ivoire-200">
              <Row label="Médiateur">
                <Value value={p.mediator.name} />
              </Row>
              {(p.mediator.address.trim() || !IS_PRODUCTION) && (
                <Row label="Adresse">
                  <Value value={p.mediator.address} optional />
                </Row>
              )}
              <Row label="Site web">
                <Value value={p.mediator.website} />
              </Row>
            </dl>
          </Section>

          <Section title="5. Données personnelles">
            <p className="text-ink-700">
              Le traitement de vos données est décrit dans notre{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-ink-900">
                politique de confidentialité
              </Link>
              . Pour exercer vos droits (accès, rectification, effacement, opposition, limitation, portabilité),
              écrivez à <Value value={p.dataProtectionEmail} />. Vous pouvez aussi introduire une réclamation auprès
              de l&apos;autorité de contrôle compétente (en France, la CNIL : www.cnil.fr).
            </p>
          </Section>

          <Section title="6. Propriété intellectuelle">
            <p className="text-ink-700">
              La structure, les textes, les graphismes, les logiciels et la marque Trajectoire sont protégés par le
              droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans
              autorisation écrite préalable de l&apos;éditeur est interdite. Les CV et documents que vous déposez
              restent votre propriété.
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}
