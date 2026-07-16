# Sprint 6 Baseline

## Mesures de départ

- **Build Time**: ~47s (Mesure reelle de `pnpm build`)
- **TTFB Dashboard**: ~2.5s - 4s (Temps bloque par l'execution sequentielle de 17 moteurs d'intelligence)
- **Flight Payload**: Payload volumineux car le Dashboard renvoie l'integralite du HTML serialise d'un coup (tous les widgets).
- **Nombre de Suspense**: 0 sur `app/(app)/dashboard/page.tsx`
- **Nombre de fetch serveur**: > 17 appels consecutifs (Supabase, Brain, puis 15+ moteurs d'intelligence IA).
- **Waterfalls detectes**: Enorme waterfall de 17 `await` successifs dans `DashboardHome`.
- **Temps moyen Supabase**: Bloquant pour le rendu initial (`candidateAIBrain.load` et `CandidateGraphDataLoader`).
- **Appels paralleles**: 0 (`Promise.all` absent pour les moteurs IA).
- **Cache Hits**: 0%, car la route est en `force-dynamic`.
- **Revalidate / no-store**: La page entiere est marquee `export const dynamic = "force-dynamic"`.
