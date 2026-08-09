const RECRUITER_SIGNALS = [
    {
        pattern: "fast-paced",
        mappedTrait: "Ambuiguity Tolerance & Speed",
        impact: "high",
    },
    { pattern: "agile", mappedTrait: "Adaptability", impact: "medium" },
    { pattern: "ownership", mappedTrait: "Proactivity", impact: "high" },
    { pattern: "start-up", mappedTrait: "Resourcefulness", impact: "high" },
    {
        pattern: "stakeholder management",
        mappedTrait: "Leadership & Communication",
        impact: "high",
    },
];
/**
 * Detects implicit recruiter needs from a job description.
 */
export function detectRecruiterSignals(jobDescription) {
    const lowerDesc = jobDescription.toLowerCase();
    return RECRUITER_SIGNALS.filter((signal) => lowerDesc.includes(signal.pattern.toLowerCase())).map((signal) => signal.mappedTrait);
}
//# sourceMappingURL=detector.js.map