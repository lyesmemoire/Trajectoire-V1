# Conventions API (Next.js Routes)

Les Route Handlers Next.js (`app/api/**/route.ts`) doivent agir uniquement comme des contrôleurs d'entrée/sortie. Ils ne doivent contenir aucune logique métier complexe.

## Le Pipeline Standard

Toutes les requêtes entrantes (POST, PUT, etc.) doivent suivre ce pipeline exact :
1. **Validation Zod** de l'entrée (`req.json()`).
2. **Authentification** (récupération de l'utilisateur).
3. **Appel au Service Métier**.
4. **Retour** de la réponse formatée.

## Exemple d'Implémentation Idéale

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";
import { usersService } from "@/lib/users";
import { requireUser } from "@/lib/auth"; // Exemple

const UpdateUserSchema = z.object({
  fullName: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    // 1. Validation de l'entrée
    const input = UpdateUserSchema.parse(await req.json());

    // 2. Authentification
    const user = await requireUser();

    // 3. Appel du Service
    const updatedProfile = await usersService.updateProfile(user.id, input);

    // 4. Retour (le Service renvoie déjà un DTO)
    return NextResponse.json({ success: true, data: updatedProfile });
    
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
```

## À Bannir
- Intégrer de la logique `stripe.customers.create()` directement dans la route.
- Faire appel à `prisma.*` ou `supabase.from()` dans la route.
- Renvoyer des objets Prisma complets contenant des mots de passe hachés ou des identifiants techniques internes.
