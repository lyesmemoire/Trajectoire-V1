# Couche de Données (Data Layer)

La couche d'accès aux données est l'une des parties les plus sensibles de l'application. Elle est la seule autorisée à exécuter des requêtes vers la base de données.

## Le Modèle Repository

L'application suit strictement le pattern Repository. Un Repository est une classe ou un objet responsable de la communication avec le stockage de données (Prisma ou Supabase).

**Interdictions formelles :**
- Aucune requête `prisma.*` en dehors d'un fichier `*.repository.ts`.
- Aucune requête `supabase.from()` en dehors d'un fichier `*.repository.ts` (sauf pour l'authentification pure, le storage, ou les vérifications de session).
- Un Service ne doit **jamais** manipuler une connexion Prisma directement.

## Exemple d'Implémentation

```typescript
// lib/users/users.repository.ts
import prisma from "@/lib/prisma";

export class UsersRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<User>) {
    return prisma.user.update({ where: { id }, data });
  }
}
```

## Migration Supabase vers Prisma

La migration d'un accès Supabase vers Prisma doit se faire de manière réfléchie, table par table, après un audit complet :
1. La table contient-elle des règles RLS actives exploitées par l'application cliente ou l'API ?
2. La table est-elle gérée intrinsèquement par Supabase (ex: `auth.users`) ?
Si oui, Supabase Client reste l'outil privilégié.
Si non (table métier pure comme `CV`, `Interview`, `Billing`), la table doit être accédée via Prisma pour bénéficier de la sécurité des types et des transactions complexes.
