# MARKETING CLEANUP REPORT

## 1. DUPLICATES RESOLVED
- **Supprimé** : Le dossier complet `components/marketing-old` a été supprimé.
- **Supprimé** : Le fichier `app/(marketing)/page.old.txt` a été supprimé.
- **Retenu** : Le dossier `components/marketing` reste la source unique de vérité pour l'UI de la landing page.

## 2. DEAD UI REMOVAL
- **Nettoyé** : Les anciens composants de pricing, features, faq, et testimonials qui étaient en doublon dans l'ancienne structure ont été définitivement purgés pour éviter toute confusion lors de la phase QA.
- **Retenu** : Seuls les composants activement importés par `app/(marketing)/page.tsx` sont conservés.

## 3. COPY CONTRADICTIONS & RISKS
- **Vérification** : La promesse de `StudioEntretien` est désormais centrée sur "l'entraînement comportemental sous pression" et non plus sur des promesses génériques (ex: "Trouvez un emploi en 2 jours").
- **Risque résiduel** : La section `InstantInterviewDemo` (si elle n'est pas connectée au vrai SIL) pourrait être perçue comme une fausse promesse. Elle devra être surveillée lors du QA global pour vérifier qu'elle reflète exactement la latence de production.
