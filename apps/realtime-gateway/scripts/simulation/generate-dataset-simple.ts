/**
 * Simple dataset generator without LLM dependency
 * Generates synthetic candidate profiles with predefined responses for each behavior type
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Profile {
  profileId: string;
  jobOffer: string;
  cv: string;
  behaviorType: string;
  responses: string[];
}

const BEHAVIOR_DEFINITIONS = [
  { id: "solid_1", type: "solid" },
  { id: "solid_2", type: "solid" },
  { id: "solid_3", type: "solid" },
  { id: "solid_4", type: "solid" },
  { id: "solid_5", type: "solid" },
  { id: "bluff_1", type: "bluff" },
  { id: "bluff_2", type: "bluff" },
  { id: "bluff_3", type: "bluff" },
  { id: "bluff_4", type: "bluff" },
  { id: "bluff_5", type: "bluff" },
  { id: "vague_1", type: "vague" },
  { id: "vague_2", type: "vague" },
  { id: "vague_3", type: "vague" },
  { id: "vague_4", type: "vague" },
  { id: "vague_5", type: "vague" },
  { id: "fragile_1", type: "fragile" },
  { id: "fragile_2", type: "fragile" },
  { id: "fragile_3", type: "fragile" },
  { id: "fragile_4", type: "fragile" },
  { id: "fragile_5", type: "fragile" },
  { id: "tech_1", type: "technical" },
  { id: "tech_2", type: "technical" },
  { id: "tech_3", type: "technical" },
  { id: "tech_4", type: "technical" },
  { id: "tech_5", type: "technical" },
  { id: "lead_1", type: "leadership" },
  { id: "lead_2", type: "leadership" },
  { id: "lead_3", type: "leadership" },
  { id: "lead_4", type: "leadership" },
  { id: "lead_5", type: "leadership" }
];

const RESPONSE_TEMPLATES = {
  solid: [
    "J'ai commencé comme développeur junior il y a 8 ans, puis j'ai évolué vers des rôles de senior et lead. J'ai travaillé sur des projets de grande envergure dans le e-commerce et la fintech.",
    "Je cherche de nouveaux défis après avoir réussi à scaler notre plateforme à 1 million d'utilisateurs actifs. Je veux rejoindre une équipe où je peux avoir un impact significatif.",
    "Je privilégie une approche pragmatique, en me concentrant sur la résolution de problèmes concrets avec des solutions testées et éprouvées.",
    "J'ai mené la refonte de notre architecture microservices, réduisant la latence de 40%. Nous avons utilisé Kubernetes et Docker pour l'orchestration.",
    "Pour optimiser les performances, j'ai implémenté un système de cache Redis et réécrit les requêtes SQL les plus coûteuses, réduisant le temps de réponse de 60%.",
    "Mon approche architecturale se base sur la modularité, la scalabilité et la maintenabilité. Je privilégie les principes SOLID et les patterns de conception éprouvés.",
    "Lors d'une crise de production majeure, j'ai dû prendre la décision de rollbacker une nouvelle fonctionnalité en moins de 5 minutes, ce qui a évité une perte de revenus significative.",
    "J'ai géré un conflit entre deux développeurs en organisant une réunion de médiation et en établissant des guidelines claires pour les code reviews.",
    "Après l'échec d'un projet de migration cloud, j'ai documenté les leçons apprises et mis en place un processus de PoC plus rigoureux pour les futurs projets.",
    "J'aligne les objectifs techniques avec la stratégie business en participant aux réunions de direction et en traduisant les besoins métier en spécifications techniques claires.",
    "J'ai dirigé une équipe de 12 développeurs avec des profils variés (backend, frontend, DevOps) en mettant en place des rituels agiles et une culture de feedback continu.",
    "Je vois le leadership technique comme un rôle d'enablement : permettre à l'équipe de prendre les bonnes décisions techniques tout en maintenant une cohérence architecturale."
  ],
  bluff: [
    "Je suis un expert en transformation digitale avec une expérience approfondie dans l'innovation technologique et l'agilité organisationnelle.",
    "Je suis passionné par les défis disruptifs et les opportunités de transformation à grande échelle dans des environnements dynamiques.",
    "Mon approche est basée sur l'excellence opérationnelle et l'optimisation continue des processus avec une vision stratégique holistique.",
    "J'ai implémenté des solutions cloud-native avec une scalabilité exceptionnelle utilisant les meilleures pratiques de l'industrie et des frameworks modernes.",
    "Nous avons optimisé significativement les performances grâce à des approches innovantes et des technologies de pointe comme les microservices et le serverless.",
    "L'architecture doit être évolutive, flexible et résiliente. Je privilégie les patterns modernes et les paradigmes émergents pour une meilleure adaptabilité.",
    "Dans des situations de haute pression, je maintiens une vision claire et une prise de décision stratégique basée sur l'analyse de données et l'intuition business.",
    "Je facilite la collaboration interfonctionnelle et promeus une culture d'excellence et d'innovation continue au sein de l'équipe.",
    "Chaque expérience est une opportunité d'apprentissage. J'embrasse l'échec comme un catalyseur de croissance et d'amélioration continue.",
    "L'alignement stratégique est crucial. Je m'assure que les initiatives techniques soutiennent directement les objectifs business et créent de la valeur.",
    "J'ai dirigé des équipes pluridisciplinaires avec un leadership transformationnel et une approche centrée sur les personnes et les résultats.",
    "Le leadership technique nécessite une vision à long terme, une capacité d'inspiration et une maîtrise des tendances technologiques émergentes."
  ],
  vague: [
    "Euh, j'ai fait un peu de développement, puis j'ai évolué vers des trucs plus... complexes. Je crois que j'ai travaillé sur des projets web.",
    "Je cherche peut-être un changement, c'est difficile à dire exactement pourquoi. Je pense que je veux... quelque chose de différent.",
    "Je dirais que je suis assez flexible. Je m'adapte aux situations, je fais ce qu'il faut, à peu près.",
    "On a fait des trucs techniques, je ne me souviens plus exactement quoi. C'était important pour l'entreprise, je crois.",
    "Pour les performances, on a fait des optimisations. Je ne sais pas trop les détails, mais ça allait mieux après.",
    "L'architecture, c'est important. Il faut que ça soit bien fait, scalable, tout ça. Je suis pour les bonnes pratiques.",
    "Une fois, y'a eu un problème. On a dû prendre une décision vite. Je ne me rappelle plus exactement, mais ça s'est bien passé.",
    "Les conflits, ça arrive. On en discute et on trouve une solution. C'est comme ça que ça marche en équipe.",
    "J'ai eu des projets qui n'ont pas marché comme prévu. C'est la vie, on apprend. Je ne me souviens pas des détails.",
    "Il faut aligner les trucs techniques avec les objectifs business. C'est important pour la réussite globale.",
    "J'ai travaillé avec des équipes, c'est sûr. On collaborait, on faisait des réunions. C'était bien.",
    "Le leadership, c'est guider les gens, les aider à avancer. C'est important d'avoir une vision."
  ],
  fragile: [
    "J'ai... euh... commencé comme développeur il y a quelques années. Je ne suis pas sûr de l'année exacte.",
    "Je cherche peut-être un changement parce que... je ne sais pas trop. Je me sens un peu... coincé.",
    "Mon style de travail ? Je ne sais pas trop comment le décrire. Je fais de mon mieux, c'est tout.",
    "J'ai participé à un projet de... quelque chose. Je ne me souviens plus exactement. C'était important, je crois.",
    "Pour les performances, euh, on a peut-être fait quelque chose ? Je ne suis pas certain. Je n'étais pas très impliqué.",
    "L'architecture, c'est... compliqué. Je ne suis pas très à l'aise avec ces concepts. Je préfère coder.",
    "Une fois, il y a eu une crise. J'étais stressé, je ne savais pas quoi faire. Heureusement, quelqu'un d'autre a géré.",
    "Les conflits, ça me stresse. Je préfère éviter. Je ne suis pas très bon pour ça.",
    "J'ai échoué dans un projet. C'était humiliant. Je ne veux plus en parler.",
    "Aligner les objectifs... je ne suis pas sûr de savoir faire ça. C'est au-dessus de mes compétences.",
    "Diriger une équipe ? Non, je ne pourrais pas. Je n'ai pas assez de confiance en moi.",
    "Le leadership technique, c'est pour des gens plus compétents que moi. Je ne suis pas à la hauteur."
  ],
  technical: [
    "J'ai commencé comme développeur backend en Java, puis je me suis spécialisé en Node.js et Go. J'ai travaillé sur des systèmes distribués à haute disponibilité.",
    "Je veux rejoindre votre équipe parce que vous utilisez une stack technique moderne (Kubernetes, gRPC, PostgreSQL) qui correspond à mes compétences.",
    "J'approche les problèmes de manière systématique : analyse des requirements, conception, implémentation, tests, monitoring.",
    "J'ai implémenté une architecture event-driven avec Kafka pour gérer 100k événements par seconde. Nous avons utilisé des patterns CQRS et Saga.",
    "Pour optimiser les performances, j'ai profilé l'application avec pprof, identifié les hotspots CPU, et réécrit les algorithmes critiques en Rust.",
    "Je privilégie une architecture hexagonale avec séparation des concerns, injection de dépendances, et tests unitaires avec 90% de couverture.",
    "Lors d'un incident de production, j'ai analysé les logs avec ELK, identifié une race condition dans le cache, et déployé un hotfix en 15 minutes.",
    "Pour les conflits techniques, j'organise des RFC (Request for Comments) et des design reviews pour aligner l'équipe sur les meilleures solutions.",
    "Un projet a échoué à cause d'une mauvaise estimation de la complexité. J'ai depuis adopté une approche de planning poker et de réévaluation continue.",
    "J'aligne les objectifs techniques avec les KPIs business en implémentant des dashboards de monitoring et en participant aux OKRs.",
    "J'ai dirigé une équipe de 8 développeurs en mettant en place des code reviews automatisés, CI/CD avec GitHub Actions, et pair programming.",
    "Le leadership technique consiste à maintenir un haut niveau de qualité, documenter les décisions d'architecture, et mentorer les juniors."
  ],
  leadership: [
    "J'ai commencé comme consultant en stratégie, puis j'ai transitionné vers le management technique en dirigeant des équipes de transformation digitale.",
    "Je cherche un rôle où je peux combiner ma compréhension business avec ma passion pour la technologie pour créer de la valeur organisationnelle.",
    "Mon style de travail est collaboratif et orienté résultats. Je privilégie la transparence, la communication et l'autonomisation des équipes.",
    "J'ai mené un programme de transformation agile sur 18 mois, impliquant 200 personnes et réduisant le time-to-market de 40%.",
    "Pour améliorer l'efficacité, j'ai redéfini les processus de gouvernance, éliminé les silos organisationnels et mis en place des rituels de synchronisation.",
    "Mon approche architecturale se concentre sur la business capability mapping et l'alignement stratégique plutôt que sur les détails techniques purement technologiques.",
    "Lors d'une crise de confiance avec un client clé, j'ai personnellement géré la relation, établi un plan de remédiation transparent et restauré la confiance.",
    "J'ai résolu des conflits inter-équipes en créant des forums de discussion ouverts, en clarifiant les responsabilités et en favorisant la compréhension mutuelle.",
    "Un projet stratégique a échoué par manque d'alignement exécutif. J'ai depuis créé un processus de stakeholder management plus rigoureux.",
    "J'aligne les initiatives technologiques avec la stratégie business en participant au comité exécutif et en traduisant la vision en roadmaps opérationnelles.",
    "J'ai dirigé une organisation de 50 personnes (ingénieurs, product managers, designers) en mettant en place une culture de performance et d'innovation.",
    "Le leadership technique est un levier stratégique : il faut recruter les bons talents, développer les compétences et créer un environnement propice à l'excellence."
  ]
};

function generateProfile(def: typeof BEHAVIOR_DEFINITIONS[0]): Profile {
  const responses = RESPONSE_TEMPLATES[def.type as keyof typeof RESPONSE_TEMPLATES];
  
  // Add slight variations to make profiles unique
  const variedResponses = responses.map((r, i) => {
    const suffix = def.id.split('_')[1];
    return i === 0 ? `${r} [Profile ${def.id}]` : r;
  });
  
  return {
    profileId: def.id,
    jobOffer: "Senior Software Engineer / Tech Lead",
    cv: `Candidate ${def.id} - ${def.type.toUpperCase()} profile with relevant experience in software engineering and leadership.`,
    behaviorType: def.type,
    responses: variedResponses
  };
}

async function main() {
  const datasetsDir = path.join(__dirname, "datasets");
  if (!fs.existsSync(datasetsDir)) {
    fs.mkdirSync(datasetsDir, { recursive: true });
  }

  const generatedProfiles: Profile[] = [];
  
  for (const def of BEHAVIOR_DEFINITIONS) {
    try {
      const profile = generateProfile(def);
      generatedProfiles.push(profile);
      console.log(`Generated ${def.id} (${def.type})`);
    } catch (error) {
      console.error(`Failed to generate ${def.id}`, error);
    }
  }

  const outPath = path.join(datasetsDir, "profiles.json");
  fs.writeFileSync(outPath, JSON.stringify(generatedProfiles, null, 2));
  console.log(`\n✅ Generated ${generatedProfiles.length} profiles to ${outPath}`);
}

main().catch(console.error);
