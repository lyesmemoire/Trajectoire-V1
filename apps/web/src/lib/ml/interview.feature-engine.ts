import { StandardInterviewSession } from "@/domain/interview.contract";

export interface InterviewFeatures {
  sessionId: string;

  temporal: {
    responseLatency: number[];
    answerLength: number[];
    pauseRatio: number;
  };

  linguistic: {
    complexityScore: number;
    vocabularyRichness: number;
    repetitionRate: number;
  };

  behavioral: {
    hesitationIndex: number;
    confidenceDecay: number;
    assertivenessCurve: number[];
  };
}

/**
 * PURE FUNCTION: Transforms a session into ML features deterministically.
 * Extracts real features from session data (answers/transcript).
 * NO randomness. NO DB access.
 */
export function buildFeatures(session: StandardInterviewSession | any): InterviewFeatures {
  const isPremium = "transcript" in session;
  
  // Extract text content from session
  let answers: string[] = [];
  let timestamps: number[] = [];
  
  if (isPremium) {
    const transcript = (session as any).transcript || [];
    answers = transcript
      .filter((t: any) => t.role === "candidate" || t.role === "user")
      .map((t: any) => t.content || "");
    timestamps = transcript
      .filter((t: any) => t.role === "candidate" || t.role === "user")
      .map((t: any) => t.timestamp || Date.now());
  } else {
    answers = (session as StandardInterviewSession).answers || [];
    // For standard sessions, we don't have timestamps, so we estimate
    timestamps = answers.map((_, i) => Date.now() - (answers.length - i) * 60000);
  }

  // Ensure we have at least one element
  if (answers.length === 0) {
    answers = [""];
    timestamps = [Date.now()];
  }

  // Extract real temporal features
  const answerLength = answers.map(a => a.length);
  const responseLatency = calculateResponseLatency(timestamps);
  const pauseRatio = calculatePauseRatio(answers);

  // Extract real linguistic features
  const linguisticFeatures = extractLinguisticFeatures(answers);

  // Extract real behavioral features
  const behavioralFeatures = extractBehavioralFeatures(answers, answerLength);

  return {
    sessionId: session.id,
    temporal: {
      responseLatency,
      answerLength,
      pauseRatio,
    },
    linguistic: linguisticFeatures,
    behavioral: behavioralFeatures,
  };
}

/**
 * Calculate response latency between consecutive answers
 */
function calculateResponseLatency(timestamps: number[]): number[] {
  if (timestamps.length <= 1) {
    return [2000]; // Default 2 seconds for single answer
  }

  const latencies: number[] = [];
  for (let i = 1; i < timestamps.length; i++) {
    const diff = timestamps[i] - timestamps[i - 1];
    // Clamp to reasonable range (500ms to 30 seconds)
    latencies.push(Math.max(500, Math.min(30000, diff)));
  }
  
  // Add estimated latency for first answer
  latencies.unshift(2000);
  
  return latencies;
}

/**
 * Calculate pause ratio (silence / total time) in answers
 */
function calculatePauseRatio(answers: string[]): number {
  if (answers.length === 0) return 0;

  let totalPauseChars = 0;
  let totalChars = 0;

  answers.forEach(answer => {
    const chars = answer.length;
    totalChars += chars;
    // Count pauses indicated by ellipsis, periods, commas
    const pauseMarkers = (answer.match(/[.,;]/g) || []).length;
    totalPauseChars += pauseMarkers * 3; // Estimate 3 chars per pause
  });

  if (totalChars === 0) return 0;
  return Math.min(1, totalPauseChars / totalChars);
}

/**
 * Extract linguistic features from answers
 */
function extractLinguisticFeatures(answers: string[]): {
  complexityScore: number;
  vocabularyRichness: number;
  repetitionRate: number;
} {
  if (answers.length === 0) {
    return { complexityScore: 0.5, vocabularyRichness: 0.5, repetitionRate: 0 };
  }

  const allText = answers.join(" ");
  const words = allText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const uniqueWords = new Set(words);

  // Vocabulary richness: unique words / total words
  const vocabularyRichness = words.length > 0 
    ? Math.min(1, uniqueWords.size / words.length)
    : 0.5;

  // Complexity score: based on average word length and sentence structure
  const avgWordLength = words.length > 0
    ? words.reduce((sum, w) => sum + w.length, 0) / words.length
    : 0;
  const complexityScore = Math.min(1, avgWordLength / 8); // Normalize against 8 char average

  // Repetition rate: count repeated words
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });
  
  let repeatedCount = 0;
  wordCounts.forEach(count => {
    if (count > 2) repeatedCount += count - 2;
  });
  
  const repetitionRate = words.length > 0
    ? Math.min(1, repeatedCount / words.length)
    : 0;

  return {
    complexityScore: Math.max(0.1, complexityScore),
    vocabularyRichness: Math.max(0.1, vocabularyRichness),
    repetitionRate,
  };
}

/**
 * Extract behavioral features from answers
 */
function extractBehavioralFeatures(
  answers: string[],
  answerLength: number[]
): {
  hesitationIndex: number;
  confidenceDecay: number;
  assertivenessCurve: number[];
} {
  if (answers.length === 0) {
    return {
      hesitationIndex: 0.2,
      confidenceDecay: 0,
      assertivenessCurve: [0.5],
    };
  }

  // Hesitation index: based on filler words and short responses
  const fillerWords = ["um", "uh", "like", "you know", "sort of", "kind of", "euh", "bon", "en fait"];
  let hesitationCount = 0;
  let totalWords = 0;

  answers.forEach(answer => {
    const words = answer.toLowerCase().split(/\s+/);
    totalWords += words.length;
    fillerWords.forEach(filler => {
      if (answer.toLowerCase().includes(filler)) {
        hesitationCount++;
      }
    });
  });

  const hesitationIndex = totalWords > 0
    ? Math.min(1, hesitationCount / totalWords * 10) // Amplify for visibility
    : 0.2;

  // Confidence decay: trend in answer length over time
  const confidenceDecay = calculateTrend(answerLength);

  // Assertiveness curve: based on answer length and linguistic markers
  const assertivenessCurve = answerLength.map((length, index) => {
    const normalizedLength = Math.min(1, length / 200); // Normalize against 200 chars
    const positionFactor = 1 - (index / answerLength.length) * 0.3; // Slight decay over time
    return Math.max(0.1, Math.min(1, normalizedLength * positionFactor));
  });

  return {
    hesitationIndex,
    confidenceDecay,
    assertivenessCurve,
  };
}

/**
 * Calculate trend (positive = improving, negative = decaying)
 */
function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;

  const n = values.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Normalize slope to -1 to 1 range
  const avgValue = sumY / n;
  if (avgValue === 0) return 0;
  
  return Math.max(-1, Math.min(1, slope / avgValue));
}
