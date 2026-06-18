/**
 * Tests P4.2 — Runtime Voice Binding Layer.
 * Déterminisme (seed+Clock), réalisation bornée, transport bête.
 */
import { describe, it, expect } from "vitest";
import type { PerceptionUX } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/perception-ux";
import {
  FakeClock,
  SeededRng,
  buildTurnPlan,
  estimateSpeakMs,
  runVoiceTurn,
  bindAndPlay,
  type VoiceSink,
} from "@/apps/realtime-gateway/src/voice-interview/runtime/index";
import type { TTSAdapter } from "@/apps/realtime-gateway/src/voice-interview/adapters/tts/types";

function ux(p: Partial<PerceptionUX> = {}): PerceptionUX {
  return {
    delayBeforeReplyMs: 800,
    silenceProbability: 0.2,
    interruptionChance: 0.1,
    toneShift: 0,
    questionSharpness: 0.3,
    speechRate: 1,
    emotion: "neutral",
    ...p,
  };
}

const mockTTS: TTSAdapter = {
  isConfigured: () => true,
  synthesize: async (text: string) =>
    new Uint8Array(Math.max(1, text.length)).buffer,
};

/**
 * Pilote un runVoiceTurn avec une FakeClock : on cède la main (microtask) entre
 * chaque pas de temps pour laisser les sleeps s'enregistrer avant de les résoudre.
 */
async function drive<T>(promise: Promise<T>, clock: FakeClock, stepMs = 200): Promise<T> {
  let done = false;
  promise.finally(() => {
    done = true;
  });
  for (let i = 0; i < 200 && !done; i++) {
    await Promise.resolve(); // laisse runVoiceTurn atteindre son prochain await
    clock.advance(stepMs);
  }
  return promise;
}

describe("P4.2 — déterminisme", () => {
  it("même seed → même plan", () => {
    const u = ux({ silenceProbability: 0.5, interruptionChance: 0.5 });
    const a = buildTurnPlan(u, "Bonjour, parlez-moi de vous.", new SeededRng(42));
    const b = buildTurnPlan(u, "Bonjour, parlez-moi de vous.", new SeededRng(42));
    expect(a).toEqual(b);
  });

  it("sur 100 seeds avec p=0.5, les deux issues apparaissent", () => {
    const u = ux({ silenceProbability: 0.5 });
    const results = new Set<boolean>();
    for (let s = 0; s < 100; s++) {
      results.add(buildTurnPlan(u, "x", new SeededRng(s)).emphaticSilence);
    }
    expect(results.has(true)).toBe(true);
    expect(results.has(false)).toBe(true);
  });
});

describe("P4.2 — réalisation bornée", () => {
  it("estimateSpeakMs : débit module la durée + plancher", () => {
    const slow = estimateSpeakMs("phrase de test", 0.85);
    const fast = estimateSpeakMs("phrase de test", 1.2);
    expect(fast).toBeLessThan(slow);
    expect(estimateSpeakMs("", 1)).toBeGreaterThanOrEqual(400);
  });

  it("totalLeadMs = délai + silence appuyé si tiré", () => {
    const u = ux({ delayBeforeReplyMs: 600, silenceProbability: 1 });
    const plan = buildTurnPlan(u, "ok", new SeededRng(1));
    expect(plan.emphaticSilence).toBe(true);
    expect(plan.totalLeadMs).toBe(600 + 700);
  });

  it("silenceProbability=0 → jamais de silence", () => {
    for (let s = 0; s < 50; s++) {
      const plan = buildTurnPlan(ux({ silenceProbability: 0 }), "x", new SeededRng(s));
      expect(plan.emphaticSilence).toBe(false);
    }
  });
});

describe("P4.2 — runtime + Clock virtuelle", () => {
  it("runVoiceTurn fait avancer le temps de façon cohérente", async () => {
    const clock = new FakeClock(0);
    const rng = new SeededRng(7);
    const u = ux({ delayBeforeReplyMs: 500, silenceProbability: 0, interruptionChance: 0 });
    const result = await drive(
      runVoiceTurn({ ux: u, replyText: "Une question.", clock, rng }),
      clock,
    );
    expect(result.totalLatencyMs).toBeGreaterThanOrEqual(500);
    const types = result.instructions.map((i) => i.type);
    expect(types).toContain("speak");
    expect(types[types.length - 1]).toBe("turn_done");
  });
});

describe("P4.2 — transport bête (bindAndPlay)", () => {
  it("traduit instructions → events + audio sans rien décider", async () => {
    const signals: Array<{ type: string; [k: string]: unknown }> = [];
    let audioCount = 0;
    const sink: VoiceSink = {
      sendAudio: () => {
        audioCount++;
      },
      sendSignal: (s) => signals.push(s),
    };
    const clock = new FakeClock(0);
    const rng = new SeededRng(3);
    const u = ux({ delayBeforeReplyMs: 300, silenceProbability: 1, interruptionChance: 0 });
    const { instructions } = await drive(
      runVoiceTurn({ ux: u, replyText: "Détaillez.", clock, rng }),
      clock,
    );
    await bindAndPlay(instructions, mockTTS, sink);
    expect(audioCount).toBe(1);
    expect(signals.some((s) => s.type === "speaking_start")).toBe(true);
    expect(signals.some((s) => s.type === "turn_done")).toBe(true);
  });
});

import { createWsVoiceSink } from "@/apps/realtime-gateway/src/voice-interview/runtime/voice-sink-ws";

describe("P4.2 — pont WS additif (createWsVoiceSink)", () => {
  it("sérialise events runtime en messages sim_* sans rien décider", async () => {
    const jsonMsgs: Array<{ type: string; [k: string]: unknown }> = [];
    let audioSent = 0;
    const sink = createWsVoiceSink({
      sendJson: (m) => jsonMsgs.push(m),
      sendAudio: () => {
        audioSent++;
      },
    });

    const clock = new FakeClock(0);
    const rng = new SeededRng(11);
    const u = ux({ delayBeforeReplyMs: 400, silenceProbability: 1, interruptionChance: 0 });
    const { instructions } = await drive(
      runVoiceTurn({ ux: u, replyText: "Pourquoi ce poste ?", clock, rng }),
      clock,
    );
    await bindAndPlay(instructions, mockTTS, sink);

    const types = jsonMsgs.map((m) => m.type);
    expect(types).toContain("sim_thinking");
    expect(types).toContain("sim_silence");
    expect(types).toContain("sim_speaking_start");
    expect(types).toContain("sim_turn_done");
    expect(audioSent).toBe(1);
  });
});
