/**
 * Palette de couleurs du Design System "Rouge Luxueux"
 * Centralisée ici pour cohérence entre toutes les OG images
 */
export declare const OG_COLORS: {
    readonly background: "#0a0a0a";
    readonly surface: "#1a0a0a";
    readonly primary: "#dc2626";
    readonly primaryLight: "#ef4444";
    readonly primaryDark: "#991b1b";
    readonly gold: "#f59e0b";
    readonly textPrimary: "#ffffff";
    readonly textSecondary: "#d1d5db";
    readonly textMuted: "#6b7280";
    readonly border: "#3f1010";
    readonly success: "#22c55e";
};
/**
 * Dimensions standards OG
 * Twitter et LinkedIn utilisent 1200x630
 */
export declare const OG_DIMENSIONS: {
    readonly width: 1200;
    readonly height: 630;
};
/**
 * Mappe les catégories de jobs vers des emojis
 */
export declare const JOB_CATEGORY_EMOJI: Record<string, string>;
/**
 * Mappe les catégories d'entreprises vers des badges
 */
export declare const COMPANY_CATEGORY_LABEL: Record<string, string>;
/**
 * Tronque un texte à une longueur maximale avec ellipsis
 */
export declare function truncate(text: string, maxLength: number): string;
/**
 * Génère le gradient de fond principal
 * Réutilisé dans toutes les images OG
 */
export declare const BACKGROUND_GRADIENT: {
    readonly backgroundImage: "radial-gradient(ellipse at 20% 50%, #3f1010 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #1f0a0a 0%, transparent 50%)";
    readonly backgroundColor: "#0a0a0a";
};
//# sourceMappingURL=og.d.ts.map