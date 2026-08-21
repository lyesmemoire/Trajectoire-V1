export interface InterviewCandidateContext {
  cvId: string | null;
  fileName: string | null;
  cvText: string;
}

export interface InterviewJobContext {
  title: string;
  description: string;
  level: string;
  interviewType: string;
}

export interface InterviewMatchingContext {
  reportId: string | null;
  score: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

export interface InterviewHistoryContext {
  previousSessionCount: number;
  previousScores: number[];
  averageScore: number | null;
}

export interface UnifiedInterviewContext {
  version: 1;

  userId: string;
  sessionId: string;

  candidate: InterviewCandidateContext;
  job: InterviewJobContext;
  matching: InterviewMatchingContext;
  history: InterviewHistoryContext;

  priorities: string[];

  generatedAt: string;
}

interface SupabaseLike {
  from(table: string): any;
}

interface SessionRow {
  id: string;
  user_id: string;
  job_title?: string | null;
  job_description?: string | null;
  level?: string | null;
  interview_type?: string | null;
}

interface CvAnalysisRow {
  id: string;

  userId?: string | null;
  user_id?: string | null;

  fileName?: string | null;
  file_name?: string | null;

  originalText?: string | null;
  original_text?: string | null;

  optimizedText?: string | null;
  optimized_text?: string | null;

  cvData?: unknown;
  cv_data?: unknown;

  atsScoreBefore?: number | null;
  ats_score_before?: number | null;

  atsScoreAfter?: number | null;
  ats_score_after?: number | null;

  improvements?: unknown;
  keywords?: unknown;

  createdAt?: string | null;
  created_at?: string | null;
}

interface PreviousSessionRow {
  id: string;

  clarity_score?: number | null;
  confidence_score?: number | null;
  ownership_score?: number | null;
  specificity_score?: number | null;
  career_trajectory_score?: number | null;
}

const MAX_CV_CONTEXT_LENGTH = 12_000;
const MAX_JOB_CONTEXT_LENGTH = 12_000;
const MAX_SKILLS = 20;
const MAX_SUGGESTIONS = 8;
const MAX_PRIORITIES = 3;
function cleanText(
  value: string | null | undefined,
  maxLength: number,
): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function extractStrings(
  value: unknown,
  maxItems: number,
): string[] {
  const collected: string[] = [];

  const visit = (current: unknown): void => {
    if (collected.length >= maxItems) {
      return;
    }

    if (typeof current === "string") {
      const normalized = current.trim();

      if (normalized) {
        collected.push(normalized);
      }

      return;
    }

    if (Array.isArray(current)) {
      for (const item of current) {
        visit(item);

        if (collected.length >= maxItems) {
          break;
        }
      }

      return;
    }

    if (
      current &&
      typeof current === "object"
    ) {
      for (const item of Object.values(current)) {
        visit(item);

        if (collected.length >= maxItems) {
          break;
        }
      }
    }
  };

  visit(value);

  return Array.from(
    new Set(collected),
  ).slice(0, maxItems);
}

function calculateAverage(
  scores: number[],
): number | null {
  if (scores.length === 0) {
    return null;
  }

  const sum = scores.reduce(
    (total, score) => total + score,
    0,
  );

  return Math.round(
    (sum / scores.length) * 10,
  ) / 10;
}

function calculateSessionScore(
  row: PreviousSessionRow,
): number | null {
  const dimensions = [
    row.clarity_score,
    row.confidence_score,
    row.ownership_score,
    row.specificity_score,
    row.career_trajectory_score,
  ].filter(
    (value): value is number =>
      typeof value === "number" &&
      Number.isFinite(value),
  );

  if (dimensions.length === 0) {
    return null;
  }

  return calculateAverage(dimensions);
}

function getCvText(
  cv: CvAnalysisRow | null,
): string {
  if (!cv) {
    return "";
  }

  const originalText =
    cv.originalText ??
    cv.original_text ??
    "";

  const optimizedText =
    cv.optimizedText ??
    cv.optimized_text ??
    "";

  const preferredText =
    optimizedText.trim() ||
    originalText.trim();

  if (preferredText) {
    return cleanText(
      preferredText,
      MAX_CV_CONTEXT_LENGTH,
    );
  }

  if (cv.cvData || cv.cv_data) {
    try {
      return cleanText(
        JSON.stringify(
          cv.cvData ?? cv.cv_data,
        ),
        MAX_CV_CONTEXT_LENGTH,
      );
    } catch {
      return "";
    }
  }

  return "";
}

function getAtsScore(
  cv: CvAnalysisRow | null,
): number | null {
  if (!cv) {
    return null;
  }

  const after =
    cv.atsScoreAfter ??
    cv.ats_score_after;

  if (
    typeof after === "number" &&
    Number.isFinite(after)
  ) {
    return after;
  }

  const before =
    cv.atsScoreBefore ??
    cv.ats_score_before;

  if (
    typeof before === "number" &&
    Number.isFinite(before)
  ) {
    return before;
  }

  return null;
}

function buildPriorities(
  matching: InterviewMatchingContext,
): string[] {
  const priorities: string[] = [];

  for (const skill of matching.missingSkills) {
    if (priorities.length >= MAX_PRIORITIES) {
      break;
    }

    priorities.push(
      `Vérifier et approfondir : ${skill}`,
    );
  }

  for (const suggestion of matching.suggestions) {
    if (priorities.length >= MAX_PRIORITIES) {
      break;
    }

    if (!priorities.includes(suggestion)) {
      priorities.push(suggestion);
    }
  }

  if (priorities.length === 0) {
    priorities.push(
      "Évaluer la pertinence des réponses pour le poste.",
      "Évaluer la structure et la précision des exemples.",
      "Vérifier les compétences clés à travers des exemples concrets.",
    );
  }

  return priorities.slice(
    0,
    MAX_PRIORITIES,
  );
}
export class UnifiedInterviewContextService {
  constructor(
    private readonly supabase: SupabaseLike,
  ) {}

  async build(params: {
    userId: string;
    sessionId: string;
  }): Promise<UnifiedInterviewContext> {
    const {
      userId,
      sessionId,
    } = params;

    /*
     * ----------------------------------------------------------
     * SESSION
     * ----------------------------------------------------------
     *
     * La session est la source de vérité concernant :
     * - le poste ;
     * - la description ;
     * - le niveau ;
     * - le type d'entretien.
     */
    const {
      data: session,
      error: sessionError,
    } =
      await this.supabase
        .from("interview_sessions")
        .select(
          "id,user_id,job_title,job_description,level,interview_type",
        )
        .eq("id", sessionId)
        .eq("user_id", userId)
        .single();

    if (
      sessionError ||
      !session
    ) {
      throw new Error(
        "INTERVIEW_SESSION_NOT_FOUND",
      );
    }

    const sessionRow =
      session as SessionRow;

    /*
     * ----------------------------------------------------------
     * CV ANALYSIS
     * ----------------------------------------------------------
     *
     * Trajectoire ne possède pas de table "cvs".
     *
     * Le CV analysé est stocké dans CVAnalysis.
     * On récupère l'analyse la plus récente de l'utilisateur.
     *
     * CVAnalysis contient également :
     * - le texte original ;
     * - le texte optimisé ;
     * - les données structurées ;
     * - les scores ATS ;
     * - les améliorations ;
     * - les mots-clés.
     */
    const {
      data: cvRows,
      error: cvError,
    } =
      await this.supabase
        .from("CVAnalysis")
        .select(
          "id,userId,fileName,originalText,optimizedText,cvData,atsScoreBefore,atsScoreAfter,improvements,keywords,createdAt",
        )
        .eq("userId", userId)
        .order(
          "createdAt",
          {
            ascending: false,
          },
        )
        .limit(1);

    if (cvError) {
      console.warn(
        "[UnifiedInterviewContext] CVAnalysis lookup failed:",
        cvError,
      );
    }

    const cv =
      Array.isArray(cvRows) &&
      cvRows.length > 0
        ? (cvRows[0] as CvAnalysisRow)
        : null;

    /*
     * ----------------------------------------------------------
     * MATCHING / ATS
     * ----------------------------------------------------------
     *
     * Il n'existe pas de table ats_reports.
     *
     * Les informations ATS disponibles sont déjà contenues
     * dans CVAnalysis.
     *
     * Nous transformons donc CVAnalysis vers le contrat
     * InterviewMatchingContext.
     */
    const matchedSkills =
      extractStrings(
        cv?.keywords,
        MAX_SKILLS,
      );

    const suggestions =
      extractStrings(
        cv?.improvements,
        MAX_SUGGESTIONS,
      );

    /*
     * Les données actuelles ne possèdent pas encore une liste
     * fiable et dédiée de compétences manquantes.
     *
     * On ne doit surtout pas inventer cette information.
     * InterviewStrategy pourra exploiter les améliorations
     * comme priorités tant que le matching métier n'expose
     * pas explicitement missingSkills.
     */
    const missingSkills: string[] = [];

    const matching:
      InterviewMatchingContext = {
        reportId:
          cv?.id ?? null,

        score:
          getAtsScore(cv),

        matchedSkills,

        missingSkills,

        suggestions,
      };
    /*
     * ----------------------------------------------------------
     * HISTORIQUE DES ENTRETIENS
     * ----------------------------------------------------------
     *
     * On exploite les dimensions réellement présentes dans
     * interview_sessions plutôt qu'un champ "score" générique.
     */
    const {
      data: previousSessions,
      error: historyError,
    } =
      await this.supabase
        .from("interview_sessions")
        .select(
          "id,score,career_trajectory_score,feedback_json,created_at",
        )
        .eq(
          "user_id",
          userId,
        )
        .neq(
          "id",
          sessionId,
        )
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(10);

    if (historyError) {
      console.warn(
        "[UnifiedInterviewContext] History lookup failed:",
        historyError,
      );
    }

    const previousRows =
      Array.isArray(previousSessions)
        ? (
            previousSessions as
              PreviousSessionRow[]
          )
        : [];

    const previousScores =
      previousRows
        .map(
          calculateSessionScore,
        )
        .filter(
          (
            score,
          ): score is number =>
            typeof score === "number" &&
            Number.isFinite(score),
        );

    /*
     * ----------------------------------------------------------
     * CONTEXTE UNIFIÉ
     * ----------------------------------------------------------
     */
    const context:
      UnifiedInterviewContext = {
        version: 1,

        userId,
        sessionId,

        candidate: {
          cvId:
            cv?.id ?? null,

          fileName:
            cv?.fileName ??
            cv?.file_name ??
            null,

          cvText:
            getCvText(cv),
        },

        job: {
          title:
            cleanText(
              sessionRow.job_title,
              200,
            ),

          description:
            cleanText(
              sessionRow.job_description,
              MAX_JOB_CONTEXT_LENGTH,
            ),

          level:
            cleanText(
              sessionRow.level,
              100,
            ),

          interviewType:
            cleanText(
              sessionRow.interview_type,
              100,
            ),
        },

        matching,

        history: {
          previousSessionCount:
            previousRows.length,

          previousScores,

          averageScore:
            calculateAverage(
              previousScores,
            ),
        },

        priorities:
          buildPriorities(
            matching,
          ),

        generatedAt:
          new Date().toISOString(),
      };

    return context;
  }
}