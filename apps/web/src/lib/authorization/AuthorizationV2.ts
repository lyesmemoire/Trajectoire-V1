// apps/web/src/lib/authorization/AuthorizationV2.ts
//
// Authorization V2 - Système d'autorisation centralisé et simplifié
// Supprime toute logique d'autorisation dupliquée
// Utilise des décorateurs/guards pour la protection des routes

// ============================================================
// TYPES
// ============================================================

export enum AccessLevel {
  /** Accès public - aucune authentification requise */
  PUBLIC = "PUBLIC",
  /** Authentification requise - utilisateur connecté uniquement */
  AUTHENTICATED = "AUTHENTICATED",
  /** Abonnement Premium requis - authentification + vérification abonnement */
  PREMIUM = "PREMIUM",
  /** Rôle admin requis - authentification + vérification rôle administrateur */
  ADMIN = "ADMIN",
  /** Route inconnue ou volontairement fermée : traitée comme inexistante (404) */
  NOT_FOUND = "NOT_FOUND",
}

export enum UserRole {
  USER = "USER",
  ADMIN_SUPPORT = "ADMIN_SUPPORT",
  ADMIN_PRODUCT = "ADMIN_PRODUCT",
  ADMIN_FOUNDER = "ADMIN_FOUNDER",
}

/**
 * Plans reconnus par les règles d'accès. La grille tarifaire réelle (prix, limites, droits)
 * est `lib/plans.ts` : c'est la source de vérité. Cette énumération est distincte de
 * `types/subscription.SubscriptionPlan` (qui ajoute TEAM et ENTERPRISE, hors grille).
 * Dette connue : les deux énumérations ne sont pas fusionnées (voir .claude/tasks.md).
 */
export enum SubscriptionPlan {
  FREE = "FREE",
  PACK = "PACK",
  PRO = "PRO",
}

/**
 * Plans « premium » : PACK débloque exactement les mêmes routes et
 * fonctionnalités que PRO. Seul le quota (5 simulations, 3 mois) diffère et il
 * est géré par lib/quota, pas ici.
 */
const PREMIUM_PLANS: readonly SubscriptionPlan[] = [
  SubscriptionPlan.PRO,
  SubscriptionPlan.PACK,
];

export interface UserContext {
  userId: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  isAuthenticated: boolean;
}

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  requiredAccessLevel?: AccessLevel;
}

// ============================================================
// CONFIGURATION DES ROUTES
// ============================================================

interface RouteRule {
  pattern: string;
  accessLevel: AccessLevel;
  comment: string;
}

const ROUTE_RULES: RouteRule[] = [
  // ============================================================
  // ROUTES PUBLIQUES (AccessLevel.PUBLIC)
  // ============================================================
  { pattern: "/", accessLevel: AccessLevel.PUBLIC, comment: "Page d'accueil" },
  { pattern: "/features", accessLevel: AccessLevel.PUBLIC, comment: "Page fonctionnalités" },
  { pattern: "/pricing", accessLevel: AccessLevel.PUBLIC, comment: "Page tarifs" },
  { pattern: "/faq", accessLevel: AccessLevel.PUBLIC, comment: "FAQ" },
  { pattern: "/about", accessLevel: AccessLevel.PUBLIC, comment: "Page à propos" },
  { pattern: "/contact", accessLevel: AccessLevel.PUBLIC, comment: "Page contact" },
  { pattern: "/blog", accessLevel: AccessLevel.PUBLIC, comment: "Blog" },
  { pattern: "/login", accessLevel: AccessLevel.PUBLIC, comment: "Page de connexion" },
  { pattern: "/signup", accessLevel: AccessLevel.PUBLIC, comment: "Page d'inscription" },
  { pattern: "/auth", accessLevel: AccessLevel.PUBLIC, comment: "Routes d'authentification" },
  { pattern: "/forgot-password", accessLevel: AccessLevel.PUBLIC, comment: "Mot de passe oublié" },
  { pattern: "/reset-password", accessLevel: AccessLevel.PUBLIC, comment: "Réinitialisation du mot de passe" },
  { pattern: "/logout", accessLevel: AccessLevel.PUBLIC, comment: "Déconnexion" },
  { pattern: "/signup-conversion", accessLevel: AccessLevel.PUBLIC, comment: "Conversion de l'aperçu gratuit" },
  { pattern: "/privacy", accessLevel: AccessLevel.PUBLIC, comment: "Politique de confidentialité" },
  { pattern: "/terms", accessLevel: AccessLevel.PUBLIC, comment: "Conditions d'utilisation" },
  { pattern: "/mentions-legales", accessLevel: AccessLevel.PUBLIC, comment: "Mentions légales (404 en production tant qu'elles sont incomplètes)" },
  { pattern: "/api/public", accessLevel: AccessLevel.PUBLIC, comment: "API publique (aperçu gratuit anonyme)" },
  { pattern: "/api/cron", accessLevel: AccessLevel.PUBLIC, comment: "Tâches planifiées : authentifiées dans la route par CRON_SECRET (refus si absent)" },
  { pattern: "/images", accessLevel: AccessLevel.PUBLIC, comment: "Images statiques" },
  { pattern: "/audio-processor.js", accessLevel: AccessLevel.PUBLIC, comment: "Worklet audio (public/)" },
  { pattern: "/pcm16-processor.js", accessLevel: AccessLevel.PUBLIC, comment: "Worklet audio (public/)" },
  { pattern: "/api/auth", accessLevel: AccessLevel.PUBLIC, comment: "API d'authentification" },
  { pattern: "/api/stripe/webhook", accessLevel: AccessLevel.PUBLIC, comment: "Webhook Stripe" },
  { pattern: "/api/health", accessLevel: AccessLevel.PUBLIC, comment: "Health check" },
  { pattern: "/_next", accessLevel: AccessLevel.PUBLIC, comment: "Assets Next.js" },
  { pattern: "/static", accessLevel: AccessLevel.PUBLIC, comment: "Fichiers statiques" },

  // ============================================================
  // ROUTES AUTHENTIFIÉES (AccessLevel.AUTHENTICATED)
  // ============================================================
  { pattern: "/onboarding", accessLevel: AccessLevel.AUTHENTICATED, comment: "Onboarding" },
  { pattern: "/api/onboarding", accessLevel: AccessLevel.AUTHENTICATED, comment: "API onboarding" },
  { pattern: "/api/cv", accessLevel: AccessLevel.AUTHENTICATED, comment: "API CV" },
  { pattern: "/api/user", accessLevel: AccessLevel.AUTHENTICATED, comment: "API utilisateur" },
  { pattern: "/dashboard", accessLevel: AccessLevel.AUTHENTICATED, comment: "Dashboard principal" },
  { pattern: "/simulation", accessLevel: AccessLevel.AUTHENTICATED, comment: "Simulation" },
  { pattern: "/report", accessLevel: AccessLevel.AUTHENTICATED, comment: "Rapports" },
  { pattern: "/history", accessLevel: AccessLevel.AUTHENTICATED, comment: "Historique" },
  { pattern: "/settings", accessLevel: AccessLevel.AUTHENTICATED, comment: "Paramètres" },
  { pattern: "/api/simulation", accessLevel: AccessLevel.AUTHENTICATED, comment: "API simulation" },
  { pattern: "/api/report", accessLevel: AccessLevel.AUTHENTICATED, comment: "API rapports" },
  { pattern: "/api/interview", accessLevel: AccessLevel.AUTHENTICATED, comment: "API interview" },
  { pattern: "/analyze", accessLevel: AccessLevel.PUBLIC, comment: "Analyse CV" },
  { pattern: "/search", accessLevel: AccessLevel.AUTHENTICATED, comment: "Recherche" },
  { pattern: "/copilot", accessLevel: AccessLevel.AUTHENTICATED, comment: "Copilot" },
  { pattern: "/opportunities", accessLevel: AccessLevel.AUTHENTICATED, comment: "Opportunités" },
  { pattern: "/api/opportunities", accessLevel: AccessLevel.AUTHENTICATED, comment: "API opportunités" },
  { pattern: "/cv", accessLevel: AccessLevel.AUTHENTICATED, comment: "Mes CV" },
  { pattern: "/interview", accessLevel: AccessLevel.AUTHENTICATED, comment: "Entretien" },
  { pattern: "/knowledge", accessLevel: AccessLevel.AUTHENTICATED, comment: "Base de connaissances" },
  { pattern: "/matching", accessLevel: AccessLevel.AUTHENTICATED, comment: "Matching" },
  { pattern: "/discovery", accessLevel: AccessLevel.AUTHENTICATED, comment: "Discovery" },
  { pattern: "/radar", accessLevel: AccessLevel.AUTHENTICATED, comment: "Radar des offres" },
  { pattern: "/api/radar", accessLevel: AccessLevel.AUTHENTICATED, comment: "API radar des offres" },
  { pattern: "/api/account", accessLevel: AccessLevel.AUTHENTICATED, comment: "API compte" },
  { pattern: "/api/analytics", accessLevel: AccessLevel.AUTHENTICATED, comment: "API analytics" },
  { pattern: "/api/career-memory", accessLevel: AccessLevel.AUTHENTICATED, comment: "API mémoire de carrière" },
  { pattern: "/api/discovery", accessLevel: AccessLevel.AUTHENTICATED, comment: "API discovery" },
  { pattern: "/api/knowledge", accessLevel: AccessLevel.AUTHENTICATED, comment: "API connaissances" },
  { pattern: "/api/matching", accessLevel: AccessLevel.AUTHENTICATED, comment: "API matching" },
  { pattern: "/api/quota", accessLevel: AccessLevel.AUTHENTICATED, comment: "API quota" },
  { pattern: "/api/stories", accessLevel: AccessLevel.AUTHENTICATED, comment: "API histoires" },
  { pattern: "/api/stripe", accessLevel: AccessLevel.AUTHENTICATED, comment: "API Stripe (checkout, portail) ; le webhook a sa règle publique" },

  // ============================================================
  // ROUTES PREMIUM (AccessLevel.PREMIUM)
  // ============================================================
  // Aucune route ne redirige automatiquement vers pricing
  // Le pricing s'affiche uniquement quand une fonctionnalité premium est utilisée

  // ============================================================
  // ROUTES ADMIN (AccessLevel.ADMIN)
  // ============================================================
  { pattern: "/admin", accessLevel: AccessLevel.ADMIN, comment: "Interface admin" },
  { pattern: "/api/admin", accessLevel: AccessLevel.ADMIN, comment: "API admin" },
  { pattern: "/api/performance", accessLevel: AccessLevel.ADMIN, comment: "Métriques internes de performance" },

  // ============================================================
  // ROUTES FERMÉES (AccessLevel.NOT_FOUND) — 404 pour tout le monde
  // ============================================================
  { pattern: "/monitoring", accessLevel: AccessLevel.NOT_FOUND, comment: "Page de monitoring cassée (API absente) : fermée" },
  { pattern: "/recruiter", accessLevel: AccessLevel.NOT_FOUND, comment: "Espace recruteur non lancé : fermé" },
  { pattern: "/__qa__", accessLevel: AccessLevel.NOT_FOUND, comment: "Page de QA design : dev uniquement" },
  { pattern: "/admin/cognitive", accessLevel: AccessLevel.NOT_FOUND, comment: "Tableau de bord de moteurs en mémoire sans données réelles (valeurs simulées) : fermé" },
  { pattern: "/admin/ai-operating-system", accessLevel: AccessLevel.NOT_FOUND, comment: "Tableau de bord de moteurs en mémoire sans données réelles (latences simulées) : fermé" },
];

/**
 * Une règle couvre son chemin exact et ses sous-chemins (frontière de segment) :
 * "/api/cv" couvre "/api/cv/analyze" mais pas "/api/cvx". La règle "/" ne couvre que l'accueil :
 * comme préfixe, elle capterait tous les chemins et rendrait le défaut fermé inopérant.
 */
function matchesRule(pathname: string, pattern: string): boolean {
  if (pattern === "/") return pathname === "/";
  return pathname === pattern || pathname.startsWith(pattern + "/");
}

// ============================================================
// AUTHORIZATION V2
// ============================================================

/**
 * Authorization V2 - Système d'autorisation centralisé
 * 
 * Responsabilités :
 * - Déterminer le niveau d'accès requis pour une route
 * - Vérifier si un utilisateur a accès à une route
 * - Fournir une interface unique pour l'autorisation
 * 
 * Utilisation :
 * ```ts
 * const auth = new AuthorizationV2(userContext)
 * const result = auth.checkAccess('/dashboard')
 * if (!result.allowed) {
 *   return redirect('/login')
 * }
 * ```
 */
export class AuthorizationV2 {
  private userContext: UserContext | null;
  private routeRules: RouteRule[];

  constructor(userContext: UserContext | null = null) {
    this.userContext = userContext;
    this.routeRules = [...ROUTE_RULES].sort((a, b) => b.pattern.length - a.pattern.length);
  }

  /**
   * Détermine le niveau d'accès requis pour un chemin donné
   */
  getRequiredAccessLevel(pathname: string): AccessLevel {
    // Règle la plus spécifique (patterns triés du plus long au plus court) :
    // chemin exact ou sous-chemin, à la frontière de segment.
    const match = this.routeRules.find(rule => matchesRule(pathname, rule.pattern));
    if (match) {
      return match.accessLevel;
    }

    // Par défaut : fermé (fail-closed). Toute nouvelle page ou route doit recevoir une règle
    // explicite ; sinon elle répond 404 (le test route-coverage.test.ts le vérifie).
    return AccessLevel.NOT_FOUND;
  }

  /**
   * Vérifie si l'utilisateur a accès à une route
   */
  checkAccess(pathname: string): AuthorizationResult {
    const requiredAccessLevel = this.getRequiredAccessLevel(pathname);

    // NOT_FOUND : fermé pour tout le monde, même connecté
    if (requiredAccessLevel === AccessLevel.NOT_FOUND) {
      return { allowed: false, reason: "Not found", requiredAccessLevel };
    }

    // PUBLIC : Toujours autorisé
    if (requiredAccessLevel === AccessLevel.PUBLIC) {
      return { allowed: true };
    }

    // Si pas d'utilisateur, refuser
    if (!this.userContext || !this.userContext.isAuthenticated) {
      return {
        allowed: false,
        reason: "Authentication required",
        requiredAccessLevel: requiredAccessLevel,
      };
    }

    // AUTHENTICATED : Autorisé si authentifié
    if (requiredAccessLevel === AccessLevel.AUTHENTICATED) {
      return { allowed: true };
    }

    // PREMIUM : Vérifier l'abonnement
    if (requiredAccessLevel === AccessLevel.PREMIUM) {
      const hasPremium = PREMIUM_PLANS.includes(this.userContext.plan);
      
      if (!hasPremium) {
        return {
          allowed: false,
          reason: "Premium subscription required",
          requiredAccessLevel: requiredAccessLevel,
        };
      }

      return { allowed: true };
    }

    // ADMIN : Vérifier le rôle
    if (requiredAccessLevel === AccessLevel.ADMIN) {
      const isAdmin = this.userContext.role === UserRole.ADMIN_SUPPORT ||
                      this.userContext.role === UserRole.ADMIN_PRODUCT ||
                      this.userContext.role === UserRole.ADMIN_FOUNDER;
      
      if (!isAdmin) {
        return {
          allowed: false,
          reason: "Admin role required",
          requiredAccessLevel: requiredAccessLevel,
        };
      }

      return { allowed: true };
    }

    // Fallback : Refuser
    return {
      allowed: false,
      reason: "Unknown access level",
      requiredAccessLevel: requiredAccessLevel,
    };
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(requiredRole: UserRole): boolean {
    if (!this.userContext) {
      return false;
    }

    const roleHierarchy = {
      [UserRole.USER]: 0,
      [UserRole.ADMIN_SUPPORT]: 1,
      [UserRole.ADMIN_PRODUCT]: 2,
      [UserRole.ADMIN_FOUNDER]: 3,
    };

    return roleHierarchy[this.userContext.role] >= roleHierarchy[requiredRole];
  }

  /**
   * Vérifie si l'utilisateur est admin
   */
  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN_SUPPORT);
  }

  /**
   * Vérifie si l'utilisateur a un abonnement premium
   */
  isPremium(): boolean {
    if (!this.userContext) {
      return false;
    }

    return PREMIUM_PLANS.includes(this.userContext.plan);
  }

  /**
   * Met à jour le contexte utilisateur
   */
  setUserContext(userContext: UserContext): void {
    this.userContext = userContext;
  }

  /**
   * Retourne le contexte utilisateur actuel
   */
  getUserContext(): UserContext | null {
    return this.userContext;
  }

  /**
   * Retourne toutes les règles de route
   */
  getRouteRules(): RouteRule[] {
    return this.routeRules;
  }

  /**
   * Ajoute une règle de route
   */
  addRouteRule(rule: RouteRule): void {
    this.routeRules.push(rule);
    this.routeRules.sort((a, b) => b.pattern.length - a.pattern.length);
  }

  /**
   * Supprime une règle de route
   */
  removeRouteRule(pattern: string): void {
    this.routeRules = this.routeRules.filter(rule => rule.pattern !== pattern);
  }
}

// ============================================================
// DÉCORATEURS (pour usage dans les contrôleurs)
// ============================================================

/**
 * Décorateur pour protéger une route avec un niveau d'accès
 */
export function RequireAccess(accessLevel: AccessLevel) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const auth = new AuthorizationV2((this as any).userContext);
      const result = auth.checkAccess((this as any).pathname || propertyKey);

      if (!result.allowed) {
        throw new Error(result.reason || "Access denied");
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Décorateur pour protéger une route pour les utilisateurs authentifiés
 */
export function RequireAuthenticated() {
  return RequireAccess(AccessLevel.AUTHENTICATED);
}

/**
 * Décorateur pour protéger une route pour les utilisateurs premium
 */
export function RequirePremium() {
  return RequireAccess(AccessLevel.PREMIUM);
}

/**
 * Décorateur pour protéger une route pour les admins
 */
export function RequireAdmin() {
  return RequireAccess(AccessLevel.ADMIN);
}

// ============================================================
// FONCTIONS CONVENIENCE
// ============================================================

/**
 * Crée une instance d'AuthorizationV2 avec un contexte utilisateur
 */
export function createAuthorization(userContext: UserContext): AuthorizationV2 {
  return new AuthorizationV2(userContext);
}

/**
 * Vérifie si un utilisateur a accès à une route
 */
export function checkAccess(userContext: UserContext, pathname: string): AuthorizationResult {
  const auth = new AuthorizationV2(userContext);
  return auth.checkAccess(pathname);
}

/**
 * Vérifie si un utilisateur est admin
 */
export function isAdmin(userContext: UserContext): boolean {
  const auth = new AuthorizationV2(userContext);
  return auth.isAdmin();
}

/**
 * Vérifie si un utilisateur a un abonnement premium
 */
export function isPremium(userContext: UserContext): boolean {
  const auth = new AuthorizationV2(userContext);
  return auth.isPremium();
}
