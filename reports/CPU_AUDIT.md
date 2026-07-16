# CPU Server Audit

## Goulets d'etranglement CPU
Les 17 moteurs d'intelligence IA executent de lourdes boucles de tri, de mappage et de filtrage sur le graphe du candidat.

## Risque de Scalabilite
Si le CPU Node.js est occupe a mouliner 17 moteurs l'un apres l'autre (waterfall) par utilisateur, un pic de trafic s'averera dommageable (Event Loop surchargee).

## Solution
- **Parallellisation** : Le systeme doit deleguer toutes les promesses a l'event loop des que possible (via `Promise.all` ou Suspense).
- **Memoization / React.cache** : Envelopper la fonction de generation du `CandidateGraph` via `cache()` garantira que son extraction CPU (parcours des entites) n'est executee qu'une seule fois par requete serveur, peu importe combien de Server Components la reclament simultanement.
