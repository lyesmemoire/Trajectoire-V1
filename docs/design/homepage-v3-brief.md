# Homepage V3 – design system Calm, ambiance Sauge

## Tokens
fond #FAFAF8 · surface #FFFFFF · bordures #E6E4DE / #ECEBE6 · encre #1F2A37 · secondaire #4B5563 · tertiaire #3F4855 · accent #2F6B5E · accent-deep #245247 · accent-soft #E3EFE9 · accent-wash #F1F7F3 · accent-line #B9D3C8 · avertissement #8A4B16
Polices : Figtree (texte), Newsreader italique (mots d'accent, chiffres d'étapes).
Rayons : 14 boutons, 18-22 cartes, 28-32 blocs. Ombres très douces. Conteneur max 1200 px, marges latérales 20 px.

## 1. Header (blanc, filet bas)
Logo : carré arrondi 32 px accent-soft avec une courbe montante + un point en accent, puis « Trajectoire » (gras).
Liens : Comment ça marche · Pour qui · Tarifs. À droite : Connexion, bouton pilule accent « Diagnostic gratuit ».
Sous 760 px : seuls logo + bouton + bouton menu (44 px) ; menu déroulant avec les liens + Connexion (aria-expanded).

## 2. Héros (2 colonnes, grid auto-fit min 460 px)
Gauche :
- h1 clamp(36px,5.6vw,60px) : « Entraînez-vous face au recruteur qui a lu votre CV. » — « lu votre CV » en Newsreader italique couleur accent-deep.
- Sous-titre : « Alexandra, votre recruteuse d'entraînement, vous pose les vraies questions de l'offre que vous visez. À voix haute, sans jugement, puis un rapport clair pour progresser. »
- Mobile uniquement (< 760 px), au-dessus du formulaire : bande blanche avec avatar (initiale « A » sur accent-soft tant que SHOW_PORTRAIT=false), « Alexandra », « Votre recruteuse d'entraînement, bienveillante ».
- Carte blanche du formulaire (RÉUTILISE le composant et l'appel existants POST /api/public/analyze-preview) : zone de dépôt en pointillés accent-line sur fond accent-wash, icône upload, « Déposez votre CV », « PDF, DOCX ou TXT · 8 Mo maximum » ; bouton plein accent « Obtenir mon diagnostic gratuit → » ; en dessous, à gauche lien « + Ajouter l'offre visée », à droite « Gratuit · sans carte bancaire · résultat en 1 minute ».
Droite : carte produit blanche, rayon 28 :
- avatar 84 px (initiale « A » tant que SHOW_PORTRAIT=false), « Alexandra », « Recruteuse d'entraînement · bienveillante », pastille grise « Alternance · Chargée de communication » ;
- bloc gris clair : pastille accent-soft « Question tirée de votre CV », puis « « Vous avez animé les réseaux sociaux de votre association étudiante. Qu'est-ce qui a le mieux fonctionné, et comment l'avez-vous mesuré ? » » ;
- lecteur « Écouter Alexandra (20 s) » : bouton rond accent + forme d'onde, MASQUÉ tant que SHOW_HERO_AUDIO=false ;
- « Respirez. Vous pouvez reformuler à tout moment. » centré, texte secondaire.
PAS de photo stock dans le héros.

## 3. Bande pleine largeur fond accent-deep, texte blanc (id pour-qui)
Gauche : h2 « Le jour J, vous aurez déjà répondu à ces questions. » (« ces questions » en Newsreader italique), « Vous préparez : », boutons pilules (client, aria-pressed ; actif = fond blanc texte accent-deep ; inactif = transparent, bordure blanche 45 %) :
- Alternance : « Pourquoi l'alternance, et pourquoi chez nous ? » / « Comment allez-vous gérer le rythme école-entreprise ? » / « Parlez-moi d'une difficulté que vous avez surmontée. »
- Stage : « Qu'attendez-vous de ce stage ? » / « Quel projet de cours vous a le plus appris ? » / « Comment vous organisez-vous quand tout arrive en même temps ? »
- Premier emploi : « Vous avez peu d'expérience : pourquoi vous ? » / « Racontez-moi un projet dont vous êtes fier. » / « Où vous voyez-vous dans trois ans ? »
- Oral d'école : « Pourquoi notre école plutôt qu'une autre ? » / « Quel est votre projet professionnel ? » / « Parlez-moi d'un échec et de ce qu'il vous a appris. »
- Reconversion : « Pourquoi changer de métier maintenant ? » / « Qu'est-ce qui, dans votre parcours, vous sert pour ce poste ? » / « Comment comblez-vous ce qui vous manque encore ? »
- Cadre : « Comment avez-vous géré un conflit dans votre équipe ? » / « Quelle décision difficile avez-vous dû prendre ? » / « Quelles sont vos prétentions salariales ? »
Droite : les 3 questions du segment actif entre guillemets « », cartes blanc 10 % avec bordure blanche 22 %, aria-live="polite". Questions dans un fichier de contenu typé.

## 4. Comment ça marche (id comment)
Surtitre « COMMENT ÇA MARCHE », h2 « Trois étapes, moins de dix minutes ». 3 colonnes séparées par un filet haut, grands chiffres 1/2/3 en Newsreader italique 52 px couleur accent :
1 « Déposez votre CV » — « Et l'offre visée si vous l'avez. Trajectoire repère vos atouts et ce qu'un recruteur voudra creuser. » — 30 secondes
2 « Échangez avec Alexandra » — « Un échauffement à voix haute, comme un vrai entretien. Elle s'appuie sur votre parcours, sans vous piéger. » — 5 minutes
3 « Progressez, question par question » — « Un point fort, un axe prioritaire, une version plus claire de votre réponse. Puis réessayez tout de suite. » — Immédiat

## 5. Le rapport (fond blanc)
Gauche : « LE RAPPORT », h2 « Un rapport qui vous fait progresser, pas douter », « Pas de liste de quinze défauts. L'essentiel, formulé avec bienveillance, et de quoi vous améliorer dès maintenant. »
Droite : carte exemple : « Votre point fort » (accent-deep) « Des exemples concrets, tirés de vos expériences. » ; « À travailler en priorité » (avertissement) « Conclure chaque réponse par un résultat. » ; bloc gris « Votre réponse » « « J'ai posté régulièrement et ça a plutôt bien marché. » » ; bloc accent-soft « Une version plus claire » « « J'ai mis en place un calendrier de publication hebdomadaire. En un semestre, nos événements ont attiré davantage de participants. » » ; bouton contour accent « Réessayer cette question ».

## 6. Réassurance (bloc arrondi 32 fond accent-wash)
h2 « Ici, vous avez le droit de vous tromper. » (« vous tromper » en Newsreader italique), « Le stress se travaille comme le reste. Plus vous vous entraînez au calme, plus le jour J ressemble à quelque chose que vous connaissez déjà. » 4 cartes blanches : Entraînement privé / Exigence à votre mesure / Recommencez librement / Vos données vous appartiennent (textes : voir les équivalents actuels du produit, ton bienveillant, aucune promesse non vérifiée).

## 7. Témoignages : composant prêt, MASQUÉ (SHOW_TESTIMONIALS=false).

## 8. Tarifs (id tarifs)
h2 « Commencez gratuitement », « Commencez sans payer, puis choisissez l'offre qui correspond à votre recherche. L'offre Pro est sans engagement et résiliable à tout moment. » (vérifie la conformité avec les CGV, signale tout écart).
3 cartes, prix et contenus lus depuis lib/plans.ts : Découverte (0 €, bouton contour « Obtenir mon diagnostic gratuit »), Pass Alternance (mis en avant : bordure 2 px accent, pastille « Idéal pour la saison », bouton plein), Pro (bouton contour).

## 9. FAQ (fond blanc, <details>)
« Je suis très stressé en entretien. Est-ce adapté ? » / « Que deviennent mon CV et mes réponses ? » / « Est-ce que ça remplace un coach ? » / « Puis-je préparer un oral d'école ? » — réponses courtes, bienveillantes, sans promesse non vérifiée.

## 10. CTA final (bloc arrondi 32 fond accent-soft, centré)
h2 « Votre prochain entretien se prépare aujourd'hui. », « Déposez votre CV, découvrez ce qu'un recruteur va vous demander, et entraînez-vous au calme. », bouton « Obtenir mon diagnostic gratuit », « Gratuit, sans carte bancaire ». Sous le bloc : « Vous êtes une école, un CFA ou une université ? Découvrir l'offre établissements » → /ecoles.

## 11. Footer : logo + Écoles et CFA · Mentions légales · Confidentialité · CGU · Contact · © 2026 Trajectoire.

## Règles
Un seul CTA principal (« Obtenir mon diagnostic gratuit »). Server Components par défaut ; client seulement pour le menu mobile, les segments et le lecteur. Framer Motion : apparition douce au défilement, rien sur le héros, coupé si prefers-reduced-motion. Espaces insécables françaises partout (y compris dans le fichier des questions). Focus visible (blanc sur la bande foncée). Aucune donnée inventée.
