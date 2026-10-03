# Homepage finale : comparaison avec la référence

Référence : `docs/design/homepage-finale-apercu.html` (captures `ref-1440.png`, `ref-390.png`).
Implémentation : build de production locale (captures `home-1440.png`, `home-390.png`).

| Section | Écart avec la référence |
|---|---|
| En-tête | Identique (logo serif 29 px + point vert, liens, Connexion, bouton plein, filet léger ; « Menu » sous 700 px). Écart voulu : cibles de 44 px de large minimum pour les liens. Sous 400 px, logo à 21 px et bouton à 12 px pour tenir à 320 px. |
| Héros | Identique (repère, h1, introduction, zone de dépôt, bouton, ligne de mentions, portrait 4:5, carte de question, légende). Ajouts demandés : glisser-déposer avec état visuel, nom et poids du fichier, bouton « Retirer le fichier », erreurs en `role="alert"`. Écart voulu : le texte « Question tirée de votre CV » est à 12 px (11 px dans la référence). La question affichée est la question complète de `HERO_QUESTION` (la référence la tronquait). |
| La méthode | Identique. |
| Pour qui | Identique ; les 6 segments sont lus dans `content.ts`, hauteur mini 400 px, sans arrondi. |
| Le rapport | Identique ; carte avec ombre douce (`shadow-report`). |
| Notre conviction | Identique ; le texte de « Reformulez librement » ne promet plus « reformuler à tout moment » (non vérifiable dans le produit). |
| Tarifs | Identique en structure ; prix, noms et listes lus dans `lib/plans.ts`. Écart voulu : les boutons d’achat du Pack et de Pro affichent « Bientôt disponible » tant que `PURCHASE_ENABLED` est faux (la référence montrait « Choisir… »). |
| FAQ | Questions de `content.ts` (7 au lieu de 5) ; indicateur « + » ajouté (la référence utilise la flèche native du navigateur). |
| Fin | Identique. |
| Pied de page | Identique ; « Mentions légales » absent tant que les champs d’éditeur sont vides (condition inchangée). |

## Mesures (build de production, Chrome, mobile)

- Aucun débordement horizontal à 320, 390, 768 et 1440 px.
- Aucun texte sous 12 px ; aucun contraste sous 4,5:1 (3:1 pour le grand texte) sur le fond réel de chaque élément.
- Cibles : toutes ≥ 44 px, sauf le lien d’évitement « Aller au contenu principal » (invisible tant qu’il n’a pas le focus).
- Lighthouse mobile, 3 passes : Accessibilité 100, Bonnes pratiques 100, SEO 100 sur toutes les passes.
  Performance (très bruitée sur cette machine, deux modes d’exécution) : avant 63 / 84 / 71, après 81 / 74 / 66.
  LCP simulé : avant 3,7 à 4,9 s, après 3,8 à 5,1 s ; l’élément LCP est le titre h1, pas le portrait.
  CLS 0,016, TBT 260 à 530 ms.
