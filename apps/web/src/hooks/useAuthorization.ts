// apps/web/src/hooks/useAuthorization.ts
//
// Hook React pour l'autorisation
// Utilise AuthorizationModule pour vérifier les permissions côté client

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AuthorizationModule } from '@/lib/authorization/AuthorizationModule'
import { Permission, Role, Resource, Action } from '@/types/permissions'

// ============================================================
// TYPES
// ============================================================

interface UseAuthorizationReturn {
  /** Vérifie si l'utilisateur a une permission */
  can: (permission: Permission) => boolean
  /** Vérifie si l'utilisateur peut effectuer une action sur une ressource */
  canPerform: (resource: Resource, action: Action) => boolean
  /** Vérifie si l'utilisateur a un rôle spécifique */
  hasRole: (role: Role) => boolean
  /** Vérifie si l'utilisateur est admin */
  isAdmin: () => boolean
  /** Vérifie si l'utilisateur a une capacité */
  hasCapability: (capability: string) => boolean
  /** Retourne le quota mensuel */
  getQuota: (resource: string) => number | null
  /** Retourne toutes les permissions */
  getPermissions: () => Permission[]
  /** Vérifie plusieurs permissions */
  canMultiple: (permissions: Permission[]) => Map<Permission, boolean>
  /** Vérifie si toutes les permissions sont accordées */
  canAll: (permissions: Permission[]) => boolean
  /** Vérifie si au moins une permission est accordée */
  canAny: (permissions: Permission[]) => boolean
  /** Chargement en cours */
  loading: boolean
  /** Erreur */
  error: string | null
  /** Informations utilisateur */
  userInfo: { userId: string; plan: string; role: Role | null } | null
}

// ============================================================
// HOOK
// ============================================================

/**
 * Hook pour l'autorisation côté client.
 * 
 * Utilisation :
 * ```tsx
 * const { can, loading } = useAuthorization()
 * 
 * if (loading) return <Loading />
 * if (!can(Permission.EXPORT_REPORT_PDF)) {
 *   return <UpgradePrompt />
 * }
 * ```
 * 
 * @param userId - L'ID de l'utilisateur (optionnel, récupéré depuis Supabase si non fourni)
 * @returns Fonctions d'autorisation et état
 */
export function useAuthorization(userId?: string): UseAuthorizationReturn {
  const [authModule, setAuthModule] = useState<AuthorizationModule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId || null)

  // Charger le module d'autorisation
  useEffect(() => {
    async function loadAuthorization() {
      try {
        setLoading(true)
        setError(null)

        // Si userId n'est pas fourni, essayer de le récupérer depuis Supabase
        let targetUserId = currentUserId
        if (!targetUserId) {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          targetUserId = user?.id || null
        }

        if (!targetUserId) {
          setError('User not authenticated')
          setLoading(false)
          return
        }

        const authorizationModule = await AuthorizationModule.create(targetUserId)
        setAuthModule(authorizationModule)
        setCurrentUserId(targetUserId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load authorization')
      } finally {
        setLoading(false)
      }
    }

    loadAuthorization()
  }, [currentUserId, userId])

  // Vérifier une permission
  const can = useCallback((permission: Permission): boolean => {
    if (!authModule) return false
    return authModule.can(permission)
  }, [authModule])

  // Vérifier une action sur une ressource
  const canPerform = useCallback((resource: Resource, action: Action): boolean => {
    if (!authModule) return false
    return authModule.canPerform(resource, action)
  }, [authModule])

  // Vérifier un rôle
  const hasRole = useCallback((role: Role): boolean => {
    if (!authModule) return false
    return authModule.hasRole(role)
  }, [authModule])

  // Vérifier si admin
  const isAdmin = useCallback((): boolean => {
    if (!authModule) return false
    return authModule.isAdmin()
  }, [authModule])

  // Vérifier une capacité
  const hasCapability = useCallback((capability: string): boolean => {
    if (!authModule) return false
    return authModule.hasCapability(capability)
  }, [authModule])

  // Obtenir le quota
  const getQuota = useCallback((resource: string): number | null => {
    if (!authModule) return 0
    return authModule.getQuota(resource)
  }, [authModule])

  // Obtenir toutes les permissions
  const getPermissions = useCallback((): Permission[] => {
    if (!authModule) return []
    return authModule.getPermissions()
  }, [authModule])

  // Vérifier plusieurs permissions
  const canMultiple = useCallback((permissions: Permission[]): Map<Permission, boolean> => {
    if (!authModule) return new Map()
    return authModule.canMultiple(permissions)
  }, [authModule])

  // Vérifier si toutes les permissions sont accordées
  const canAll = useCallback((permissions: Permission[]): boolean => {
    if (!authModule) return false
    return authModule.canAll(permissions)
  }, [authModule])

  // Vérifier si au moins une permission est accordée
  const canAny = useCallback((permissions: Permission[]): boolean => {
    if (!authModule) return false
    return authModule.canAny(permissions)
  }, [authModule])

  // Obtenir les infos utilisateur
  const userInfo = authModule ? authModule.getUserInfo() : null

  return {
    can,
    canPerform,
    hasRole,
    isAdmin,
    hasCapability,
    getQuota,
    getPermissions,
    canMultiple,
    canAll,
    canAny,
    loading,
    error,
    userInfo,
  }
}

// ============================================================
// COMPOSANTS D'AUTHORISATION
// ============================================================

/**
 * Composant qui rend ses enfants uniquement si la permission est accordée
 */
interface PermissionGuardProps {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { can, loading } = useAuthorization()

  if (loading) {
    return React.createElement('div', { className: 'animate-pulse h-4 w-4' })
  }

  if (!can(permission)) {
    return React.createElement(React.Fragment, null, fallback)
  }

  return React.createElement(React.Fragment, null, children)
}

/**
 * Composant qui rend ses enfants uniquement si l'utilisateur est admin
 */
interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  const { isAdmin, loading } = useAuthorization()

  if (loading) {
    return React.createElement('div', { className: 'animate-pulse h-4 w-4' })
  }

  if (!isAdmin()) {
    return React.createElement(React.Fragment, null, fallback)
  }

  return React.createElement(React.Fragment, null, children)
}

/**
 * Composant qui rend ses enfants uniquement si le rôle correspond
 */
interface RoleGuardProps {
  role: Role
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const { hasRole, loading } = useAuthorization()

  if (loading) {
    return React.createElement('div', { className: 'animate-pulse h-4 w-4' })
  }

  if (!hasRole(role)) {
    return React.createElement(React.Fragment, null, fallback)
  }

  return React.createElement(React.Fragment, null, children)
}
