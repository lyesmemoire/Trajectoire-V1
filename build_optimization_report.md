# Rapport d'Optimisation du Build Next.js

## Objectif
Adapter le processus de build du frontend Next.js pour un environnement à mémoire limitée (Arena sandbox) afin d'éviter les erreurs `SIGKILL`.

## Modifications Appliquées

### Fichier : `next.config.mjs`
Les optimisations suivantes ont été ajoutées pour réduire la consommation de ressources lors de la phase de build :

1.  **`output: 'standalone'`** : Active le mode standalone de Next.js. Cela permet de générer un serveur minimaliste contenant uniquement les fichiers nécessaires au runtime, réduisant ainsi la taille du build final.
2.  **`typescript: { ignoreBuildErrors: true }`** : Désactive la vérification des types TypeScript pendant le build. Le type-checking est désormais géré séparément via la commande `npm run typecheck`, évitant ainsi de charger le compilateur TS durant la phase de build Next.js.
3.  **`eslint: { ignoreDuringBuilds: true }`** : (Déjà présent, confirmé) Désactive l'exécution du linting pendant le build pour gagner du temps et de la mémoire.
4.  **`productionBrowserSourceMaps: false`** : Désactive explicitement la génération de source maps pour la production, réduisant ainsi l'utilisation de la mémoire et l'espace disque.

## Respect des Contraintes
- [x] **Pas de modification de logique métier** : Aucune route ni fonctionnalité n'a été touchée.
- [x] **Pas de modification d'architecture** : La structure du monorepo reste inchangée.
- [x] **Pas de suppression de fonctionnalités** : Toutes les capacités du frontend sont préservées.
- [x] **Optimisation ciblée** : Seuls les paramètres de compilation ont été ajustés.

## État Final
Le build est désormais configuré pour être le plus léger possible en termes de ressources système, déléguant la validation statique (TS/Lint) à des étapes de CI/CD ou de développement distinctes.
