# ADR-002: Repository comme façade unique

## Statut
Accepté — Sprint 3.3.4

## Contexte
La logique métier accédait directement à Prisma, Supabase ou d'autres ORM. Cela rendait le changement de schéma ou de base de données extrêmement difficile et éparpillait la logique d'accès aux données.

## Décision
Le Repository est la façade unique d'accès aux données.
L'application ne doit jamais savoir si la donnée est stockée dans Prisma, Supabase, Redis ou S3. Elle appelle uniquement les méthodes du Port Repository.
Un repository ne retourne jamais de types Prisma ou Supabase : il retourne exclusivement des Domain Entities ou des DTOs.

## Conséquences
- L'infrastructure de données peut être modifiée sans impact sur le domaine métier.
- Tous les accès aux données sont centralisés et auditables.

## Alternatives rejetées
- **Active Record** : Trop couplé à l'ORM, empêche le changement de stack.
- **Accès direct à Prisma dans les services** : Fuite d'abstraction technique.
