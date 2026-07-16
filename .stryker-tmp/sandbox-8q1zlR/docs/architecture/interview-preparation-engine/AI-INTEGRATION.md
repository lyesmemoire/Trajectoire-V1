# Interview Preparation Engine - AI Integration

## Overview
This document defines the AI integration strategy for the Interview Preparation Engine, ensuring clear separation between AI tasks, deterministic tasks, and business logic.

---

## Core Principle

**AI must never carry business logic.**

Business logic resides in the domain layer (services, policies, validators). AI is a tool for content generation, not decision-making.

---

## Task Classification

### 1. AI Tasks (GPT)

**Responsibility**: Generate content based on criteria
**Examples**:
- Generate question text
- Generate evaluation criteria
- Generate expected answer structure
- Generate follow-up questions
- Generate competency mapping suggestions

**Characteristics**:
- Non-deterministic (same input may produce different output)
- Requires validation against business rules
- Output must be post-processed by business logic
- Fallback to templates if AI fails

**Implementation**: `AIQuestionProvider` → `GPTAdapter`

---

### 2. Deterministic Tasks (Business Engine)

**Responsibility**: Execute business logic and enforce rules
**Examples**:
- Calculate question count
- Calculate timing
- Validate difficulty progression
- Validate competency coverage
- Order questions logically
- Resolve dependencies
- Apply adaptive rules

**Characteristics**:
- Deterministic (same input always produces same output)
- Enforces business rules
- No AI involvement
- Pure business logic

**Implementation**: Domain Services, Policies, Validators

---

### 3. Business Tasks (Domain Layer)

**Responsibility**: Make business decisions
**Examples**:
- Determine if coverage is sufficient
- Determine if difficulty is appropriate
- Determine if timing is valid
- Determine if plan is ready for approval
- Determine if adaptation is needed

**Characteristics**:
- Decision-making based on domain knowledge
- Uses deterministic calculations
- May use AI-generated content as input
- Never delegates decision-making to AI

**Implementation**: Domain Services, Aggregates

---

## AI Placement

### Where AI Intervenes

#### 1. Question Generation

**Location**: `QuestionGenerationService` → `AIQuestionProvider` → `GPTAdapter`

**AI Task**: Generate question text based on competency and difficulty

**Input**:
```typescript
{
  competency: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  context: {
    candidateLevel: SkillLevel;
    jobRequirements: Requirement[];
    previousQuestions: InterviewQuestion[];
  };
}
```

**AI Output**:
```typescript
{
  questionText: string;
  suggestedEvaluationCriteria: string[];
  suggestedKeyPoints: string[];
  suggestedDifficulty: QuestionDifficulty;
}
```

**Business Logic (Post-Processing)**:
- Validate question text against constraints
- Validate evaluation criteria against business rules
- Validate difficulty matches requested level
- Map to competencies
- Apply timing rules
- Add to plan

**Fallback**: Use question template if AI fails or produces invalid output

---

#### 2. Evaluation Criteria Generation

**Location**: `QuestionGenerationService` → `AIQuestionProvider` → `GPTAdapter`

**AI Task**: Generate evaluation criteria for a question

**Input**:
```typescript
{
  questionText: string;
  competency: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
}
```

**AI Output**:
```typescript
{
  criteria: string[];
  maxScore: number;
  weight: number;
  requiredKeyPoints: string[];
}
```

**Business Logic (Post-Processing)**:
- Validate criteria count (min 3, max 7)
- Validate max score (1-10)
- Validate weight (0.1-1.0)
- Validate key points relevance
- Apply scoring rubric structure

**Fallback**: Use default evaluation criteria template

---

#### 3. Expected Answer Generation

**Location**: `QuestionGenerationService` → `AIQuestionProvider` → `GPTAdapter`

**AI Task**: Generate expected answer structure

**Input**:
```typescript
{
  questionText: string;
  competency: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
}
```

**AI Output**:
```typescript
{
  structure: AnswerStructure;
  keyPoints: string[];
  examples: string[];
  antiPatterns: string[];
}
```

**Business Logic (Post-Processing)**:
- Validate structure matches question type
- Validate key points count (min 3, max 10)
- Validate examples relevance
- Validate anti-patterns
- Apply length constraints

**Fallback**: Use default answer structure template

---

#### 4. Follow-up Question Generation

**Location**: `QuestionGenerationService` → `AIQuestionProvider` → `GPTAdapter`

**AI Task**: Generate follow-up questions based on previous answer

**Input**:
```typescript
{
  previousQuestion: InterviewQuestion;
  previousAnswer: string;
  competency: string;
  difficulty: QuestionDifficulty;
}
```

**AI Output**:
```typescript
{
  followUpQuestions: string[];
  suggestedDifficulty: QuestionDifficulty;
}
```

**Business Logic (Post-Processing)**:
- Validate follow-up relevance
- Validate difficulty progression
- Validate dependency rules
- Add to plan if valid

**Fallback**: Skip follow-up if AI fails or produces invalid output

---

### Where AI Does NOT Intervene

#### 1. Business Rule Enforcement

**Location**: Policies, Validators

**AI Role**: None

**Business Logic**:
- Question count limits
- Duration limits
- Difficulty progression
- Competency coverage
- Dependency resolution

**Rationale**: Business rules must be deterministic and auditable. AI cannot be trusted to enforce constraints.

---

#### 2. Decision Making

**Location**: Domain Services, Aggregates

**AI Role**: None

**Business Logic**:
- Is coverage sufficient?
- Is difficulty appropriate?
- Is timing valid?
- Is plan ready for approval?
- Should adaptation be applied?

**Rationale**: Business decisions require domain expertise and accountability. AI cannot make business decisions.

---

#### 3. Validation

**Location**: Validators

**AI Role**: None

**Business Logic**:
- Validate plan structure
- Validate invariants
- Validate constraints
- Validate dependencies

**Rationale**: Validation must be deterministic and reliable. AI validation is unpredictable.

---

#### 4. Ordering

**Location**: `QuestionOrderingService`

**AI Role**: None

**Business Logic**:
- Order questions by difficulty
- Resolve dependencies
- Apply logical progression

**Rationale**: Ordering must be deterministic and predictable. AI ordering is unpredictable.

---

#### 5. Timing Calculation

**Location**: `TimingCalculationService`

**AI Role**: None

**Business Logic**:
- Calculate question timing
- Calculate section timing
- Calculate total timing
- Validate timing constraints

**Rationale**: Timing must be deterministic and consistent. AI timing is unpredictable.

---

## Architecture Flow

### AI Generation Flow

```
QuestionGenerationService (Business Logic)
  ↓
AIQuestionProvider (Orchestration)
  ↓
GPTAdapter (AI Integration)
  ↓
GPT API (External AI)
  ↓
GPTAdapter (Response Processing)
  ↓
AIQuestionProvider (Response Validation)
  ↓
QuestionGenerationService (Business Logic Post-Processing)
  ↓
InterviewQuestionFactory (Entity Creation)
  ↓
InterviewPlan (Domain)
```

### Key Points

1. **Business Logic First**: `QuestionGenerationService` makes the decision to use AI
2. **AI as Tool**: AI is used only for content generation
3. **Validation Required**: All AI output must be validated against business rules
4. **Fallback Strategy**: Templates used if AI fails
5. **No Decision Making**: AI never makes business decisions

---

## AI Adapter Interface

### GPTAdapter

**Responsibility**: Integrate with GPT API
**Location**: `core/ai/adapters/GPTAdapter.ts`

**SRP**: ✅ Single responsibility (GPT integration)
**Dependencies**: OpenAI SDK
**Forbidden**: Business logic, validation

```typescript
export interface GPTAdapter {
  generateQuestion(request: QuestionGenerationRequest): Promise<QuestionGenerationResponse>;
  generateEvaluationCriteria(request: CriteriaGenerationRequest): Promise<CriteriaGenerationResponse>;
  generateExpectedAnswer(request: AnswerGenerationRequest): Promise<AnswerGenerationResponse>;
  generateFollowUpQuestions(request: FollowUpGenerationRequest): Promise<FollowUpGenerationResponse>;
}
```

---

## AI Request/Response Contracts

### QuestionGenerationRequest

```typescript
interface QuestionGenerationRequest {
  competency: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  context: {
    candidateLevel: SkillLevel;
    jobRequirements: Requirement[];
    previousQuestions: InterviewQuestion[];
  };
  constraints: {
    maxLength: number;
    minLength: number;
    forbiddenTopics: string[];
  };
}
```

### QuestionGenerationResponse

```typescript
interface QuestionGenerationResponse {
  questionText: string;
  suggestedEvaluationCriteria: string[];
  suggestedKeyPoints: string[];
  suggestedDifficulty: QuestionDifficulty;
  confidence: number;
}
```

---

## AI Validation

### Pre-Request Validation

Before sending request to AI:
- Validate request parameters
- Validate constraints
- Validate context completeness
- Validate AI availability

### Post-Response Validation

After receiving response from AI:
- Validate response structure
- Validate content quality
- Validate confidence threshold
- Validate against business rules
- Validate against constraints

### Validation Failure Handling

If validation fails:
- Log validation failure
- Use fallback (template)
- Retry with different parameters (if applicable)
- Alert monitoring if repeated failures

---

## AI Fallback Strategy

### When AI Fails

1. **Network Error**: Use template
2. **API Error**: Use template
3. **Timeout**: Use template
4. **Invalid Response**: Use template
5. **Low Confidence**: Use template
6. **Validation Failure**: Use template

### Template Selection

- Match competency
- Match difficulty
- Match type
- Match context

### Template Priority

1. Exact match (competency + difficulty + type)
2. Partial match (competency + difficulty)
3. Partial match (competency + type)
4. Generic match (type only)
5. Default template

---

## AI Configuration

### Model Selection

- **Question Generation**: GPT-4 (higher quality)
- **Evaluation Criteria**: GPT-3.5 (cost optimization)
- **Expected Answer**: GPT-3.5 (cost optimization)
- **Follow-up Questions**: GPT-4 (context awareness)

### Temperature Settings

- **Question Generation**: 0.7 (creative but focused)
- **Evaluation Criteria**: 0.3 (consistent and structured)
- **Expected Answer**: 0.5 (balanced)
- **Follow-up Questions**: 0.6 (adaptive)

### Token Limits

- **Question Generation**: 500 tokens
- **Evaluation Criteria**: 300 tokens
- **Expected Answer**: 400 tokens
- **Follow-up Questions**: 300 tokens

### Confidence Threshold

- **Minimum Confidence**: 0.7
- **Below Threshold**: Use template

---

## AI Monitoring

### Metrics to Track

- AI request success rate
- AI response validation pass rate
- AI fallback rate
- AI response time
- AI confidence distribution
- AI cost per request

### Alerts

- High fallback rate (> 30%)
- Low confidence rate (> 50%)
- High error rate (> 10%)
- Slow response time (> 5s)

---

## AI Testing

### Unit Tests

- Mock AI adapter responses
- Test validation logic
- Test fallback logic
- Test error handling

### Integration Tests

- Test with real AI API (staging)
- Test rate limiting
- Test error scenarios
- Test fallback scenarios

### E2E Tests

- Test complete generation flow
- Test AI + template hybrid
- Test adaptation scenarios

---

## AI Security

### Input Sanitization

- Sanitize all inputs before sending to AI
- Remove sensitive information
- Remove PII
- Validate input structure

### Output Sanitization

- Validate AI output structure
- Sanitize AI output content
- Remove malicious content
- Validate against constraints

### API Security

- Use API keys (never in code)
- Use environment variables
- Rotate keys regularly
- Monitor usage for anomalies

---

## AI Cost Management

### Cost Optimization

- Use cheaper models for simple tasks
- Cache AI responses
- Use templates where possible
- Batch requests when possible

### Cost Monitoring

- Track cost per request
- Track cost per plan
- Set cost budgets
- Alert on budget exceeded

---

## AI Future Enhancements

### Phase 2B (Implementation)
- Basic AI integration
- Template fallback
- Basic validation

### Phase 2C (Enhancement)
- Fine-tuned models
- Custom prompts
- Advanced validation
- Hybrid AI + template

### Phase 3 (Optimization)
- Response caching
- Model selection optimization
- Cost optimization
- Performance optimization
