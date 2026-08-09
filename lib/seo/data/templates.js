export const cvTemplates = [
    {
        id: "modern-red",
        name: "Modern Pro",
        style: "modern",
        color: "red",
        description: "Un design moderne et épuré qui attire l'œil tout en restant ATS-compatible.",
        targetRoles: [
            "product-manager",
            "growth-manager",
            "software-engineer",
            "fullstack-developer",
        ],
        atsScore: 94,
        features: [
            "En-tête avec photo optionnelle",
            "Section compétences avec barres visuelles",
            "Timeline expérience claire",
            "Score ATS intégré : 94/100",
            "Compatible ATS Lever, Greenhouse, Workday",
            "Personnalisable (couleurs, polices)",
        ],
        popular: true,
        premium: false,
    },
    {
        id: "executive-navy",
        name: "Executive",
        style: "executive",
        color: "navy",
        description: "Un design sobre et autoritaire pour les profils senior et C-Level.",
        targetRoles: [
            "cto",
            "cfo",
            "chief-people-officer",
            "vp-sales",
            "chief-product-officer",
        ],
        atsScore: 97,
        features: [
            "Format deux colonnes équilibré",
            'Section "Executive Summary" mise en avant',
            "Métriques d'impact chiffrées",
            "Score ATS intégré : 97/100",
            "Compatible tous les systèmes ATS",
            "Idéal pour postes > 80K€",
        ],
        popular: false,
        premium: false,
    },
    {
        id: "minimal-black",
        name: "Minimal",
        style: "minimal",
        color: "black",
        description: "Le maximum d'impact avec le minimum d'éléments. Clarté absolue.",
        targetRoles: [
            "data-scientist",
            "ml-engineer",
            "ai-engineer",
            "software-architect",
        ],
        atsScore: 99,
        features: [
            "Une colonne, lecture linéaire",
            "Typographie soignée",
            "Score ATS intégré : 99/100 (meilleur score)",
            "Idéal pour les parsers ATS stricts",
            "Poids léger (< 200 KB)",
            "Optimisé pour les systèmes bancaires et finance",
        ],
        popular: false,
        premium: false,
    },
    {
        id: "creative-slate",
        name: "Creative",
        style: "creative",
        color: "slate",
        description: "Un design distinctif pour les profils créatifs qui veulent se démarquer.",
        targetRoles: [
            "ux-designer",
            "ui-designer",
            "product-designer",
            "brand-designer",
            "motion-designer",
        ],
        atsScore: 88,
        features: [
            "Mise en page originale et mémorable",
            'Sections "Portfolio" et "Projets" mises en avant',
            "Score ATS intégré : 88/100",
            "Lien vers portfolio/Dribbble",
            "Idéal pour agences et startups créatives",
            "Design system cohérent",
        ],
        popular: false,
        premium: true,
    },
];
export function getTemplateBySlug(slug) {
    return cvTemplates.find((t) => t.id === slug);
}
export function getAllTemplateSlugs() {
    return cvTemplates.map((t) => t.id);
}
export function getTemplatesForJob(jobId) {
    return cvTemplates.filter((t) => t.targetRoles.includes(jobId));
}
//# sourceMappingURL=templates.js.map