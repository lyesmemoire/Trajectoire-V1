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

const profilesDef = [
  // 5 profils très solides
  ...Array(5).fill(0).map((_, i) => ({ id: `solid-${i+1}`, type: "très solide" })),
  // 5 profils CV gonflés mais faibles oralement
  ...Array(5).fill(0).map((_, i) => ({ id: `bluff-${i+1}`, type: "CV gonflé mais faible oralement" })),
  // 5 profils honnêtes mais imprécis
  ...Array(5).fill(0).map((_, i) => ({ id: `vague-${i+1}`, type: "honnête mais imprécis" })),
  // 5 profils stress fragiles
  ...Array(5).fill(0).map((_, i) => ({ id: `fragile-${i+1}`, type: "stress fragile" })),
  // 5 profils très techniques
  ...Array(5).fill(0).map((_, i) => ({ id: `tech-${i+1}`, type: "très technique" })),
  // 5 profils leadership forts mais techniques moyens
  ...Array(5).fill(0).map((_, i) => ({ id: `lead-${i+1}`, type: "leadership fort mais technique moyen" })),
];

// Template-based profile generation (no API key required)
const templates: Record<string, { jobOffer: string; cv: string; responses: string[] }[]> = {
  "très solide": [
    {
      jobOffer: "Senior Software Engineer - Platform Team",
      cv: "7 ans d'expérience, expert React/Node.js, a mené la migration microservices chez TechCorp",
      responses: [
        "J'ai commencé comme développeur full-stack chez StartupX, puis j'ai rejoint TechCorp il y a 3 ans où j'ai pris en charge l'architecture plateforme. J'ai notamment réduit le temps de déploiement de 45 minutes à 8 minutes.",
        "Sur la migration microservices, j'ai travaillé avec une équipe de 5 personnes. On a migré 12 services en 6 mois. Le principal challenge était la gestion des transactions distribuées, qu'on a résolue avec des sagas.",
        "Oui, j'ai eu des conflits avec l'équipe produit sur les deadlines. On a mis en place des rituels de sync hebdo et j'ai documenté les trade-offs techniques pour aligner tout le monde.",
        "Pour la scalabilité, j'ai mis en place du horizontal pod autoscaling. On passe de 10 à 50 pods automatiquement. Le coût a augmenté de 30% mais la disponibilité est passée de 99.5% à 99.95%.",
        "J'ai fait une erreur sur la config du load balancer qui a causé un outage de 15 minutes. J'ai documenté le post-mortem, ajouté des tests d'intégration et mis en place des garde-fous.",
        "Je m'intéresse beaucoup à l'observabilité. J'ai implémenté OpenTelemetry et des dashboards Grafana. Ça nous a permis de réduire le MTTD de 2h à 15min.",
        "Pour le leadership, je mentorise 2 juniors. On a mis en place des code reviews systématiques et des sessions de pair programming.",
        "Je suis à l'aise avec Kubernetes mais je ne suis pas expert. Je sais déployer et gérer des clusters, mais pour les aspects avancés comme les operators, je ferais appel à l'équipe DevOps.",
        "Oui, j'ai travaillé avec des équipes offshore. Le décalage horaire était un challenge, on a mis en place des async communications et des overlap hours.",
        "Sur les 3 dernières années, j'ai livré 12 features majeures, réduit le bug rate de 25%, et formé 4 développeurs."
      ]
    },
    {
      jobOffer: "Lead Developer - E-commerce",
      cv: "8 ans en e-commerce, expertise Magento/Shopify, optimisé conversion rate de 12%",
      responses: [
        "Je suis développeur depuis 8 ans, spécialisé e-commerce. J'ai passé 4 ans chez RetailMax où j'ai refait toute la plateforme checkout. On a augmenté le taux de conversion de 8% à 20%.",
        "Pour le refactoring checkout, on a fait du A/B testing sur chaque étape. J'ai travaillé avec l'équipe UX pour optimiser les formulaires. Le temps de chargement a été réduit de 3s à 1.2s.",
        "On avait des tensions avec le marketing sur les promos. J'ai mis en place un système de feature flags pour déployer progressivement et rollback rapidement si besoin.",
        "Pour les pics de traffic, j'ai mis en place du caching Redis avec une stratégie de cache warming. On gère maintenant 100k req/min sans problème.",
        "J'ai sous-estimé l'impact d'une migration de base de données sur Black Friday. J'ai appris à toujours planifier les migrations en période creuse et avoir un rollback plan détaillé.",
        "Je suis passionné par les performances web. J'ai implémenté du lazy loading, optimisé les images, et mis en place un CDN. Le Lighthouse score est passé de 45 à 92.",
        "J'ai géré une équipe de 4 développeurs. On a mis en place des daily standups et des retrospectives mensuelles pour améliorer les processus.",
        "Je connais bien les bases de données relationnelles mais je suis moins à l'aise avec NoSQL. Pour les cas d'usage analytics, je travaillerais avec un data engineer.",
        "Oui, j'ai collaboré avec des équipes data science pour les recommandations produits. On a mis en place une API REST pour exposer les données.",
        "Sur le dernier projet, j'ai réduit le technical debt de 30% en 6 mois tout en livrant 15 nouvelles features."
      ]
    },
    {
      jobOffer: "Backend Engineer - Fintech",
      cv: "6 ans en fintech, expert Go/Python, sécurisé transactions high-frequency",
      responses: [
        "Je suis backend engineer depuis 6 ans, spécialisé fintech. J'ai travaillé chez PayFlow sur le système de traitement de transactions. On passe 2M transactions par jour avec une latence moyenne de 50ms.",
        "Pour la haute disponibilité, on a une architecture multi-region avec du failover automatique. On a 99.99% de uptime. Les données sont répliquées en temps réel avec une RPO de 1 seconde.",
        "On a eu des débats avec la compliance sur la gestion des données sensibles. J'ai travaillé avec le CISO pour implémenter du chiffrement end-to-end et de la pseudonymisation.",
        "Pour la scalabilité, j'ai utilisé du partitionnement sharding basé sur l'ID utilisateur. Chaque shard gère 500k utilisateurs. On a des procédures de resharding automatisées.",
        "J'ai introduit un bug dans la logique de frais qui a causé des erreurs de calcul. J'ai ajouté des tests de propriété basés sur les règles métier et mis en place des alertes monitoring.",
        "Je suis très rigoureux sur la sécurité. J'ai implémenté du rate limiting, de la détection de fraude avec du machine learning, et des audits de sécurité trimestriels.",
        "Je mentorise 2 développeurs sur les best practices backend. On a des sessions de review de code et des workshops sur les patterns de concurrence.",
        "Je suis expert en Go mais je découvre Rust. Pour les composants critiques de performance, je pourrais envisager Rust mais je ferais un POC d'abord.",
        "Oui, j'ai travaillé avec des équipes frontend sur les APIs. On a documenté avec OpenAPI et généré des clients TypeScript pour éviter les incohérences.",
        "Sur l'année dernière, j'ai réduit la latence de 30%, augmenté le throughput de 50%, et zéro incident de sécurité."
      ]
    },
    {
      jobOffer: "Full Stack Developer - SaaS",
      cv: "5 ans en SaaS B2B, React/Node.js, construit dashboard analytics complexe",
      responses: [
        "Je suis full stack depuis 5 ans, focus sur SaaS B2B. J'ai rejoint DataViz il y a 2 ans pour construire leur dashboard analytics. On a maintenant 500 entreprises clientes.",
        "Pour le dashboard, j'ai utilisé React avec D3.js pour les visualisations. Côté backend, j'ai construit une API GraphQL pour permettre aux clients de customiser leurs dashboards.",
        "On avait des frictions avec le sales sur les features prioritaires. J'ai mis en place un roadmap public et des cycles de release de 2 semaines pour gérer les attentes.",
        "Pour la performance des requêtes, j'ai optimisé les indexes de la base de données et mis en place du caching au niveau API. Le temps de chargement des dashboards est passé de 5s à 1s.",
        "J'ai mal estimé la complexité d'une feature de realtime qui a causé des timeouts. J'ai appris à toujours faire des POCs et à monitorer la performance en prod.",
        "Je suis fan de developer experience. J'ai automatisé le setup local avec Docker, mis en place des pre-commit hooks, et documenté tout dans un portal dev.",
        "J'ai travaillé en équipe de 3 full stack. On a des pair programming sessions et on rotate sur les tickets pour partager la connaissance.",
        "Je suis à l'aise avec React mais je n'ai pas beaucoup d'expérience avec Angular. Si je devais maintenir un projet Angular, je prendrais le temps de me former.",
        "Oui, j'ai collaboré avec le customer success pour comprendre les use cases des clients. On a des calls mensuels pour recueillir le feedback.",
        "J'ai livré 20 features cette année, maintenu un NPS client de 8.5, et réduit le churn de 15%."
      ]
    },
    {
      jobOffer: "DevOps Engineer - Cloud Platform",
      cv: "4 ans DevOps, AWS/GCP certifié, automatisé CI/CD pour 50+ services",
      responses: [
        "Je suis DevOps depuis 4 ans, certifié AWS et GCP. Chez CloudScale, j'ai automatisé le CI/CD pour 50+ services. Le lead time est passé de 2 jours à 2 heures.",
        "Pour l'infrastructure as code, j'utilise Terraform avec des modules réutilisables. On a des environnements dev/staging/prod identiques. Le drift est détecté automatiquement.",
        "On avait des tensions avec les développeurs sur la vitesse de déploiement. J'ai mis en place des pipelines self-service avec des garde-fous automatiques.",
        "Pour le monitoring, j'ai implémenté Prometheus et Grafana avec des alertes basées sur les SLOs. On a un dashboard de disponibilité par service.",
        "J'ai fait une erreur de config qui a supprimé des ressources staging. J'ai ajouté des confirmations manuelles pour les actions destructives et des backups automatiques.",
        "Je suis passionné par l'automatisation. J'ai scripté tout le onboarding des nouveaux services avec des templates et des generators.",
        "Je forme les développeurs aux pratiques DevOps. On a des workshops sur le CI/CD et le monitoring mensuellement.",
        "Je suis expert Kubernetes mais je découvre Istio. Pour le service mesh, je ferais un POC sur un service non-critical d'abord.",
        "Oui, je travaille avec tous les équipes engineering. Je suis dans les channels Slack support et je participe aux retrospectives.",
        "J'ai réduit le MTTR de 4h à 30min, automatisé 80% des tâches ops, et maintenu un uptime de 99.9%."
      ]
    }
  ],
  "CV gonflé mais faible oralement": [
    {
      jobOffer: "Senior Software Engineer",
      cv: "10 ans d'expérience, architecte logiciel, expert cloud native, Kubernetes master",
      responses: [
        "Oui, j'ai beaucoup d'expérience en architecture logicielle. J'ai travaillé sur des systèmes très complexes avec des microservices et du cloud native.",
        "Pour Kubernetes, je l'utilise depuis longtemps. C'est très puissant pour l'orchestration des containers. Je sais faire des déploiements et gérer les clusters.",
        "Les microservices, c'est mon domaine. J'ai fait beaucoup d'architectures basées sur des services. C'est scalable et flexible.",
        "Pour le cloud, je connais AWS et Azure. J'ai déployé des applications sur ces plateformes. C'est essentiel pour le cloud native.",
        "La CI/CD, je l'ai mise en place dans plusieurs projets. Jenkins, GitLab CI, j'ai utilisé ces outils. C'est important pour l'automatisation.",
        "Pour la sécurité, je suis conscient de l'importance. Je fais attention aux authentifications et aux permissions. C'est crucial dans le cloud.",
        "Le monitoring, j'ai utilisé des outils comme Prometheus et Grafana. C'est utile pour voir ce qui se passe dans les systèmes.",
        "Pour les bases de données, j'ai travaillé avec SQL et NoSQL. Les deux ont leur place selon les cas d'usage.",
        "L'agilité, je pratique Scrum depuis des années. Les sprints, les daily standups, je connais bien.",
        "Bref, j'ai une expérience très complète et je peux m'adapter à n'importe quel environnement technique."
      ]
    },
    {
      jobOffer: "Tech Lead",
      cv: "8 ans en leadership, expert architecture distributed systems, mentor senior",
      responses: [
        "Oui, j'ai beaucoup d'expérience en tech lead. J'ai dirigé des équipes sur des projets de systems distribués complexes.",
        "Pour l'architecture distribuée, c'est mon expertise. J'ai conçu des systèmes avec des patterns comme CQRS et event sourcing. C'est très avancé.",
        "Le leadership, je l'ai pratiqué pendant longtemps. Je sais gérer des équipes et faire des revues de code. C'est naturel pour moi.",
        "Pour le mentoring, j'ai formé beaucoup de développeurs. Je transmet mon expérience et mes connaissances. C'est gratifiant.",
        "Les design patterns, je les maîtrise parfaitement. Singleton, Factory, Observer, je les utilise tous les jours.",
        "Pour la scalabilité, j'ai travaillé sur des systèmes à très grande échelle. Des millions d'utilisateurs, je connais.",
        "La performance, c'est crucial. J'optimise toujours le code pour qu'il soit rapide et efficace. C'est une priorité.",
        "Pour les tests, je suis un grand partisan du TDD. J'écris toujours des tests avant le code. C'est une best practice.",
        "Le refactoring, je le fais régulièrement. Je maintiens le code propre et maintenable. C'est important sur le long terme.",
        "En résumé, j'ai toutes les compétences nécessaires pour être un excellent tech lead."
      ]
    },
    {
      jobOffer: "Senior Backend Developer",
      cv: "7 ans backend, expert Go/Rust, high performance systems, concurrency master",
      responses: [
        "Oui, je suis expert en backend development. J'ai beaucoup d'expérience avec Go et Rust pour les systèmes haute performance.",
        "Pour la concurrence, c'est mon domaine d'expertise. Goroutines, channels, async/await, je maîtrise parfaitement ces concepts.",
        "La performance, c'est ma priorité. J'optimise toujours pour avoir le meilleur throughput possible. C'est essentiel pour le backend.",
        "Pour les bases de données, je connais PostgreSQL et MongoDB en profondeur. J'ai optimisé beaucoup de requêtes pour améliorer la performance.",
        "Les APIs, j'en ai construit des REST et des GraphQL. Je connais les best practices pour la conception d'APIs.",
        "Pour la sécurité, je suis très vigilant. J'implémente toujours l'authentification et l'autorisation correctement. C'est fondamental.",
        "Le caching, je l'utilise beaucoup. Redis, Memcached, je connais ces technologies pour améliorer la performance.",
        "Pour les message queues, j'ai utilisé Kafka et RabbitMQ. C'est utile pour les architectures asynchrones.",
        "Les microservices, j'ai beaucoup d'expérience. Je sais les architecter et les déployer correctement.",
        "Bref, j'ai une expertise backend très complète et je peux contribuer immédiatement."
      ]
    },
    {
      jobOffer: "Full Stack Architect",
      cv: "9 ans full stack, expert React/Vue, Node.js architecte, UI/UX designer certifié",
      responses: [
        "Oui, je suis architecte full stack avec beaucoup d'expérience. Je maîtrise React et Vue pour le frontend et Node.js pour le backend.",
        "Pour l'architecture frontend, je connais les patterns comme Redux et MobX. J'ai construit des applications complexes avec ces outils.",
        "Le design, je suis certifié UI/UX. Je sais créer des interfaces utilisateur modernes et intuitives. C'est un atout.",
        "Pour le backend, je suis expert Node.js. J'ai construit des APIs RESTful et des applications en temps réel avec WebSockets.",
        "Les bases de données, je connais SQL et NoSQL. J'ai utilisé MySQL et MongoDB dans plusieurs projets.",
        "Pour le responsive design, je maîtrise CSS et les frameworks comme Tailwind. Je m'assure que tout fonctionne sur tous les devices.",
        "L'accessibilité, je la prends au sérieux. Je respecte les standards WCAG pour que les applications soient accessibles à tous.",
        "Pour les tests, je fais du testing end-to-end avec Cypress. C'est important pour la qualité du frontend.",
        "Le performance web, je l'optimise avec des techniques comme le lazy loading et le code splitting. C'est crucial pour l'UX.",
        "En somme, j'ai toutes les compétences full stack nécessaires pour architecter des applications complètes."
      ]
    },
    {
      jobOffer: "Cloud Solutions Architect",
      cv: "6 ans cloud, AWS/Azure/GCP expert, serverless pioneer, cost optimization specialist",
      responses: [
        "Oui, je suis architecte cloud avec beaucoup d'expérience sur AWS, Azure et GCP. Je connais ces plateformes en profondeur.",
        "Pour le serverless, je suis un pionnier. J'ai beaucoup d'expérience avec Lambda et Azure Functions. C'est très moderne.",
        "L'optimisation des coûts, c'est ma spécialité. Je sais réduire les factures cloud sans sacrifier la performance. C'est un vrai talent.",
        "Pour l'infrastructure as code, j'utilise Terraform et CloudFormation. J'automatise tout le déploiement d'infrastructure.",
        "Les containers, je connais Docker et Kubernetes. Je sais orchestrer des applications containerisées à grande échelle.",
        "Pour la sécurité cloud, je suis expert. Je configure les firewalls, les IAM roles, et les VPCs correctement.",
        "Le monitoring cloud, j'utilise CloudWatch et Azure Monitor. Je surveille tout ce qui se passe dans l'infrastructure.",
        "Pour le multi-cloud, j'ai de l'expérience. Je sais architecter des applications qui fonctionnent sur plusieurs providers.",
        "La disaster recovery, je la planifie soigneusement. J'ai des stratégies de backup et de failover robustes.",
        "Bref, j'ai une expertise cloud très complète et je peux architecter n'importe quelle solution cloud."
      ]
    }
  ],
  "honnête mais imprécis": [
    {
      jobOffer: "Software Developer",
      cv: "3 ans d'expérience, React/Node.js, passionné par le clean code",
      responses: [
        "J'ai commencé comme développeur il y a 3 ans. J'ai travaillé sur quelques projets React et Node.js. C'était des applications web assez simples.",
        "Pour React, je l'utilise depuis le début de ma carrière. Je sais créer des composants et gérer l'état avec useState. C'est assez basique mais ça marche.",
        "Je n'ai pas beaucoup d'expérience avec les tests. J'ai fait quelques tests unitaires mais je ne suis pas expert. Je pourrais m'améliorer là-dessus.",
        "Pour Node.js, j'ai construit quelques APIs. Je connais Express et les bases du routing. Je n'ai pas fait de choses très complexes.",
        "Les bases de données, j'ai utilisé PostgreSQL sur un projet. Je sais faire des requêtes simples mais je ne suis pas expert en optimisation.",
        "Je suis intéressé par le clean code mais je ne suis pas parfait. J'essaie de suivre les principes SOLID mais parfois c'est difficile en pratique.",
        "Pour le Git, je l'utilise quotidiennement. Je sais faire des commits et des pull requests. Je ne connais pas toutes les commandes avancées.",
        "Je n'ai pas beaucoup d'expérience avec le cloud. J'ai déployé une application sur Heroku une fois mais c'est tout.",
        "L'agilité, j'ai travaillé en équipe avec des sprints. Je participe aux daily standups mais je ne suis pas Scrum Master.",
        "En gros, j'ai les bases solides mais il y a encore beaucoup de choses que je dois apprendre."
      ]
    },
    {
      jobOffer: "Junior Developer",
      cv: "1 an d'expérience, JavaScript/TypeScript, eager to learn",
      responses: [
        "Je suis développeur depuis un an. J'ai fait une formation en ligne et j'ai travaillé sur quelques petits projets personnels.",
        "Pour JavaScript, je connais les bases. Les variables, les fonctions, les boucles, ça je connais. Je découvre encore TypeScript.",
        "Je n'ai pas encore travaillé sur des projets professionnels complexes. Mes projets étaient plutôt simples, des to-do lists et des sites vitrines.",
        "Pour React, j'ai suivi un tutoriel. Je sais créer des composants simples mais je ne maîtrise pas encore les hooks avancés.",
        "Les bases de données, j'ai un peu utilisé SQLite dans un projet. Je ne connais pas bien les bases de données relationnelles complexes.",
        "Je suis très motivé pour apprendre. Je lis beaucoup de documentation et je regarde des vidéos pour m'améliorer.",
        "Pour le Git, je connais les commandes de base. Add, commit, push. Je ne suis pas très à l'aise avec les branches et les merges.",
        "Je n'ai pas d'expérience avec les tests. Je sais que c'est important mais je ne l'ai pas encore pratiqué.",
        "Le déploiement, je n'ai jamais déployé une application en production. Tout ce que j'ai fait était en local.",
        "En résumé, je suis débutant mais je suis prêt à apprendre et à m'investir."
      ]
    },
    {
      jobOffer: "Frontend Developer",
      cv: "2 ans frontend, HTML/CSS/JavaScript, learning React",
      responses: [
        "Je suis frontend developer depuis 2 ans. J'ai commencé avec HTML et CSS, puis j'ai appris JavaScript.",
        "Pour HTML et CSS, je suis assez à l'aise. Je sais créer des mises en page responsive et utiliser Flexbox et Grid.",
        "JavaScript, je connais les bases. Le DOM manipulation, les événements, ça je sais faire. Je découvre ES6+.",
        "React, je suis en train d'apprendre. J'ai créé quelques petits projets mais je ne suis pas encore très à l'aise avec les concepts avancés.",
        "Je n'ai pas beaucoup d'expérience avec les frameworks CSS. J'utilise surtout du CSS pur. J'ai un peu touché à Bootstrap.",
        "Pour l'accessibilité, je connais les principes de base. Les alt tags, les semantic HTML, mais je ne suis pas expert.",
        "Les tests frontend, je n'en ai pas fait. Je sais que ça existe mais je ne l'ai pas encore pratiqué.",
        "Pour les outils de build, j'utilise un peu Webpack mais je ne comprends pas tout. Je suis plus à l'aise avec des setups simples.",
        "Je n'ai pas travaillé avec des APIs complexes. J'ai fait quelques fetch requests simples mais c'est tout.",
        "Bref, j'ai de bonnes bases en frontend mais il y a encore beaucoup à apprendre."
      ]
    },
    {
      jobOffer: "Backend Developer",
      cv: "2 ans backend, Python/Django, learning databases",
      responses: [
        "Je suis backend developer depuis 2 ans. J'ai commencé avec Python et j'ai utilisé Django pour quelques projets.",
        "Pour Python, je connais assez bien la syntaxe et les concepts de base. Les classes, les fonctions, ça je maîtrise.",
        "Django, je l'ai utilisé pour créer des APIs REST. Je connais les models, les views, les URLs. C'est assez intuitif.",
        "Les bases de données, je suis en train d'apprendre. J'ai utilisé SQLite avec Django mais je ne connais pas bien PostgreSQL ou MySQL.",
        "Je n'ai pas beaucoup d'expérience avec l'authentification. J'ai utilisé les built-ins de Django mais je ne comprends pas tout le JWT.",
        "Pour le caching, je n'en ai pas utilisé. Je sais que ça existe pour améliorer la performance mais je ne l'ai pas implémenté.",
        "Les tests backend, j'en ai fait quelques uns avec pytest. Je ne suis pas très à l'aise avec les tests d'intégration.",
        "Je n'ai pas d'expérience avec les message queues. Je connais le concept mais je ne l'ai jamais utilisé.",
        "Pour le déploiement, j'ai déployé une application Django sur un VPS une fois. C'était assez basique.",
        "En gros, j'ai les bases du backend avec Django mais il y a beaucoup de concepts que je dois encore maîtriser."
      ]
    },
    {
      jobOffer: "Mobile Developer",
      cv: "1 an mobile, React Native beginner, learning iOS/Android",
      responses: [
        "Je suis développeur mobile depuis un an. J'ai commencé avec React Native pour créer des applications cross-platform.",
        "Pour React Native, je connais les bases. Les composants, la navigation, les styles. Je peux créer des applications simples.",
        "Je n'ai pas encore développé d'applications natives iOS ou Android. Je me concentre sur React Native pour le moment.",
        "Pour les APIs mobiles, j'en ai consommé quelques unes. Je sais faire des fetch requests et gérer les états.",
        "Le state management, j'ai utilisé useState et useContext. Je n'ai pas encore expérimenté Redux ou MobX.",
        "Je n'ai pas d'expérience avec les push notifications. Je sais que c'est important pour les apps mobiles mais je ne l'ai pas fait.",
        "Pour le testing mobile, je n'en ai pas fait. Je teste manuellement sur mon appareil mais je ne connais pas les outils de test automatisés.",
        "Le store deployment, j'ai publié une application sur le Play Store une fois. C'était un processus assez simple.",
        "Je n'ai pas d'expérience avec les fonctionnalités natives comme la caméra ou le GPS. Je me suis concentré sur des apps simples.",
        "En somme, je débute en mobile development mais je suis motivé pour apprendre plus."
      ]
    }
  ],
  "stress fragile": [
    {
      jobOffer: "Software Engineer",
      cv: "2 ans d'expérience, React/Node.js, junior developer",
      responses: [
        "Bonjour, je suis développeur depuis 2 ans. J'ai travaillé sur des projets React et Node.js dans ma précédente entreprise.",
        "Pour React, j'ai créé plusieurs composants pour une application de gestion. C'était assez intéressant, j'ai appris beaucoup.",
        "Euh, pour les tests... j'ai fait quelques tests unitaires mais je ne suis pas très à l'aise avec les tests d'intégration. Je peux apprendre.",
        "Node.js, j'ai utilisé Express pour créer des APIs. C'était... c'était des APIs simples, je ne suis pas expert.",
        "Les bases de données... j'ai utilisé PostgreSQL. Je sais faire des requêtes basiques mais... je ne suis pas très à l'aise avec les optimisations.",
        "Je... je ne sais pas trop quoi dire sur le clean code. J'essaie de faire du code propre mais... c'est difficile parfois.",
        "Pour Git, je l'utilise. Add, commit, push. Les merges parfois... ça peut être compliqué mais je gère.",
        "Le cloud... je n'ai pas beaucoup d'expérience. J'ai... j'ai peut-être déployé une fois mais je ne me souviens pas bien.",
        "L'agilité... j'ai participé à des daily standups. C'était... c'était bien.",
        "Voilà, je pense que... je pense que j'ai les bases nécessaires."
      ]
    },
    {
      jobOffer: "Junior Developer",
      cv: "1 an d'expérience, JavaScript, learning React",
      responses: [
        "Je suis développeur depuis un an. J'ai fait une formation et j'ai travaillé sur un projet.",
        "JavaScript... je connais les bases. Variables, fonctions, boucles. C'est... c'est ce que j'ai appris.",
        "React... j'ai commencé à l'apprendre. Je sais créer des composants simples mais... je ne suis pas encore très à l'aise.",
        "Je n'ai pas... je n'ai pas beaucoup d'expérience professionnelle. C'était... c'était un petit projet.",
        "Les bases de données... j'ai un peu utilisé SQLite. Je ne connais pas... je ne connais pas grand chose sur les bases de données complexes.",
        "Je... je veux apprendre. Je suis motivé. Je lis des docs.",
        "Git... add, commit, push. C'est... c'est ce que je fais.",
        "Les tests... je n'en ai pas fait. Je sais que c'est important mais... je ne l'ai pas encore fait.",
        "Déploiement... jamais fait. Tout en local.",
        "Euh... voilà. Je suis... je suis débutant mais motivé."
      ]
    },
    {
      jobOffer: "Frontend Developer",
      cv: "2 ans frontend, HTML/CSS, learning JavaScript",
      responses: [
        "Je suis frontend depuis 2 ans. HTML, CSS, un peu de JavaScript.",
        "HTML et CSS... je suis assez à l'aise. Flexbox, Grid, ça va.",
        "JavaScript... je connais les bases. Le DOM... les événements... c'est... c'est que des bases.",
        "React... j'ai commencé à regarder. Je ne suis pas... je ne suis pas encore à l'aise.",
        "Frameworks CSS... j'ai utilisé Bootstrap un peu. Pas... pas beaucoup.",
        "Accessibilité... je connais les principes. Alt tags... semantic HTML... c'est... c'est basique.",
        "Tests... jamais fait. Je ne sais pas... je ne sais pas comment faire.",
        "Outils de build... Webpack... je ne comprends pas tout. C'est... c'est compliqué.",
        "APIs... j'ai fait quelques fetch requests. Simples.",
        "Voilà. J'ai... j'ai des bases mais... il y a beaucoup à apprendre."
      ]
    },
    {
      jobOffer: "Backend Developer",
      cv: "1 an backend, Python, learning Django",
      responses: [
        "Backend depuis un an. Python... Django... un peu.",
        "Python... syntaxe de base. Classes, fonctions... ça va.",
        "Django... models, views, URLs. C'est... c'est intuitif mais je ne suis pas expert.",
        "Bases de données... SQLite avec Django. PostgreSQL... je ne connais pas bien.",
        "Authentification... built-ins Django. JWT... je ne comprends pas tout.",
        "Caching... jamais utilisé. Je sais que ça existe mais... pas implémenté.",
        "Tests... quelques tests avec pytest. Pas... pas très à l'aise avec intégration.",
        "Message queues... concept connu mais jamais utilisé.",
        "Déploiement... une fois sur VPS. C'était... c'était basique.",
        "Euh... bases du backend mais... beaucoup à apprendre."
      ]
    },
    {
      jobOffer: "Full Stack Developer",
      cv: "2 ans full stack, MERN stack beginner",
      responses: [
        "Full stack depuis 2 ans. MongoDB, Express, React, Node... un peu de tout.",
        "MongoDB... je sais faire des requêtes basiques. Pas... pas d'optimisation.",
        "Express... APIs REST simples. Routing basique.",
        "React... composants, state basique. Hooks... useState, useContext. Pas Redux.",
        "Node.js... JavaScript backend. C'est... c'est ce que j'utilise.",
        "Authentification... JWT un peu. Pas... pas très à l'aise avec la sécurité.",
        "Tests... quelques tests unitaires. Pas... pas d'end-to-end.",
        "Déploiement... jamais en prod. Tout en local.",
        "Git... add, commit, push. Parfois des conflits... je gère tant bien que mal.",
        "Voilà. Je suis... je suis débutant mais j'apprends."
      ]
    }
  ],
  "très technique": [
    {
      jobOffer: "Senior Backend Engineer",
      cv: "6 ans backend, Go/Rust expert, systems programming, performance optimization",
      responses: [
        "J'ai commencé en C++ puis je suis passé à Go il y a 4 ans. J'ai travaillé sur des systèmes haute performance avec des contraintes de latence sub-millisecondes.",
        "Pour la gestion de la mémoire, j'ai implémenté un memory pool custom en Go pour réduire la GC pressure. On a passé de 50ms de pause GC à 2ms.",
        "J'ai utilisé des lock-free data structures pour les compteurs de métriques. Les atomic operations avec Compare-And-Swap pour éviter les contentions.",
        "Pour la serialization, j'ai benchmarké protobuf vs JSON. Protobuf était 3x plusfast en throughput et utilisait 60% moins de mémoire.",
        "J'ai implémenté un custom scheduler pour les goroutines workers en utilisant des channels avec buffering pour gérer les backpressure.",
        "Pour le networking, j'ai utilisé epoll en Go avec raw sockets pour optimiser le throughput. On a atteint 1M connections concurrentes.",
        "J'ai écrit un BPF program pour tracer les syscalls et identifier les bottlenecks au niveau kernel. Ça nous a permis d'optimiser les I/O syscalls.",
        "Pour la persistence, j'ai utilisé RocksDB avec un custom compaction strategy. Les write amplification ont été réduites de 40%.",
        "J'ai implémenté un Raft consensus algorithm from scratch pour un distributed log. Le leader election a été optimisé avec pre-vote pour éviter les disruptions.",
        "En termes de profiling, j'utilise pprof et perf régulièrement. J'ai identifié un cache miss pattern qui a causé une optimisation des data structures."
      ]
    },
    {
      jobOffer: "Systems Engineer",
      cv: "5 ans systems programming, C/C++, kernel development",
      responses: [
        "J'ai travaillé sur le développement kernel Linux pendant 3 ans. J'ai contribué au scheduler et au memory subsystem.",
        "Pour le memory management, j'ai implémenté un custom allocator pour réduire la fragmentation. On a utilisé buddy system avec slab allocator.",
        "J'ai écrit des device drivers pour des NICs custom. J'ai utilisé DMA et interrupt handling pour optimiser le throughput réseau.",
        "Pour le filesystem, j'ai travaillé sur ext4 optimizations. J'ai implémenté delayed allocation et journaling optimizations.",
        "J'ai utilisé eBPF pour tracer les appels système et identifier les hot paths. Les instrumentation overhead étaient inférieurs à 1%.",
        "Pour la virtualization, j'ai travaillé sur KVM optimizations. J'ai implémenté vCPU scheduling avec CPU pinning pour réduire la latency.",
        "J'ai écrit des modules kernel pour le networking stack. TCP congestion control avec BBR pour améliorer le throughput sur high-latency networks.",
        "Pour la sécurité, j'ai implémenté SELinux policies pour le confinement des processus. J'ai utilisé LSM hooks pour le contrôle d'accès.",
        "J'ai travaillé sur le boot process optimization. J'ai réduit le kernel boot time de 5s à 1.5s avec initrd compression et parallel init.",
        "En termes de debugging, j'utilise ftrace, kprobes et crash analysis. J'ai identifié un race condition dans le lock implementation."
      ]
    },
    {
      jobOffer: "Performance Engineer",
      cv: "4 ans performance optimization, profiling, benchmarking",
      responses: [
        "Je suis spécialisé en performance engineering. J'utilise perf, VTune et FlameGraphs pour identifier les bottlenecks.",
        "Pour le CPU profiling, j'ai identifié un branch misprediction pattern dans un hot loop. J'ai restructuré le code pour améliorer l'ILP.",
        "J'ai optimisé le cache locality en réorganisant les data structures. Les cache miss rate ont été réduites de 30%.",
        "Pour la memory bandwidth, j'ai utilisé NUMA-aware allocation. Les remote memory accesses ont été réduites de 60%.",
        "J'ai implémenté SIMD vectorization avec AVX-512 pour les calculs matriciels. Le throughput a été multiplié par 8.",
        "Pour le I/O, j'ai utilisé async I/O avec io_uring pour réduire la syscall overhead. Les IOPS ont augmenté de 2x.",
        "J'ai optimisé le networking avec kernel bypass DPDK. On a atteint 100Gbps line rate avec une latency de 10μs.",
        "Pour la database performance, j'ai optimisé les query plans et les indexes. Les query latencies ont été réduites de 80%.",
        "J'ai implémenté un custom memory allocator pour réduire la fragmentation. Les allocation overhead étaient inférieurs à 5%.",
        "En termes de benchmarking, j'utilise des workloads synthétiques et réels. J'ai identifié un regression dans le nouveau compiler version."
      ]
    },
    {
      jobOffer: "Database Engineer",
      cv: "5 ans database internals, storage engines, distributed systems",
      responses: [
        "J'ai travaillé sur les internals de PostgreSQL pendant 3 ans. J'ai contribué au query optimizer et au storage engine.",
        "Pour le query optimization, j'ai implémenté un custom join algorithm pour les star queries. Les latencies ont été réduites de 70%.",
        "J'ai optimisé le WAL (Write-Ahead Log) avec group commit et compression. Les I/O ont été réduites de 50%.",
        "Pour le storage engine, j'ai implémenté un LSM-tree avec tiered compaction. Les write amplification ont été réduites de 40%.",
        "J'ai travaillé sur le distributed query processing. J'ai utilisé sharding avec consistent hashing pour la scalabilité.",
        "Pour la concurrency control, j'ai implémenté MVCC avec optimistic concurrency control. Les contentions ont été réduites de 60%.",
        "J'ai optimisé le buffer pool avec LRU-K replacement policy. Les cache hit rates ont augmenté de 25%.",
        "Pour les indexes, j'ai implémenté des adaptive radix trees pour les lookups haute performance. Les latencies étaient sous les 100ns.",
        "J'ai travaillé sur le replication avec logical decoding. Les replication lag étaient inférieurs à 100ms.",
        "En termes de monitoring, j'ai utilisé des métriques détaillées sur les buffer pool, locks et WAL. J'ai identifié un pattern de lock contention."
      ]
    },
    {
      jobOffer: "Network Engineer",
      cv: "4 ans networking, TCP/IP, high-frequency trading",
      responses: [
        "J'ai travaillé sur les protocoles réseau pour le high-frequency trading. J'ai optimisé la TCP stack pour réduire la latency.",
        "Pour le kernel bypass, j'ai utilisé DPDK et Solarflare NICs avec onload. On a atteint une latency de 1μs round-trip.",
        "J'ai implémenté un custom UDP protocol avec forward error correction pour la fiabilité sans TCP overhead.",
        "Pour le multicast, j'ai utilisé PGM et PGML pour la diffusion de données de marché. Les jitter étaient inférieurs à 10μs.",
        "J'ai optimisé le NIC tuning avec RSS, RFS et XPS. Le packet processing était distribué sur tous les cores.",
        "Pour la clock synchronization, j'ai utilisé PTP avec hardware timestamping. La skew était inférieure à 100ns.",
        "J'ai implémenté un custom load balancer layer 4 avec eBPF. Le throughput était de 200Gbps avec une latency de 5μs.",
        "Pour la congestion control, j'ai utilisé BBR et CUBIC avec custom tuning pour high-BDP networks.",
        "J'ai travaillé sur le network virtualization avec VXLAN et Geneve. L'overhead était inférieur à 5%.",
        "En termes de monitoring, j'ai utilisé sFlow, NetFlow et eBPF pour tracer les packets. J'ai identifié un pattern de packet loss."
      ]
    }
  ],
  "leadership fort mais technique moyen": [
    {
      jobOffer: "Engineering Manager",
      cv: "5 ans management, agile coach, team building",
      responses: [
        "J'ai commencé comme développeur puis je suis passé au management il y a 5 ans. J'ai géré des équipes de 5 à 15 personnes.",
        "Pour le team building, j'ai mis en place des rituels d'équipe : daily standups, retrospectives, et team lunches mensuels.",
        "J'ai travaillé sur la culture d'entreprise avec des valeurs claires et des feedbacks réguliers. Le turnover a été réduit de 40%.",
        "Pour le recrutement, j'ai amélioré le process d'embauche avec des structured interviews. Le time-to-hire a été réduit de 30%.",
        "J'ai mis en place des programmes de mentorat pour les juniors. 4 juniors ont été promus en 2 ans.",
        "Pour la performance, j'ai introduit des OKRs trimestriels alignés sur les objectifs business. L'alignement a été amélioré significativement.",
        "J'ai géré des conflits d'équipe avec des médiations et des sessions de feedback. La satisfaction team a augmenté de 25%.",
        "Pour le budget, j'ai géré un budget de 2M€ avec optimisation des coûts cloud. On a réduit les coûts de 20%.",
        "J'ai travaillé avec les stakeholders pour définir la roadmap. La satisfaction produit a augmenté de 30%.",
        "En termes de leadership, je crois au servant leadership et à l'autonomisation des équipes. Les teams sont maintenant self-organizing."
      ]
    },
    {
      jobOffer: "Tech Lead",
      cv: "4 ans tech lead, people management, stakeholder communication",
      responses: [
        "Je suis tech lead depuis 4 ans. J'ai géré des équipes techniques tout en restant impliqué dans les décisions d'architecture.",
        "Pour la communication, j'ai mis en place des weekly syncs avec les stakeholders. La visibilité a été améliorée de 50%.",
        "J'ai travaillé sur la carrière development des développeurs. 3 développeurs ont été promus en 18 mois.",
        "Pour le delivery, j'ai introduit des sprints de 2 semaines avec des demo meetings. Le predictability a été améliorée.",
        "J'ai géré les relations avec les autres équipes engineering. On a mis en place des guilds techniques pour partager les connaissances.",
        "Pour la qualité, j'ai introduit des code reviews systématiques et des quality gates. Le bug rate a été réduit de 35%.",
        "J'ai travaillé sur l'onboarding avec un programme structuré de 4 semaines. Le time-to-productivity a été réduit de 40%.",
        "Pour l'innovation, j'ai organisé des hackathons trimestriels. 5 innovations ont été mises en production.",
        "J'ai géré les crises avec des war rooms et des communications transparentes. La confiance des stakeholders a été maintenue.",
        "En termes de coaching, je fais des 1:1 hebdomadaires avec chaque membre de l'équipe. La satisfaction team est à 4.5/5."
      ]
    },
    {
      jobOffer: "Product Engineering Lead",
      cv: "3 ans product lead, cross-functional collaboration",
      responses: [
        "Je suis product engineering lead depuis 3 ans. Je travaille à l'intersection de l'engineering, du product et du design.",
        "Pour la collaboration, j'ai mis en place des triads (engineer, PM, designer) par feature. L'efficacité a été améliorée de 40%.",
        "J'ai travaillé sur la roadmap avec des quarterly planning sessions. L'alignement business-tech a été optimisé.",
        "Pour le delivery, j'ai introduit des metrics de DORA. Le lead time for changes a été réduit de 50%.",
        "J'ai géré les trade-offs entre speed et quality avec des guardrails automatisés. La stabilité a été maintenue.",
        "Pour l'UX, j'ai travaillé étroitement avec les designers sur les prototypes. La satisfaction utilisateur a augmenté de 30%.",
        "J'ai mis en place des user feedback loops avec des beta programs. Le feedback incorporation a été accéléré.",
        "Pour la data, j'ai travaillé avec les data scientists sur les A/B tests. Les décisions sont maintenant data-driven.",
        "J'ai géré les dependencies avec les autres teams. On a mis en place des SLAs et des contracts d'API.",
        "En termes de vision, je communique régulièrement sur la direction technique. L'équipe est alignée et motivée."
      ]
    },
    {
      jobOffer: "Engineering Director",
      cv: "6 years directorship, organizational design, strategy",
      responses: [
        "Je suis engineering director depuis 6 ans. J'ai géré des organisations de 50 à 200 personnes.",
        "Pour l'organizational design, j'ai restructuré les équipes en squads avec des missions claires. L'efficacité a été améliorée de 35%.",
        "J'ai défini la stratégie technique à 3 ans alignée sur les business goals. La roadmap est maintenant claire et exécutable.",
        "Pour le budget, j'ai géré un budget de 10M€ avec optimisation des ressources. Le ROI a été amélioré de 25%.",
        "J'ai travaillé sur la culture engineering avec des valeurs et des rituels. L'engagement employee a augmenté de 40%.",
        "Pour le talent, j'ai mis en place des programs de retention et de development. Le turnover a été réduit de 50%.",
        "J'ai géré les relations avec le C-level et le board. La confiance a été maintenue même pendant les crises.",
        "Pour la diversité, j'ai introduit des initiatives d'inclusion. La diversité gender a été améliorée de 30%.",
        "J'ai mis en place des governance processes avec des comités techniques. La compliance a été assurée.",
        "En termes de leadership, je crois à la transparence et à l'empowerment. L'organisation est maintenant agile et résiliente."
      ]
    },
    {
      jobOffer: "VP of Engineering",
      cv: "4 years VP, executive leadership, company scaling",
      responses: [
        "Je suis VP of Engineering depuis 4 ans. J'ai accompagné la croissance de l'entreprise de 50 à 500 employés.",
        "Pour le scaling, j'ai mis en place des processes scalables tout en maintenant l'agilité. La vélocité a été maintenue.",
        "J'ai défini la vision technique à 5 ans en alignement avec la vision company. La direction est claire et inspirante.",
        "Pour le executive team, j'ai participé aux décisions stratégiques. L'engineering est maintenant un business partner.",
        "J'ai géré le fundraising avec les VCs en présentant la stratégie technique. On a levé 50M€ en Series B.",
        "Pour l'acquisition, j'ai intégré 3 équipes avec des processes de onboarding structurés. L'intégration a été réussie.",
        "J'ai mis en place des metrics de business impact pour l'engineering. La contribution tech est maintenant mesurable.",
        "Pour la communication, je fais des all-hands mensuels et des town halls. L'engagement est à 4.8/5.",
        "J'ai travaillé sur la brand de l'engineering avec des conférences et des publications. L'attractivité a été améliorée.",
        "En termes de legacy, je construis une organisation durable avec des leaders capables. La succession est assurée."
      ]
    }
  ]
};

async function main() {
  const datasetDir = path.join(__dirname, "datasets");
  if (!fs.existsSync(datasetDir)) {
    fs.mkdirSync(datasetDir, { recursive: true });
  }

  const generatedProfiles: Profile[] = [];
  
  console.log("Generating 30 profiles using template-based approach (no API key required)...");

  const typeCounters: Record<string, number> = {};

  for (const def of profilesDef) {
    const variationNum = (typeCounters[def.type] || 0) + 1;
    typeCounters[def.type] = variationNum;
    
    console.log(`Generating [${def.id}] -> Behavior: ${def.type} (variation #${variationNum})`);
    
    const templateIndex = (variationNum - 1) % templates[def.type].length;
    const template = templates[def.type][templateIndex];
    
    // Add variation to responses to make them unique
    const variedResponses = template.responses.map((r, i) => {
      const variationMarker = `[Profile ${def.id} - Response ${i + 1}]`;
      return `${variationMarker} ${r}`;
    });
    
    const profile: Profile = {
      profileId: def.id,
      jobOffer: template.jobOffer,
      cv: template.cv,
      behaviorType: def.type,
      responses: variedResponses
    };
    
    generatedProfiles.push(profile);
  }

  const outPath = path.join(datasetDir, "profiles.json");
  fs.writeFileSync(outPath, JSON.stringify(generatedProfiles, null, 2));
  console.log(`\n✅ Generated ${generatedProfiles.length} profiles to ${outPath}`);
}

main().catch(console.error);
