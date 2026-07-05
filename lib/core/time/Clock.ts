export class Clock {
  /**
   * Retourne l'heure courante. 
   * Peut être mocké dans les tests.
   */
  static now(): Date {
    return new Date();
  }
}
