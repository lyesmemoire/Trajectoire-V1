/**
 * Normalisation et découpage de texte pour l'analyse de CV.
 * Insensible à la casse et aux accents ; correspondance par MOTS ENTIERS (jamais
 * par sous-chaîne : « go » ne doit pas se trouver dans « Google »).
 */

const STOPWORDS = new Set(
  (
    // français
    "le la les l un une des du de d et ou mais donc or ni car que qui quoi dont ou " +
    "ce cet cette ces cela ca ceci celui celle ceux celles il elle ils elles on nous vous je tu me te se " +
    "mon ma mes ton ta tes son sa ses notre nos votre vos leur leurs y en au aux a as ont est sont etre avoir " +
    "avec sans sous sur dans par pour vers chez entre depuis pendant avant apres comme plus moins tres tout " +
    "tous toute toutes autre autres meme aussi ainsi alors si non pas ne n s c j m t qu " +
    "etes sera seront serez peut peuvent doit doivent fait faire faites sont ete etait " +
    // anglais
    "the a an and or but of to in on at for from by with without as is are be been was were this that these those " +
    "it its we you your our their they he she his her i my me us them not no yes will would can could should may " +
    // mots génériques d'offres d'emploi
    "poste recherchons recherche rejoindre rejoignez profil mission missions entreprise societe candidat candidate " +
    "experience experiences annee annees an ans minimum souhaite souhaites souhaitee souhaitees exige exiges exigee " +
    "requis requise requises environnement cdi cdd offre emploi job years year required requirements looking seeking " +
    "vous serez assurez assurer realiser realisez charge chargee responsable " +
    "competence competences connaissance connaissances maitrise capacite capacites qualite qualites " +
    "travail service services personne personnes ere ee es euse trice"
  ).split(/\s+/),
)

const ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  postgres: "postgresql",
  k8s: "kubernetes",
  golang: "go",
  developer: "developpeur",
  developers: "developpeur",
  developpeuse: "developpeur",
  engineer: "ingenieur",
  node: "nodejs",
  reactjs: "react",
  vuejs: "vue",
  nextjs: "nextjs",
  "ci/cd": "cicd",
}

/** Minuscules, sans accents, apostrophes typographiques normalisées. */
export function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’‘`´]/g, "'")
}

const TOKEN_RE = /[a-z0-9]+(?:[.+#/-][a-z0-9]+)*[+#]*/g

/**
 * Découpe en jetons (les termes techniques `node.js`, `c++`, `ci/cd` restent entiers ;
 * les alternatives `SEA/SEO` sont séparées).
 */
export function tokenize(text: string): string[] {
  const out: string[] = []
  for (const token of normalize(text).match(TOKEN_RE) ?? []) {
    if (token.includes("/") && token !== "ci/cd") out.push(...token.split("/").filter(Boolean))
    else out.push(token)
  }
  return out
}

/** Forme canonique d'un jeton : alias techniques, ponctuation interne retirée. */
export function canonical(token: string): string {
  const alias = ALIASES[token]
  if (alias) return alias
  const stripped = token.replace(/[.-]/g, "")
  return ALIASES[stripped] ?? stripped
}

/** Racine légère (pluriels et féminins français/anglais) ; les jetons techniques restent intacts. */
export function stem(token: string): string {
  const t = canonical(token)
  if (/[0-9+#/]/.test(t) || t.length <= 4) return t
  let s = t
  if (s.length > 4 && (s.endsWith("s") || s.endsWith("x"))) s = s.slice(0, -1)
  for (let i = 0; i < 2 && s.length > 5 && s.endsWith("e"); i += 1) s = s.slice(0, -1)
  return s
}

export function isStopword(token: string): boolean {
  return STOPWORDS.has(token)
}

/** Ensemble des racines présentes dans un texte (pour tester la présence d'un terme). */
export function stemSet(text: string): Set<string> {
  return new Set(tokenize(text).map(stem))
}
