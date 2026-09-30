/**
 * Identité légale de l'éditeur du site : SEULE source des mentions légales, des CGU (article « Éditeur »)
 * et des adresses de contact affichées.
 *
 * ▶ À COMPLÉTER par l'éditeur avec ses informations réelles, puis à faire valider par un juriste.
 *   Aucune valeur n'est inventée ici : tant qu'un champ obligatoire est vide,
 *   - la page /mentions-legales répond 404 en production (et signale les champs manquants en développement) ;
 *   - le lien du pied de page est masqué en production ;
 *   - l'article « Éditeur » des CGU renvoie aux mentions légales sans donner d'identité.
 *
 * Vérification avant lancement : `LEGAL_REQUIRED=1 pnpm --dir apps/web exec vitest run src/lib/legal`
 * (le test échoue tant qu'il manque un champ obligatoire).
 *
 * Éditeur personne physique (entreprise individuelle sans personnalité morale) : renseigner nom et
 * prénom dans `companyName`, le domicile dans `registeredAddress`, et laisser `shareCapital` vide.
 */

export type PublisherInfo = {
  /** Dénomination sociale (ou nom et prénom pour une personne physique). */
  companyName: string
  /** Forme juridique : SAS, SARL, EOOD, micro-entreprise… */
  legalForm: string
  /** Capital social, ex. « 10 000 € ». Facultatif (sociétés à capital uniquement). */
  shareCapital: string
  /** Adresse du siège social (ou domicile). */
  registeredAddress: string
  /** Registre d'immatriculation, ex. « RCS Paris » ou « Registre du commerce de Bulgarie ». */
  registryName: string
  /** Numéro d'immatriculation (SIREN / numéro de registre). */
  registrationNumber: string
  /** Numéro de TVA intracommunautaire. */
  vatNumber: string
  /** Nom du directeur de la publication. */
  publicationDirector: string
  /** Adresse e-mail de contact professionnelle. */
  contactEmail: string
  /** Numéro de téléphone (exigé par la LCEN pour l'éditeur et l'hébergeur). */
  contactPhone: string
  /** Contact pour l'exercice des droits sur les données personnelles (DPO ou responsable). */
  dataProtectionEmail: string
  host: {
    /** Nom ou dénomination sociale de l'hébergeur. */
    name: string
    /** Adresse de l'hébergeur. */
    address: string
    /** Téléphone de l'hébergeur. */
    phone: string
    /** Site web de l'hébergeur (facultatif). */
    website: string
  }
  mediator: {
    /** Médiateur de la consommation auquel l'éditeur est rattaché. */
    name: string
    /** Adresse postale du médiateur (facultatif si le site suffit). */
    address: string
    /** Site web du médiateur (permet de déposer une réclamation en ligne). */
    website: string
  }
}

export const PUBLISHER: PublisherInfo = {
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

type FieldSpec = { label: string; get: (info: PublisherInfo) => string }

/** Champs obligatoires (le capital, le site de l'hébergeur et l'adresse du médiateur sont facultatifs). */
export const REQUIRED_PUBLISHER_FIELDS: FieldSpec[] = [
  { label: "Dénomination sociale (companyName)", get: i => i.companyName },
  { label: "Forme juridique (legalForm)", get: i => i.legalForm },
  { label: "Adresse du siège (registeredAddress)", get: i => i.registeredAddress },
  { label: "Registre d'immatriculation (registryName)", get: i => i.registryName },
  { label: "Numéro d'immatriculation (registrationNumber)", get: i => i.registrationNumber },
  { label: "TVA intracommunautaire (vatNumber)", get: i => i.vatNumber },
  { label: "Directeur de la publication (publicationDirector)", get: i => i.publicationDirector },
  { label: "E-mail de contact (contactEmail)", get: i => i.contactEmail },
  { label: "Téléphone (contactPhone)", get: i => i.contactPhone },
  { label: "Contact données personnelles (dataProtectionEmail)", get: i => i.dataProtectionEmail },
  { label: "Hébergeur : nom (host.name)", get: i => i.host.name },
  { label: "Hébergeur : adresse (host.address)", get: i => i.host.address },
  { label: "Hébergeur : téléphone (host.phone)", get: i => i.host.phone },
  { label: "Médiateur de la consommation : nom (mediator.name)", get: i => i.mediator.name },
  { label: "Médiateur de la consommation : site (mediator.website)", get: i => i.mediator.website },
]

export function getMissingPublisherFields(info: PublisherInfo = PUBLISHER): string[] {
  return REQUIRED_PUBLISHER_FIELDS.filter(f => f.get(info).trim() === "").map(f => f.label)
}

export function isPublisherComplete(info: PublisherInfo = PUBLISHER): boolean {
  return getMissingPublisherFields(info).length === 0
}

/**
 * Les mentions légales sont visibles si elles sont complètes, ou hors production (aperçu de travail).
 * En production, une page incomplète ne doit jamais s'afficher.
 */
export function canShowLegalNotice(info: PublisherInfo = PUBLISHER): boolean {
  return isPublisherComplete(info) || process.env.NODE_ENV !== "production"
}

/** Phrase d'identification de l'éditeur pour les CGU ; `null` tant que les informations sont incomplètes. */
export function describePublisher(info: PublisherInfo = PUBLISHER): string | null {
  if (!isPublisherComplete(info)) return null
  const capital = info.shareCapital.trim() ? `, au capital de ${info.shareCapital.trim()}` : ""
  return (
    `Le service Trajectoire est édité par ${info.companyName.trim()}, ${info.legalForm.trim()}${capital}, ` +
    `immatriculée au ${info.registryName.trim()} sous le numéro ${info.registrationNumber.trim()}, ` +
    `numéro de TVA intracommunautaire ${info.vatNumber.trim()}, dont le siège social est situé ${info.registeredAddress.trim()}.`
  )
}

/** Adresse de contact affichée : la valeur renseignée, sinon l'adresse provisoire actuelle du site. */
export const LEGACY_CONTACT_EMAIL = "anislamine1980@gmail.com"
export function contactEmail(info: PublisherInfo = PUBLISHER): string {
  return info.contactEmail.trim() || LEGACY_CONTACT_EMAIL
}
