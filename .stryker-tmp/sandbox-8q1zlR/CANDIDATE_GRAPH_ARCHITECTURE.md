# Candidate Intelligence Graph Architecture

## Overview

The Candidate Intelligence Graph is the single source of truth for all candidate-related data in the Trajectoire application. It aggregates information from multiple sources and intelligence engines to provide a comprehensive view of a candidate's career intelligence.

## Architecture

```
Raw Data Sources
    ↓
CandidateGraphBuilder (Orchestrator)
    ↓
Intelligence Engines (All 11 engines)
    ↓
CandidateGraph (Consolidated View)
    ↓
CandidateGraphValidator (Validation)
    ↓
CandidateGraphSnapshot (Immutable History)
    ↓
CandidateGraphDiff (Comparison & Analytics)
    ↓
Application Layers (Dashboard, ATS, Simulation, Report, etc.)
```

## Components

### 1. CandidateGraphBuilder
**File:** `/core/intelligence/profile/CandidateGraphBuilder.ts`

**Responsibilities:**
- Assemble CandidateGraph progressively from raw data
- Orchestrate all 11 intelligence engines
- No calculations, only orchestration
- Pure domain composition

**Engines Connected:**
- ✅ CareerEngine
- ✅ CandidateProfileEngine
- ✅ JobAnalyzerEngine
- ✅ InterviewAnalyzerEngine
- ✅ RecommendationEngine
- ✅ ProgressEngine
- ✅ ScoreEngine
- ✅ CoachEngine
- ✅ InsightEngine
- ✅ DecisionEngine
- ✅ MemoryEngine

### 2. CandidateGraphValidator
**File:** `/core/intelligence/profile/CandidateGraphValidator.ts`

**Responsibilities:**
- Validate candidate graph data
- Check for missing data
- Detect inconsistencies
- Identify conflicts
- Check for impossible scores
- Verify required fields

**Validation Types:**
- Identity validation (ID, name, email)
- Career validation (experience, target roles)
- Skills validation (levels, confidence)
- Scores validation (0-100 range)
- Progress validation (realistic changes)
- Trajectory validation (valid levels)
- Decision readiness validation

**Output:** `CandidateGraphValidation` with errors, warnings, and suggestions

### 3. CandidateGraphSnapshot
**File:** `/core/intelligence/profile/CandidateGraphSnapshot.ts`

**Responsibilities:**
- Create immutable snapshot of candidate graph
- Serve as historical record
- Enable comparison and analytics
- Support progression tracking
- Enable rollback capability

**Features:**
- Unique snapshot ID generation
- Deep cloning for immutability
- Age tracking (milliseconds and human-readable)
- Expiration checking
- Restore capability

### 4. CandidateGraphDiff
**File:** `/core/intelligence/profile/CandidateGraphDiff.ts`

**Responsibilities:**
- Compare two snapshots
- Detect progression
- Detect regression
- Identify new skills
- Identify lost skills
- Track confidence evolution
- Track employability evolution
- Track leadership evolution
- Track communication evolution

**Diff Metrics:**
- Overall score change
- Confidence change
- Employability change
- New/lost/improved/declined skills
- Communication evolution (clarity, persuasion, listening, structure)
- Leadership evolution (vision, execution, team building, conflict resolution, decision making)
- Progression/regression/stable status
- Career trajectory changes

### 5. CandidateIntelligenceGraph
**File:** `/core/intelligence/profile/CandidateIntelligenceGraph.ts`

**Responsibilities:**
- Main entry point for graph operations
- Delegate to specialized components
- Provide unified API
- Maintain backward compatibility

**Methods:**
- `buildGraph(data)` - Build complete graph (delegates to Builder)
- `validate(graph)` - Validate graph (delegates to Validator)
- `createSnapshot(graph, context)` - Create snapshot (delegates to Snapshot)
- `compareSnapshots(current, previous)` - Compare snapshots (delegates to Diff)
- `updateWithInterview(graph, data)` - Update with interview data
- `updateWithScores(graph, scores)` - Update with new scores

## Data Flow

### Input Sources

1. **CV Data**
   - Skills, experience, education
   - Certifications, languages
   - Project history

2. **ATS Analysis**
   - Job applications
   - Application status
   - Recruiter feedback

3. **Simulation History**
   - All interview simulations
   - Live scores per simulation
   - Response quality data

4. **User History**
   - Previous scores
   - Progression over time
   - Learning activities

5. **User Preferences**
   - Target roles
   - Target industries
   - Career goals

### Engine Orchestration

The CandidateGraphBuilder orchestrates the following engines:

| Engine | Responsibility | Output |
|--------|---------------|--------|
| **ScoreEngine** | Calculate composite scores, clamp values, calculate response impact | Overall score, employability, skill levels |
| **InsightEngine** | Generate insights, detect patterns, identify strengths | Strengths, patterns, behavioral analysis |
| **DecisionEngine** | Generate recruiter decisions, estimate probabilities | Decision readiness, hiring probability |
| **RecommendationEngine** | Generate recommendations, detect weaknesses | Weaknesses, job recommendations, skill recommendations |
| **CoachEngine** | Generate coaching plans, action items | Learning recommendations, interview prep |
| **InterviewAnalyzerEngine** | Analyze interview performance | Communication profile, leadership profile |
| **CareerEngine** | Analyze career trajectory | Career level, next steps, required skills |
| **CandidateProfileEngine** | Build candidate profile | Skills, experience, education |
| **JobAnalyzerEngine** | Analyze job requirements | Job fit, skill gaps |
| **ProgressEngine** | Track progression over time | Progress metrics, trends |
| **MemoryEngine** | Store and retrieve historical data | Memory context, patterns |

### Output Structure

The graph produces a single `CandidateGraph` object containing:

- **Identity**: Personal information
- **Career**: Career level, target roles, experience
- **Skills**: Hard and soft skills with proficiency
- **Communication**: Communication profile (clarity, persuasion, listening, structure)
- **Leadership**: Leadership profile (vision, execution, team building)
- **Confidence**: Overall confidence score
- **Employability**: Overall employability with trajectory
- **Strengths**: Detected strengths with confidence and impact
- **Weaknesses**: Detected weaknesses with suggestions
- **Patterns**: Recurring patterns (strengths, weaknesses, risks)
- **Progress**: Score progression over time
- **Trajectory**: Career trajectory with next steps
- **Recommendations**: Jobs, skills, interviews, learning
- **Risk Analysis**: Identified risks with mitigation
- **Decision Readiness**: Readiness for hiring decisions
- **Overall Score**: Composite score

## Lifecycle

### 1. Build Phase
```
Raw Data → CandidateGraphBuilder → Engines → CandidateGraph
```

### 2. Validation Phase
```
CandidateGraph → CandidateGraphValidator → Validation Result
```

### 3. Snapshot Phase
```
CandidateGraph → CandidateGraphSnapshot → Immutable Snapshot
```

### 4. Comparison Phase
```
Snapshot A + Snapshot B → CandidateGraphDiff → Diff Result
```

### 5. Update Phase
```
CandidateGraph + New Data → Engines → Updated CandidateGraph
```

## Dependencies

### Internal Dependencies
- All engines in `/core/intelligence/engines/`
- Type definitions in `/core/intelligence/types/`
- Profile components in `/core/intelligence/profile/`

### External Dependencies
- None (pure domain layer)

## Ownership

**Owner**: Intelligence Layer
**Maintained by**: Core Team
**Consumed by**: All application layers

## Responsibilities

### What the Graph DOES
- Aggregate data from multiple sources
- Orchestrate all 11 intelligence engines
- Provide single source of truth
- Calculate derived metrics
- Generate comprehensive candidate view
- Validate data integrity
- Create immutable snapshots
- Compare historical states
- Track progression over time

### What the Graph DOES NOT DO
- UI logic
- React state management
- API calls
- Database operations
- Business logic (delegated to engines)
- Display formatting (delegated to UI layer)

## Evolution

### Phase 1 (Current - SPRINT 10.4)
- Complete graph structure
- All 11 engines connected
- Builder, Validator, Snapshot, Diff components
- Comprehensive validation
- Historical tracking

### Phase 2 (Future)
- Historical pattern detection
- Predictive analytics
- Machine learning integration
- Real-time updates
- Advanced diff algorithms

### Phase 3 (Future)
- Cross-candidate benchmarking
- Market intelligence
- Salary optimization
- Career path prediction
- Personalized coaching AI

## Usage Example

```typescript
import { CandidateIntelligenceGraph } from "@/core/intelligence/profile/CandidateIntelligenceGraph";

// Build graph
const graph = CandidateIntelligenceGraph.buildGraph({
  identity: { id: "123", name: "John Doe", email: "john@example.com" },
  career: { careerLevel: "senior", yearsOfExperience: 8, targetRoles: ["CTO"] },
  skills: [{ name: "React", category: "hard", level: 85, confidence: 0.9, lastAssessed: new Date() }],
  liveScores: { communication: 75, leadership: 80, structure: 70, confidence: 85, impact: 75, stressManagement: 80, synthesis: 75 },
  interviewHistory: [],
  previousScores: [70, 72, 75],
});

// Validate
const validation = CandidateIntelligenceGraph.validate(graph);
if (!validation.isValid) {
  console.error("Validation errors:", validation.errors);
}

// Create snapshot
const snapshot = CandidateIntelligenceGraph.createSnapshot(graph, "After interview #5");

// Compare snapshots
const diff = CandidateIntelligenceGraph.compareSnapshots(currentSnapshot, previousSnapshot);
console.log("Progression:", diff.progression);
console.log("New skills:", diff.newSkills);
```

## Integration Points

### Dashboard
- Displays overall score
- Shows progress trajectory
- Highlights strengths/weaknesses
- Uses diff for progression visualization

### ATS
- Uses employability score
- Leverages decision readiness
- Displays recommended jobs
- Tracks application progress

### Simulation
- Updates live scores
- Refreshes graph after each simulation
- Provides real-time feedback
- Creates snapshots for history

### Report
- Uses comprehensive graph data
- Generates detailed analysis
- Provides actionable insights
- Shows progression over time

## Constraints

- No React dependencies
- No hooks
- No JSX
- No Tailwind classes
- No UI logic
- Pure domain orchestration
- All engines must be used
- No unused imports

## Performance Considerations

- Graph building is synchronous
- Can be cached for read operations
- Updates trigger recalculation
- Lazy loading for heavy computations
- Snapshots are immutable (safe for caching)
- Diff operations are optimized for performance

## Testing

### Unit Tests
- Test each component independently
- Mock engines for isolated testing
- Validate edge cases

### Integration Tests
- Test full graph building
- Test validation logic
- Test snapshot creation
- Test diff operations

### Regression Tests
- Verify all engines are called
- Verify no unused imports
- Verify data consistency
- Verify backward compatibility
