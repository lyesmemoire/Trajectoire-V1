// lib/seo/generators/og.ts
/**
 * Palette de couleurs du Design System "Rouge Luxueux"
 * Centralisée ici pour cohérence entre toutes les OG images
 */
export const OG_COLORS = {
    background: "#0a0a0a", // Noir profond
    surface: "#1a0a0a", // Noir légèrement rouge
    primary: "#dc2626", // Rouge vif
    primaryLight: "#ef4444", // Rouge clair
    primaryDark: "#991b1b", // Rouge sombre
    gold: "#f59e0b", // Or accent
    textPrimary: "#ffffff", // Blanc
    textSecondary: "#d1d5db", // Gris clair
    textMuted: "#6b7280", // Gris moyen
    border: "#3f1010", // Bordure rouge sombre
    success: "#22c55e", // Vert succès
};
/**
 * Dimensions standards OG
 * Twitter et LinkedIn utilisent 1200x630
 */
export const OG_DIMENSIONS = {
    width: 1200,
    height: 630,
};
/**
 * Mappe les catégories de jobs vers des emojis
 */
export const JOB_CATEGORY_EMOJI = {
    engineering: "⚙️",
    product: "🎯",
    design: "🎨",
    data: "📊",
    marketing: "📈",
    sales: "💼",
    hr: "👥",
    finance: "💰",
    legal: "⚖️",
    operations: "🔧",
};
/**
 * Mappe les catégories d'entreprises vers des badges
 */
export const COMPANY_CATEGORY_LABEL = {
    gafam: "GAFAM",
    unicorn: "Licorne",
    enterprise: "Grand Groupe",
    startup: "Startup",
};
/**
 * Tronque un texte à une longueur maximale avec ellipsis
 */
export function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength - 3) + "...";
}
/**
 * Génère le gradient de fond principal
 * Réutilisé dans toutes les images OG
 */
export const BACKGROUND_GRADIENT = {
    backgroundImage: "radial-gradient(ellipse at 20% 50%, #3f1010 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #1f0a0a 0%, transparent 50%)",
    backgroundColor: OG_COLORS.background,
};
//# sourceMappingURL=og.js.map