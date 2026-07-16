# Flight Payload Audit

## Problème de surcharge
Suite aux excellentes migrations du Sprint 5, nous avons reduit massivement le JavaScript client. Cependant, le payload Flight a grossi (logique : le serveur renvoie le HTML complet serialise). Ce n'est pas un probleme en soi, sauf s'il retarde l'affichage initial !

## Recommandation
Sans streaming, le navigateur doit telecharger l'integralite du HTML serialise de l'enorme page Dashboard avant de l'afficher. Le payload est trop gros pour etre envoye de maniere monolithique.
Le decoupage de la page via `<Suspense>` permettra d'envoyer le payload en morceaux (Chunks) progressifs, en commencant par le Layout.

*Impact*: Maintien de l'empreinte client tres faible tout en ameliorant le Time To First Byte (TTFB).
