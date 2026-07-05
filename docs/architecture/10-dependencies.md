# Règles d'Architecture et Dépendances

Pour maintenir une architecture propre (Golden Domain), l'application Trajectoire respecte une hiérarchie stricte des dépendances et de complexité.

## 1. Flux Nominal

Le pipeline d'une requête doit toujours suivre cette chaîne :
**`API → Validation → Use Case → Repository/Adapter → Infrastructure (BDD/API externe)`**

## 2. Dépendances Inter-Domaines

L'isolation des domaines est cruciale. La règle de base est qu'un domaine ne doit pas importer directement le code d'un autre domaine.

| Source | Cible | Autorisé ? | Justification |
| :--- | :--- | :--- | :--- |
| `lib/users` | `lib/core` | ✅ Oui | Les outils transverses (Logger, EventBus, Errors) sont globaux. |
| `lib/users` | `lib/cv/domain/events` | ✅ Oui | Écouter les événements d'un autre domaine est le mécanisme de couplage faible recommandé. |
| `lib/users` | `lib/cv/ports` | ✅ Oui | Dépendre d'un contrat (Port) abstrait défini par un autre domaine. |
| `lib/users` | `lib/cv` (index) | ✅ Oui | Via l'API publique (`index.ts`) si une intégration synchrone stricte est nécessaire. |
| `lib/users` | `lib/cv/infrastructure/*` | ❌ Non | Strictement interdit. Fuite d'abstraction. |

## 3. Garde-fous Automatiques (ESLint)
Ces règles sont appliquées statiquement via la configuration ESLint. Toute violation bloque le CI/CD.
- Interdiction d'importer `@prisma/client` ou `@supabase/supabase-js` dans `application/` ou `domain/`.
- Interdiction d'appeler `new` sur des classes applicatives (`*UseCase`, `*Repository`, `*Adapter`) en dehors des fichiers `container.ts`.
- Interdiction des imports inter-domaines contournant le fichier `index.ts`.

## 4. Règle absolue des Use Cases

**Un Use Case ne doit orchestrer qu'un seul objectif métier.**

- **Exemple valide** : `UploadCvUseCase`
- **Exemple invalide** : Un Use Case qui gère l'upload, le parsing, la réécriture IA, le scoring et l'envoi d'emails simultanément.
- Les comportements transverses (Logs, Transactions, Retries, Validation Auth) doivent être gérés dans l'infrastructure ou via des wrappers (`createApiHandler`), jamais dans le Use Case.

## 5. Limites de Taille et de Complexité

Afin d'empêcher l'apparition de "God Objects", des limites strictes sont imposées sur les composants de l'architecture :

| Élément | Taille maximale recommandée | Complexité maximale (Méthodes publiques) |
| --- | --- | --- |
| Route API | 50 lignes | 1 (handler) |
| DTO | 100 lignes | N/A |
| Mapper | 150 lignes | 5 |
| Use Case | 150–200 lignes | 1 (ex: `execute()`) |
| Repository / Adapter | 250 lignes | 15 |

### Dépendances directes
**Aucune classe (Use Case, Repository, Adapter) ne peut dépendre de plus de cinq collaborateurs directs.** Si un constructeur nécessite plus de 5 dépendances, c'est une violation du principe de responsabilité unique (SRP). Le code doit être découpé.
