# Structure des Dossiers

L'architecture s'organise autour d'une séparation claire entre le framework (Next.js) et le cœur métier.

## Arborescence Cible

```text
app/
  api/
    [domaine]/         # Routes API exposant les services
  [pages]/             # Composants React (Server Components par défaut)

components/            # Composants UI partagés (Boutons, Modals, etc.)

lib/
  core/                # Mécanismes transverses (Erreurs, Logger, Result, Pagination)
  [domaine]/           # Dossier métier (ex: users, billing, cv, ats, interview)
    index.ts           # Seul point d'entrée exportant les éléments autorisés
    *.service.ts       # Logique métier pure
    *.repository.ts    # Accès aux données (Prisma/Supabase)
    *.validation.ts    # Schémas Zod
    *.dto.ts           # Objets de Transfert de Données
    *.types.ts         # Types TypeScript spécifiques au domaine

  supabase/            # Initialisation des clients Supabase (Server, Client, Admin)
  prisma/              # Singleton Prisma

types/                 # Types globaux de l'application (ex: Database Supabase généré)
docs/                  # Documentation architecturale et technique
```

## Règles
1. Le dossier `lib/[domaine]/` ne doit contenir que des fichiers appartenant à ce domaine.
2. Tout accès externe à un domaine doit se faire via son fichier `index.ts`.
3. Les fichiers générés, copies, backups sont formellement interdits dans l'arborescence source.
