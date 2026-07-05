# Gestion des Erreurs

Une gestion robuste des erreurs est vitale.

## Principes de Base
1. Ne pas fuiter d'informations sensibles (stack traces, requêtes SQL) au client.
2. Typer les erreurs pour faciliter le traitement.
3. Utiliser un système d'erreurs standardisé (ex: classe `AppError` ou pattern `Result<T, E>`).

## Types d'erreurs à prévoir
- `ValidationError`: Entrée utilisateur invalide (HTTP 400).
- `UnauthorizedError`: Utilisateur non authentifié (HTTP 401).
- `ForbiddenError`: L'utilisateur n'a pas les droits métier (HTTP 403).
- `NotFoundError`: Ressource introuvable (HTTP 404).
- `ConflictError`: Problème de concurrence ou doublon métier (HTTP 409).
- `InternalError`: Erreur inattendue serveur (HTTP 500).
