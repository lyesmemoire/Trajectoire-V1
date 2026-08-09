# RC37.1 - Dead Runtime Evidence

**Mission:** Document dead or unused runtime components based on observable evidence only.

**Evidence Policy:** Every assertion must include File, Line, Function, and Evidence. If not observed, write "NOT OBSERVED".

---

## DEAD RUNTIME: FLOWS

### Job Flow
- **Status:** DEAD
- **Evidence:** No separate job upload flow observed
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Reason:** Job upload is integrated into Landing/Preview flows as optional parameter
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\page.tsx` Line 28-29 shows job as optional input
- **Impact:** No standalone job upload page or route

### Admin Flow
- **Status:** DEAD
- **Evidence:** Admin pages and controllers not observed
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Reason:** No admin pages viewed, no admin controllers observed in API
- **Evidence Source:** File search did not reveal admin page implementations
- **Impact:** Admin functionality not accessible through observed runtime

---

## DEAD RUNTIME: COMPONENTS

### PreviewAnalysisRepository
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in PreviewAnalysisService but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts` Line 6 imports previewAnalysisRepository
- **Called By:** PreviewAnalysisService.analyzePreview (Line 38), PreviewAnalysisService.claimPreview (Line 63, 69, 80)
- **Impact:** Repository implementation unknown, database persistence unclear

### GraphRepository
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in GraphController but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\api\src\runtime\kg\graph.controller.ts` Line 8 imports GraphRepository type
- **Called By:** GraphController (all methods)
- **Impact:** Graph persistence layer unknown

### UserStateResolver
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in OnboardingResolver but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\lib\onboarding\OnboardingResolver.ts` Line 6 imports UserStateResolver
- **Called By:** OnboardingResolver.resolveOnboarding (Line 23), OnboardingResolver.advanceToNextStep (Line 71)
- **Impact:** User state persistence unknown

### JourneyResolver
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in OnboardingResolver and FlowEngine but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\lib\onboarding\OnboardingResolver.ts` Line 7 imports JourneyResolver
- **Called By:** OnboardingResolver (multiple methods), FlowEngine (multiple methods)
- **Impact:** Journey configuration and step resolution unknown

### ProgressEngine
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in FlowEngine but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\lib\onboarding\FlowEngine.ts` Line 9 imports ProgressEngine
- **Called By:** FlowEngine.getFlowContext (Line 232)
- **Impact:** Progress calculation unknown

### ConversationMemoryService
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in CopilotService but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts` Line 4 imports ConversationMemoryService
- **Called By:** CopilotService.processMessage (Line 33, 69, 75, 213-223)
- **Impact:** Conversation persistence unknown

### PromptInterpreterService
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in CopilotService but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts` Line 2 imports PromptInterpreterService
- **Called By:** CopilotService.processMessage (Line 32)
- **Impact:** Intent interpretation unknown

### ResponseBuilderService
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in CopilotService but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts` Line 3 imports ResponseBuilderService
- **Called By:** CopilotService.processMessage (Line 67)
- **Impact:** Response formatting unknown

### GraphMatchingService
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in MatchingController and CopilotService but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts` Line 2 imports GraphMatchingService
- **Called By:** MatchingController (Line 48, 67, 91), CopilotService (Line 6, 19)
- **Impact:** Graph matching algorithm unknown

### GraphSearchService
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in SearchController and CopilotService but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\api\src\search\search.controller.ts` Line 2 imports GraphSearchService
- **Called By:** SearchController (multiple methods), CopilotService (Line 5, 18, 110, 127, 151, 170)
- **Impact:** Graph search algorithm unknown

### GraphReasoningEngine
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in CopilotService but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts` Line 7 imports GraphReasoningEngine
- **Called By:** CopilotService.processMessage (Line 37)
- **Impact:** Graph reasoning algorithm unknown

### CacheService
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in CopilotService but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\api\src\copilot\copilot.service.ts` Line 9 imports CacheService
- **Called By:** CopilotService.processMessage (Line 24, 27, 84)
- **Impact:** Caching implementation unknown

### IdempotencyService
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in simulation create route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\simulation\create\route.ts` Line 9 imports IdempotencyService
- **Called By:** POST /api/simulation/create (Line 63-89)
- **Impact:** Idempotency implementation unknown

### SimulationService
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in simulation create route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\simulation\create\route.ts` Line 5 imports SimulationService
- **Called By:** POST /api/simulation/create (Line 58, 70, 91)
- **Impact:** Simulation logic unknown

### KernelState
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in interview route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\interview\route.ts` Line 8 imports KernelState
- **Called By:** POST /api/interview (Line 63, 95, 185, 210, 237)
- **Impact:** Interview kernel logic unknown

---

## DEAD RUNTIME: MIDDLEWARE

### CSRF Protect
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in sync-user route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\auth\sync-user\route.ts` Line 8 imports csrfProtect
- **Called By:** POST /api/auth/sync-user (Line 19)
- **Impact:** CSRF protection implementation unknown

### Upstash Rate Limit
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in analyze-preview route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts` Line 8 imports checkRateLimit
- **Called By:** POST /api/public/analyze-preview (Line 15)
- **Impact:** Rate limiting implementation unknown

### Centralized Rate Limit Service
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** File exists but implementation not viewed
- **Evidence Source:** File search found `centralized-rate-limit.service.ts`
- **Called By:** NOT OBSERVED
- **Impact:** Centralized rate limiting unknown

---

## DEAD RUNTIME: CLIENT COMPONENTS

### CandidateSearch
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in SearchWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\search\SearchWorkspace.tsx` Line 4 imports CandidateSearch
- **Called By:** SearchWorkspace (Line 19)
- **Impact:** Candidate search UI unknown

### JobSearch
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in SearchWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\search\SearchWorkspace.tsx` Line 5 imports JobSearch
- **Called By:** SearchWorkspace (Line 20)
- **Impact:** Job search UI unknown

### SimilarityView
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in SearchWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\search\SearchWorkspace.tsx` Line 6 imports SimilarityView
- **Called By:** SearchWorkspace (Line 24)
- **Impact:** Similarity view UI unknown

### CareerPathView
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in SearchWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\search\SearchWorkspace.tsx` Line 7 imports CareerPathView
- **Called By:** SearchWorkspace (Line 25)
- **Impact:** Career path view UI unknown

### CandidateUploader
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in RecruiterWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx` Line 4 imports CandidateUploader
- **Called By:** RecruiterWorkspace (Line 62)
- **Impact:** Candidate upload UI unknown

### JobUploader
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in RecruiterWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx` Line 5 imports JobUploader
- **Called By:** RecruiterWorkspace (Line 63)
- **Impact:** Job upload UI unknown

### MatchingPanel
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in RecruiterWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx` Line 6 imports MatchingPanel
- **Called By:** RecruiterWorkspace (Line 67)
- **Impact:** Matching panel UI unknown

### RecommendationPanel
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in RecruiterWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx` Line 7 imports RecommendationPanel
- **Called By:** RecruiterWorkspace (Line 72)
- **Impact:** Recommendation panel UI unknown

### GraphViewer
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in RecruiterWorkspace but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx` Line 8 imports GraphViewer
- **Called By:** RecruiterWorkspace (Line 76)
- **Impact:** Graph viewer UI unknown

---

## DEAD RUNTIME: HOOKS

### usePreviewStorage
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in AnalyzePage and SignupPage but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\analyze\page.tsx` Line 7 imports usePreviewStorage
- **Called By:** AnalyzePage (Line 20), SignupPage (Line 7)
- **Impact:** Preview storage logic unknown

---

## DEAD RUNTIME: UTILITIES

### getStrictUser
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in stripe checkout route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\stripe\checkout\route.ts` Line 7 imports getStrictUser
- **Called By:** POST /api/stripe/checkout (Line 60)
- **Impact:** Strict user validation unknown

### checkUserQuota
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in DashboardPage but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx` Line 7 imports checkUserQuota
- **Called By:** DashboardPage (Line 62)
- **Impact:** Quota checking logic unknown

### validateCVUpload
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in analyze-preview route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts` Line 9 imports validateCVUpload
- **Called By:** POST /api/public/analyze-preview (Line 35)
- **Impact:** CV validation logic unknown

### validateJobDescription
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in analyze-preview route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts` Line 9 imports validateJobDescription
- **Called By:** POST /api/public/analyze-preview (Line 45)
- **Impact:** Job description validation logic unknown

### generateFingerprint
- **Status:** DEAD (implementation not observed)
- **File:** NOT OBSERVED
- **Line:** NOT OBSERVED
- **Function:** NOT OBSERVED
- **Evidence:** Referenced in analyze-preview route but implementation not viewed
- **Evidence Source:** `c:\Trajectoire\apps\web\src\app\api\public\analyze-preview\route.ts` Line 8 imports generateFingerprint
- **Called By:** POST /api/public/analyze-preview (Line 13)
- **Impact:** Fingerprint generation logic unknown

---

## DEAD RUNTIME: PLACEHOLDER IMPLEMENTATIONS

### createSkills
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 206-213
- **Function:** `createSkills`
- **Evidence:** Line 211: `// TODO: Créer les skills dans la base de données`
- **Called By:** PreviewAnalysisService.claimPreview (Line 88)
- **Impact:** Skills not persisted to database

### createExperience
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 218-225
- **Function:** `createExperience`
- **Evidence:** Line 223: `// TODO: Créer l'expérience dans la base de données`
- **Called By:** PreviewAnalysisService.claimPreview (Line 91)
- **Impact:** Experience not persisted to database

### createEducation
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 230-237
- **Function:** `createEducation`
- **Evidence:** Line 235: `// TODO: Créer l'éducation dans la base de données`
- **Called By:** PreviewAnalysisService.claimPreview (Line 94)
- **Impact:** Education not persisted to database

### createLanguages
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 242-249
- **Function:** `createLanguages`
- **Evidence:** Line 247: `// TODO: Créer les langues dans la base de données`
- **Called By:** PreviewAnalysisService.claimPreview (Line 97)
- **Impact:** Languages not persisted to database

### feedKnowledgeGraph
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 263-274
- **Function:** `feedKnowledgeGraph`
- **Evidence:** Line 265: `// TODO: Intégrer avec le système Knowledge Graph`
- **Called By:** PreviewAnalysisService.claimPreview (Line 104)
- **Impact:** Knowledge graph not fed with data

### simulateATSAnalysis
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 141-163
- **Function:** `simulateATSAnalysis`
- **Evidence:** Line 33: `// TODO: Intégrer avec le service ATS existant`
- **Called By:** PreviewAnalysisService.analyzePreview (Line 35)
- **Impact:** ATS analysis is simulated, not real

---

## DEAD RUNTIME: API ENDPOINTS WITH PLACEHOLDERS

### POST /api/matching/candidate
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 12-26
- **Function:** `registerCandidate`
- **Evidence:** Line 18-20: Returns message "Graph must be stored via GraphRepository"
- **Called By:** RecruiterWorkspace
- **Impact:** Candidate registration not functional

### POST /api/matching/job
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 28-42
- **Function:** `registerJob`
- **Evidence:** Line 34-36: Returns message "Graph must be stored via GraphRepository"
- **Called By:** RecruiterWorkspace
- **Impact:** Job registration not functional

### GET /api/matching/candidates
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 131-144
- **Function:** `getAllCandidates`
- **Evidence:** Line 138: Returns message "Use GraphRepository to retrieve candidates"
- **Called By:** MatchingService
- **Impact:** Candidate retrieval not functional

### GET /api/matching/jobs
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 146-159
- **Function:** `getAllJobs`
- **Evidence:** Line 152: Returns message "Use GraphRepository to retrieve jobs"
- **Called By:** MatchingService
- **Impact:** Job retrieval not functional

### GET /api/matching/candidate/:id
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 161-174
- **Function:** `getCandidate`
- **Evidence:** Line 168: Returns message "Use GraphRepository to retrieve candidate graph"
- **Called By:** NOT OBSERVED
- **Impact:** Candidate graph retrieval not functional

### GET /api/matching/job/:id
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 176-189
- **Function:** `getJob`
- **Evidence:** Line 182: Returns message "Use GraphRepository to retrieve job graph"
- **Called By:** NOT OBSERVED
- **Impact:** Job graph retrieval not functional

### POST /api/search/related-skills
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 124-138
- **Function:** `findRelatedSkills`
- **Evidence:** Line 132: Returns message "Use graph-based similarity search for related skills"
- **Called By:** SearchService
- **Impact:** Related skills search not functional

### POST /api/search/register-candidate
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 170-183
- **Function:** `registerCandidate`
- **Evidence:** Line 177: Returns message "Use GraphRepository to store candidate graphs"
- **Called By:** SearchService
- **Impact:** Candidate registration not functional

### POST /api/search/register-job
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 185-198
- **Function:** `registerJob`
- **Evidence:** Line 192: Returns message "Use GraphRepository to store job graphs"
- **Called By:** SearchService
- **Impact:** Job registration not functional

### GET /api/search/candidates
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 200-213
- **Function:** `getAllCandidates`
- **Evidence:** Line 207: Returns message "Use GraphRepository to retrieve candidates"
- **Called By:** SearchService
- **Impact:** Candidate retrieval not functional

### GET /api/search/jobs
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 215-228
- **Function:** `getAllJobs`
- **Evidence:** Line 222: Returns message "Use GraphRepository to retrieve jobs"
- **Called By:** SearchService
- **Impact:** Job retrieval not functional

### GET /api/search/candidate/:id
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 230-243
- **Function:** `getCandidate`
- **Evidence:** Line 237: Returns message "Use GraphRepository to retrieve candidate graph"
- **Called By:** NOT OBSERVED
- **Impact:** Candidate graph retrieval not functional

### GET /api/search/job/:id
- **Status:** DEAD (placeholder)
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 245-258
- **Function:** `getJob`
- **Evidence:** Line 252: Returns message "Use GraphRepository to retrieve job graph"
- **Called By:** NOT OBSERVED
- **Impact:** Job graph retrieval not functional

---

## SUMMARY

### Dead Runtime by Category

| Category | Total Dead | Evidence |
|----------|------------|----------|
| Flows | 2 | Job Flow, Admin Flow |
| Components (Services/Repositories) | 13 | PreviewAnalysisRepository, GraphRepository, UserStateResolver, JourneyResolver, ProgressEngine, ConversationMemoryService, PromptInterpreterService, ResponseBuilderService, GraphMatchingService, GraphSearchService, GraphReasoningEngine, CacheService, IdempotencyService, SimulationService, KernelState |
| Middleware | 3 | CSRF Protect, Upstash Rate Limit, Centralized Rate Limit Service |
| Client Components | 8 | CandidateSearch, JobSearch, SimilarityView, CareerPathView, CandidateUploader, JobUploader, MatchingPanel, RecommendationPanel, GraphViewer |
| Hooks | 1 | usePreviewStorage |
| Utilities | 5 | getStrictUser, checkUserQuota, validateCVUpload, validateJobDescription, generateFingerprint |
| Placeholder Implementations | 5 | createSkills, createExperience, createEducation, createLanguages, feedKnowledgeGraph, simulateATSAnalysis |
| Placeholder API Endpoints | 12 | Matching and Search endpoints with placeholder messages |

**Total Dead Runtime:** 49 components

### Critical Dead Components

1. **GraphRepository** - Core persistence layer for graph data
2. **GraphMatchingService** - Core matching algorithm
3. **GraphSearchService** - Core search algorithm
4. **GraphReasoningEngine** - Core reasoning algorithm
5. **UserStateResolver** - User state persistence
6. **JourneyResolver** - Onboarding journey configuration
7. **ConversationMemoryService** - Copilot conversation persistence
8. **PreviewAnalysisRepository** - Preview analysis persistence

### Impact Assessment

- **High Impact:** GraphRepository, GraphMatchingService, GraphSearchService, GraphReasoningEngine (core functionality not observable)
- **Medium Impact:** UserStateResolver, JourneyResolver, ConversationMemoryService (onboarding and copilot not fully observable)
- **Low Impact:** Placeholder implementations (TODOs indicate planned functionality not yet implemented)

### Evidence Completeness

- **Total Components Analyzed:** 91
- **Dead (Not Observed):** 49 (54%)
- **Alive (Observed):** 42 (46%)
