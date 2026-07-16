// @ts-nocheck
export interface FraudTrajectoryPoint {
  timestamp: number
  riskScore: number
}

export class FraudTracker {
  private history = new Map<string, FraudTrajectoryPoint[]>()

  append(userId: string, score: number) {
    const arr = this.history.get(userId) || []

    arr.push({
      timestamp: Date.now(),
      riskScore: score,
    })

    this.history.set(userId, arr.slice(-20))
  }

  getTrend(userId: string) {
    const arr = this.history.get(userId) || []

    if (arr.length < 2) return 0

    const delta =
      arr[arr.length - 1]!.riskScore -
      arr[0]!.riskScore

    return delta
  }
}
