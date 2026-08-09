export class InterviewEngine {
    state;
    constructor(mode, context) {
        const timeLimit = mode === "diagnostic" ? 10 * 60 * 1000 : 20 * 60 * 1000;
        this.state = {
            mode,
            context,
            currentPhase: "positionnement",
            questionIndex: 0,
            stressLevel: 0.2,
            startTime: Date.now(),
            timeLimit,
        };
    }
    getTimeRemaining() {
        return this.state.timeLimit - (Date.now() - this.state.startTime);
    }
    nextPhase() {
        const phaseOrderDiagnostic = [
            "positionnement",
            "impact",
            "contradiction",
            "pression",
        ];
        const phaseOrderSimulation = [
            "positionnement",
            "impact",
            "contradiction",
            "pression",
            "codir",
        ];
        const order = this.state.mode === "diagnostic"
            ? phaseOrderDiagnostic
            : phaseOrderSimulation;
        const currentIndex = order.indexOf(this.state.currentPhase);
        if (currentIndex < order.length - 1) {
            this.state.currentPhase = order[currentIndex + 1];
            this.state.stressLevel = Math.min(1, this.state.stressLevel + 0.2);
        }
    }
    registerAnswer(dominantPosture) {
        this.state.questionIndex++;
        if (dominantPosture) {
            this.state.dominantPosture = dominantPosture;
        }
    }
    shouldInterrupt() {
        return this.state.stressLevel > 0.7;
    }
    shouldEnd() {
        return this.getTimeRemaining() <= 0;
    }
}
//# sourceMappingURL=engine.js.map