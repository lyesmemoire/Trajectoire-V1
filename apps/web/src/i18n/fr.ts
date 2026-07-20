/**
 * TRAJECTOIRE · HIIOS v4.0
 * Localisation francophone complète
 * File: i18n/fr.ts
 */

export const fr = {

  // ──────────────────────────────────────────────────────────
  // IDENTITÉ DU SYSTÈME
  // ──────────────────────────────────────────────────────────

  system: {
    name        : 'Trajectoire',
    tagline     : 'Le meilleur recruteur virtuel du monde.',
    description : `Un moteur cognitif d'entretien.
                   Exigeant. Juste. Empathique. Transparent.`,
    version     : 'v4.0',
  },

  // ──────────────────────────────────────────────────────────
  // ÉTATS DE L'ENTRETIEN
  // ──────────────────────────────────────────────────────────

  interviewStates: {
    CALIBRATION   : 'Calibration',
    EXPLORATION   : 'Exploration',
    PRECISION     : 'Précision',
    JUSTIFICATION : 'Justification',
    CONTRADICTION : 'Contradiction',
    PRESSION      : 'Pression',
    REFLEXION     : 'Réflexion',
  },

  // ──────────────────────────────────────────────────────────
  // TYPES DE PREUVES
  // ──────────────────────────────────────────────────────────

  evidenceTypes: {
    CITATION  : 'Citation directe',
    BEHAVIOR  : 'Comportement observable',
    ABSENCE   : 'Absence notable',
    PATTERN   : 'Schéma répété',
  },

  evidenceReliability: {
    HIGH   : 'Fiabilité haute',
    MEDIUM : 'Fiabilité moyenne',
    LOW    : 'Fiabilité faible',
  },

  evidenceDirection: {
    CONFIRMS : 'Confirme',
    INFIRMS  : 'Infirme',
    NEUTRAL  : 'Neutre',
  },

  // ──────────────────────────────────────────────────────────
  // STATUTS DES HYPOTHÈSES
  // ──────────────────────────────────────────────────────────

  hypothesisStatus: {
    GENERATED : 'Générée',
    ACTIVE    : 'Active',
    CONFIRMED : 'Confirmée',
    INFIRMED  : 'Infirmée',
    SUSPENDED : 'Suspendue',
    ABANDONED : 'Abandonnée',
  },

  // ──────────────────────────────────────────────────────────
  // TYPES DE BIAIS
  // ──────────────────────────────────────────────────────────

  biasTypes: {
    HALO_EFFECT       : 'Effet de halo',
    SIMILARITY_BIAS   : 'Biais de similarité',
    AFFINITY_BIAS     : 'Biais d\'affinité',
    ANCHORING         : 'Ancrage cognitif',
    CONFIRMATION_BIAS : 'Biais de confirmation',
    CONTRAST_EFFECT   : 'Effet de contraste',
    ATTRIBUTION_ERROR : 'Erreur d\'attribution',
  },

  biasDescriptions: {
    HALO_EFFECT       : `Une qualité forte masque toutes les faiblesses.
                         Vous évaluez l'ensemble du candidat
                         à travers le prisme d'un seul point positif.`,
    SIMILARITY_BIAS   : `Vous appréciez ce candidat parce qu'il vous ressemble.
                         Posez-vous la question :
                         est-ce que je recrute ou est-ce que je me reconnais ?`,
    AFFINITY_BIAS     : `Un lien implicite favorise ce candidat.
                         École, région, parcours similaire.
                         Revenez aux faits. Aux preuves.`,
    ANCHORING         : `Votre première impression oriente encore votre lecture.
                         Reformulez mentalement le profil à mi-entretien.`,
    CONFIRMATION_BIAS : `Vous cherchez ce qui confirme votre intuition initiale.
                         Cherchez activement ce qui la contredit.`,
    CONTRAST_EFFECT   : `Vous évaluez ce candidat par rapport au précédent.
                         Évaluez-le contre le poste. Pas contre autrui.`,
    ATTRIBUTION_ERROR : `Vous imputez ses difficultés à sa personnalité.
                         Demandez le contexte avant de conclure sur la personne.`,
  },

  // ──────────────────────────────────────────────────────────
  // ARCHÉTYPES DE CANDIDATS
  // ──────────────────────────────────────────────────────────

  archetypes: {
    Junior       : 'Le Junior',
    Senior       : 'Le Senior',
    TresStresse  : 'Le Très Stressé',
    Bavard       : 'Le Bavard',
    TropConfiant : 'Le Trop Confiant',
    TresPrepare  : 'Le Très Préparé',
    Bluffeur     : 'Le Bluffeur',
    Discret      : 'Le Discret',
    Manager      : 'Le Manager',
    ExpertTech   : 'L\'Expert Technique',
    Consultant   : 'Le Consultant',
  },

  archetypeStrategies: {
    Junior       : `Structurez. Sécurisez. Évaluez le potentiel, pas seulement le passé.`,
    Senior       : `Allez vite. Creusez la vision et l'impact réel.`,
    TresStresse  : `Ralentissez. Reformulez. Laissez du silence.`,
    Bavard       : `Recentrez avec bienveillance. Toujours.`,
    TropConfiant : `Demandez du concret. Montrez-moi.`,
    TresPrepare  : `Brisez le script. Posez une question inattendue.`,
    Bluffeur     : `Demandez un exemple précis. Immédiatement.`,
    Discret      : `Commencez par des questions fermées. Ouvrez progressivement.`,
    Manager      : `Testez les décisions difficiles et la gestion des conflits.`,
    ExpertTech   : `Testez la capacité à vulgariser. Pas la technique seule.`,
    Consultant   : `Demandez où il a exécuté. Pas seulement où il a conçu.`,
  },

  // ──────────────────────────────────────────────────────────
  // NIVEAUX DE CONFIANCE
  // ──────────────────────────────────────────────────────────

  confidenceLevels: {
    TRES_FAIBLE : 'Très faible',
    FAIBLE      : 'Faible',
    MODEREE     : 'Modérée',
    ELEVEE      : 'Élevée',
    TRES_ELEVEE : 'Très élevée',
  },

  confidenceDescriptions: {
    TRES_FAIBLE : `Observation unique. Aucune preuve convergente.
                   Interdiction de conclure. Exploration obligatoire.`,
    FAIBLE      : `Hypothèse active. Preuves partielles.
                   Identifiez ce qu'il manque. Posez une question ciblée.`,
    MODEREE     : `Plusieurs observations convergentes.
                   Activez le moteur de contradiction. Testez l'hypothèse.`,
    ELEVEE      : `Schéma confirmé. Testé sous contradiction.
                   Conclusion possible. Nommez les zones résiduelles.`,
    TRES_ELEVEE : `Requiert 5+ preuves indépendantes et 2+ contradictions échouées.
                   Nommez toujours l'incertitude résiduelle. Jamais 100%.`,
  },

  // ──────────────────────────────────────────────────────────
  // DÉCISIONS DE RECRUTEMENT
  // ──────────────────────────────────────────────────────────

  decisions: {
    HIRE    : 'Recommande le recrutement',
    NO_HIRE : 'Ne recommande pas le recrutement',
    DEFER   : 'Décision suspendue — information manquante',
  },

  decisionLabels: {
    confidence           : 'Niveau de confiance',
    probabiliteSucces    : 'Probabilité de succès',
    risqueFauxPositif    : 'Risque de faux positif',
    risqueFauxNegatif    : 'Risque de faux négatif',
    couvertureProfil     : 'Couverture du profil',
    incertitudeResiduelle: 'Incertitude résiduelle',
    signauxForts         : 'Signaux forts',
    signauxFaibles       : 'Signaux faibles',
    zonesNonExplorees    : 'Zones non explorées',
    biaisDetectes        : 'Biais détectés',
    correctionAppliquee  : 'Correction appliquée',
    questionsRestantes   : 'Questions restantes avant décision finale',
    raisonnement         : 'Raisonnement',
  },

  // ──────────────────────────────────────────────────────────
  // REQUÊTES D'EXPLICATION
  // ──────────────────────────────────────────────────────────

  explainQueries: {
    WHY_THIS_QUESTION        : 'Pourquoi cette question ?',
    WHY_THIS_CONFIDENCE      : 'Pourquoi ce niveau de confiance ?',
    WHAT_IS_UNKNOWN          : 'Qu\'est-ce que le système ne sait pas encore ?',
    FULL_REASONING           : 'Récapitulatif du raisonnement complet',
    WHY_THIS_DECISION        : 'Pourquoi cette décision ?',
    WHAT_CHANGED_AT_TURN     : 'Qu\'est-ce qui a changé à ce tour ?',
    HOW_WAS_BIAS_CORRECTED   : 'Comment ce biais a-t-il été corrigé ?',
    WHY_HYPOTHESIS_ABANDONED : 'Pourquoi cette hypothèse a-t-elle été abandonnée ?',
    WHAT_EVIDENCE_COUNTS     : 'Quelles preuves comptent le plus ?',
    WHAT_WOULD_CHANGE        : 'Qu\'est-ce qui changerait la décision ?',
  },

  // ──────────────────────────────────────────────────────────
  // RAPPORTS — TITRES ET SECTIONS
  // ──────────────────────────────────────────────────────────

  reports: {

    progression: {
      title    : 'Rapport de progression',
      subtitle : 'Établi par Trajectoire à l\'issue de l\'entretien',
      sections: {
        forcesProuvees        : 'Forces réellement démontrées',
        competencesAmeliorer  : 'Compétences insuffisamment démontrées',
        croyancesLimitantes   : 'Croyances limitantes observées',
        anglesMorts           : 'Angles morts comportementaux',
        communicationAmeliorer: 'Habitudes de communication à améliorer',
        questionsdifficiles   : 'Questions auxquelles vous répondez le moins bien',
        situationsEntrainement: 'Situations d\'entraînement prioritaires',
        planProgression       : 'Plan de progression personnalisé',
        messageFinal          : 'Pour continuer',
      },
      planLabels: {
        semaine: 'Semaine',
        action : 'Action',
        cible  : 'Compétence ciblée',
      },
      notes: {
        forcesNote    : `Ces forces sont prouvées. Pas supposées.
                         Elles sont tirées directement de vos réponses.`,
        competencesNote: `Ces compétences ne sont pas absentes.
                          Elles n'ont pas encore trouvé leurs mots dans cet entretien.
                          C'est une différence importante.`,
        croyancesNote  : `Ce sont des hypothèses, pas des diagnostics.
                          Elles méritent d'être explorées, pas acceptées comme certitudes.`,
      },
    },

    decision: {
      title   : 'Décision de recrutement',
      subtitle: 'Établie par Trajectoire · Fondée sur des preuves',
    },

    evidenceMap: {
      title   : 'Carte des preuves',
      subtitle: 'Toutes les preuves accumulées pendant l\'entretien',
    },

    hypothesisMap: {
      title   : 'Carte des hypothèses',
      subtitle: 'État de toutes les hypothèses et leur niveau de confiance',
    },

    confidenceGraph: {
      title   : 'Graphe de confiance',
      subtitle: 'Évolution de la confiance tour par tour',
    },

    skillRadar: {
      title   : 'Radar de compétences',
      subtitle: 'Vue d\'ensemble des compétences explorées',
    },

    biasReport: {
      title   : 'Rapport sur les biais',
      subtitle: 'Biais détectés, pénalités appliquées, corrections effectuées',
    },

    contradictionReport: {
      title   : 'Rapport de contradictions',
      subtitle: 'Contradictions explorées et leur résolution',
    },

    riskMatrix: {
      title   : 'Matrice des risques',
      subtitle: 'Risques identifiés, probabilité, impact',
    },

    openQuestions: {
      title   : 'Questions ouvertes',
      subtitle: 'Questions restantes classées par gain d\'information',
    },

    learning: {
      title   : 'Rapport d\'apprentissage',
      subtitle: 'Résultats observés · Propositions d\'ajustement · Poids actifs',
    },
  },

  // ──────────────────────────────────────────────────────────
  // COMPÉTENCES DU GRAPHE
  // ──────────────────────────────────────────────────────────

  skillGraph: {
    LEADERSHIP: {
      label: 'Leadership',
      nodes: {
        decision           : 'Décision sous pression',
        influence          : 'Influence sans autorité',
        responsabilisation : 'Responsabilisation d\'équipe',
        conflit            : 'Gestion du conflit',
        vision             : 'Vision et sens',
      },
    },
    COMMUNICATION: {
      label: 'Communication',
      nodes: {
        clarte    : 'Clarté sous pression',
        ecoute    : 'Écoute active',
        adaptation: 'Adaptation du message',
        desaccord : 'Gestion du désaccord',
      },
    },
    EXECUTION: {
      label: 'Exécution',
      nodes: {
        priorisation : 'Priorisation',
        incertitude  : 'Gestion de l\'incertitude',
        livraison    : 'Livraison sous contrainte',
        apprentissage: 'Apprentissage par l\'échec',
      },
    },
    INTELLIGENCE_EMOTIONNELLE: {
      label: 'Intelligence émotionnelle',
      nodes: {
        conscienceSoi: 'Conscience de soi',
        regulation   : 'Régulation émotionnelle',
        empathie     : 'Empathie',
        resilience   : 'Résilience',
      },
    },
  },

  // ──────────────────────────────────────────────────────────
  // MESSAGES SYSTÈME
  // ──────────────────────────────────────────────────────────

  system_messages: {

    // Progression de l'entretien
    interview: {
      debut: `Bonjour. Je suis Trajectoire.
               Je vais conduire cet entretien avec vous.
               Prenez le temps qu'il vous faut pour répondre.
               Il n'y a pas de piège. Il y a des questions.`,
      changementEtat: (etat: string) =>
        `Nous allons maintenant explorer ${etat}.`,
      bilanMiParcours: `Vous avez fait un bon travail jusqu'ici.
                         Continuons.`,
      fin: `Merci pour cet entretien.
            Vous avez répondu à des questions difficiles avec sérieux.
            Votre rapport de progression va être généré.`,
    },

    // Principe d'Or
    principeOr: {
      actif : `L'entretien monte en intensité.
               Trajectoire augmente proportionnellement son niveau d'empathie.`,
      alerte: `Niveau de pression trop élevé par rapport à l'empathie.
               Régulation automatique déclenchée.`,
    },

    // Biais
    biais: {
      detecte   : (type: string) =>
        `Biais détecté : ${type}. Pénalité appliquée. Question corrective déclenchée.`,
      corrige   : (type: string) =>
        `Biais ${type} corrigé. Preuve contraire obtenue.`,
      nonResolu : (type: string) =>
        `Biais ${type} non résolu. La décision finale est bloquée jusqu'à résolution.`,
    },

    // Hypothèses
    hypotheses: {
      generee   : (label: string) =>
        `Nouvelle hypothèse générée : "${label}".`,
      confirmee : (label: string, conf: number) =>
        `Hypothèse "${label}" confirmée. Confiance : ${(conf * 100).toFixed(0)}%.`,
      infirmee  : (label: string) =>
        `Hypothèse "${label}" infirmée. Preuve contraire suffisante.`,
      suspendue : (label: string) =>
        `Hypothèse "${label}" suspendue. Questions nécessaires non disponibles.`,
    },

    // Décision
    decision: {
      insuffisante : `Les preuves sont insuffisantes pour conclure.
                      Voici ce qu'il manque :`,
      biaisBloquant : `Un biais non résolu bloque la décision finale.
                       Résolvez d'abord :`,
      prete         : `Les preuves sont suffisantes pour une recommandation.
                       Confiance :`,
    },

    // Apprentissage
    apprentissage: {
      seuilNonAtteint: (actuel: number, requis: number) =>
        `Seuil minimum non atteint.
         Observations disponibles : ${actuel}/${requis}.
         Aucun ajustement déclenché.`,
      propositionGeneree: (label: string, delta: string) =>
        `Proposition générée : ${label} (${delta}).
         En attente de validation humaine.`,
      propositionApprouvee: (label: string) =>
        `Proposition approuvée : ${label}. Poids mis à jour.`,
      propositionRejetee: (label: string, raison: string) =>
        `Proposition rejetée : ${label}. Raison : ${raison}`,
      violationEquite: (dimension: string, delta: string) =>
        `Violation d'équité détectée sur la dimension "${dimension}".
         Écart observé : ${delta}. Proposition bloquée.`,
    },

    // Erreurs
    erreurs: {
      outcomeInvalide       : `Le résultat soumis est invalide. Vérifiez les champs requis.`,
      validationHumaine     : `La validation humaine est obligatoire. Renseignez "validé par".`,
      propositionIntrouvable: `Proposition introuvable. Vérifiez l'identifiant.`,
      rollbackImpossible     : `Rollback impossible : ce poids n'a pas encore été appliqué.`,
    },
  },

  // ──────────────────────────────────────────────────────────
  // INTERFACE UTILISATEUR — LABELS ET BOUTONS
  // ──────────────────────────────────────────────────────────

  ui: {

    actions: {
      commencer        : 'Commencer l\'entretien',
      continuer        : 'Continuer',
      pause            : 'Pause',
      terminer         : 'Terminer l\'entretien',
      voirRapport      : 'Voir le rapport',
      telecharger      : 'Télécharger',
      partager         : 'Partager',
      approuver        : 'Approuver',
      rejeter          : 'Rejeter',
      annuler          : 'Annuler',
      rollback         : 'Annuler l\'ajustement',
      expliquer        : 'Expliquer',
      pourquoiQuestion : 'Pourquoi cette question ?',
      voirRaisonnement : 'Voir le raisonnement complet',
    },

    labels: {
      tour              : 'Tour',
      etat              : 'État',
      confiance         : 'Confiance',
      hypotheses       : 'Hypothèses',
      preuves           : 'Preuves',
      biais             : 'Biais',
      contradictions    : 'Contradictions',
      questionsOuvertes : 'Questions ouvertes',
      decisionFinale    : 'Décision finale',
      planProgression   : 'Plan de progression',
      poidsActifs       : 'Poids actifs',
      enAttenteRevision : 'En attente de révision',
    },

    navigation: {
      tableau_de_bord: 'Tableau de bord',
      entretiens     : 'Entretiens',
      rapports       : 'Rapports',
      apprentissageu  : 'Apprentissage',
      parametres     : 'Paramètres',
      aide           : 'Aide',
    },

    niveauxRisque: {
      SAFE      : 'Sûr',
      MONITORED : 'À surveiller',
      HIGH_RISK : 'Risque élevé',
      BLOCKED   : 'Bloqué',
    },

    statutsProposition: {
      PENDING_REVIEW: 'En attente de révision',
      APPROVED      : 'Approuvée',
      REJECTED      : 'Rejetée',
      APPLIED       : 'Appliquée',
      ROLLED_BACK   : 'Annulée',
    },

    statutsOutcome: {
      SUCCESS          : 'Succès confirmé',
      PARTIAL          : 'Succès partiel',
      FAILURE          : 'Échec confirmé',
      FALSE_POSITIVE   : 'Faux positif',
      FALSE_NEGATIVE   : 'Faux négatif',
      DEFERRED_SUCCESS : 'Succès différé',
    },
  },

  // ──────────────────────────────────────────────────────────
  // PRINCIPES — AFFICHÉS DANS L'INTERFACE
  // ──────────────────────────────────────────────────────────

  principes: {

    or: `Chaque augmentation de difficulté
         doit être compensée par une augmentation proportionnelle d'empathie.`,

    dignite: `On ne challenge jamais la personne.
              On challenge son raisonnement, ses choix, ses exemples.`,

    progression: `Chaque entretien laisse le candidat meilleur qu'avant.
                  Même si la décision est négative.
                  Surtout si la décision est négative.`,

    transparence: `Le raisonnement est toujours visible.
                   Chaque décision est traçable jusqu'à sa source.`,

    incertitude: `Ce que le système ne sait pas compte autant
                  que ce que le système sait.
                  L'incertitude résiduelle est toujours honnête.`,

    equite: `Aucun ajustement ne peut créer ou renforcer
             un biais systématique contre un groupe de candidats.`,
  },

  // ──────────────────────────────────────────────────────────
  // QUESTIONS — EXEMPLES LOCALISÉS
  // ──────────────────────────────────────────────────────────

  questionExamples: {

    exploration: [
      'Racontez-moi une situation où vous avez dû prendre une décision difficile.',
      'Parlez-moi d\'un projet dont vous êtes particulièrement fier.',
      'Décrivez-moi un moment où vous avez dû gérer un désaccord dans votre équipe.',
    ],

    precision: [
      'Qu\'avez-vous réellement fait, vous personnellement ?',
      'Quel était votre rôle exact dans cette situation ?',
      'Quelles décisions avez-vous prises seul dans ce projet ?',
    ],

    justification: [
      'Pourquoi ce choix-là et pas un autre ?',
      'Qu\'est-ce qui vous a amené à cette conclusion ?',
      'Sur quelle base avez-vous pris cette décision ?',
    ],

    contradiction: [
      'Qu\'auriez-vous fait si les conditions avaient été différentes ?',
      'Quelle est la limite de cette approche selon vous ?',
      'Dans quel contexte cette méthode ne fonctionnerait-elle pas ?',
    ],

    pression: [
      'Votre manager n\'était pas d\'accord avec vous. Qu\'avez-vous fait ?',
      'Racontez-moi une situation où vous avez maintenu votre position malgré la pression.',
      'Qu\'est-ce qui s\'est passé quand votre équipe a refusé votre décision ?',
    ],

    reflexion: [
      'Avec le recul, referiez-vous exactement la même chose ?',
      'Qu\'avez-vous appris de cette situation ?',
      'Si c\'était à refaire, que changeriez-vous ?',
    ],
  },

  // ──────────────────────────────────────────────────────────
  // REFORMULATIONS — COMMUNICATION SCIENCE
  // ──────────────────────────────────────────────────────────

  reformulations: {

    reflechir: [
      'Si je comprends bien…',
      'Ce que vous dites, c\'est que…',
      'Vous voulez dire que…',
    ],

    normaliser: [
      'Beaucoup de personnes traversent exactement cette situation.',
      'C\'est une situation que beaucoup de professionnels ont vécue.',
      'Ce que vous décrivez est plus commun qu\'on ne le croit.',
    ],

    recadrer: [
      'Ce que vous décrivez comme un échec — est-ce que ça pourrait aussi être…',
      'Je me demande si cette situation ne vous a pas aussi appris…',
      'Avec un autre regard, cette expérience pourrait aussi signifier…',
    ],

    challenger: [
      'J\'aimerais comprendre ce qui vous fait dire cela.',
      'Il me manque un élément pour être convaincu.',
      'Si vous deviez convaincre un directeur en deux minutes, quel exemple choisiriez-vous ?',
      'Qu\'est-ce qui vous a amené à cette conclusion ?',
    ],

    presenceActive: [
      'Prenez le temps qu\'il vous faut.',
      'Je vous écoute.',
      'Continuez, je suis avec vous.',
    ],
  },

} as const

// Type utilitaire pour accès typé
export type FrLocale = typeof fr
