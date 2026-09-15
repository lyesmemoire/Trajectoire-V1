import { describe, it, expect } from "vitest";
import { OralPerformanceService } from "../OralPerformanceService";

describe("OralPerformanceService", () => {
  it("1. réponse texte -> aucune OralPerformance (null)", () => {
    const result = OralPerformanceService.analyze("Voici ma réponse sans durée");
    expect(result).toBeNull();
  });

  it("2. réponse vocale 120 mots / 60 sec -> ~120 WPM", () => {
    const words = Array(120).fill("mot").join(" ");
    const result = OralPerformanceService.analyze(words, 60000);
    expect(result).not.toBeNull();
    expect(result?.wordCount).toBe(120);
    expect(result?.wordsPerMinute).toBe(120);
  });

  it("3. réponse avec plusieurs 'euh' -> fillers détectés", () => {
    const text = "euh je pense que euhm c'est une bonne idée hum";
    const result = OralPerformanceService.analyze(text, 10000);
    expect(result?.fillerWords.total).toBe(3);
    expect(result?.fillerWords.detected).toEqual(expect.arrayContaining(["euh", "euhm", "hum"]));
  });

  it("4. occurrence légitime isolée (pas de highFillerRate abusif)", () => {
    const text = "voilà mon approche pour ce projet " + Array(90).fill("test").join(" ");
    const result = OralPerformanceService.analyze(text, 30000);
    expect(result?.fillerWords.total).toBe(1); // 'voilà'
    expect(result?.flags.highFillerRate).toBe(false); // 1 / 95 mots < 5%
  });

  it("5. durée nulle/invalide -> null (pas Infinity / NaN)", () => {
    const resultZero = OralPerformanceService.analyze("test", 0);
    const resultNeg = OralPerformanceService.analyze("test", -100);
    expect(resultZero).toBeNull();
    expect(resultNeg).toBeNull();
  });

  it("6. transcript vide -> comportement safe (null)", () => {
    const result = OralPerformanceService.analyze("   ", 5000);
    expect(result).toBeNull();
  });

  it("high filler rate flag is correctly set", () => {
    const text = "euh bah du coup je euh fait hum";
    const result = OralPerformanceService.analyze(text, 10000);
    expect(result?.flags.highFillerRate).toBe(true);
  });

  describe("aggregateSummary", () => {
    it("7. plusieurs réponses vocales -> OralSummary correct", () => {
      const perf1 = OralPerformanceService.analyze(Array(60).fill("mot").join(" "), 30000); // 120 WPM
      const perf2 = OralPerformanceService.analyze(Array(100).fill("test").join(" ") + " euh euh", 60000); // ~100 WPM

      const summary = OralPerformanceService.aggregateSummary([perf1, perf2]);

      expect(summary?.analyzedResponses).toBe(2);
      expect(summary?.averageWordsPerMinute).toBe(111); // (120 + 102) / 2 = 111
      expect(summary?.totalFillerWords).toBe(2);
      expect(summary?.fillerRatePer100Words).toBe(1.2); // 2 fillers / 162 words = 1.2%
    });

    it("8. mélange texte + vocal -> seules les vocales sont agrégées", () => {
      const perfText = OralPerformanceService.analyze("Texte seulement"); // null
      const perfVoice = OralPerformanceService.analyze(Array(120).fill("mot").join(" "), 60000); // 120 WPM

      const summary = OralPerformanceService.aggregateSummary([perfText, perfVoice]);

      expect(summary?.analyzedResponses).toBe(1);
      expect(summary?.averageWordsPerMinute).toBe(120);
    });

    it("9. valeurs manquantes -> undefined (plutôt qu'invention)", () => {
      const summary = OralPerformanceService.aggregateSummary([null, undefined]);
      expect(summary).toBeUndefined();
    });
  });

  describe("VOICE → TEXT → VOICE — no stale durationMs reuse", () => {
    it("tour vocal, tour texte, tour vocal : seuls les 2 tours vocaux produisent oralPerformance", () => {
      const dur1 = 45000; // tour 1 : 45s de parole
      const dur3 = 80000; // tour 3 : 80s de parole

      // Simule ce que ConversationService reçoit pour chaque tour
      const turn1 = OralPerformanceService.analyze(Array(90).fill("mot").join(" "), dur1);
      const turn2 = OralPerformanceService.analyze("Réponse tapée au clavier"); // text → pas de durationMs
      const turn3 = OralPerformanceService.analyze(Array(160).fill("test").join(" "), dur3);

      // Tour 1 vocal : oralPerformance non null, durationMs correct
      expect(turn1).not.toBeNull();
      expect(turn1?.durationMs).toBe(dur1);

      // Tour 2 texte : strictement null
      expect(turn2).toBeNull();

      // Tour 3 vocal : oralPerformance non null, durationMs propre (≠ dur1)
      expect(turn3).not.toBeNull();
      expect(turn3?.durationMs).toBe(dur3);
      expect(turn3?.durationMs).not.toBe(turn1?.durationMs);
    });

    it("durationMs undefined produit oralPerformance null (stale guard)", () => {
      // Simule un tour où le hook a reset metricsRef (erreur micro ou abort)
      // → durationMs non transmis → oralPerformance null, pas d'invention
      const result = OralPerformanceService.analyze("J'ai dit quelque chose", undefined);
      expect(result).toBeNull();
    });
  });
});
