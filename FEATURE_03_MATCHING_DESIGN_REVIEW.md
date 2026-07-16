# FEATURE 03 MATCHING DESIGN REVIEW
## Matching Intelligence Engine - Cognitive Core Specification

> **Date**: 2026-07-10
> **Feature**: Matching Intelligence Engine
> **Objective**: Complete specification for the cognitive core of Career Copilot
> **Scope**: Design review only - no implementation

---

## SECTION 1 — VISION

### Why This Intelligence Exists

The Matching Intelligence Engine exists to solve the fundamental problem of career decision-making: **determining whether a candidate is a good fit for a job offer beyond simple keyword matching**.

Traditional ATS systems and job matching platforms fail because they:

1. **Reduce complex human profiles to binary keyword matches**
2. **Ignore transferable skills and cognitive adaptability**
3. **Miss cultural and motivational alignment**
4. **Provide no reasoning or explanation for their conclusions**
5. **Cannot assess potential, only current state**

The Career Copilot's Matching Intelligence Engine addresses these failures by:

- **Producing reasoning, not percentages**: Every conclusion includes a logical chain of thought
- **Recognizing transferable skills**: Understanding that Docker experience can transfer to Kubernetes
- **Assessing potential**: Evaluating learning capacity and adaptability
- **Providing full explainability**: Every conclusion includes proofs, confidence, and limitations
- **Being deterministic**: Same candidate + same job offer = same matching result

### Problem Solved

The Matching Intelligence Engine solves the **"Am I a good fit?"** problem with nuance and depth:

- **Not just**: "You match 75% of the keywords"
- **But**: "You don't know Kubernetes, but you know Docker and Azure, and you've worked on distributed architectures, so the skills are transferable. The risk is low, and the gap can be compensated quickly."

This level of reasoning is what makes the Career Copilot a true cognitive assistant rather than a simple keyword matcher.

### Why It Constitutes the Heart of Career Copilot

The Matching Intelligence Engine is the **cognitive core** of the Career Copilot because:

1. **It connects the two primary data sources**: CandidateGraph and JobOfferGraph
2. **It enables all downstream intelligences**: Planning, Execution, Coaching, Accountability, Outcome, Learning all depend on matching results
3. **It provides the fundamental truth**: Whether a candidate is a good fit is the foundational decision for all career guidance
4. **It requires the most sophisticated reasoning**: Transferable skills, risk assessment, potential evaluation, cultural alignment
5. **It must be the most explainable**: Users need to understand why they are or aren't a good fit

Without the Matching Intelligence Engine, the Career Copilot would have two disconnected graphs (candidate and job offer) with no way to connect them meaningfully.

---

## SECTION 2 — POSITION DANS LE PIPELINE

### Position Exacte

```
CandidateGraph
    ↓
Candidate Profile Intelligence (FEATURE 01)
    ↓
Job Offer Intelligence (FEATURE 02)
    ↓
Matching Intelligence (FEATURE 03) ← CURRENT FOCUS
    ↓
Planning Intelligence
    ↓
Execution Intelligence
    ↓
Coaching Intelligence
    ↓
Accountability Intelligence
    ↓
Outcome Intelligence
    ↓
Learning Intelligence
```

### Entrées

**Obligatoires**:
- `CandidateGraph` - Complete candidate profile from FEATURE 01
- `JobOfferGraph` - Complete job offer profile from FEATURE 02

**Optionnels**:
- `Reflection Intelligence` - Past reflections on candidate's strengths and weaknesses
- `Planning Intelligence` - Current career goals and trajectory
- `Decision Intelligence` - Past decisions and their outcomes
- `Forecast Intelligence` - Market trends and predictions
- `Evidence Intelligence` - Accumulated evidence about candidate's capabilities
- `Constraint Intelligence` - Current constraints and limitations
- `Success Intelligence` - Past successes and patterns
- `Opportunity Intelligence` - Market opportunities analysis
- `Mission Intelligence` - Current mission and objectives
- `Goal Intelligence` - Current goals and progress
- `Personalization Intelligence` - Personalization preferences

### Sorties

**Matching Intelligence Output**:
- `MatchingGraph` - Complete matching analysis with reasoning
- `MatchingReport` - Human-readable matching report
- `MatchingEvents` - Domain events for timeline and learning

### Consommateurs

**Direct Consumers**:
- `Planning Intelligence` - Uses matching results to create action plans
- `Execution Intelligence` - Uses matching results to select next best actions
- `Coaching Intelligence` - Uses matching results to provide guidance
- `Accountability Intelligence` - Uses matching results to track progress
- `Outcome Intelligence` - Uses matching results to measure success
- `Learning Intelligence` - Uses matching results to improve future matching

**Indirect Consumers**:
- `Dashboard` - Displays matching results
- `Digital Twin` - Stores matching context
- `Career Chat` - Answers questions about matching
- `Voice Interview` - Prepares interview based on matching
- `Final Report` - Includes matching analysis

### Dépendances

**Hard Dependencies**:
- `CandidateGraph` must be fully populated
- `JobOfferGraph` must be fully populated
- Both graphs must include full explainability

**Soft Dependencies**:
- `Reflection Intelligence` - Enriches matching with historical insights
- `Planning Intelligence` - Enriches matching with goal context
- `Evidence Intelligence` - Enriches matching with accumulated evidence

---

## SECTION 3 — SOURCES AUTORISÉES

### Sources Obligatoires

1. **CandidateGraph** (FEATURE 01)
   - **Role**: Primary source of candidate data
   - **Usage**: All candidate dimensions (skills, experience, projects, etc.)
   - **Why**: Only authoritative source of candidate information

2. **JobOfferGraph** (FEATURE 02)
   - **Role**: Primary source of job offer data
   - **Usage**: All job offer dimensions (requirements, culture, etc.)
   - **Why**: Only authoritative source of job offer information

### Sources Optionnelles

1. **Reflection Intelligence**
   - **Role**: Enriches matching with historical insights
   - **Usage**: Candidate's self-identified strengths and weaknesses
   - **Why**: Provides candidate's own perspective on capabilities

2. **Planning Intelligence**
   - **Role**: Enriches matching with goal context
   - **Usage**: Current career goals and trajectory
   - **Why**: Provides context for alignment assessment

3. **Decision Intelligence**
   - **Role**: Enriches matching with decision history
   - **Usage**: Past decisions and their outcomes
   - **Why**: Provides pattern recognition for decision quality

4. **Forecast Intelligence**
   - **Role**: Enriches matching with market trends
   - **Usage**: Market trends and predictions
   - **Why**: Provides context for opportunity assessment

5. **Evidence Intelligence**
   - **Role**: Enriches matching with accumulated evidence
   - **Usage**: Accumulated evidence about candidate's capabilities
   - **Why**: Provides additional proof for matching conclusions

6. **Constraint Intelligence**
   - **Role**: Enriches matching with constraint awareness
   - **Usage**: Current constraints and limitations
   - **Why**: Provides context for feasibility assessment

7. **Success Intelligence**
   - **Role**: Enriches matching with success patterns
   - **Usage**: Past successes and patterns
   - **Why**: Provides pattern recognition for success factors

8. **Opportunity Intelligence**
   - **Role**: Enriches matching with market opportunities
   - **Usage**: Market opportunities analysis
   - **Why**: Provides context for opportunity assessment

9. **Mission Intelligence**
   - **Role**: Enriches matching with mission context
   - **Usage**: Current mission and objectives
   - **Why**: Provides context for alignment assessment

10. **Goal Intelligence**
    - **Role**: Enriches matching with goal context
    - **Usage**: Current goals and progress
    - **Why**: Provides context for alignment assessment

11. **Personalization Intelligence**
    - **Role**: Enriches matching with personalization preferences
    - **Usage**: Personalization preferences
    - **Why**: Provides context for user experience

### Sources Interdites

- **Direct LLM calls** (must use existing intelligences)
- **External APIs** (must use existing data sources)
- **User input** (must use existing graphs)
- **Real-time data** (must use existing snapshots)

---

## SECTION 4 — DIMENSIONS DU MATCHING

### Primary Dimensions

#### 1. Hard Skills
- **Candidate**: `CandidateGraph.hardSkills` (categorized by type)
- **Job**: `JobOfferGraph.hardSkills` (categorized by type)
- **Comparison**: Category-by-category matching with transferability assessment
- **Why**: Technical foundation of the role

#### 2. Soft Skills
- **Candidate**: `CandidateGraph.softSkills`
- **Job**: `JobOfferGraph.softSkills`
- **Comparison**: Soft skill matching with behavioral evidence
- **Why**: Cultural fit and team dynamics

#### 3. Technologies
- **Candidate**: `CandidateGraph.technologies`
- **Job**: `JobOfferGraph.technologies`
- **Comparison**: Technology stack matching with transferability
- **Why**: Technology ecosystem alignment

#### 4. Experience
- **Candidate**: `CandidateGraph.experiences` (years, roles, industries)
- **Job**: `JobOfferGraph.expectedLevel.yearsOfExperience`
- **Comparison**: Experience depth and relevance assessment
- **Why**: Maturity and domain expertise

#### 5. Seniority
- **Candidate**: `CandidateGraph.career.currentLevel`
- **Job**: `JobOfferGraph.seniority.level`
- **Comparison**: Seniority alignment with growth potential
- **Why**: Role level and career trajectory

#### 6. Leadership
- **Candidate**: `CandidateGraph.behavior.leadershipStyle`
- **Job**: `JobOfferGraph.responsibilities` (managerial type)
- **Comparison**: Leadership style and experience matching
- **Why**: Leadership capability and team management

#### 7. Communication
- **Candidate**: `CandidateGraph.behavior.communicationStyle`
- **Job**: `JobOfferGraph.companyCulture` (collaboration, innovation)
- **Comparison**: Communication style and cultural fit
- **Why**: Team collaboration and stakeholder management

#### 8. Autonomy
- **Candidate**: `CandidateGraph.behavior.synthesisAbility`, `CandidateGraph.behavior.businessImpact`
- **Job**: `JobOfferGraph.difficulty.expectedAutonomy`
- **Comparison**: Autonomy level and independence assessment
- **Why**: Self-sufficiency and decision-making authority

#### 9. Organization
- **Candidate**: `CandidateGraph.behavior.synthesisAbility`, `CandidateGraph.behavior.argumentationQuality`
- **Job**: `JobOfferGraph.difficulty.technicalComplexity`, `JobOfferGraph.difficulty.businessComplexity`
- **Comparison**: Organizational capability and complexity handling
- **Why**: Project management and complexity navigation

#### 10. Culture
- **Candidate**: `CandidateGraph.behavior.personalityType`, `CandidateGraph.behavior.confidenceLevel`
- **Job**: `JobOfferGraph.companyCulture` (innovation, collaboration, excellence, autonomy, diversity, quality, agility)
- **Comparison**: Cultural alignment and values fit
- **Why**: Organizational fit and long-term satisfaction

#### 11. Values
- **Candidate**: `CandidateGraph.behavior.personalityType`, `CandidateGraph.behavior.leadershipStyle`
- **Job**: `JobOfferCompany.companyCulture` (implicit values)
- **Comparison**: Values alignment and ethical fit
- **Why**: Ethical alignment and organizational values

#### 12. Motivation
- **Candidate**: `CandidateGraph.career.targetPosition`, `CandidateGraph.career.targetLevel`
- **Job**: `JobOfferGraph.missions`, `JobOfferGraph.responsibilities`
- **Comparison**: Motivational alignment and goal fit
- **Why**: Intrinsic motivation and engagement

#### 13. Objectives
- **Candidate**: `CandidateGraph.career.targetPosition`, `CandidateGraph.career.targetLevel`
- **Job**: `JobOfferGraph.missions`, `JobOfferGraph.responsibilities`
- **Comparison**: Career objective alignment
- **Why**: Career trajectory and growth potential

#### 14. Contraintes
- **Candidate**: `CandidateGraph.career.companySize` (preference)
- **Job**: `JobOfferGraph.generalInfo.company` (if known)
- **Comparison**: Constraint compatibility
- **Why**: Practical feasibility and lifestyle fit

#### 15. Salaire
- **Candidate**: Not directly in CandidateGraph (implicit from experience level)
- **Job**: `JobOfferGraph.generalInfo.salary`
- **Comparison**: Salary alignment with market and experience
- **Why**: Financial expectations and market alignment

#### 16. Localisation
- **Candidate**: Not directly in CandidateGraph (implicit from experiences)
- **Job**: `JobOfferGraph.generalInfo.location`
- **Comparison**: Location compatibility and mobility
- **Why**: Geographic feasibility and relocation

#### 17. Télétravail
- **Candidate**: Not directly in CandidateGraph (implicit preference)
- **Job**: `JobOfferGraph.generalInfo.remoteWork`
- **Comparison**: Remote work compatibility
- **Why**: Work style preference and flexibility

#### 18. Certifications
- **Candidate**: `CandidateGraph.education.certifications`
- **Job**: `JobOfferGraph.expectedLevel.certifications`
- **Comparison**: Certification matching with relevance
- **Why**: Formal qualifications and compliance

#### 19. Langues
- **Candidate**: `CandidateGraph.education.languages`
- **Job**: `JobOfferGraph.expectedLevel.languages`
- **Comparison**: Language proficiency matching
- **Why**: Communication capability and global fit

#### 20. Missions
- **Candidate**: `CandidateGraph.experiences` (project descriptions)
- **Job**: `JobOfferGraph.missions`
- **Comparison**: Mission alignment and project relevance
- **Why**: Day-to-day work alignment and interest

#### 21. Responsabilités
- **Candidate**: `CandidateGraph.experiences` (role descriptions)
- **Job**: `JobOfferGraph.responsibilities`
- **Comparison**: Responsibility alignment and scope
- **Why**: Role scope and accountability

#### 22. Secteur
- **Candidate**: `CandidateGraph.career.sector`
- **Job**: `JobOfferGraph.generalInfo.sector`
- **Comparison**: Sector alignment and domain expertise
- **Why**: Domain expertise and industry knowledge

#### 23. Produits
- **Candidate**: `CandidateGraph.experiences` (product domains)
- **Job**: Not directly in JobOfferGraph (implicit from domain)
- **Comparison**: Product domain alignment
- **Why**: Product knowledge and domain expertise

#### 24. Méthodologies
- **Candidate**: `CandidateGraph.hardSkills` (methodologies category)
- **Job**: `JobOfferGraph.atsKeywords.methods`
- **Comparison**: Methodology alignment and process fit
- **Why**: Process alignment and workflow compatibility

#### 25. Stack Technique
- **Candidate**: `CandidateGraph.technologies`
- **Job**: `JobOfferGraph.technologies`
- **Comparison**: Technology stack alignment with transferability
- **Why**: Technology ecosystem alignment

#### 26. Potentiel
- **Candidate**: `CandidateGraph.behavior.learningAbility` (implicit from progression)
- **Job**: `JobOfferGraph.difficulty.technicalComplexity`, `JobOfferGraph.difficulty.businessComplexity`
- **Comparison**: Potential assessment vs role complexity
- **Why**: Growth potential and future capability

#### 27. Compétences Transférables
- **Candidate**: `CandidateGraph.hardSkills`, `CandidateGraph.technologies`
- **Job**: `JobOfferGraph.hardSkills`, `JobOfferGraph.technologies`
- **Comparison**: Transferability assessment across domains
- **Why**: Adaptability and cross-domain capability

#### 28. Adaptabilité
- **Candidate**: `CandidateGraph.behavior.learningAbility` (implicit from career progression)
- **Job**: `JobOfferGraph.companyCulture.agility`
- **Comparison**: Adaptability vs organizational agility
- **Why**: Change management and learning agility

#### 29. Capacité d'Apprentissage
- **Candidate**: `CandidateGraph.behavior.learningAbility` (implicit from skill progression)
- **Job**: `JobOfferGraph.difficulty.technicalComplexity`, `JobOfferGraph.difficulty.businessComplexity`
- **Comparison**: Learning capacity vs role complexity
- **Why**: Onboarding speed and skill acquisition

#### 30. Historique
- **Candidate**: `CandidateGraph.history.simulations`, `CandidateGraph.history.progressions`
- **Job**: Not applicable (job offer has no history)
- **Comparison**: Historical performance vs role requirements
- **Why**: Past performance as predictor of future success

#### 31. Preuves
- **Candidate**: All CandidateGraph data includes explainability
- **Job**: All JobOfferGraph data includes explainability
- **Comparison**: Evidence quality and confidence assessment
- **Why**: Confidence in matching conclusions

#### 32. Confiance
- **Candidate**: `CandidateGraph.metrics.atsScore`, `CandidateGraph.metrics.confidence`
- **Job**: `JobOfferGraph.extractionMetadata.confidence`
- **Comparison**: Overall confidence in data quality
- **Why**: Reliability of matching conclusions

### Secondary Dimensions

#### 33. Domain Knowledge
- **Candidate**: `CandidateGraph.career.sector`, `CandidateGraph.experiences`
- **Job**: `JobOfferGraph.domain.name`
- **Comparison**: Domain expertise depth
- **Why**: Industry knowledge and context

#### 34. Project Complexity
- **Candidate**: `CandidateGraph.experiences` (project complexity implicit)
- **Job**: `JobOfferGraph.difficulty.technicalComplexity`, `JobOfferGraph.difficulty.businessComplexity`
- **Comparison**: Project complexity experience vs requirements
- **Why**: Complexity handling capability

#### 35. Team Size
- **Candidate**: `CandidateGraph.career.companySize` (preference)
- **Job**: Not directly in JobOfferGraph (implicit from company)
- **Comparison**: Team size preference vs reality
- **Why**: Team dynamics preference

#### 36. Career Stage
- **Candidate**: `CandidateGraph.career.currentLevel`, `CandidateGraph.career.yearsOfExperience`
- **Job**: `JobOfferGraph.seniority.level`
- **Comparison**: Career stage alignment
- **Why**: Career trajectory and growth

#### 37. Growth Potential
- **Candidate**: `CandidateGraph.behavior.learningAbility` (implicit)
- **Job**: `JobOfferGraph.seniority.level` (growth potential implicit)
- **Comparison**: Growth potential vs role growth
- **Why**: Long-term career growth

#### 38. Risk Tolerance
- **Candidate**: `CandidateGraph.behavior.stressManagement` (implicit)
- **Job**: `JobOfferCompany.companyCulture` (innovation, agility)
- **Comparison**: Risk tolerance vs organizational risk
- **Why**: Risk alignment and comfort

#### 39. Innovation Preference
- **Candidate**: `CandidateGraph.behavior.personalityType` (implicit)
- **Job**: `JobOfferGraph.companyCulture.innovation`
- **Comparison**: Innovation preference vs organizational innovation
- **Why**: Innovation alignment and creativity

#### 40. Collaboration Style
- **Candidate**: `CandidateGraph.behavior.communicationStyle`, `CandidateGraph.behavior.leadershipStyle`
- **Job**: `JobOfferGraph.companyCulture.collaboration`
- **Comparison**: Collaboration style vs team dynamics
- **Why**: Team collaboration and dynamics

---

## SECTION 5 — MATRICE DE COMPARAISON

### Example: Hard Skills

| Aspect | Entrée Candidate | Entrée Job | Comparaison | Règles | Résultat Attendu | Confiance | Explicabilité |
|--------|------------------|------------|-------------|--------|------------------|-----------|---------------|
| Languages | `hardSkills.languages` (Python, JavaScript) | `hardSkills.languages` (Python, Go) | Category matching | Exact match = 100%, Transferable = 75%, Missing = 0% | Python: 100%, JavaScript: 0%, Go: 0% | High (80-90) | Source: CandidateGraph.hardSkills, JobOfferGraph.hardSkills<br>Proof: Skill lists<br>Explanation: Exact match for Python, JavaScript not required, Go missing |
| Frameworks | `hardSkills.frameworks` (React, Vue) | `hardSkills.frameworks` (React, Angular) | Category matching | Exact match = 100%, Transferable = 80%, Missing = 0% | React: 100%, Vue: 0%, Angular: 0% | High (80-90) | Source: CandidateGraph.hardSkills, JobOfferGraph.hardSkills<br>Proof: Skill lists<br>Explanation: Exact match for React, Vue transferable to Angular (80%), Angular missing |
| Databases | `hardSkills.databases` (PostgreSQL, MongoDB) | `hardSkills.databases` (PostgreSQL, MySQL) | Category matching | Exact match = 100%, Transferable = 90%, Missing = 0% | PostgreSQL: 100%, MongoDB: 0%, MySQL: 0% | High (80-90) | Source: CandidateGraph.hardSkills, JobOfferGraph.hardSkills<br>Proof: Skill lists<br>Explanation: Exact match for PostgreSQL, MongoDB transferable to MySQL (90%), MySQL missing |

### Example: Soft Skills

| Aspect | Entrée Candidate | Entrée Job | Comparaison | Règles | Résultat Attendu | Confiance | Explicabilité |
|--------|------------------|------------|-------------|--------|------------------|-----------|---------------|
| Communication | `softSkills` (Communication, Teamwork) | `softSkills` (Communication, Leadership) | Category matching | Exact match = 100%, Related = 70%, Missing = 0% | Communication: 100%, Teamwork: 0%, Leadership: 0% | Medium (60-70) | Source: CandidateGraph.softSkills, JobOfferGraph.softSkills<br>Proof: Skill lists<br>Explanation: Exact match for Communication, Teamwork related to Leadership (70%), Leadership missing |
| Leadership | `softSkills` (Leadership, Mentoring) | `softSkills` (Leadership, Decision-making) | Category matching | Exact match = 100%, Related = 70%, Missing = 0% | Leadership: 100%, Mentoring: 0%, Decision-making: 0% | Medium (60-70) | Source: CandidateGraph.softSkills, JobOfferGraph.softSkills<br>Proof: Skill lists<br>Explanation: Exact match for Leadership, Mentoring related to Decision-making (70%), Decision-making missing |

### Example: Experience

| Aspect | Entrée Candidate | Entrée Job | Comparaison | Règles | Résultat Attendu | Confiance | Explicabilité |
|--------|------------------|------------|-------------|--------|------------------|-----------|---------------|
| Years of Experience | `career.yearsOfExperience` (5 years) | `expectedLevel.yearsOfExperience` (3+ years) | Numeric comparison | Candidate >= Job = 100%, Candidate < Job = 50%, Candidate >> Job = 100% | 100% (5 >= 3) | High (90-100) | Source: CandidateGraph.career, JobOfferGraph.expectedLevel<br>Proof: Years values<br>Explanation: Candidate has 5 years, job requires 3+, requirement met |
| Domain Experience | `experiences.sector` (Technology, Finance) | `generalInfo.sector` (Technology) | Domain matching | Exact match = 100%, Related = 70%, Unrelated = 30% | Technology: 100%, Finance: 0% | High (80-90) | Source: CandidateGraph.experiences, JobOfferGraph.generalInfo<br>Proof: Sector values<br>Explanation: Exact match for Technology, Finance not required |

### Example: Seniority

| Aspect | Entrée Candidate | Entrée Job | Comparaison | Règles | Résultat Attendu | Confiance | Explicabilité |
|--------|------------------|------------|-------------|--------|------------------|-----------|---------------|
| Level | `career.currentLevel` (Senior) | `seniority.level` (Senior) | Level matching | Exact match = 100%, One level diff = 70%, Two level diff = 30% | 100% (Senior == Senior) | High (90-100) | Source: CandidateGraph.career, JobOfferGraph.seniority<br>Proof: Level values<br>Explanation: Exact match for Senior level |

### Example: Culture

| Aspect | Entrée Candidate | Entrée Job | Comparaison | Règles | Résultat Attendu | Confiance | Explicabilité |
|--------|------------------|------------|-------------|--------|------------------|-----------|---------------|
| Innovation | `behavior.personalityType` (Innovative) | `companyCulture.innovation` (true) | Culture matching | Match = 100%, Mismatch = 30%, Unknown = 50% | 100% (Innovative + innovation culture) | Medium (60-70) | Source: CandidateGraph.behavior, JobOfferGraph.companyCulture<br>Proof: Personality type and culture flags<br>Explanation: Candidate is innovative, company values innovation, good fit |
| Collaboration | `behavior.communicationStyle` (Collaborative) | `companyCulture.collaboration` (true) | Culture matching | Match = 100%, Mismatch = 30%, Unknown = 50% | 100% (Collaborative + collaboration culture) | Medium (60-70) | Source: CandidateGraph.behavior, JobOfferGraph.companyCulture<br>Proof: Communication style and culture flags<br>Explanation: Candidate is collaborative, company values collaboration, good fit |

---

## SECTION 6 — TRANSFERABLE SKILLS

### Cognitive Rules for Transferability

#### Rule 1: Same Category Transferability
**Principle**: Skills within the same category are highly transferable.

**Examples**:
- Docker → Kubernetes (container orchestration)
- React → Vue → Angular (JavaScript frameworks)
- PostgreSQL → MySQL → SQL Server (relational databases)
- AWS → Azure → GCP (cloud platforms)
- Python → Go → Rust (programming languages)

**Transferability Score**: 80-90%

**Confidence**: High (80-90)

**Explicability**:
- Source: Skill category classification
- Proof: Both skills in same category
- Explanation: Skills share fundamental concepts, learning curve is minimal
- Confidence: High due to category alignment

#### Rule 2: Related Category Transferability
**Principle**: Skills in related categories are moderately transferable.

**Examples**:
- SQL → NoSQL (data persistence)
- Frontend → Backend (web development)
- Mobile → Web (application development)
- DevOps → SRE (infrastructure management)

**Transferability Score**: 60-70%

**Confidence**: Medium (60-70)

**Explicability**:
- Source: Skill category classification
- Proof: Skills in related categories
- Explanation: Skills share some concepts, but require additional learning
- Confidence: Medium due to partial overlap

#### Rule 3: Concept Transferability
**Principle**: Skills sharing fundamental concepts are partially transferable.

**Examples**:
- Project Management → Scrum Master (methodology)
- Team Lead → Engineering Manager (leadership)
- Technical Lead → Solution Architect (technical leadership)

**Transferability Score**: 50-60%

**Confidence**: Medium (50-60)

**Explicability**:
- Source: Skill concept analysis
- Proof: Skills share fundamental concepts
- Explanation: Skills share core concepts, but require significant additional learning
- Confidence: Medium due to conceptual overlap

#### Rule 4: Experience Transferability
**Principle**: Experience in one domain can transfer to related domains.

**Examples**:
- Finance → Fintech (industry knowledge)
- Healthcare → MedTech (industry knowledge)
- E-commerce → Marketplace (business model)
- B2B → B2C (customer interaction)

**Transferability Score**: 40-50%

**Confidence**: Low-Medium (40-50)

**Explicability**:
- Source: Domain analysis
- Proof: Related domains
- Explanation: Experience in one domain provides context for related domain, but requires domain-specific learning
- Confidence: Low-Medium due to domain differences

#### Rule 5: Leadership Transferability
**Principle**: Leadership skills are highly transferable across domains.

**Examples**:
- Team Lead → Engineering Manager (leadership)
- Project Manager → Product Manager (leadership)
- Engineering Manager → Director of Engineering (leadership)

**Transferability Score**: 70-80%

**Confidence**: High (70-80)

**Explicability**:
- Source: Leadership skill analysis
- Proof: Leadership roles
- Explanation: Leadership skills are domain-agnostic, transferability is high
- Confidence: High due to leadership universality

### Transferability Matrix

| From | To | Transferability | Confidence | Rule |
|------|-----|----------------|------------|------|
| Docker | Kubernetes | 90% | High | Same Category |
| React | Vue | 85% | High | Same Category |
| React | Angular | 80% | High | Same Category |
| PostgreSQL | MySQL | 90% | High | Same Category |
| PostgreSQL | MongoDB | 70% | Medium | Related Category |
| AWS | Azure | 85% | High | Same Category |
| AWS | GCP | 80% | High | Same Category |
| Python | Go | 70% | Medium | Related Category |
| Python | JavaScript | 60% | Medium | Related Category |
| Project Management | Scrum Master | 75% | High | Concept Transferability |
| Team Lead | Engineering Manager | 80% | High | Leadership Transferability |
| Frontend | Backend | 65% | Medium | Related Category |
| Mobile | Web | 70% | Medium | Related Category |
| DevOps | SRE | 85% | High | Same Category |
| Finance | Fintech | 60% | Medium | Experience Transferability |
| Healthcare | MedTech | 60% | Medium | Experience Transferability |

---

## SECTION 7 — GAPS

### Gap Types

#### 1. Gap Technique
**Definition**: Missing technical skills or technologies.

**Examples**:
- Missing Kubernetes when Docker is known
- Missing Go when Python is known
- Missing React when Vue is known

**Gravité**: High (if essential), Medium (if desired), Low (if bonus)

**Impact**: 
- Essential: Cannot perform core job functions
- Desired: May require additional training
- Bonus: Nice to have, not blocking

**Compensable?**: 
- Essential: Only if transferable skills exist (70%+ transferability)
- Desired: Yes, with training (2-4 weeks)
- Bonus: Yes, minimal impact

**Temps estimé de rattrapage**:
- Essential: 4-8 weeks (if transferable), 8-16 weeks (if not transferable)
- Desired: 2-4 weeks
- Bonus: 1-2 weeks

#### 2. Gap Métier
**Definition**: Missing domain or industry knowledge.

**Examples**:
- Missing Fintech experience when Finance is known
- Missing MedTech experience when Healthcare is known
- Missing E-commerce experience when Retail is known

**Gravité**: Medium (domain knowledge can be learned)

**Impact**: May require onboarding time, but not blocking

**Compensable?**: Yes, with training (4-8 weeks)

**Temps estimé de rattrapage**: 4-8 weeks

#### 3. Gap Secteur
**Definition**: Missing sector-specific experience.

**Examples**:
- Missing Technology sector experience when Finance is known
- Missing Healthcare sector experience when Retail is known

**Gravité**: Medium (sector knowledge can be learned)

**Impact**: May require onboarding time, but not blocking

**Compensable?**: Yes, with training (4-8 weeks)

**Temps estimé de rattrapage**: 4-8 weeks

#### 4. Gap Expérience
**Definition**: Insufficient years of experience.

**Examples**:
- 3 years experience when 5+ years required
- 2 years experience when 3+ years required

**Gravité**: Medium (experience can be compensated with skills)

**Impact**: May require additional supervision, but not blocking

**Compensable?**: Yes, with strong skills and transferability

**Temps estimé de rattrapage**: Cannot be compensated (time-based)

#### 5. Gap Management
**Definition**: Missing management or leadership experience.

**Examples**:
- No management experience when team lead required
- 1 year management when 3+ years required

**Gravité**: High (if essential), Medium (if desired)

**Impact**: 
- Essential: Cannot perform leadership functions
- Desired: May require additional training

**Compensable?**: 
- Essential: Only if leadership potential exists (70%+ confidence)
- Desired: Yes, with training (8-12 weeks)

**Temps estimé de rattrapage**:
- Essential: 8-16 weeks (if potential exists)
- Desired: 8-12 weeks

#### 6. Gap Langue
**Definition**: Missing language proficiency.

**Examples**:
- No French when French required
- Basic English when fluent English required

**Gravité**: High (if essential), Medium (if desired)

**Impact**: 
- Essential: Cannot communicate effectively
- Desired: May require additional training

**Compensable?**: 
- Essential: Only if language can be learned quickly (similar languages)
- Desired: Yes, with training (8-16 weeks)

**Temps estimé de rattrapage**:
- Essential: 16-24 weeks (if learnable)
- Desired: 8-16 weeks

#### 7. Gap Diplôme
**Definition**: Missing required degree or education level.

**Examples**:
- No Master's when Master's required
- No Bachelor's when Bachelor's required

**Gravité**: High (if essential), Medium (if desired)

**Impact**: 
- Essential: May not meet formal requirements
- Desired: May be compensated with experience

**Compensable?**: 
- Essential: Only if experience can compensate (5+ years)
- Desired: Yes, with experience

**Temps estimé de rattrapage**: Cannot be compensated (formal requirement)

#### 8. Gap Certification
**Definition**: Missing required certifications.

**Examples**:
- No AWS certification when AWS required
- No PMP when PMP required

**Gravité**: Medium (certifications can be obtained)

**Impact**: May require additional study, but not blocking

**Compensable?**: Yes, with training (4-8 weeks)

**Temps estimé de rattrapage**: 4-8 weeks

#### 9. Gap Mobilité
**Definition**: Geographic or relocation constraints.

**Examples**:
- Candidate in Paris when job in London
- Candidate unwilling to relocate when relocation required

**Gravité**: High (if relocation required), Low (if remote)

**Impact**: 
- High: Cannot accept job
- Low: Remote work possible

**Compensable?**: 
- High: Only if remote work is possible
- Low: Yes, remote work

**Temps estimé de rattrapage**: Cannot be compensated (personal constraint)

#### 10. Gap Salaire
**Definition**: Salary expectations vs job offer.

**Examples**:
- Candidate expects 100k when job offers 80k
- Candidate expects 120k when job offers 100k

**Gravité**: Medium (negotiable), High (if inflexible)

**Impact**: May affect job acceptance

**Compensable?**: Yes, with negotiation

**Temps estimé de rattrapage**: Cannot be compensated (negotiation required)

#### 11. Gap Soft Skills
**Definition**: Missing soft skills or behavioral traits.

**Examples**:
- Low communication when high communication required
- Low leadership when leadership required

**Gravité**: Medium (soft skills can be developed)

**Impact**: May affect team dynamics, but not blocking

**Compensable?**: Yes, with training (8-12 weeks)

**Temps estimé de rattrapage**: 8-12 weeks

#### 12. Gap Responsabilités
**Definition**: Missing scope or scale of responsibilities.

**Examples**:
- Managed team of 5 when team of 20 required
- Managed budget of 100k when budget of 1M required

**Gravité**: Medium (scale can be learned)

**Impact**: May require additional supervision, but not blocking

**Compensable?**: Yes, with experience (6-12 months)

**Temps estimé de rattrapage**: 6-12 months

---

## SECTION 8 — RISKS

### Risk Types

#### 1. Surestimation
**Definition**: Candidate overestimates their skills or experience.

**Detection**:
- Compare self-assessed skills with evidence
- Look for gaps between claimed skills and project evidence
- Check for inconsistent experience descriptions

**Examples**:
- Claims "Expert in Kubernetes" but no Kubernetes projects
- Claims "5 years experience" but only 2 years in relevant domain
- Claims "Leadership experience" but no management roles

**Severity**: High

**Impact**: May lead to poor job fit and performance issues

**Mitigation**:
- Cross-reference claims with evidence
- Highlight discrepancies in matching report
- Recommend interview validation

#### 2. Sous-expérience
**Definition**: Candidate has insufficient experience for role requirements.

**Detection**:
- Compare years of experience with job requirements
- Check for relevant domain experience
- Assess project complexity vs role complexity

**Examples**:
- 2 years experience when 5+ years required
- No domain experience when domain expertise required
- Junior projects when senior role required

**Severity**: Medium-High

**Impact**: May require additional supervision and training

**Mitigation**:
- Highlight experience gap in matching report
- Recommend additional training or mentorship
- Consider if transferability can compensate

#### 3. CV Incohérent
**Definition**: CV contains inconsistencies or contradictions.

**Detection**:
- Check for timeline gaps or overlaps
- Look for inconsistent skill progression
- Identify contradictory role descriptions

**Examples**:
- Overlapping employment dates
- Skills appearing without project evidence
- Rapid role changes without explanation

**Severity**: Medium

**Impact**: May indicate accuracy issues or dishonesty

**Mitigation**:
- Flag inconsistencies in matching report
- Recommend clarification during interview
- Assess impact on overall confidence

#### 4. Technologie Absente
**Definition**: Critical technology or skill is completely missing.

**Detection**:
- Compare required technologies with candidate technologies
- Check for transferability for missing technologies
- Assess if technology is essential or desired

**Examples**:
- No Kubernetes when Kubernetes is essential
- No Go when Go is essential
- No AWS when AWS is essential

**Severity**: High (if essential), Medium (if desired)

**Impact**: May prevent job performance

**Mitigation**:
- Highlight missing technology in matching report
- Assess transferability from related technologies
- Recommend training if compensable

#### 5. Leadership Insuffisant
**Definition**: Insufficient leadership experience or capability.

**Detection**:
- Compare leadership roles with job leadership requirements
- Assess leadership style vs organizational culture
- Check for leadership evidence in projects

**Examples**:
- No management experience when team lead required
- Limited leadership scope when senior leadership required
- Leadership style mismatch with organizational culture

**Severity**: High (if essential), Medium (if desired)

**Impact**: May affect team dynamics and performance

**Mitigation**:
- Highlight leadership gap in matching report
- Assess leadership potential from behavioral traits
- Recommend leadership training if compensable

#### 6. Mobilité
**Definition**: Geographic or relocation constraints.

**Detection**:
- Compare candidate location with job location
- Check for remote work options
- Assess candidate mobility preferences

**Examples**:
- Candidate in Paris when job in London
- Candidate unwilling to relocate when relocation required
- No remote work option when remote work preferred

**Severity**: High (if relocation required), Low (if remote)

**Impact**: May prevent job acceptance

**Mitigation**:
- Highlight mobility constraint in matching report
- Check for remote work options
- Recommend relocation if feasible

#### 7. Disponibilité
**Definition**: Timing or availability constraints.

**Detection**:
- Check notice period vs job start date
- Assess current employment status
- Identify any availability constraints

**Examples**:
- 3 month notice period when immediate start required
- Currently employed when full-time availability required
- Part-time availability when full-time required

**Severity**: Medium

**Impact**: May delay job start or affect availability

**Mitigation**:
- Highlight availability constraint in matching report
- Check if notice period can be negotiated
- Assess if part-time is acceptable

#### 8. Écart Salarial
**Definition**: Salary expectations vs job offer.

**Detection**:
- Compare candidate salary expectations with job offer
- Assess market alignment
- Check for negotiation flexibility

**Examples**:
- Candidate expects 100k when job offers 80k
- Candidate expects 120k when job offers 100k
- Market rate is 90k when candidate expects 100k

**Severity**: Medium

**Impact**: May affect job acceptance

**Mitigation**:
- Highlight salary gap in matching report
- Assess market alignment
- Recommend negotiation if feasible

#### 9. Secteur Totalement Différent
**Definition**: Candidate has no experience in job's sector.

**Detection**:
- Compare candidate sector experience with job sector
- Assess sector transferability
- Check for related sector experience

**Examples**:
- Retail experience when Technology sector required
- Healthcare experience when Finance sector required
- No sector experience when specialized sector required

**Severity**: Medium-High

**Impact**: May require significant onboarding

**Mitigation**:
- Highlight sector gap in matching report
- Assess sector transferability
- Recommend sector training if compensable

#### 10. Expérience Trop Ancienne
**Definition**: Relevant experience is too old to be current.

**Detection**:
- Check age of relevant experience
- Assess if skills are still current
- Identify skill decay

**Examples**:
- 5-year-old Java experience when modern Java required
- 10-year-old management experience when current practices required
- Outdated technology experience

**Severity**: Medium

**Impact**: May indicate skill decay or outdated knowledge

**Mitigation**:
- Highlight outdated experience in matching report
- Assess if skills are still current
- Recommend refresher training if needed

---

## SECTION 9 — OPPORTUNITIES

### Opportunity Types

#### 1. Compétence Rare
**Definition**: Candidate possesses rare or in-demand skills.

**Detection**:
- Identify skills that are scarce in the market
- Check for niche technologies or domains
- Assess skill rarity vs job requirements

**Examples**:
- Kubernetes expertise when Kubernetes is rare
- Blockchain experience when blockchain is emerging
- AI/ML experience when AI/ML is in high demand

**Value**: High

**Impact**: Significant competitive advantage

**Highlight**: Emphasize in matching report as differentiator

#### 2. Progression Rapide
**Definition**: Candidate shows rapid career progression.

**Detection**:
- Analyze career trajectory and promotions
- Check for rapid role advancement
- Assess skill acquisition speed

**Examples**:
- Junior to Senior in 2 years
- Multiple promotions in short timeframe
- Rapid skill acquisition across domains

**Value**: High

**Impact**: Indicates high potential and learning ability

**Highlight**: Emphasize in matching report as growth potential

#### 3. Leadership
**Definition**: Candidate demonstrates strong leadership capability.

**Detection**:
- Identify leadership roles and responsibilities
- Check for team management experience
- Assess leadership impact and results

**Examples**:
- Led team of 20+ engineers
- Mentored junior developers
- Drove successful organizational change

**Value**: High

**Impact**: Critical for leadership roles

**Highlight**: Emphasize in matching report as leadership strength

#### 4. Projets Remarquables
**Definition**: Candidate has worked on notable or high-impact projects.

**Detection**:
- Identify high-impact or complex projects
- Check for project scale and complexity
- Assess project results and achievements

**Examples**:
- Led migration of monolith to microservices
- Built platform serving 1M+ users
- Drove 50% cost reduction initiative

**Value**: High

**Impact**: Demonstrates capability and impact

**Highlight**: Emphasize in matching report as project excellence

#### 5. Certifications
**Definition**: Candidate has relevant and valuable certifications.

**Detection**:
- Identify certifications that match job requirements
- Check for certification rarity and value
- Assess certification recency

**Examples**:
- AWS Solutions Architect Professional
- PMP certification
- Kubernetes Administrator (CKA)

**Value**: Medium-High

**Impact**: Validates skills and knowledge

**Highlight**: Emphasize in matching report as qualification strength

#### 6. Stack Moderne
**Definition**: Candidate works with modern technology stack.

**Detection**:
- Identify modern technologies and frameworks
- Check for technology currency
- Assess technology alignment with job

**Examples**:
- React, TypeScript, Node.js experience
- Kubernetes, Docker, CI/CD experience
- Cloud-native architecture experience

**Value**: High

**Impact**: Indicates modern practices and adaptability

**Highlight**: Emphasize in matching report as technology strength

#### 7. Polyvalence
**Definition**: Candidate demonstrates versatility across domains.

**Detection**:
- Identify cross-domain experience
- Check for diverse skill set
- Assess adaptability across contexts

**Examples**:
- Frontend + Backend + DevOps experience
- Multiple industry sector experience
- Diverse technology stack experience

**Value**: High

**Impact**: Indicates adaptability and broad capability

**Highlight**: Emphasize in matching report as versatility strength

#### 8. Adaptabilité
**Definition**: Candidate demonstrates high adaptability.

**Detection**:
- Identify career transitions and pivots
- Check for successful role changes
- Assess learning agility

**Examples**:
- Successfully transitioned from Finance to Technology
- Rapidly adopted new technologies
- Thrived in diverse organizational cultures

**Value**: High

**Impact**: Indicates learning ability and change management

**Highlight**: Emphasize in matching report as adaptability strength

#### 9. Potentiel
**Definition**: Candidate shows high growth potential.

**Detection**:
- Analyze career trajectory and growth rate
- Check for learning speed and curiosity
- Assess ambition and drive

**Examples**:
- Consistent skill acquisition and growth
- Proactive learning and self-improvement
- Clear career ambition and goals

**Value**: High

**Impact**: Indicates future value and long-term fit

**Highlight**: Emphasize in matching report as potential strength

#### 10. Culture Fit
**Definition**: Candidate aligns well with organizational culture.

**Detection**:
- Compare candidate values with company culture
- Assess communication style alignment
- Check for work style compatibility

**Examples**:
- Innovative personality in innovation-driven culture
- Collaborative style in team-oriented culture
- Autonomous approach in autonomy-valuing culture

**Value**: High

**Impact**: Critical for long-term satisfaction and retention

**Highlight**: Emphasize in matching report as cultural strength

---

## SECTION 10 — SCORING

### Score Types

#### 1. Technical Match
**Definition**: Overall match of technical skills and technologies.

**Calculation**:
- Hard skills matching (weighted by category importance)
- Technology stack matching (with transferability)
- Certification matching
- Years of experience matching

**Range**: 0-100

**Interpretation**:
- 80-100: Strong technical fit
- 60-79: Good technical fit with some gaps
- 40-59: Moderate technical fit with significant gaps
- 0-39: Poor technical fit

**Confidence**: High (80-90)

**Explicability**:
- Source: Hard skills, technologies, certifications, experience
- Proof: Skill lists, technology stacks, certification lists
- Explanation: Weighted calculation of technical dimensions
- Confidence: High due to objective data

#### 2. Business Match
**Definition**: Overall match of business and domain knowledge.

**Calculation**:
- Domain experience matching
- Sector experience matching
- Industry knowledge matching
- Business complexity handling

**Range**: 0-100

**Interpretation**:
- 80-100: Strong business fit
- 60-79: Good business fit with some gaps
- 40-59: Moderate business fit with significant gaps
- 0-39: Poor business fit

**Confidence**: Medium-High (70-80)

**Explicability**:
- Source: Experiences, sector, domain
- Proof: Experience descriptions, sector values
- Explanation: Weighted calculation of business dimensions
- Confidence: Medium-High due to domain complexity

#### 3. Experience Match
**Definition**: Overall match of experience level and relevance.

**Calculation**:
- Years of experience matching
- Role level matching
- Project complexity matching
- Responsibility scope matching

**Range**: 0-100

**Interpretation**:
- 80-100: Strong experience fit
- 60-79: Good experience fit with some gaps
- 40-59: Moderate experience fit with significant gaps
- 0-39: Poor experience fit

**Confidence**: High (80-90)

**Explicability**:
- Source: Experiences, career level
- Proof: Experience descriptions, career level values
- Explanation: Weighted calculation of experience dimensions
- Confidence: High due to objective data

#### 4. Soft Skills Match
**Definition**: Overall match of soft skills and behavioral traits.

**Calculation**:
- Soft skills matching
- Communication style matching
- Leadership style matching
- Cultural alignment

**Range**: 0-100

**Interpretation**:
- 80-100: Strong soft skills fit
- 60-79: Good soft skills fit with some gaps
- 40-59: Moderate soft skills fit with significant gaps
- 0-39: Poor soft skills fit

**Confidence**: Medium (60-70)

**Explicability**:
- Source: Soft skills, behavior, culture
- Proof: Skill lists, behavior traits, culture flags
- Explanation: Weighted calculation of soft skill dimensions
- Confidence: Medium due to subjective nature

#### 5. Leadership Match
**Definition**: Overall match of leadership capability and requirements.

**Calculation**:
- Leadership experience matching
- Leadership style matching
- Team management matching
- Organizational impact matching

**Range**: 0-100

**Interpretation**:
- 80-100: Strong leadership fit
- 60-79: Good leadership fit with some gaps
- 40-59: Moderate leadership fit with significant gaps
- 0-39: Poor leadership fit

**Confidence**: Medium-High (70-80)

**Explicability**:
- Source: Experiences, behavior, responsibilities
- Proof: Leadership roles, behavior traits, responsibility types
- Explanation: Weighted calculation of leadership dimensions
- Confidence: Medium-High due to evidence-based assessment

#### 6. Culture Match
**Definition**: Overall match with organizational culture and values.

**Calculation**:
- Cultural values matching
- Work style matching
- Communication style matching
- Innovation preference matching

**Range**: 0-100

**Interpretation**:
- 80-100: Strong cultural fit
- 60-79: Good cultural fit with some gaps
- 40-59: Moderate cultural fit with significant gaps
- 0-39: Poor cultural fit

**Confidence**: Medium (60-70)

**Explicability**:
- Source: Behavior, culture, personality
- Proof: Behavior traits, culture flags, personality type
- Explanation: Weighted calculation of cultural dimensions
- Confidence: Medium due to subjective nature

#### 7. Potential Match
**Definition**: Overall assessment of growth potential.

**Calculation**:
- Learning ability assessment
- Career progression analysis
- Adaptability assessment
- Ambition and drive assessment

**Range**: 0-100

**Interpretation**:
- 80-100: High potential
- 60-79: Good potential
- 40-59: Moderate potential
- 0-39: Low potential

**Confidence**: Medium (60-70)

**Explicability**:
- Source: Career progression, behavior, history
- Proof: Progression records, behavior traits, historical patterns
- Explanation: Weighted calculation of potential dimensions
- Confidence: Medium due to predictive nature

#### 8. Transferability Score
**Definition**: Overall assessment of skill transferability.

**Calculation**:
- Transferable skills count
- Transferability confidence
- Learning curve assessment
- Domain transferability

**Range**: 0-100

**Interpretation**:
- 80-100: High transferability
- 60-79: Good transferability
- 40-59: Moderate transferability
- 0-39: Low transferability

**Confidence**: Medium-High (70-80)

**Explicability**:
- Source: Skills, technologies, experiences
- Proof: Skill lists, technology stacks, experience descriptions
- Explanation: Weighted calculation of transferability dimensions
- Confidence: Medium-High due to transferability rules

#### 9. Risk Score
**Definition**: Overall assessment of risk factors.

**Calculation**:
- Risk factor count
- Risk severity assessment
- Risk impact assessment
- Risk mitigation potential

**Range**: 0-100 (inverted: 0 = low risk, 100 = high risk)

**Interpretation**:
- 0-20: Low risk
- 21-40: Moderate risk
- 41-60: High risk
- 61-100: Very high risk

**Confidence**: Medium (60-70)

**Explicability**:
- Source: Risk factors, gaps, inconsistencies
- Proof: Risk factor list, gap analysis, inconsistency flags
- Explanation: Weighted calculation of risk dimensions
- Confidence: Medium due to predictive nature

#### 10. Interview Readiness
**Definition**: Overall assessment of interview preparation.

**Calculation**:
- Knowledge gap assessment
- Skill gap assessment
- Experience gap assessment
- Confidence assessment

**Range**: 0-100

**Interpretation**:
- 80-100: High interview readiness
- 60-79: Good interview readiness with some preparation
- 40-59: Moderate interview readiness with significant preparation
- 0-39: Low interview readiness requiring extensive preparation

**Confidence**: Medium-High (70-80)

**Explicability**:
- Source: All matching dimensions
- Proof: Gap analysis, skill matching, experience matching
- Explanation: Weighted calculation of readiness dimensions
- Confidence: Medium-High due to comprehensive assessment

#### 11. Confidence
**Definition**: Overall confidence in matching conclusions.

**Calculation**:
- Data quality confidence
- Evidence quality confidence
- Transferability confidence
- Risk assessment confidence

**Range**: 0-100

**Interpretation**:
- 80-100: High confidence
- 60-79: Good confidence
- 40-59: Moderate confidence
- 0-39: Low confidence

**Confidence**: N/A (this is the confidence score itself)

**Explicability**:
- Source: All data sources
- Proof: Explainability from all dimensions
- Explanation: Weighted calculation of confidence dimensions
- Confidence: N/A (this is the confidence score)

#### 12. Overall Match
**Definition**: Overall assessment of candidate-job fit.

**Calculation**:
- Technical Match (30%)
- Business Match (15%)
- Experience Match (20%)
- Soft Skills Match (10%)
- Leadership Match (10%)
- Culture Match (5%)
- Potential Match (5%)
- Transferability Score (5%)

**Range**: 0-100

**Interpretation**:
- 80-100: Strong fit
- 60-79: Good fit
- 40-59: Moderate fit
- 0-39: Poor fit

**Confidence**: Medium-High (70-80)

**Explicability**:
- Source: All matching dimensions
- Proof: All dimension scores
- Explanation: Weighted calculation of all dimensions
- Confidence: Medium-High due to comprehensive assessment

---

## SECTION 11 — EXPLAINABILITY

### Explainability Structure

Every conclusion must include:

#### 1. Why
**Description**: The reasoning behind the conclusion.

**Format**: Logical chain of thought from evidence to conclusion.

**Example**:
```
The candidate does not know Kubernetes (missing skill).
However, they know Docker (related skill).
They also know Azure (related cloud platform).
They have worked on distributed architectures (relevant experience).
Therefore, the skills are transferable with minimal learning curve.
The risk is low, and the gap can be compensated in 2-4 weeks.
```

#### 2. Sur quelles preuves
**Description**: The specific evidence supporting the conclusion.

**Format**: Direct references to data sources with line numbers or specific values.

**Example**:
```
Evidence:
- CandidateGraph.hardSkills: Docker (line 15), Azure (line 18)
- CandidateGraph.experiences: "Led migration to microservices" (line 42)
- JobOfferGraph.hardSkills: Kubernetes (line 23)
- JobOfferGraph.responsibilities: "Container orchestration" (line 31)
```

#### 3. Quelles intelligences consultées
**Description**: Which intelligences were used to reach the conclusion.

**Format**: List of intelligences with specific data used.

**Example**:
```
Intelligences Consulted:
- Candidate Profile Intelligence: Skills and experience data
- Job Offer Intelligence: Requirements and responsibilities
- Evidence Intelligence: Accumulated evidence about candidate's capabilities
- Transferability Intelligence: Skill transferability rules
```

#### 4. Quelles limites
**Description**: The limitations and assumptions of the conclusion.

**Format**: Clear statement of what is not known or assumed.

**Example**:
```
Limitations:
- Assumes candidate's Docker experience is recent and current
- Assumes Kubernetes learning curve is minimal for Docker experts
- Assumes distributed architecture experience is relevant to job requirements
- Does not account for specific Kubernetes features required by job
```

#### 5. Niveau de confiance
**Description**: The confidence level in the conclusion.

**Format**: Numerical confidence score (0-100) with justification.

**Example**:
```
Confidence: 75%
Justification:
- High confidence in Docker to Kubernetes transferability (90%)
- Medium confidence in distributed architecture relevance (70%)
- Medium confidence in learning curve estimation (65%)
- Overall confidence is weighted average of component confidences
```

### Explainability Examples

#### Example 1: Technical Gap with Transferability

**Conclusion**: The candidate lacks Kubernetes but has transferable skills.

**Why**:
```
The candidate does not have Kubernetes experience (missing skill).
However, they have Docker experience (container technology).
They also have Azure experience (cloud platform).
They have worked on distributed architectures (relevant experience).
Docker and Kubernetes are both container orchestration technologies (same category).
Azure provides container services that use Kubernetes (related platform).
Distributed architecture experience is relevant to Kubernetes workloads (related experience).
Therefore, the skills are transferable with minimal learning curve.
The risk is low, and the gap can be compensated in 2-4 weeks.
```

**Sur quelles preuves**:
```
Evidence:
- CandidateGraph.hardSkills.languages: Docker (line 15)
- CandidateGraph.hardSkills.cloud: Azure (line 18)
- CandidateGraph.experiences: "Led migration to microservices" (line 42)
- JobOfferGraph.hardSkills.cloud: Kubernetes (line 23)
- JobOfferGraph.responsibilities: "Container orchestration" (line 31)
```

**Quelles intelligences consultées**:
```
Intelligences Consulted:
- Candidate Profile Intelligence: Skills and experience data
- Job Offer Intelligence: Requirements and responsibilities
- Transferability Intelligence: Docker to Kubernetes transferability rules
```

**Quelles limites**:
```
Limitations:
- Assumes candidate's Docker experience is recent and current
- Assumes Kubernetes learning curve is minimal for Docker experts
- Assumes distributed architecture experience is relevant to job requirements
- Does not account for specific Kubernetes features required by job
```

**Niveau de confiance**:
```
Confidence: 75%
Justification:
- High confidence in Docker to Kubernetes transferability (90%)
- Medium confidence in distributed architecture relevance (70%)
- Medium confidence in learning curve estimation (65%)
- Overall confidence is weighted average of component confidences
```

#### Example 2: Leadership Gap with Potential

**Conclusion**: The candidate lacks leadership experience but shows leadership potential.

**Why**:
```
The candidate has no formal leadership experience (missing experience).
However, they have led technical projects (informal leadership).
They have mentored junior developers (leadership behavior).
They have high communication scores (leadership trait).
They have taken initiative on projects (leadership behavior).
They have strong collaboration skills (leadership trait).
Therefore, the candidate shows leadership potential despite no formal experience.
The risk is medium, and the gap can be compensated with mentorship in 8-12 weeks.
```

**Sur quelles preuves**:
```
Evidence:
- CandidateGraph.experiences: No management roles (line 0)
- CandidateGraph.experiences: "Led technical migration" (line 35)
- CandidateGraph.behavior.communicationStyle: "Collaborative" (line 12)
- CandidateGraph.behavior.leadershipStyle: "Collaborative" (line 13)
- CandidateGraph.behavior.synthesisAbility: 85 (line 15)
```

**Quelles intelligences consultées**:
```
Intelligences Consulted:
- Candidate Profile Intelligence: Experience and behavior data
- Job Offer Intelligence: Leadership requirements
- Evidence Intelligence: Accumulated evidence about leadership behaviors
- Potential Intelligence: Leadership potential assessment
```

**Quelles limites**:
```
Limitations:
- Assumes informal leadership translates to formal leadership
- Assumes mentorship will be available
- Does not account for specific leadership challenges in role
- Does not account for organizational leadership culture
```

**Niveau de confiance**:
```
Confidence: 65%
Justification:
- Medium confidence in informal leadership translation (70%)
- Medium confidence in mentorship availability (60%)
- Medium confidence in leadership potential assessment (65%)
- Overall confidence is weighted average of component confidences
```

---

## SECTION 12 — SORTIES

### Matching Intelligence Output Structure

#### 1. Résumé
**Description**: High-level summary of the matching analysis.

**Content**:
- Overall match score (0-100)
- Overall confidence (0-100)
- Key strengths (3-5 bullet points)
- Key weaknesses (3-5 bullet points)
- Overall recommendation (Strong Fit, Good Fit, Moderate Fit, Poor Fit)

**Example**:
```
Overall Match: 72%
Overall Confidence: 75%

Key Strengths:
- Strong technical foundation with modern stack (React, TypeScript, Node.js)
- Excellent soft skills with strong communication and collaboration
- High potential with rapid career progression
- Good cultural alignment with innovation-driven culture

Key Weaknesses:
- Missing Kubernetes experience (compensable with Docker and Azure)
- No formal leadership experience (shows leadership potential)
- Limited domain experience in Fintech (transferable from Finance)

Overall Recommendation: Good Fit with minor gaps
```

#### 2. Forces
**Description**: Detailed analysis of candidate strengths.

**Content**:
- Technical strengths (hard skills, technologies)
- Business strengths (domain, sector, industry)
- Experience strengths (years, roles, projects)
- Soft skills strengths (communication, collaboration, leadership)
- Cultural strengths (values, work style, innovation)
- Potential strengths (learning ability, adaptability, growth)

**Example**:
```
Technical Strengths:
- Modern stack: React, TypeScript, Node.js (90% match)
- Cloud experience: AWS, Azure (85% match)
- DevOps: Docker, CI/CD (80% match)

Business Strengths:
- Finance domain expertise (100% match)
- Fintech transferability (70% match)
- Business complexity handling (75% match)

Experience Strengths:
- 5 years relevant experience (100% match)
- Senior level (100% match)
- Complex project experience (85% match)

Soft Skills Strengths:
- Communication: Collaborative style (90% match)
- Teamwork: Strong collaboration history (85% match)
- Problem-solving: High synthesis ability (80% match)

Cultural Strengths:
- Innovation: Innovative personality (90% match)
- Collaboration: Collaborative work style (85% match)
- Autonomy: High autonomy preference (80% match)

Potential Strengths:
- Learning ability: Rapid skill acquisition (85% match)
- Adaptability: Successful career transitions (80% match)
- Growth: Consistent career progression (85% match)
```

#### 3. Faiblesses
**Description**: Detailed analysis of candidate weaknesses.

**Content**:
- Technical gaps (missing skills, technologies)
- Business gaps (domain, sector, industry)
- Experience gaps (years, roles, projects)
- Soft skills gaps (communication, collaboration, leadership)
- Cultural gaps (values, work style, innovation)
- Risk factors (overestimation, inconsistencies, constraints)

**Example**:
```
Technical Gaps:
- Missing Kubernetes (compensable with Docker and Azure, 75% transferability)
- Missing Go (compensable with Python, 60% transferability)
- Missing GraphQL (not directly compensable, 0% transferability)

Business Gaps:
- Limited Fintech experience (transferable from Finance, 70% transferability)
- No MedTech experience (not required, 0% impact)

Experience Gaps:
- No formal leadership experience (shows leadership potential, 65% confidence)
- Limited team size experience (managed 5, requires 20, 50% match)

Soft Skills Gaps:
- Limited public speaking experience (not required, 0% impact)
- No formal mentoring experience (informal mentoring present, 70% match)

Cultural Gaps:
- No explicit remote work experience (remote work available, 0% impact)
- No explicit startup experience (innovation culture present, 0% impact)

Risk Factors:
- No critical risks detected
- Minor risk: Kubernetes gap (low risk, compensable)
- Minor risk: Leadership gap (medium risk, potential exists)
```

#### 4. Compétences Transférables
**Description**: Analysis of transferable skills and learning potential.

**Content**:
- Transferable skills list (from → to with transferability score)
- Learning curve estimates (time to acquire missing skills)
- Transferability confidence (overall confidence in transferability)

**Example**:
```
Transferable Skills:
- Docker → Kubernetes (90% transferability, 2-4 weeks learning)
- AWS → Azure (85% transferability, 1-2 weeks learning)
- Finance → Fintech (70% transferability, 4-8 weeks learning)
- Python → Go (60% transferability, 4-6 weeks learning)
- Project Management → Scrum Master (75% transferability, 2-4 weeks learning)

Learning Curve Estimates:
- Kubernetes: 2-4 weeks (high transferability from Docker)
- Go: 4-6 weeks (medium transferability from Python)
- Fintech domain: 4-8 weeks (medium transferability from Finance)
- Leadership: 8-12 weeks (potential exists, requires mentorship)

Transferability Confidence: 75%
Justification:
- High confidence in technology transferability (85%)
- Medium confidence in domain transferability (70%)
- Medium confidence in leadership transferability (65%)
- Overall confidence is weighted average of component confidences
```

#### 5. Risques
**Description**: Detailed analysis of risk factors.

**Content**:
- Risk factors list (type, severity, impact, mitigation)
- Overall risk score (0-100, inverted)
- Risk mitigation recommendations

**Example**:
```
Risk Factors:
- Technical Gap (Kubernetes): Medium severity, Low impact, Mitigation: 2-4 weeks training
- Leadership Gap: Medium severity, Medium impact, Mitigation: 8-12 weeks mentorship
- Domain Gap (Fintech): Low severity, Low impact, Mitigation: 4-8 weeks learning

Overall Risk Score: 25 (Low Risk)
Justification:
- No critical risks detected
- All gaps are compensable with training or mentorship
- Transferability reduces risk for technical gaps
- Potential exists for leadership gap

Risk Mitigation Recommendations:
- Prioritize Kubernetes training (2-4 weeks)
- Seek mentorship for leadership development (8-12 weeks)
- Allocate time for Fintech domain learning (4-8 weeks)
- Validate leadership potential during interview
```

#### 6. Axes d'Amélioration
**Description**: Specific recommendations for improvement.

**Content**:
- Priority improvements (high priority, time estimate)
- Secondary improvements (medium priority, time estimate)
- Nice-to-have improvements (low priority, time estimate)

**Example**:
```
Priority Improvements (High Priority):
- Learn Kubernetes (2-4 weeks, high impact)
- Develop leadership skills (8-12 weeks, high impact)
- Gain Fintech domain knowledge (4-8 weeks, medium impact)

Secondary Improvements (Medium Priority):
- Learn Go programming language (4-6 weeks, medium impact)
- Gain GraphQL experience (2-4 weeks, low impact)
- Develop public speaking skills (8-12 weeks, low impact)

Nice-to-Have Improvements (Low Priority):
- Gain startup experience (ongoing, low impact)
- Develop formal mentoring skills (8-12 weeks, low impact)
- Expand cloud platform knowledge (4-8 weeks, low impact)
```

#### 7. Préparation Entretien
**Description**: Interview preparation guidance.

**Content**:
- Key topics to prepare (technical, behavioral, cultural)
- Questions to expect (technical, behavioral, cultural)
- Answers to prepare (strengths, weaknesses, examples)
- Red flags to address (gaps, risks, inconsistencies)

**Example**:
```
Key Topics to Prepare:
- Container orchestration (Kubernetes vs Docker)
- Cloud platforms (AWS vs Azure vs GCP)
- Leadership experience (informal leadership examples)
- Fintech domain knowledge (Finance to Fintech transition)
- Cultural fit (innovation, collaboration, autonomy)

Questions to Expect:
- Technical: "How would you migrate from Docker to Kubernetes?"
- Behavioral: "Tell me about a time you led a technical project."
- Cultural: "How do you approach innovation in your work?"
- Domain: "How would your Finance experience apply to Fintech?"

Answers to Prepare:
- Strengths: Modern stack, soft skills, potential
- Weaknesses: Kubernetes gap, leadership gap, Fintech gap
- Examples: Microservices migration, mentoring junior developers

Red Flags to Address:
- Kubernetes gap: Explain Docker experience and transferability
- Leadership gap: Explain informal leadership and potential
- Fintech gap: Explain Finance experience and transferability
```

#### 8. Priorités
**Description**: Prioritized action items.

**Content**:
- Immediate priorities (this week)
- Short-term priorities (this month)
- Long-term priorities (this quarter)

**Example**:
```
Immediate Priorities (This Week):
- Research Kubernetes basics
- Identify Kubernetes training resources
- Prepare leadership examples for interview
- Research Fintech domain basics

Short-Term Priorities (This Month):
- Complete Kubernetes training (2-4 weeks)
- Start leadership mentorship (ongoing)
- Begin Fintech domain learning (4-8 weeks)
- Prepare for interview (ongoing)

Long-Term Priorities (This Quarter):
- Gain Kubernetes proficiency (ongoing)
- Develop leadership skills (8-12 weeks)
- Gain Fintech domain expertise (4-8 weeks)
- Expand cloud platform knowledge (ongoing)
```

#### 9. Score
**Description**: Detailed score breakdown.

**Content**:
- Overall match score (0-100)
- Dimension scores (Technical, Business, Experience, Soft Skills, Leadership, Culture, Potential, Transferability)
- Risk score (0-100, inverted)
- Interview readiness score (0-100)
- Confidence score (0-100)

**Example**:
```
Overall Match Score: 72%
- Technical Match: 75%
- Business Match: 70%
- Experience Match: 80%
- Soft Skills Match: 85%
- Leadership Match: 65%
- Culture Match: 80%
- Potential Match: 85%
- Transferability Score: 75%

Risk Score: 25 (Low Risk)
- Technical Risk: 30 (Low)
- Leadership Risk: 40 (Medium)
- Domain Risk: 20 (Low)

Interview Readiness Score: 70%
- Knowledge Gap: 65%
- Skill Gap: 70%
- Experience Gap: 75%
- Confidence: 70%

Confidence Score: 75%
- Data Quality: 80%
- Evidence Quality: 75%
- Transferability Confidence: 75%
- Risk Assessment Confidence: 70%
```

#### 10. Explications
**Description**: Detailed explanations for key conclusions.

**Content**:
- Why overall match score is X
- Why specific gaps are compensable or not
- Why transferability is high or low
- Why risk is low or high
- Why confidence is high or low

**Example**:
```
Why Overall Match Score is 72%:
- Strong technical foundation (75%) drives overall score
- Excellent soft skills (85%) significantly boost score
- High potential (85%) indicates future value
- Compensable gaps (Kubernetes, leadership) reduce negative impact
- Cultural alignment (80%) supports long-term fit

Why Kubernetes Gap is Compensable:
- Docker experience provides 90% transferability
- Azure experience provides cloud platform context
- Distributed architecture experience provides relevant context
- Learning curve is minimal (2-4 weeks)
- Risk is low due to high transferability

Why Leadership Gap is Compensable:
- Informal leadership experience shows potential
- High communication scores support leadership capability
- Strong collaboration skills support team management
- Mentorship can bridge formal experience gap
- Potential exists for leadership development

Why Transferability is High (75%):
- Technology transferability is high (85%)
- Domain transferability is medium (70%)
- Leadership transferability is medium (65%)
- Overall confidence is weighted average

Why Risk is Low (25):
- No critical risks detected
- All gaps are compensable with training or mentorship
- Transferability reduces technical risk
- Potential exists for leadership development
- Cultural alignment reduces organizational risk

Why Confidence is High (75%):
- Data quality is high (80%) - both graphs well-populated
- Evidence quality is good (75%) - strong evidence for most conclusions
- Transferability confidence is high (75%) - well-established transferability rules
- Risk assessment confidence is medium (70%) - predictive nature introduces uncertainty
```

#### 11. Preuves
**Description**: Evidence supporting key conclusions.

**Content**:
- Evidence for technical conclusions
- Evidence for business conclusions
- Evidence for experience conclusions
- Evidence for soft skills conclusions
- Evidence for cultural conclusions
- Evidence for potential conclusions

**Example**:
```
Evidence for Technical Conclusions:
- Docker experience: CandidateGraph.hardSkills.cloud (line 15)
- Azure experience: CandidateGraph.hardSkills.cloud (line 18)
- Kubernetes requirement: JobOfferGraph.hardSkills.cloud (line 23)
- Microservices experience: CandidateGraph.experiences (line 42)

Evidence for Business Conclusions:
- Finance experience: CandidateGraph.career.sector (line 8)
- Fintech requirement: JobOfferGraph.generalInfo.sector (line 5)
- Business complexity: CandidateGraph.experiences (line 38)

Evidence for Experience Conclusions:
- 5 years experience: CandidateGraph.career.yearsOfExperience (line 10)
- Senior level: CandidateGraph.career.currentLevel (line 11)
- Complex projects: CandidateGraph.experiences (line 35-45)

Evidence for Soft Skills Conclusions:
- Communication: CandidateGraph.behavior.communicationStyle (line 12)
- Collaboration: CandidateGraph.behavior.leadershipStyle (line 13)
- Synthesis ability: CandidateGraph.behavior.synthesisAbility (line 15)

Evidence for Cultural Conclusions:
- Innovation: CandidateGraph.behavior.personalityType (line 14)
- Collaboration: JobOfferGraph.companyCulture.collaboration (line 28)
- Autonomy: JobOfferGraph.companyCulture.autonomy (line 29)

Evidence for Potential Conclusions:
- Career progression: CandidateGraph.history.progressions (line 55-60)
- Learning ability: CandidateGraph.behavior.learningAbility (implicit)
- Adaptability: CandidateGraph.experiences (line 30-40)
```

---

## SECTION 13 — CONSOMMATEURS

### Direct Consumers

#### 1. Planning Intelligence
**Usage**: Uses matching results to create action plans for addressing gaps and leveraging strengths.

**Data Used**:
- Gaps and their severity
- Transferability scores
- Learning curve estimates
- Priority improvements
- Risk factors

**Output**: Personalized action plan for job acquisition

#### 2. Execution Intelligence
**Usage**: Uses matching results to select next best actions for job application process.

**Data Used**:
- Priority improvements
- Interview readiness score
- Risk factors
- Confidence score

**Output**: Next best action (e.g., "Complete Kubernetes training")

#### 3. Coaching Intelligence
**Usage**: Uses matching results to provide personalized guidance and motivation.

**Data Used**:
- Strengths and weaknesses
- Transferability analysis
- Risk factors
- Potential assessment

**Output**: Personalized coaching guidance

#### 4. Accountability Intelligence
**Usage**: Uses matching results to track progress on addressing gaps.

**Data Used**:
- Priority improvements
- Learning curve estimates
- Risk factors

**Output**: Progress tracking and accountability

#### 5. Outcome Intelligence
**Usage**: Uses matching results to measure success of job application process.

**Data Used**:
- Overall match score
- Confidence score
- Risk score

**Output**: Success measurement and outcome analysis

#### 6. Learning Intelligence
**Usage**: Uses matching results to improve future matching accuracy.

**Data Used**:
- All matching dimensions
- Transferability rules
- Risk factors
- Confidence scores

**Output**: Improved matching algorithms and transferability rules

### Indirect Consumers

#### 7. Dashboard
**Usage**: Displays matching results to user.

**Data Used**:
- Overall match score
- Strengths and weaknesses
- Priority improvements
- Risk factors

**Output**: Visual representation of matching results

#### 8. Digital Twin
**Usage**: Stores matching context for future reference.

**Data Used**:
- Matching results
- Explainability
- Confidence scores

**Output**: Matching context stored in Digital Twin

#### 9. Career Chat
**Usage**: Answers user questions about matching results.

**Data Used**:
- Matching results
- Explainability
- Evidence

**Output**: Natural language responses to user questions

#### 10. Voice Interview
**Usage**: Prepares interview based on matching results.

**Data Used**:
- Gaps and risks
- Interview readiness score
- Preparation recommendations

**Output**: Interview preparation guidance

#### 11. Final Report
**Usage**: Includes matching analysis in final report.

**Data Used**:
- All matching results
- Explainability
- Evidence

**Output**: Comprehensive matching analysis in final report

---

## SECTION 14 — BOUNDARY VALIDATION

### Comparison with Other Intelligences

#### 1. Planning Intelligence
**Planning Responsibility**: Transform recommendations into action plans
**Matching Responsibility**: Compare candidate and job offer to produce actionable insights
**Overlap**: ❌ None
**Boundary**: Matching provides data, Planning uses it to create plans

#### 2. Reflection Intelligence
**Reflection Responsibility**: Critical analysis of recommendations and self-assessment
**Matching Responsibility**: Objective comparison of candidate and job offer
**Overlap**: ❌ None
**Boundary**: Matching provides objective analysis, Reflection provides critical analysis

#### 3. Execution Intelligence
**Execution Responsibility**: Select next best action based on goals and context
**Matching Responsibility**: Provide matching analysis for decision-making
**Overlap**: ❌ None
**Boundary**: Matching provides analysis, Execution uses it to select actions

#### 4. Decision Intelligence
**Decision Responsibility**: Take decisions based on goals and context
**Matching Responsibility**: Provide matching analysis for decision-making
**Overlap**: ❌ None
**Boundary**: Matching provides analysis, Decision uses it to make decisions

#### 5. Scenario Intelligence
**Scenario Responsibility**: Predict future scenarios and outcomes
**Matching Responsibility**: Provide current matching analysis
**Overlap**: ❌ None
**Boundary**: Matching provides current state, Scenario predicts future states

#### 6. Forecast Intelligence
**Forecast Responsibility**: Predict future trends and market conditions
**Matching Responsibility**: Provide current matching analysis
**Overlap**: ❌ None
**Boundary**: Matching provides current analysis, Forecast provides future predictions

#### 7. Evidence Intelligence
**Evidence Responsibility**: Accumulate and validate evidence about candidate capabilities
**Matching Responsibility**: Use evidence to support matching conclusions
**Overlap**: ❌ None
**Boundary**: Evidence provides data, Matching uses it

#### 8. Mission Intelligence
**Mission Responsibility**: Define mission objectives and track progress
**Matching Responsibility**: Provide matching analysis for mission alignment
**Overlap**: ❌ None
**Boundary**: Matching provides analysis, Mission uses it for alignment

#### 9. Goal Intelligence
**Goal Responsibility**: Define and follow career goals
**Matching Responsibility**: Provide matching analysis for goal alignment
**Overlap**: ❌ None
**Boundary**: Matching provides analysis, Goal uses it for alignment

#### 10. Opportunity Intelligence
**Opportunity Responsibility**: Analyze market opportunities and trends
**Matching Responsibility**: Provide matching analysis for specific job offer
**Overlap**: ❌ None
**Boundary**: Opportunity analyzes market, Matching analyzes specific offer

#### 11. Accountability Intelligence
**Accountability Responsibility**: Track progress and ensure accountability
**Matching Responsibility**: Provide matching analysis for progress tracking
**Overlap**: ❌ None
**Boundary**: Matching provides analysis, Accountability uses it for tracking

#### 12. Outcome Intelligence
**Outcome Responsibility**: Measure success and analyze outcomes
**Matching Responsibility**: Provide matching analysis for outcome measurement
**Overlap**: ❌ None
**Boundary**: Matching provides analysis, Outcome uses it for measurement

### Who Does What

| Intelligence | Responsibility | Does NOT |
|--------------|---------------|---------|
| Matching Intelligence | Compare candidate and job offer | Create action plans |
| Planning Intelligence | Create action plans | Compare candidate and job offer |
| Reflection Intelligence | Critical analysis of self | Objective comparison |
| Execution Intelligence | Select next best action | Provide matching analysis |
| Decision Intelligence | Take decisions | Provide matching analysis |
| Scenario Intelligence | Predict future scenarios | Provide current analysis |
| Forecast Intelligence | Predict future trends | Provide current analysis |
| Evidence Intelligence | Accumulate evidence | Use evidence for matching |
| Mission Intelligence | Define mission objectives | Provide matching analysis |
| Goal Intelligence | Define career goals | Provide matching analysis |
| Opportunity Intelligence | Analyze market opportunities | Analyze specific offer |
| Accountability Intelligence | Track progress | Provide matching analysis |
| Outcome Intelligence | Measure success | Provide matching analysis |

### Who Must Never Do What

| Intelligence | Must Never Do |
|--------------|---------------|
| Matching Intelligence | Create action plans, take decisions, predict future |
| Planning Intelligence | Compare candidate and job offer, take decisions |
| Reflection Intelligence | Objective comparison, create action plans |
| Execution Intelligence | Provide matching analysis, predict future |
| Decision Intelligence | Provide matching analysis, create action plans |
| Scenario Intelligence | Provide current analysis, create action plans |
| Forecast Intelligence | Provide current analysis, create action plans |
| Evidence Intelligence | Use evidence for matching, create action plans |
| Mission Intelligence | Provide matching analysis, create action plans |
| Goal Intelligence | Provide matching analysis, create action plans |
| Opportunity Intelligence | Analyze specific offer, create action plans |
| Accountability Intelligence | Provide matching analysis, create action plans |
| Outcome Intelligence | Provide matching analysis, create action plans |

---

## SECTION 15 — PERFORMANCE

### Réutilisation Maximale

#### 1. Graphes Utilisés
- **CandidateGraph**: Used once, cached for all dimensions
- **JobOfferGraph**: Used once, cached for all dimensions
- **No re-parsing**: Graphs are pre-parsed by FEATURE 01 and FEATURE 02

#### 2. Aucun Recalcul
- **Dimension calculations**: Each dimension calculated once
- **Score calculations**: Each score calculated once
- **Transferability calculations**: Each transferability calculated once
- **Risk calculations**: Each risk calculated once

#### 3. Aucune Duplication
- **No duplicate data structures**: Single MatchingGraph output
- **No duplicate calculations**: Each calculation performed once
- **No duplicate storage**: Single storage location for results

### Ordre Optimal

#### Phase 1: Data Loading
1. Load CandidateGraph (from FEATURE 01)
2. Load JobOfferGraph (from FEATURE 02)
3. Load optional intelligences (if available)

#### Phase 2: Dimension Analysis (Parallel)
1. Analyze Hard Skills (parallel with other dimensions)
2. Analyze Soft Skills (parallel with other dimensions)
3. Analyze Technologies (parallel with other dimensions)
4. Analyze Experience (parallel with other dimensions)
5. Analyze Seniority (parallel with other dimensions)
6. Analyze Leadership (parallel with other dimensions)
7. Analyze Communication (parallel with other dimensions)
8. Analyze Autonomy (parallel with other dimensions)
9. Analyze Organization (parallel with other dimensions)
10. Analyze Culture (parallel with other dimensions)

#### Phase 3: Transferability Analysis
1. Calculate transferability for missing skills
2. Calculate learning curves
3. Calculate transferability confidence

#### Phase 4: Gap Analysis
1. Identify gaps by type (technical, business, experience, etc.)
2. Assess gap severity
3. Assess gap impact
4. Assess gap compensability

#### Phase 5: Risk Analysis
1. Identify risk factors
2. Assess risk severity
3. Assess risk impact
4. Assess risk mitigation

#### Phase 6: Opportunity Analysis
1. Identify opportunities
2. Assess opportunity value
3. Assess opportunity impact

#### Phase 7: Score Calculation
1. Calculate dimension scores
2. Calculate overall match score
3. Calculate risk score
4. Calculate interview readiness score
5. Calculate confidence score

#### Phase 8: Explainability Generation
1. Generate explanations for each conclusion
2. Generate evidence references
3. Generate intelligence consultation list
4. Generate limitations
5. Generate confidence justification

#### Phase 9: Output Generation
1. Generate summary
2. Generate strengths and weaknesses
3. Generate transferability analysis
4. Generate risk analysis
5. Generate improvement recommendations
6. Generate interview preparation
7. Generate priorities
8. Generate score breakdown
9. Generate explanations
10. Generate evidence

### Performance Characteristics

- **Single-pass analysis**: Each dimension analyzed once
- **Parallel processing**: Dimensions analyzed in parallel where possible
- **Cached results**: Graphes cached for all dimensions
- **No redundant calculations**: Each calculation performed once
- **Optimal order**: Phases ordered to minimize dependencies

---

## SECTION 16 — DÉTERMINISME

### Determinism Guarantees

#### 1. Same CV, Same Job Offer → Same Matching

**Guarantee**: The same CandidateGraph and JobOfferGraph will always produce the same MatchingGraph.

**Implementation**:
- **Fixed order**: Dimension analysis order is fixed
- **Fixed weights**: Score weights are fixed
- **Fixed rules**: Transferability rules are fixed
- **Fixed thresholds**: Risk thresholds are fixed
- **No randomness**: No random number generation
- **No external state**: No external state dependencies
- **Pure function**: Matching is a pure function of inputs

#### 2. Deterministic Transferability

**Guarantee**: Transferability assessment is deterministic based on fixed rules.

**Implementation**:
- **Fixed transferability matrix**: Transferability scores are fixed
- **Fixed learning curves**: Learning curve estimates are fixed
- **Fixed rules**: Transferability rules are fixed
- **No LLM calls**: No probabilistic LLM calls
- **No randomness**: No random number generation

#### 3. Deterministic Scoring

**Guarantee**: Score calculation is deterministic based on fixed weights and rules.

**Implementation**:
- **Fixed weights**: Dimension weights are fixed
- **Fixed formulas**: Score formulas are fixed
- **Fixed thresholds**: Score thresholds are fixed
- **No randomness**: No random number generation
- **No external state**: No external state dependencies

#### 4. Deterministic Risk Assessment

**Guarantee**: Risk assessment is deterministic based on fixed rules and thresholds.

**Implementation**:
- **Fixed risk rules**: Risk identification rules are fixed
- **Fixed severity rules**: Severity assessment rules are fixed
- **Fixed thresholds**: Risk thresholds are fixed
- **No randomness**: No random number generation
- **No external state**: No external state dependencies

#### 5. Deterministic Explainability

**Guarantee**: Explainability generation is deterministic based on fixed templates and rules.

**Implementation**:
- **Fixed templates**: Explanation templates are fixed
- **Fixed rules**: Explanation generation rules are fixed
- **Fixed evidence references**: Evidence reference rules are fixed
- **No randomness**: No random number generation
- **No external state**: No external state dependencies

### Determinism Validation

**Validation Method**:
1. Run matching with same inputs multiple times
2. Verify identical outputs each time
3. Verify identical scores each time
4. Verify identical explanations each time

**Expected Result**: 100% identical outputs across multiple runs

---

## SECTION 17 — INTÉGRATION FUTURE

### Dashboard Integration

**Integration Point**: Dashboard widget for matching results

**Data Flow**:
```
Matching Intelligence → MatchingGraph → Dashboard Widget
```

**Display Elements**:
- Overall match score
- Strengths and weaknesses summary
- Priority improvements
- Risk factors
- Transferability analysis

**Implementation**: Presentational component only, no business logic

### Timeline Integration

**Integration Point**: Timeline events for matching analysis

**Data Flow**:
```
Matching Intelligence → MatchingEvents → Timeline
```

**Event Types**:
- `MatchingCompleted` - Matching analysis completed
- `GapIdentified` - Gap identified (type, severity, impact)
- `RiskDetected` - Risk detected (type, severity, impact)
- `OpportunityIdentified` - Opportunity identified (type, value, impact)

**Implementation**: Events published via DomainEventPublisher

### Digital Twin Integration

**Integration Point**: Digital Twin context for matching results

**Data Flow**:
```
Matching Intelligence → MatchingGraph → Digital Twin.matchingContext
```

**Context Elements**:
- Overall match score
- Dimension scores
- Gaps and risks
- Opportunities
- Transferability analysis
- Confidence score

**Implementation**: Context storage only, no business logic

### Career Chat Integration

**Integration Point**: Chat responses about matching results

**Data Flow**:
```
Career Chat → Digital Twin.matchingContext → Natural Language Response
```

**Query Types**:
- "Am I a good fit for this job?"
- "What are my strengths for this job?"
- "What are my weaknesses for this job?"
- "What gaps do I have?"
- "How can I improve?"
- "What is my overall match score?"

**Implementation**: Query processing only, no business logic

### Voice Interview Integration

**Integration Point**: Interview preparation based on matching results

**Data Flow**:
```
Matching Intelligence → MatchingGraph → Voice Interview Preparation
```

**Preparation Elements**:
- Key topics to prepare
- Questions to expect
- Answers to prepare
- Red flags to address
- Interview readiness score

**Implementation**: Preparation guidance only, no business logic

### Final Report Integration

**Integration Point**: Matching analysis in final report

**Data Flow**:
```
Matching Intelligence → MatchingGraph → Final Report
```

**Report Elements**:
- Overall match score
- Strengths and weaknesses
- Transferability analysis
- Risk analysis
- Improvement recommendations
- Interview preparation
- Evidence and explanations

**Implementation**: Report generation only, no business logic

### Learning Integration

**Integration Point**: Learning from matching results

**Data Flow**:
```
Matching Intelligence → MatchingGraph → Learning Intelligence
```

**Learning Elements**:
- Transferability rule refinement
- Risk threshold adjustment
- Score weight optimization
- Confidence calibration

**Implementation**: Learning algorithm only, no business logic

---

## SECTION 18 — ROADMAP

### Phase A: Analysis (Weeks 1-2)

**Objective**: Implement core dimension analysis

**Tasks**:
1. Implement Hard Skills matching
2. Implement Soft Skills matching
3. Implement Technologies matching
4. Implement Experience matching
5. Implement Seniority matching

**Deliverables**:
- Dimension analysis methods
- Dimension scoring methods
- Dimension explainability methods

**Dependencies**: None

### Phase B: Matching (Weeks 3-4)

**Objective**: Implement remaining dimension analysis

**Tasks**:
1. Implement Leadership matching
2. Implement Communication matching
3. Implement Autonomy matching
4. Implement Organization matching
5. Implement Culture matching

**Deliverables**:
- Remaining dimension analysis methods
- Remaining dimension scoring methods
- Remaining dimension explainability methods

**Dependencies**: Phase A

### Phase C: Transferability (Weeks 5-6)

**Objective**: Implement transferability analysis

**Tasks**:
1. Implement transferability matrix
2. Implement transferability rules
3. Implement learning curve estimation
4. Implement transferability confidence

**Deliverables**:
- Transferability analysis system
- Transferability matrix
- Learning curve estimation system

**Dependencies**: Phase B

### Phase D: Risks (Weeks 7-8)

**Objective**: Implement risk analysis

**Tasks**:
1. Implement risk identification
2. Implement risk severity assessment
3. Implement risk impact assessment
4. Implement risk mitigation analysis

**Deliverables**:
- Risk analysis system
- Risk identification rules
- Risk assessment methods

**Dependencies**: Phase C

### Phase E: Opportunities (Weeks 9-10)

**Objective**: Implement opportunity analysis

**Tasks**:
1. Implement opportunity identification
2. Implement opportunity value assessment
3. Implement opportunity impact assessment

**Deliverables**:
- Opportunity analysis system
- Opportunity identification rules
- Opportunity assessment methods

**Dependencies**: Phase D

### Phase F: Scoring (Weeks 11-12)

**Objective**: Implement scoring system

**Tasks**:
1. Implement dimension scoring
2. Implement overall match scoring
3. Implement risk scoring
4. Implement interview readiness scoring
5. Implement confidence scoring

**Deliverables**:
- Scoring system
- Score calculation methods
- Score explainability methods

**Dependencies**: Phase E

### Phase G: Explainability (Weeks 13-14)

**Objective**: Implement explainability system

**Tasks**:
1. Implement explanation generation
2. Implement evidence referencing
3. Implement intelligence consultation tracking
4. Implement limitation documentation
5. Implement confidence justification

**Deliverables**:
- Explainability system
- Explanation templates
- Evidence reference system

**Dependencies**: Phase F

### Phase H: Integration (Weeks 15-16)

**Objective**: Integrate with existing system

**Tasks**:
1. Integrate with CandidateGraph
2. Integrate with JobOfferGraph
3. Integrate with optional intelligences
4. Implement domain events
5. Implement output generation

**Deliverables**:
- Full integration with existing system
- Domain events
- Output generation system

**Dependencies**: Phase G

### Phase I: Testing (Weeks 17-18)

**Objective**: Test and validate

**Tasks**:
1. Unit testing
2. Integration testing
3. Determinism testing
4. Explainability testing
5. Performance testing

**Deliverables**:
- Test suite
- Test results
- Validation report

**Dependencies**: Phase H

### Phase J: Documentation (Weeks 19-20)

**Objective**: Document implementation

**Tasks**:
1. Document API
2. Document algorithms
3. Document transferability rules
4. Document risk rules
5. Document scoring rules

**Deliverables**:
- API documentation
- Algorithm documentation
- Rule documentation

**Dependencies**: Phase I

---

## VALIDATION

### Validation Checklist

- ✅ Aucun code n'a été créé
- ✅ Aucun fichier source n'a été modifié
- ✅ Aucune architecture n'a été modifiée
- ✅ Toutes les dimensions du Matching sont documentées
- ✅ Les frontières avec les autres intelligences sont parfaitement définies
- ✅ Les entrées, sorties et dépendances sont explicites
- ✅ Le raisonnement attendu est décrit de manière détaillée
- ✅ Le document peut servir de référence unique pour toute l'implémentation de FEATURE 03

### Conclusion

This document provides a complete specification for the Matching Intelligence Engine, serving as the single reference for all implementation of FEATURE 03. The specification covers:

- Vision and positioning in the pipeline
- Authorized sources and dependencies
- All 32 matching dimensions
- Comparison matrix for each dimension
- Transferable skills rules and matrix
- Gap types with severity and compensability
- Risk types with detection and mitigation
- Opportunity types with identification and value
- 12 score types with calculation and interpretation
- Explainability structure with examples
- Complete output structure
- All consumers and their usage
- Boundary validation with all intelligences
- Performance optimization strategy
- Determinism guarantees
- Future integration points
- 10-phase implementation roadmap

**Status**: ✅ **VALIDATED** - Ready for implementation

**Next Step**: Begin implementation following the roadmap in Section 18.
