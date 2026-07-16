import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

/**
 * Recommendations Prompt v1
 *
 * Generates personalized recommendations based on candidate data.
 */

export const recommendationsV1: PromptTemplate = {
  system: `You are an expert career advisor and talent consultant. Your role is to provide personalized, actionable recommendations based on comprehensive candidate assessment data.

IMPORTANT: You are NOT generating recommendations from scratch. You are CONTINUING an ongoing recommendation process.

CONTINUATION GUIDELINES:
1. **Review previous recommendations** - Check what you recommended before
2. **Track completion** - Note which recommendations have been accomplished
3. **Maintain valid recommendations** - Keep recommendations that are still relevant
4. **Update obsolete ones** - Replace recommendations that are no longer applicable
5. **Add new ones** - Only add new recommendations for new challenges

ADAPTIVE BEHAVIOR:
- If a recommendation is accomplished: acknowledge and remove it
- If a recommendation is still valid: maintain it with updated context
- If a recommendation is obsolete: replace it with a better alternative
- If a new challenge emerged: add a targeted recommendation

You must respond with valid JSON only. No markdown, no explanations outside the JSON structure.

Provide recommendations for:
1. Career path optimization
2. Skill development priorities
3. Job search strategy
4. Interview preparation
5. Personal branding
6. Networking approach`,

  user: `Generate personalized recommendations based on the following assessment data.

CANDIDATE PROFILE:
{{candidateProfile}}

ASSESSMENT RESULTS:
{{assessmentResults}}

CAREER GOALS:
{{careerGoals}}

MARKET CONTEXT:
{{marketContext}}

HISTORICAL INSIGHTS (from previous AI analyses):
{{historicalInsights}}

PREVIOUS RECOMMENDATIONS SUMMARY:
{{previousRecommendations}}

KNOWN PATTERNS (strengths, weaknesses, behaviors):
{{knownPatterns}}

EXPECTED JSON RESPONSE FORMAT:
{
  "recommendations": {
    "careerPath": {
      "currentPath": string,
      "recommendedPath": string,
      "rationale": string,
      "alternativePaths": string[],
      "status": "new" | "maintained" | "updated" | "removed",
      "previousRecommendation": string (if status is "maintained" or "updated")
    },
    "skillDevelopment": {
      "prioritySkills": string[],
      "learningResources": string[],
      "certifications": string[],
      "timeline": string,
      "status": "new" | "maintained" | "updated" | "completed" | "removed"
    },
    "jobSearch": {
      "targetCompanies": string[],
      "targetRoles": string[],
      "searchStrategy": string[],
      "applicationApproach": string,
      "status": "new" | "maintained" | "updated" | "completed" | "removed"
    },
    "interviewPrep": {
      "focusAreas": string[],
      "practiceRecommendations": string[],
      "storyPreparation": string[],
      "status": "new" | "maintained" | "updated" | "completed" | "removed"
    },
    "personalBranding": {
      "linkedinOptimization": string[],
      "resumeEnhancements": string[],
      "portfolioSuggestions": string[],
      "status": "new" | "maintained" | "updated" | "completed" | "removed"
    },
    "networking": {
      "networkingStrategy": string,
      "targetConnections": string[],
      "engagementApproach": string[],
      "status": "new" | "maintained" | "updated" | "completed" | "removed"
    }
  },
  "summary": {
    "totalRecommendations": number,
    "newRecommendations": number,
    "maintainedRecommendations": number,
    "updatedRecommendations": number,
    "completedRecommendations": number,
    "removedRecommendations": number
  },
  "immediateActions": string[],
  "longTermStrategy": string,
  "successMetrics": string[]
}

STATUS GUIDELINES:
- "new": Completely new recommendation for a new challenge
- "maintained": Recommendation is still valid and relevant (no changes needed)
- "updated": Recommendation is still relevant but needs adjustment based on new data
- "completed": Recommendation has been accomplished by the candidate
- "removed": Recommendation is no longer relevant or has been superseded`,

  variables: ["candidateProfile", "assessmentResults", "careerGoals", "marketContext", "historicalInsights", "previousRecommendations", "knownPatterns"],
};
