# Les Services

Le Service est le cœur de la logique métier. C'est l'unique composant qui orchestre les appels aux bases de données, l'application des règles métier et la conversion des Entités en DTO.

## Responsabilités
1. **Application des règles métier** : Le Service valide que l'action est métier-ment faisable (ex: vérifier que l'utilisateur a des crédits avant un appel IA).
2. **Orchestration** : Il peut faire appel à un ou plusieurs Repositories, ou à d'autres Services.
3. **Mappage DTO** : Le Service transforme les objets de la base de données (Entités Prisma/Supabase) en DTO (Data Transfer Objects) pour masquer les données sensibles et formater les réponses avant qu'elles ne parviennent à l'API.

## Exemple d'Implémentation

```typescript
// lib/users/users.service.ts
import { UsersRepository } from "./users.repository";
import { UserDTO, toUserDTO } from "./users.dto";

export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async getUserProfile(userId: string): Promise<UserDTO> {
    const userEntity = await this.repo.findById(userId);
    
    if (!userEntity) {
      throw new Error("User not found"); // Idéalement via core/errors
    }

    return toUserDTO(userEntity);
  }
}
```

## Injection de Dépendance
Autant que possible, le Service doit recevoir ses dépendances (Repositories) via son constructeur pour faciliter les tests unitaires. S'il est utilisé comme un singleton, il peut être exporté sous forme d'instance pré-configurée.
