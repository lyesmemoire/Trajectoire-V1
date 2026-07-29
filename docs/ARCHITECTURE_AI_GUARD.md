# Architecture - AI Guard

## Objectif

L'AI Guard est une couche de validation qui vérifie que les réponses du modèle respectent les règles du scénario avant d'être envoyées au candidat.

**Elle peut empêcher le modèle de :**
- Donner la réponse à un exercice
- Sortir du rôle du recruteur
- Révéler les critères d'évaluation
- Changer de langue sans raison
- Ignorer les contraintes du Planner

---

## Position dans l'Architecture

```
OpenAI Realtime
        ↓
AI Guard
        ↓
Gateway (WebSocket)
        ↓
Frontend
```

---

## Responsabilités

### 1. Validation des réponses

Vérifier que la réponse respecte :
- Le rôle du recruteur
- Les contraintes du stage actuel
- Les règles de sécurité
- La langue attendue

### 2. Détection de violations

Détecter les violations :
- Réponse directe à un exercice
- Sortie du rôle
- Révélation d'informations sensibles
- Changement de langue inapproprié
- Violation des contraintes

### 3. Correction ou rejet

En cas de violation :
- Corriger la réponse si possible
- Rejeter la réponse et demander une nouvelle
- Logger la violation pour analyse

### 4. Apprentissage

Apprendre des violations :
- Analyser les patterns de violations
- Ajuster les prompts pour éviter les violations
- Signaler les violations récurrentes

---

## Interface

```typescript
interface AIGuard {
  // Valider une réponse
  validate(response: string, context: GuardContext): Promise<GuardResult>;
  
  // Vérifier si la réponse contient une violation
  checkViolation(response: string, rules: GuardRule[]): Violation | null;
  
  // Corriger une réponse si possible
  correct(response: string, violation: Violation): string | null;
}

interface GuardContext {
  sessionId: string;
  currentStage: InterviewStage;
  currentObjective: StageObjective;
  persona: PersonaParameters;
  forbiddenBehaviors: string[];
  allowedStrategies: string[];
  language: string;
  lastQuestion?: string;
}

interface GuardResult {
  isValid: boolean;
  violation?: Violation;
  correctedResponse?: string;
  shouldRetry: boolean;
}

interface Violation {
  type: ViolationType;
  severity: 'low' | 'medium' | 'high';
  message: string;
  detectedAt: string;
  context: string;
}

type ViolationType =
  | 'direct_answer' // Donner la réponse à un exercice
  | 'role_break' // Sortir du rôle du recruteur
  | 'sensitive_info' // Révéler des informations sensibles
  | 'language_change' // Changer de langue sans raison
  | 'constraint_violation' // Violer une contrainte
  | 'evaluation_reveal' // Révéler les critères d'évaluation
  | 'inappropriate_content' // Contenu inapproprié;
```

---

## Implémentation

### 1. AI Guard

```typescript
class AIGuard implements AIGuard {
  private rules: GuardRule[] = [];
  private violationHistory: Map<string, Violation[]> = new Map();

  constructor() {
    this.initializeRules();
  }

  async validate(response: string, context: GuardContext): Promise<GuardResult> {
    // 1. Vérifier les violations
    const violation = this.checkViolation(response, this.rules);

    if (!violation) {
      return { isValid: true, shouldRetry: false };
    }

    // 2. Logger la violation
    this.logViolation(context.sessionId, violation);

    // 3. Tenter de corriger
    const corrected = this.correct(response, violation);

    if (corrected) {
      return {
        isValid: true,
        violation,
        correctedResponse: corrected,
        shouldRetry: false,
      };
    }

    // 4. Si non corrigeable, rejeter
    return {
      isValid: false,
      violation,
      shouldRetry: true,
    };
  }

  checkViolation(response: string, rules: GuardRule[]): Violation | null {
    const lowerResponse = response.toLowerCase();

    for (const rule of rules) {
      if (this.matchesRule(lowerResponse, rule)) {
        return {
          type: rule.type,
          severity: rule.severity,
          message: rule.message,
          detectedAt: new Date().toISOString(),
          context: response,
        };
      }
    }

    return null;
  }

  private matchesRule(response: string, rule: GuardRule): boolean {
    // Vérifier les patterns
    for (const pattern of rule.patterns) {
      if (response.includes(pattern)) {
        return true;
      }
    }

    // Vérifier les regex
    for (const regex of rule.regexes) {
      if (regex.test(response)) {
        return true;
      }
    }

    return false;
  }

  correct(response: string, violation: Violation): string | null {
    // Correction selon le type de violation
    switch (violation.type) {
      case 'direct_answer':
        return this.correctDirectAnswer(response);
      
      case 'role_break':
        return this.correctRoleBreak(response);
      
      case 'sensitive_info':
        return this.correctSensitiveInfo(response);
      
      case 'language_change':
        return this.correctLanguageChange(response);
      
      default:
        return null;
    }
  }

  private correctDirectAnswer(response: string): string | null {
    // Remplacer la réponse directe par une question de guidage
    const patterns = [
      /la réponse est/i,
      /c'est simple/i,
      /voici la solution/i,
      /il faut faire/i,
    ];

    for (const pattern of patterns) {
      if (pattern.test(response)) {
        return response.replace(pattern, 'Pouvez-vous me dire comment vous aborderiez ce problème ?');
      }
    }

    return null;
  }

  private correctRoleBreak(response: string): string | null {
    // Supprimer les phrases qui sortent du rôle
    const patterns = [
      /en tant qu'ia/i,
      /je suis une intelligence artificielle/i,
      /je ne suis pas un recruteur/i,
    ];

    let corrected = response;
    for (const pattern of patterns) {
      corrected = corrected.replace(pattern, '');
    }

    return corrected !== response ? corrected : null;
  }

  private correctSensitiveInfo(response: string): string | null {
    // Masquer les informations sensibles
    const patterns = [
      /score.*\d+/i,
      /évaluation.*\d+/i,
      /compétence.*\d+/i,
    ];

    let corrected = response;
    for (const pattern of patterns) {
      corrected = corrected.replace(pattern, '[information masquée]');
    }

    return corrected !== response ? corrected : null;
  }

  private correctLanguageChange(response: string): string | null {
    // Détecter si la réponse contient du texte dans une autre langue
    // Pour l'instant, on retourne null (pas de correction automatique)
    return null;
  }

  private logViolation(sessionId: string, violation: Violation): void {
    const history = this.violationHistory.get(sessionId) || [];
    history.push(violation);
    this.violationHistory.set(sessionId, history);

    // Logger pour analyse
    console.warn(`[AI Guard] Violation detected: ${violation.type}`, {
      sessionId,
      violation,
    });
  }

  private initializeRules(): void {
    this.rules = [
      // Direct answer
      {
        type: 'direct_answer',
        severity: 'high',
        patterns: [
          'la réponse est',
          'c\'est simple',
          'voici la solution',
          'il faut faire',
          'tu devrais',
        ],
        regexes: [
          /\d+\s*%\s*de\s*chance/i,
          /la\s+bonne\s+réponse\s+est/i,
        ],
        message: 'Le modèle donne une réponse directe au lieu de guider le candidat.',
      },

      // Role break
      {
        type: 'role_break',
        severity: 'high',
        patterns: [
          'en tant qu\'ia',
          'je suis une intelligence artificielle',
          'je ne suis pas un recruteur',
          'je ne peux pas',
        ],
        regexes: [],
        message: 'Le modèle sort de son rôle de recruteur.',
      },

      // Sensitive info
      {
        type: 'sensitive_info',
        severity: 'medium',
        patterns: [
          'score',
          'évaluation',
          'compétence',
          'critère',
        ],
        regexes: [
          /score.*\d+/i,
          /évaluation.*\d+/i,
        ],
        message: 'Le modèle révèle des informations sensibles sur l\'évaluation.',
      },

      // Language change
      {
        type: 'language_change',
        severity: 'low',
        patterns: [],
        regexes: [
          /[a-z]{10,}/i, // Détecte des mots longs en anglais dans un texte français
        ],
        message: 'Le modèle change de langue sans raison.',
      },

      // Constraint violation
      {
        type: 'constraint_violation',
        severity: 'medium',
        patterns: [
          'je ne peux pas répondre',
          'je ne sais pas',
          'c\'est hors de mon domaine',
        ],
        regexes: [],
        message: 'Le modèle viole les contraintes du scénario.',
      },

      // Evaluation reveal
      {
        type: 'evaluation_reveal',
        severity: 'high',
        patterns: [
          'tu as bien répondu',
          'tu as mal répondu',
          'ta réponse est correcte',
          'ta réponse est incorrecte',
        ],
        regexes: [],
        message: 'Le modèle révèle si la réponse est correcte ou non.',
      },
    ];
  }
}
```

### 2. Guard Rule

```typescript
interface GuardRule {
  type: ViolationType;
  severity: 'low' | 'medium' | 'high';
  patterns: string[];
  regexes: RegExp[];
  message: string;
}
```

---

## Exemples de Violations

### Direct Answer

**Réponse invalide**
```
"La réponse est simple : tu dois utiliser une table de hachage pour O(1)."
```

**Violation détectée**
```typescript
{
  type: 'direct_answer',
  severity: 'high',
  message: 'Le modèle donne une réponse directe au lieu de guider le candidat.',
}
```

**Réponse corrigée**
```
"Pouvez-vous me dire comment vous aborderiez ce problème ? Quelles structures de données envisageriez-vous ?"
```

### Role Break

**Réponse invalide**
```
"En tant qu'IA, je ne peux pas juger vos compétences, mais je peux vous aider..."
```

**Violation détectée**
```typescript
{
  type: 'role_break',
  severity: 'high',
  message: 'Le modèle sort de son rôle de recruteur.',
}
```

**Réponse corrigée**
```
"Je peux vous aider à explorer ce sujet. Pouvez-vous me décrire votre approche ?"
```

### Sensitive Info

**Réponse invalide**
```
"Votre score en architecture est de 75/100, ce qui est correct mais peut être amélioré."
```

**Violation détectée**
```typescript
{
  type: 'sensitive_info',
  severity: 'medium',
  message: 'Le modèle révèle des informations sensibles sur l\'évaluation.',
}
```

**Réponse corrigée**
```
"Votre approche est intéressante. Pouvez-vous me dire comment vous pourriez l'améliorer ?"
```

---

## Intégration avec OpenAI

```typescript
class OpenAIAdapter {
  constructor(
    private openai: OpenAI,
    private aiGuard: AIGuard
  ) {}

  async chat(context: PromptContext): Promise<string> {
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      // 1. Générer la réponse
      const response = await this.openai.chat.completions.create({
        messages: [
          { role: 'system', content: context.systemPrompt },
          { role: 'user', content: context.userPrompt },
        ],
      });

      const content = response.choices[0].message.content || '';

      // 2. Valider avec AI Guard
      const guardContext: GuardContext = {
        sessionId: context.sessionId,
        currentStage: context.currentStage,
        currentObjective: context.currentObjective,
        persona: context.persona,
        forbiddenBehaviors: context.forbiddenBehaviors,
        allowedStrategies: context.allowedStrategies,
        language: 'fr',
      };

      const guardResult = await this.aiGuard.validate(content, guardContext);

      // 3. Si valide, retourner
      if (guardResult.isValid) {
        return guardResult.correctedResponse || content;
      }

      // 4. Si invalide et corrigeable, retourner la correction
      if (guardResult.correctedResponse) {
        return guardResult.correctedResponse;
      }

      // 5. Si invalide et non corrigeable, réessayer
      attempt++;
      
      // Ajouter un message de correction au contexte
      context.userPrompt += `\n\n[Correction] Votre réponse précédente a été rejetée. ${guardResult.violation?.message}`;
    }

    // Si toutes les tentatives échouent, retourner une réponse par défaut
    return this.getDefaultResponse(context.currentStage);
  }

  private getDefaultResponse(stage: InterviewStage): string {
    const defaults: Record<InterviewStage, string> = {
      [InterviewStage.INTRODUCTION]: "Bonjour, pouvez-vous vous présenter ?",
      [InterviewStage.ARCHITECTURE]: "Pouvez-vous me décrire votre approche ?",
      [InterviewStage.LEADERSHIP]: "Pouvez-vous me donner un exemple concret ?",
      // ... autres stages
    };

    return defaults[stage] || "Pouvez-vous développer ?";
  }
}
```

---

## Tests

### Tests unitaires

```typescript
describe('AIGuard', () => {
  it('should detect direct answer violation', async () => {
    const response = "La réponse est simple : tu dois utiliser une table de hachage.";
    const context = createTestGuardContext();

    const result = await aiGuard.validate(response, context);

    expect(result.isValid).toBe(false);
    expect(result.violation?.type).toBe('direct_answer');
  });

  it('should detect role break violation', async () => {
    const response = "En tant qu'IA, je ne peux pas juger vos compétences.";
    const context = createTestGuardContext();

    const result = await aiGuard.validate(response, context);

    expect(result.isValid).toBe(false);
    expect(result.violation?.type).toBe('role_break');
  });

  it('should correct direct answer', async () => {
    const response = "La réponse est simple : tu dois utiliser une table de hachage.";
    const violation = {
      type: 'direct_answer' as ViolationType,
      severity: 'high' as const,
      message: 'Direct answer detected',
      detectedAt: new Date().toISOString(),
      context: response,
    };

    const corrected = aiGuard.correct(response, violation);

    expect(corrected).toContain('Pouvez-vous me dire');
    expect(corrected).not.toContain('La réponse est');
  });

  it('should pass valid response', async () => {
    const response = "Pouvez-vous me décrire votre approche pour ce problème ?";
    const context = createTestGuardContext();

    const result = await aiGuard.validate(response, context);

    expect(result.isValid).toBe(true);
    expect(result.violation).toBeUndefined();
  });
});
```

---

## Monitoring

### Métriques

```typescript
// Métriques à surveiller
- ai_guard_violations_total
- ai_guard_violations_by_type
- ai_guard_corrections_total
- ai_guard_retries_total
- ai_guard_latency_seconds
```

### Alertes

```typescript
// Alertes
- Taux de violations > 5%
- Taux de corrections > 10%
- Taux de retries > 2%
```

---

## Checklist

### Avant implémentation

- [ ] Interface AIGuard définie
- [ ] Guard Rules définies
- [ ] Violation types définis
- [ ] Correction logic défini

### Après implémentation

- [ ] AIGuard implémenté
- [ ] Guard Rules configurées
- [ ] Violation detection fonctionnel
- [ ] Correction fonctionnel
- [ ] Intégration OpenAI fonctionnel
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Monitoring en place

---

## Timeline

| Tâche | Durée |
|-------|-------|
| Interface definition | 1 jour |
| AIGuard implémenté | 2 jours |
| Guard Rules configurées | 2 jours |
| Correction logic | 2 jours |
| Intégration OpenAI | 1 jour |
| Tests | 1 jour |
| Monitoring | 1 jour |
| **Total** | **10 jours (~1.5 semaines)** |

---

## Conclusion

L'AI Guard permet :

1. **Validation des réponses** : Contrôle qualité avant envoi
2. **Détection de violations** : Patterns et regex
3. **Correction automatique** : Réponses corrigées si possible
4. **Apprentissage** : Analyse des violations
5. **Sécurité** : Empêche les réponses inappropriées
6. **Monitoring** : Métriques et alertes
