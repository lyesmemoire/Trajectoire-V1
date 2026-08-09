export class FraudTracker {
    history = new Map();
    append(userId, score) {
        const arr = this.history.get(userId) || [];
        arr.push({
            timestamp: Date.now(),
            riskScore: score,
        });
        this.history.set(userId, arr.slice(-20));
    }
    getTrend(userId) {
        const arr = this.history.get(userId) || [];
        if (arr.length < 2)
            return 0;
        const delta = arr[arr.length - 1].riskScore -
            arr[0].riskScore;
        return delta;
    }
}
//# sourceMappingURL=fraud-tracker.js.map