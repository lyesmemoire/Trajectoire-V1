/**
 * Moteur de mesure du "Time to Wow".
 * Calcule le temps nécessaire pour qu'un utilisateur ressente la valeur réelle.
 */
export declare const WowTracker: {
    start: () => void;
    trackWow: (type: "recruiter_doubt_revealed" | "cv_upload_completed" | "replay_opened" | "interview_started") => void;
    trackDropOff: (step: string) => void;
};
//# sourceMappingURL=time-to-wow.d.ts.map