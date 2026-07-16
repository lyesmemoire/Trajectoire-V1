# Module CV Suite

**Status ATS: IMPLEMENTED**
**Mock removed: YES**
**AI Analysis: ACTIVE**
**Persistence: ENABLED**

---

## État actuel
Le tunnel de gestion du CV se divise en 3 grandes étapes : l'Upload, l'Audit ATS (Crédibilité) et l'Optimisation par l'IA.
- **Upload (`app/dashboard/upload/page.tsx`)** : L'utilisateur charge un PDF. La route `/api/upload` extrait le texte, génère des embeddings (OpenAI `text-embedding-3-small`), sauvegarde dans le bucket Supabase `cvs` et dans la table `cv_embeddings` pour le RAG.
- **ATS Audit (`app/dashboard/ats/page.tsx`)** : Analyse en temps réel du CV face à une offre d'emploi. L'interface sollicite l'API `/api/ats/analyze` qui retourne une structure JSON stricte générée par Mistral (score, forces, faiblesses, mots-clés manquants, niveau de match).
- **Optimisation Premium (`app/dashboard/optimize/page.tsx`)** : Récupère le dernier score ATS généré et persistant dans `ats_reports`, puis utilise l'IA pour réécrire le contenu du CV.

## Fonctionnalités détectées
- Upload PDF, extraction locale via `pdf-parse` et vectorisation RAG.
- Déduction stricte de crédits avec rollback en cas d'erreur.
- Prompt Mistral complexe pour l'audit ATS et l'optimisation, avec mise en cache des réponses.
- Bouton d'export du CV structuré (`<ExportButton>`).

## Gaps (Maintenant tous résolus)
- **[OK] Upload & Embedding** : La pipeline d'ingestion est fonctionnelle et sécurisée.
- **[OK] Analyse ATS (Crédibilité)** : La route `app/dashboard/ats/page.tsx` est désormais couplée à une véritable IA. Les faux délais et les "mocks" ont été supprimés. L'API retourne un feedback dynamique, basé sur le contenu réel du document, persistant de façon sécurisée (côté backend) dans la table `ats_reports`.
- **[OK] Optimisation & Export** : `/dashboard/optimize` utilise le dernier `ats_reports` certifié par l'API pour lancer la réécriture. Le couplage est garanti.

## Risques
- **Tromperie utilisateur** : Résolu. L'analyse ne simule plus de données. Elle génère un audit authentique et l'UX affiche un spinner "Analyse en cours...".

## Implémentations réalisées (Phase D)
1. **Création API stricte** : `app/api/ats/analyze/route.ts` pour gérer l'output JSON et l'écriture dans `ats_reports` (sans exposer la DB côté front-end).
2. **Refonte UI** : Nettoyage de `page.tsx` (suppression du mock), affichage rigoureux des mots-clés manquants, des forces et d'un score de crédibilité.
