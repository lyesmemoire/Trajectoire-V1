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
}

export enum UserRole {
  USER = "USER",
  ADMIN_SUPPORT = "ADMIN_SUPPORT",
  ADMIN_PRODUCT = "ADMIN_PRODUCT",
  ADMIN_FOUNDER = "ADMIN_FOUNDER",
}

export enum SubscriptionPlan {
  FREE = "FREE",
  PRO = "PRO",
  EXPERT = "EXPERT",
}

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
  { pattern: "/api/auth", accessLevel: AccessLevel.PUBLIC, comment: "API d'authentification" },
  { pattern: "/api/stripe/webhook", accessLevel: AccessLevel.PUBLIC, comment: "Webhook Stripe" },
  { pattern: "/api/health", accessLevel: AccessLevel.PUBLIC, comment: "Health check" },
  { pattern: "/_next", accessLevel: AccessLevel.PUBLIC, comment: "Assets Next.js" },
  { pattern: "/static", accessLevel: AccessLevel.PUBLIC, comment: "Fichiers statiques" },

  // ============================================================
  // ROUTES AUTHENTIFIÉES (AccessLevel.AUTHENTICATED)
  // ============================================================
  { pattern: "/onboarding", accessLevel: AccessLevel.AUTHENTICATED, comment: "Onboarding" },
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
  { pattern: "/analyze", accessLevel: AccessLevel.AUTHENTICATED, comment: "Analyse CV" },
  { pattern: "/search", accessLevel: AccessLevel.AUTHENTICATED, comment: "Recherche" },
  { pattern: "/copilot", accessLevel: AccessLevel.AUTHENTICATED, comment: "Copilot" },
  { pattern: "/opportunities", accessLevel: AccessLevel.AUTHENTICATED, comment: "Opportunités" },
  { pattern: "/api/opportunities", accessLevel: AccessLevel.AUTHENTICATED, comment: "API opportunités" },

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
];

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
    // 1. Recherche de correspondance exacte
    const exactMatch = this.routeRules.find(rule => rule.pattern === pathname);
    if (exactMatch) {
      return exactMatch.accessLevel;
    }

    // 2. Recherche de correspondance par préfixe
    const prefixMatch = this.routeRules.find(rule => pathname.startsWith(rule.pattern));
    if (prefixMatch) {
      return prefixMatch.accessLevel;
    }

    // 3. Par défaut : accès public (fail-open)
    return AccessLevel.PUBLIC;
  }

  /**
   * Vérifie si l'utilisateur a accès à une route
   */
  checkAccess(pathname: string): AuthorizationResult {
    const requiredAccessLevel = this.getRequiredAccessLevel(pathname);

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
      const hasPremium = this.userContext.plan === SubscriptionPlan.PRO || 
                         this.userContext.plan === SubscriptionPlan.EXPERT;
      
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

    return this.userContext.plan === SubscriptionPlan.PRO ||
           this.userContext.plan === SubscriptionPlan.EXPERT;
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
