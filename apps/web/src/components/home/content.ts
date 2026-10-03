/**
 * Contenu de la homepage V3 (voir docs/design/homepage-v3-brief.md). Aucun chiffre ni prix ici : les tarifs sont lus
 * dans `lib/plans.ts`. Les espaces insécables françaises sont posées par le codemod de typographie.
 */

/** Interrupteurs de la page : composants prêts, masqués tant qu'il n'y a ni visuel ni contenu réel. */
export const SHOW_PORTRAIT = true
/** Portrait d'Alexandra : personnage généré par IA (jamais présenté comme une personne réelle). */
export const ALEXANDRA_PORTRAIT_SRC = "/images/alexandra-portrait.jpg"
export const ALEXANDRA_NAME = "Alexandra"
export const ALEXANDRA_ROLE = "votre recruteuse d’entraînement"
export const ALEXANDRA_PORTRAIT_CAPTION = `${ALEXANDRA_NAME}, ${ALEXANDRA_ROLE}`
export const ALEXANDRA_PORTRAIT_NOTE = "Personnage généré par IA"
/** Lecteur « Écouter Alexandra » : masqué tant qu'aucun extrait audio réel n'existe. */
export const SHOW_HERO_AUDIO = false
/** Témoignages : composant prêt, masqué tant qu'il n'existe aucun témoignage réel. */
export const SHOW_TESTIMONIALS = false
/** Lien « offre établissements » (/ecoles) : masqué tant que la page n'existe pas (elle répondrait 404). */
export const SHOW_SCHOOLS_LINK = false
export { PURCHASE_ENABLED, PURCHASE_SOON_LABEL } from "@/lib/billing/purchase-gate"
/** Badge de l'offre mise en avant (plan.highlighted dans lib/plans.ts). */
export const FEATURED_PLAN_BADGE = "Recommandé"
/** Avantages réels de l'offre gratuite, affichés à la place des lignes « non inclus ». */
export const FREE_PLAN_EXTRAS = ["Résultat immédiat, sans carte bancaire", "Le texte de votre CV n’est pas conservé"] as const

/**
 * Échauffement gratuit (simulation vocale incluse dans l'offre gratuite) : faux tant que le lot B et la voix ne sont
 * pas en production. Tant qu'il est faux, la page ne promet aucune simulation gratuite : l'offre gratuite est le
 * diagnostic du CV, l'entretien vocal fait partie des offres payantes. À passer à true seulement quand c'est vrai.
 */
export const FREE_WARMUP_ENABLED = false

export const HERO_EYEBROW = "L’entretien commence avant l’entretien"
export const HERO_SUBTITLE =
  "Déposez votre CV. Trajectoire repère ce qu’un recruteur voudra creuser, puis vous entraîne à voix haute avec Alexandra, sans jugement."

export const HOME_DESCRIPTION = FREE_WARMUP_ENABLED
  ? "Alexandra, votre recruteuse d’entraînement, vous pose les vraies questions de l’offre que vous visez. À voix haute, sans jugement, puis un rapport clair pour progresser. Diagnostic gratuit."
  : "Découvrez gratuitement ce qu’un recruteur voudra creuser dans votre CV, puis entraînez-vous à voix haute avec Alexandra, votre recruteuse d’entraînement, avec une offre payante."

/** Aperçu anonyme : aucun compte requis (tunnel /api/public/analyze-preview), analyse déterministe sans IA. */
export const FORM_NOTE = "Gratuit · sans carte bancaire · sans compte"

export const HERO_CARD_BADGE = FREE_WARMUP_ENABLED ? null : "Offres payantes"

/**
 * Colonne de droite du héros : vidéo de démonstration (true) ou carte d'Alexandra (false, retour arrière en une ligne).
 */
export const SHOW_HERO_VIDEO = false

/** Durée réelle de la vidéo : 54,8 s. */
export const HERO_VIDEO_BUTTON = "Voir un extrait d’entretien (55 s)"
export const HERO_VIDEO_CAPTION = "Démonstration d’un entretien avec Alexandra"

export const HERO_QUESTION =
  "Vous avez animé les réseaux sociaux de votre association étudiante. Qu’est-ce qui a le mieux fonctionné, et comment l’avez-vous mesuré ?"

export interface Segment {
  id: string
  label: string
  questions: readonly [string, string, string]
}

export const SEGMENTS: readonly Segment[] = [
  {
    id: "alternance",
    label: "Alternance",
    questions: [
      "Pourquoi l’alternance, et pourquoi chez nous ?",
      "Comment allez-vous gérer le rythme école-entreprise ?",
      "Parlez-moi d’une difficulté que vous avez surmontée.",
    ],
  },
  {
    id: "stage",
    label: "Stage",
    questions: [
      "Qu’attendez-vous de ce stage ?",
      "Quel projet de cours vous a le plus appris ?",
      "Comment vous organisez-vous quand tout arrive en même temps ?",
    ],
  },
  {
    id: "premier-emploi",
    label: "Premier emploi",
    questions: [
      "Vous avez peu d’expérience : pourquoi vous ?",
      "Racontez-moi un projet dont vous êtes fier.",
      "Où vous voyez-vous dans trois ans ?",
    ],
  },
  {
    id: "oral-ecole",
    label: "Oral d’école",
    questions: [
      "Pourquoi notre école plutôt qu’une autre ?",
      "Quel est votre projet professionnel ?",
      "Parlez-moi d’un échec et de ce qu’il vous a appris.",
    ],
  },
  {
    id: "reconversion",
    label: "Reconversion",
    questions: [
      "Pourquoi changer de métier maintenant ?",
      "Qu’est-ce qui, dans votre parcours, vous sert pour ce poste ?",
      "Comment comblez-vous ce qui vous manque encore ?",
    ],
  },
  {
    id: "cadre",
    label: "Cadre",
    questions: [
      "Comment avez-vous géré un conflit dans votre équipe ?",
      "Quelle décision difficile avez-vous dû prendre ?",
      "Quelles sont vos prétentions salariales ?",
    ],
  },
]

export const METHOD = {
  index: "01 / La méthode",
  title: "Pas de questions génériques.",
  accent: "Les vôtres.",
  text: "Trajectoire lit entre les lignes de votre CV pour faire émerger les expériences qui méritent une réponse claire, concrète et personnelle.",
}

export const STEPS = [
  {
    kicker: "Étape 1 · résultat immédiat, gratuit",
    title: "Déposez votre CV",
    text: "Et l’offre visée si vous l’avez. Trajectoire repère vos atouts et ce qu’un recruteur voudra creuser.",
  },
  {
    // Durées proposées à la création d'une simulation : 10, 15, 20 ou 30 minutes.
    kicker: "Étape 2 · 10 à 30 minutes",
    title: "Échangez avec Alexandra",
    text: FREE_WARMUP_ENABLED
      ? "Un échauffement à voix haute, comme un vrai entretien. Elle s’appuie sur votre parcours, sans vous piéger."
      : "L’entretien à voix haute fait partie des offres payantes. Alexandra s’appuie sur votre parcours, sans vous piéger.",
  },
  {
    kicker: "Étape 3 · à la fin de l’entretien",
    title: "Progressez, question par question",
    text: "Un point fort, un axe prioritaire, une version plus claire de votre réponse.",
  },
] as const

export const FOR_WHOM = {
  index: "02 / Pour qui",
  title: "Pour les moments où l’on veut être prêt, pas parfait.",
  text: "Alternance, premier poste, reconversion, entretien final : entraînez-vous à raconter ce que vous savez déjà faire.",
  pickerTitle: "Le jour J, vous aurez déjà répondu à ces questions.",
  pickerLabel: "Type d’entretien",
}

export const REPORT_INTRO = {
  index: "03 / Le rapport",
  title: "Un rapport qui vous fait progresser,",
  accent: "pas douter.",
  text: "Pas de liste de quinze défauts. L’essentiel, formulé avec bienveillance.",
}

export const CONVICTION = {
  eyebrow: "Notre conviction",
  title: "Ici, vous avez le droit de",
  accent: "vous tromper.",
  text: "Le stress se travaille comme le reste. Plus vous vous entraînez au calme, plus le jour J ressemble à quelque chose que vous connaissez déjà.",
}

export const PRICING_HEAD = { index: "04 / Tarifs", title: "Commencez", accent: "gratuitement." }

export const FAQ_INDEX = "05 / Questions fréquentes"

export const CLOSING = {
  eyebrow: "Votre prochaine réponse",
  title: "Elle commence",
  accent: "ici.",
  note: "Gratuit · sans carte bancaire",
}

export const FOOTER_TAGLINE = "Préparez ce que votre CV ne peut pas dire seul."

export const PRICING_INTRO = FREE_WARMUP_ENABLED
  ? "Commencez sans payer, puis choisissez l’offre qui correspond à votre recherche. L’offre Pro est sans engagement et résiliable à tout moment."
  : "Le diagnostic de votre CV est gratuit, sans carte bancaire. L’entretien vocal fait partie des offres payantes."

export const REPORT_EXAMPLE = {
  strength: "Des exemples concrets, tirés de vos expériences.",
  priority: "Conclure chaque réponse par un résultat.",
  answer: "J’ai posté régulièrement et ça a plutôt bien marché.",
  clearer:
    "J’ai mis en place un calendrier de publication hebdomadaire. En un semestre, nos événements ont attiré davantage de participants.",
} as const

export const REASSURANCE = [
  {
    title: "Entraînement privé",
    text: "Vous vous entraînez seul(e) face à Alexandra, sans public et sans note partagée.",
  },
  {
    title: "Un entraînement sur mesure",
    text: "Les questions partent de votre CV et de l’offre visée, pas d’un script générique.",
  },
  {
    title: "Reformulez librement",
    text: "Une réponse maladroite n’est pas une note : c’est un point de départ.",
  },
  {
    title: "Vos données vous appartiennent",
    text: "Supprimez votre compte à tout moment : vos CV et vos simulations sont supprimés avec lui.",
  },
] as const

export interface Testimonial {
  quote: string
  author: string
  context: string
}

/** Vide tant qu'il n'existe aucun témoignage réel : ne jamais en inventer. */
export const TESTIMONIALS: readonly Testimonial[] = []

export const FAQ = [
  {
    q: "Qu’est-ce qui est gratuit ?",
    a: "Le diagnostic de votre CV : un score et trois remarques, sans carte bancaire. Les simulations d’entretien et le rapport détaillé font partie des offres payantes.",
  },
  {
    q: "Comment se passe un entretien ?",
    a: "Vous indiquez le poste visé et choisissez une durée, de 10 à 30 minutes. Alexandra vous pose ses questions à voix haute et vous répondez au micro. Si le micro pose problème, vous pouvez répondre par écrit.",
  },
  {
    q: "Que contient le rapport ?",
    a: "Un point fort, un axe à travailler en priorité, puis un retour question par question avec une version plus claire de vos réponses. Il est préparé à la fin de chaque simulation.",
  },
  {
    q: "Je suis très stressé en entretien. Est-ce adapté ?",
    a: "Oui, c’est fait pour ça. Vous vous entraînez à votre rythme, sans public. Le stress se travaille comme le reste : en s’entraînant au calme.",
  },
  {
    q: "Que deviennent mon CV et mes réponses ?",
    a: "L’aperçu gratuit ne conserve pas le texte de votre CV. Avec un compte, vos CV et vos simulations sont conservés tant qu’il existe ; vous pouvez le supprimer à tout moment depuis les paramètres, et tout est alors supprimé avec lui.",
  },
  {
    q: "Est-ce que ça remplace un coach ?",
    a: "Non, et ce n’est pas le but. Trajectoire vous permet de vous entraîner seul(e), à l’heure qui vous convient. Un coach reste précieux pour un accompagnement personnalisé : les deux se complètent.",
  },
  {
    q: "Puis-je préparer un oral d’école ?",
    a: "Les questions partent de votre CV et du texte que vous ajoutez à la place d’une offre, par exemple la présentation de la formation visée. Vous pouvez donc vous en servir pour vous préparer à un oral d’école.",
  },
] as const

export const NAV_LINKS = [
  { href: "#methode", label: "La méthode" },
  { href: "#pour-qui", label: "Pour qui" },
  { href: "#tarifs", label: "Tarifs" },
] as const
