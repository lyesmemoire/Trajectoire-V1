/**
 * Invariant: LamportClock.value is strictly monotonic within a world.
 * If event A causally precedes event B, then timestamp(A) < timestamp(B).
 */
export class LamportClock {
  private value = 0;

  // À appeler avant l'exécution logique métier, ou juste avant un envoi réseau
  tick(): number {
    this.value += 1;
    return this.value;
  }

  // À appeler lors de la réception d'un message réseau
  // Ne doit PAS appeler tick() séparément. La formule Math.max + 1 garantit la stricte monotonicité.
  update(received: number): number {
    this.value = Math.max(this.value, received) + 1;
    return this.value;
  }

  get(): number {
    return this.value;
  }

  set(v: number): void {
    this.value = v;
  }
}
