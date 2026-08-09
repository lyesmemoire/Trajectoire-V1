# RC37.2 - Dead Paths Documentation

**Mission:** Document dead paths in end-to-end user journey based on observable evidence only.

**Evidence Policy:** Every assertion based on RC37.1 evidence. No assumptions, estimations, or inferences.

---

## DEAD PATH 1: ATS SIMULATION

### Path Description
The ATS analysis uses a simulation instead of the real ATS service.

### Location
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 141-163
- **Function:** `simulateATSAnalysis`

### Evidence
- **Line 33:** Comment "TODO: Remplacer par l'appel au vrai service ATS"
- **Line 141-163:** Function returns hardcoded mock data instead of calling real service

### Impact
- ATS analysis is not real
- Scores are simulated
- No actual ATS integration

### Called By
- `previewAnalysisService.analyzePreview` (PreviewAnalysisService.ts:35)

### Execution Path
```
analyzePreview called
  ↓
simulateATSAnalysis called
  ↓
Returns mock data (NOT REAL ATS)
  ↓
Mock data saved to database
```

### Why Dead
- TODO comment indicates planned replacement
- No real ATS service integration observed

---

## DEAD PATH 2: SKILLS CREATION

### Path Description
Skills are not persisted to database during claim preview.

### Location
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 206-213
- **Function:** `createSkills`

### Evidence
- **Line 211:** Comment "TODO: Créer les skills dans la base de données"
- **Line 212:** `console.log('Skills créés:', skills)` - only logging, no database operation

### Impact
- Skills not persisted
- No skill data available for matching
- Knowledge graph not fed with skills

### Called By
- `previewAnalysisService.claimPreview` (PreviewAnalysisService.ts:88)

### Execution Path
```
claimPreview called
  ↓
createSkills called
  ↓
console.log only (NO DATABASE SAVE)
  ↓
Function returns
```

### Why Dead
- TODO comment indicates planned implementation
- Only console.log, no Prisma operations

---

## DEAD PATH 3: EXPERIENCE CREATION

### Path Description
Experience is not persisted to database during claim preview.

### Location
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 218-225
- **Function:** `createExperience`

### Evidence
- **Line 223:** Comment "TODO: Créer l'expérience dans la base de données"
- **Line 224:** `console.log('Expérience créée:', experience)` - only logging, no database operation

### Impact
- Experience not persisted
- No experience data available for matching
- Knowledge graph not fed with experience

### Called By
- `previewAnalysisService.claimPreview` (PreviewAnalysisService.ts:91)

### Execution Path
```
claimPreview called
  ↓
createExperience called
  ↓
console.log only (NO DATABASE SAVE)
  ↓
Function returns
```

### Why Dead
- TODO comment indicates planned implementation
- Only console.log, no Prisma operations

---

## DEAD PATH 4: EDUCATION CREATION

### Path Description
Education is not persisted to database during claim preview.

### Location
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 230-237
- **Function:** `createEducation`

### Evidence
- **Line 235:** Comment "TODO: Créer l'éducation dans la base de données"
- **Line 236:** `console.log('Education créée:', education)` - only logging, no database operation

### Impact
- Education not persisted
- No education data available for matching
- Knowledge graph not fed with education

### Called By
- `previewAnalysisService.claimPreview` (PreviewAnalysisService.ts:94)

### Execution Path
```
claimPreview called
  ↓
createEducation called
  ↓
console.log only (NO DATABASE SAVE)
  ↓
Function returns
```

### Why Dead
- TODO comment indicates planned implementation
- Only console.log, no Prisma operations

---

## DEAD PATH 5: LANGUAGES CREATION

### Path Description
Languages are not persisted to database during claim preview.

### Location
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 242-249
- **Function:** `createLanguages`

### Evidence
- **Line 247:** Comment "TODO: Créer les langues dans la base de données"
- **Line 248:** `console.log('Langues créées:', languages)` - only logging, no database operation

### Impact
- Languages not persisted
- No language data available for matching
- Knowledge graph not fed with languages

### Called By
- `previewAnalysisService.claimPreview` (PreviewAnalysisService.ts:97)

### Execution Path
```
claimPreview called
  ↓
createLanguages called
  ↓
console.log only (NO DATABASE SAVE)
  ↓
Function returns
```

### Why Dead
- TODO comment indicates planned implementation
- Only console.log, no Prisma operations

---

## DEAD PATH 6: KNOWLEDGE GRAPH FEEDING

### Path Description
Knowledge graph is not fed with candidate data during claim preview.

### Location
- **File:** `c:\Trajectoire\apps\web\src\lib\preview-analysis\PreviewAnalysisService.ts`
- **Line:** 263-274
- **Function:** `feedKnowledgeGraph`

### Evidence
- **Line 265:** Comment "TODO: Intégrer avec le système Knowledge Graph"
- **Line 266-273:** Function only logs, no graph operations

### Impact
- Knowledge graph not updated
- No graph-based matching possible
- No graph-based search possible

### Called By
- `previewAnalysisService.claimPreview` (PreviewAnalysisService.ts:104)

### Execution Path
```
claimPreview called
  ↓
feedKnowledgeGraph called
  ↓
console.log only (NO GRAPH OPERATIONS)
  ↓
Function returns
```

### Why Dead
- TODO comment indicates planned integration
- No graph service calls observed

---

## DEAD PATH 7: CANDIDATE REGISTRATION

### Path Description
Candidate graph registration returns placeholder message instead of actual registration.

### Location
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 12-26
- **Function:** `registerCandidate`

### Evidence
- **Line 18-20:** Returns message "Graph must be stored via GraphRepository"
- **Line 21-22:** Returns candidateId without actual registration

### Impact
- Candidates not registered
- No candidate data in graph
- Matching functionality not working

### Called By
- `matchingService.registerCandidate` (matching.service.ts:7)
- `RecruiterWorkspace.handleCandidateLoaded` (RecruiterWorkspace.tsx:29)

### Execution Path
```
User uploads candidate
  ↓
handleCandidateLoaded called
  ↓
matchingService.registerCandidate called
  ↓
POST /api/matching/candidate
  ↓
Returns placeholder message (NO REGISTRATION)
  ↓
CandidateId returned but not persisted
```

### Why Dead
- Placeholder message indicates GraphRepository not integrated
- No actual graph storage observed

---

## DEAD PATH 8: JOB REGISTRATION

### Path Description
Job graph registration returns placeholder message instead of actual registration.

### Location
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 28-42
- **Function:** `registerJob`

### Evidence
- **Line 34-36:** Returns message "Graph must be stored via GraphRepository"
- **Line 37-38:** Returns jobId without actual registration

### Impact
- Jobs not registered
- No job data in graph
- Matching functionality not working

### Called By
- `matchingService.registerJob` (matching.service.ts:23)
- `RecruiterWorkspace.handleJobLoaded` (RecruiterWorkspace.tsx:43)

### Execution Path
```
User uploads job
  ↓
handleJobLoaded called
  ↓
matchingService.registerJob called
  ↓
POST /api/matching/job
  ↓
Returns placeholder message (NO REGISTRATION)
  ↓
JobId returned but not persisted
```

### Why Dead
- Placeholder message indicates GraphRepository not integrated
- No actual graph storage observed

---

## DEAD PATH 9: CANDIDATE RETRIEVAL

### Path Description
Candidate retrieval returns placeholder message instead of actual data.

### Location
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 131-144
- **Function:** `getAllCandidates`

### Evidence
- **Line 138:** Returns message "Use GraphRepository to retrieve candidates"
- **Line 139-140:** Returns empty array

### Impact
- Cannot retrieve candidates
- No candidate listing possible
- Recruiter workspace cannot display candidates

### Called By
- `matchingService.getAllCandidates` (matching.service.ts:71)

### Execution Path
```
User requests candidates
  ↓
matchingService.getAllCandidates called
  ↓
GET /api/matching/candidates
  ↓
Returns placeholder message (NO DATA)
  ↓
Empty array returned
```

### Why Dead
- Placeholder message indicates GraphRepository not integrated
- No actual graph retrieval observed

---

## DEAD PATH 10: JOB RETRIEVAL

### Path Description
Job retrieval returns placeholder message instead of actual data.

### Location
- **File:** `c:\Trajectoire\apps\api\src\matching\matching.controller.ts`
- **Line:** 146-159
- **Function:** `getAllJobs`

### Evidence
- **Line 152:** Returns message "Use GraphRepository to retrieve jobs"
- **Line 153-154:** Returns empty array

### Impact
- Cannot retrieve jobs
- No job listing possible
- Recruiter workspace cannot display jobs

### Called By
- `matchingService.getAllJobs` (matching.service.ts:81)

### Execution Path
```
User requests jobs
  ↓
matchingService.getAllJobs called
  ↓
GET /api/matching/jobs
  ↓
Returns placeholder message (NO DATA)
  ↓
Empty array returned
```

### Why Dead
- Placeholder message indicates GraphRepository not integrated
- No actual graph retrieval observed

---

## DEAD PATH 11: RELATED SKILLS SEARCH

### Path Description
Related skills search returns placeholder message instead of actual search.

### Location
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 124-138
- **Function:** `findRelatedSkills`

### Evidence
- **Line 132:** Returns message "Use graph-based similarity search for related skills"
- **Line 133-134:** Returns empty array

### Impact
- Cannot find related skills
- No skill recommendations possible
- Career path suggestions not working

### Called By
- `searchService.findRelatedSkills` (search.service.ts:67)

### Execution Path
```
User requests related skills
  ↓
searchService.findRelatedSkills called
  ↓
POST /api/search/related-skills
  ↓
Returns placeholder message (NO SEARCH)
  ↓
Empty array returned
```

### Why Dead
- Placeholder message indicates graph search not integrated
- No actual graph search observed

---

## DEAD PATH 12: SEARCH CANDIDATE REGISTRATION

### Path Description
Candidate registration in search service returns placeholder message.

### Location
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 170-183
- **Function:** `registerCandidate`

### Evidence
- **Line 177:** Returns message "Use GraphRepository to store candidate graphs"
- **Line 178-179:** Returns candidateId without actual registration

### Impact
- Candidates not registered for search
- No search functionality possible
- Duplicate of matching registration dead path

### Called By
- `searchService.registerCandidate` (search.service.ts:97)

### Execution Path
```
User registers candidate for search
  ↓
searchService.registerCandidate called
  ↓
POST /api/search/register-candidate
  ↓
Returns placeholder message (NO REGISTRATION)
  ↓
CandidateId returned but not persisted
```

### Why Dead
- Placeholder message indicates GraphRepository not integrated
- Duplicate of matching registration dead path

---

## DEAD PATH 13: SEARCH JOB REGISTRATION

### Path Description
Job registration in search service returns placeholder message.

### Location
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 185-198
- **Function:** `registerJob`

### Evidence
- **Line 192:** Returns message "Use GraphRepository to store job graphs"
- **Line 193-194:** Returns jobId without actual registration

### Impact
- Jobs not registered for search
- No search functionality possible
- Duplicate of matching registration dead path

### Called By
- `searchService.registerJob` (search.service.ts:107)

### Execution Path
```
User registers job for search
  ↓
searchService.registerJob called
  ↓
POST /api/search/register-job
  ↓
Returns placeholder message (NO REGISTRATION)
  ↓
JobId returned but not persisted
```

### Why Dead
- Placeholder message indicates GraphRepository not integrated
- Duplicate of matching registration dead path

---

## DEAD PATH 14: SEARCH CANDIDATE RETRIEVAL

### Path Description
Candidate retrieval in search service returns placeholder message.

### Location
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 200-213
- **Function:** `getAllCandidates`

### Evidence
- **Line 207:** Returns message "Use GraphRepository to retrieve candidates"
- **Line 208-209:** Returns empty array

### Impact
- Cannot retrieve candidates for search
- No search functionality possible
- Duplicate of matching retrieval dead path

### Called By
- `searchService.getAllCandidates` (search.service.ts:117)

### Execution Path
```
User requests candidates for search
  ↓
searchService.getAllCandidates called
  ↓
GET /api/search/candidates
  ↓
Returns placeholder message (NO DATA)
  ↓
Empty array returned
```

### Why Dead
- Placeholder message indicates GraphRepository not integrated
- Duplicate of matching retrieval dead path

---

## DEAD PATH 15: SEARCH JOB RETRIEVAL

### Path Description
Job retrieval in search service returns placeholder message.

### Location
- **File:** `c:\Trajectoire\apps\api\src\search\search.controller.ts`
- **Line:** 215-228
- **Function:** `getAllJobs`

### Evidence
- **Line 222:** Returns message "Use GraphRepository to retrieve jobs"
- **Line 223-224:** Returns empty array

### Impact
- Cannot retrieve jobs for search
- No search functionality possible
- Duplicate of matching retrieval dead path

### Called By
- `searchService.getAllJobs` (search.service.ts:127)

### Execution Path
```
User requests jobs for search
  ↓
searchService.getAllJobs called
  ↓
GET /api/search/jobs
  ↓
Returns placeholder message (NO DATA)
  ↓
Empty array returned
```

### Why Dead
- Placeholder message indicates GraphRepository not integrated
- Duplicate of matching retrieval dead path

---

## DEAD PATH 16: ONBOARDING BACK BUTTON

### Path Description
Back button in onboarding is not used in happy path.

### Location
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 126-147
- **Function:** `handleBack`

### Evidence
- **Line 126-147:** Function exists but not called in happy path
- **Line 72-124:** Happy path uses handleNext only

### Impact
- Back functionality exists but not used
- User cannot go back in happy path
- Potential UX issue

### Called By
- **NOT OBSERVED** - Not called in happy path

### Execution Path
```
User clicks back button (NOT IN HAPPY PATH)
  ↓
handleBack called
  ↓
FlowEngine.executeFlowAction(user.id, 'back')
  ↓
OnboardingResolver.goToPreviousStep
  ↓
Previous step loaded
```

### Why Dead
- Happy path only uses handleNext
- Back button exists but not executed

---

## DEAD PATH 17: ONBOARDING SKIP BUTTON

### Path Description
Skip button in onboarding is not used in happy path.

### Location
- **File:** `c:\Trajectoire\apps\web\src\app\onboarding\page.tsx`
- **Line:** 149-165
- **Function:** `handleSkip`

### Evidence
- **Line 149-165:** Function exists but not called in happy path
- **Line 72-124:** Happy path uses handleNext only

### Impact
- Skip functionality exists but not used
- User cannot skip steps in happy path
- Potential UX issue

### Called By
- **NOT OBSERVED** - Not called in happy path

### Execution Path
```
User clicks skip button (NOT IN HAPPY PATH)
  ↓
handleSkip called
  ↓
FlowEngine.executeFlowAction(user.id, 'skip')
  ↓
OnboardingResolver.skipCurrentStep
  ↓
Next step loaded
```

### Why Dead
- Happy path only uses handleNext
- Skip button exists but not executed

---

## DEAD PATH 18: MATCHING REPORT GENERATION

### Path Description
Matching report generation is not executed in basic flow.

### Location
- **File:** `c:\Trajectoire\apps\web\src\components\recruiter\RecruiterWorkspace.tsx`
- **Line:** 49-51
- **Function:** `handleReportGenerated`

### Evidence
- **Line 49-51:** Function exists but not called in basic flow
- **Line 21-47:** Basic flow only handles uploads

### Impact
- Report generation not executed
- No matching scores displayed
- Recruiter workspace incomplete

### Called By
- **NOT OBSERVED** - Not called in basic flow

### Execution Path
```
Matching report generated (NOT IN BASIC FLOW)
  ↓
handleReportGenerated called
  ↓
matchingService.getReport called
  ↓
POST /api/matching/report
  ↓
Report displayed
```

### Why Dead
- Basic flow only handles uploads
- Report generation requires matching to work first

---

## DEAD PATH 19: AUTO-CLAIM WITHOUT TOKEN

### Path Description
Auto-claim preview only happens if preview token exists.

### Location
- **File:** `c:\Trajectoire\apps\web\src\app\signup\page.tsx`
- **Line:** 58-60
- **Function:** `handleSubmit`

### Evidence
- **Line 58:** `if (previewToken) {` - conditional execution
- **Line 59:** `await claimPreview()` - only called if token exists

### Impact
- Preview not auto-claimed if no token
- User must manually claim preview
- Potential data loss

### Called By
- `handleSubmit` (page.tsx:20) - conditional

### Execution Path
```
Signup completes
  ↓
Check if previewToken exists
  ↓
If NO TOKEN: skip auto-claim (DEAD PATH)
  ↓
If TOKEN: claimPreview called
```

### Why Dead
- Conditional execution based on token existence
- Not all users have preview token

---

## DEAD PATH 20: REDIRECT IF NOT AUTHENTICATED

### Path Description
Redirect to login if not authenticated is not used in happy path.

### Location
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 24-26
- **Function:** `DashboardPage`

### Evidence
- **Line 24:** `if (!user) {` - conditional execution
- **Line 25:** `redirect('/login')` - only called if not authenticated

### Impact
- Redirect not used in happy path
- User always authenticated in happy path
- Error path not executed

### Called By
- `DashboardPage` (page.tsx:20) - conditional

### Execution Path
```
Dashboard accessed
  ↓
Check if user authenticated
  ↓
If NOT AUTHENTICATED: redirect('/login') (DEAD PATH)
  ↓
If AUTHENTICATED: continue
```

### Why Dead
- Happy path assumes user is authenticated
- Error path not executed

---

## DEAD PATH 21: REDIRECT IF ONBOARDING INCOMPLETE

### Path Description
Redirect to onboarding if incomplete is not used in happy path.

### Location
- **File:** `c:\Trajectoire\apps\web\src\app\dashboard\page.tsx`
- **Line:** 27-28
- **Function:** `DashboardPage`

### Evidence
- **Line 27:** `if (!careerProfile) {` - conditional execution
- **Line 28:** `redirect('/onboarding')` - only called if no profile

### Impact
- Redirect not used in happy path
- User always has profile in happy path
- Error path not executed

### Called By
- `DashboardPage` (page.tsx:20) - conditional

### Execution Path
```
Dashboard accessed
  ↓
Check if careerProfile exists
  ↓
If NO PROFILE: redirect('/onboarding') (DEAD PATH)
  ↓
If PROFILE: continue
```

### Why Dead
- Happy path assumes onboarding completed
- Error path not executed

---

## SUMMARY

### Total Dead Paths: 21

### By Category

| Category | Count | Dead Paths |
|----------|-------|------------|
| Placeholder Implementations | 6 | ATS Simulation, Skills, Experience, Education, Languages, Knowledge Graph |
| Placeholder API Endpoints | 9 | Candidate/Job Registration (Matching + Search), Retrieval (Matching + Search), Related Skills |
| Unused UI Branches | 3 | Back Button, Skip Button, Report Generation |
| Conditional Branches | 3 | Auto-Claim, Redirect Not Authenticated, Redirect Onboarding Incomplete |

### Impact Assessment

**High Impact:**
- Placeholder API endpoints (9) - Core functionality not working
- Placeholder implementations (6) - Data not persisted

**Medium Impact:**
- Unused UI branches (3) - UX features not used

**Low Impact:**
- Conditional branches (3) - Error paths not executed

### Critical Dead Paths

1. **GraphRepository Integration** - All graph operations return placeholders
2. **Data Persistence** - Skills, Experience, Education, Languages not saved
3. **Knowledge Graph** - Not fed with candidate data
4. **Matching Functionality** - Not functional due to placeholders
5. **Search Functionality** - Not functional due to placeholders

### Evidence Completeness

- **Total Dead Paths Identified:** 21
- **Fully Observed:** 21 (100%)
- **Partially Observed:** 0 (0%)
- **Not Observed:** 0 (0%)

**Evidence Source:** RC37.1 runtime reconstruction reports
