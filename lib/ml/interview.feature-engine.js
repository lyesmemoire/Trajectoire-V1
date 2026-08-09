/**
 * PURE FUNCTION: Transforms a session into ML features deterministically.
 * NO randomness. NO DB access.
 */
export function buildFeatures(session) {
    const isPremium = "transcript" in session;
    const elements = isPremium ? session.transcript.length : session.answers.length;
    // Deterministic mock generation based on session ID length and content length for now
    const seed = session.id.length + elements;
    const pseudoRandom = (offset) => ((seed * 1103515245 + offset * 12345) % 2147483648) / 2147483648;
    const latencies = Array.from({ length: Math.max(1, elements) }).map((_, i) => pseudoRandom(i) * 5000 + 1000);
    const lengths = Array.from({ length: Math.max(1, elements) }).map((_, i) => Math.floor(pseudoRandom(i + 10) * 150) + 20);
    const assertivenessCurve = Array.from({ length: Math.max(1, elements) }).map((_, i) => pseudoRandom(i + 20));
    return {
        sessionId: session.id,
        temporal: {
            responseLatency: latencies,
            answerLength: lengths,
            pauseRatio: pseudoRandom(1),
        },
        linguistic: {
            complexityScore: pseudoRandom(2) * 0.5 + 0.5,
            vocabularyRichness: pseudoRandom(3) * 0.5 + 0.5,
            repetitionRate: pseudoRandom(4) * 0.3,
        },
        behavioral: {
            hesitationIndex: pseudoRandom(5) * 0.4,
            confidenceDecay: pseudoRandom(6) * 0.2 - 0.1, // can be negative (improving)
            assertivenessCurve,
        }
    };
}
//# sourceMappingURL=interview.feature-engine.js.map