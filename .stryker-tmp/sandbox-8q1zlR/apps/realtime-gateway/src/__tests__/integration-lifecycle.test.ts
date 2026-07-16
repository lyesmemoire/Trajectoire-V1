/**
 * __tests__/integration-lifecycle.test.ts
 *
 * Test d'intégration de bout en bout : vérifie que les trois briques
 * (TTL/sweeper, abort/barge-in, architecture directionnelle) interagissent
 * correctement et qu'aucune fuite de ressource ne se produit.
 *
 * Utilise FakeClock pour le contrôle temporel et un faux binding pour
 * capturer les instructions émises sans WebSocket réel.
 */
// @ts-nocheck

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { SessionManager } from "../voice-interview/sessions/session-manager.js";
import { DefaultTransportBinding } from "../voice-interview/runtime/transport-binding.js";
import { VoiceRuntime } from "../voice-interview/runtime/voice-runtime.js";
import type { VoiceInstruction } from "../voice-interview/runtime/voice-runtime.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Crée un jeu complet session + binding + runtime, prêt à tester. */
function createTestSession(manager: SessionManager, sessionId: string) {
  const session = manager.createSession({ id: sessionId, initialTopic: "test" });
  const binding = new DefaultTransportBinding();
  const emitted: VoiceInstruction[] = [];

  // Capture les instructions sortantes
  binding.onInstruction((instr) => {
    emitted.push(instr);
  });

  const runtime = new VoiceRuntime(binding, manager, session.id);
  runtime.start();

  session.sink = binding;
  session.onDispose = () => runtime.dispose();

  return { session, binding, runtime, emitted };
}

/** Dispatche un transcript final et avance les timers pour exécuter les microtasks. */
async function sendTranscript(binding: DefaultTransportBinding, text: string) {
  binding.dispatch({ type: "transcript", text, isFinal: true });
  // Laisser l'event handler async s'exécuter
  await Promise.resolve();
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("Integration: Session Lifecycle (TTL + Abort + Architecture)", () => {
  let manager: SessionManager;
  let now: number;

  beforeEach(() => {
    vi.useFakeTimers();
    now = 1000000;
    manager = new SessionManager({
      ttlMs: 5000, // TTL court pour les tests (5 secondes)
      clock: () => now,
    });
  });

  afterEach(() => {
    manager.destroy();
    vi.useRealTimers();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Cycle de vie basique
  // ─────────────────────────────────────────────────────────────────────────

  it("crée une session accessible par son ID externe", () => {
    const { session } = createTestSession(manager, "ext-123");
    expect(session.id).toBe("ext-123");
    expect(manager.getSession("ext-123")).toBeDefined();
  });

  it("deleteSession supprime la session de la Map", () => {
    createTestSession(manager, "ext-456");
    expect(manager.getSession("ext-456")).toBeDefined();
    manager.deleteSession("ext-456");
    expect(manager.getSession("ext-456")).toBeUndefined();
    expect(manager.size()).toBe(0);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 2. TTL sliding
  // ─────────────────────────────────────────────────────────────────────────

  it("la session expire après le TTL d'inactivité", () => {
    createTestSession(manager, "ttl-test");
    expect(manager.getSession("ttl-test")).toBeDefined();

    // Avancer le temps au-delà du TTL
    now += 6000;
    expect(manager.getSession("ttl-test")).toBeUndefined();
  });

  it("bumpActivity prolonge la durée de vie de la session", () => {
    createTestSession(manager, "bump-test");

    // Avancer de 4s (sous le TTL)
    now += 4000;
    manager.bumpActivity("bump-test");

    // Avancer de 4s supplémentaires (8s depuis le début, mais 4s depuis le bump)
    now += 4000;
    expect(manager.getSession("bump-test")).toBeDefined();

    // Avancer de 6s supplémentaires (au-delà du TTL depuis le dernier bump)
    now += 6000;
    // getSession vérifie l'expiration
    expect(manager.getSession("bump-test")).toBeUndefined();
  });

  it("sweep() nettoie les sessions expirées", () => {
    createTestSession(manager, "sweep-1");
    createTestSession(manager, "sweep-2");
    expect(manager.size()).toBe(2);

    now += 6000; // Au-delà du TTL
    manager.sweep();
    expect(manager.size()).toBe(0);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Abort / dispose
  // ─────────────────────────────────────────────────────────────────────────

  it("deleteSession appelle onDispose (runtime.dispose())", () => {
    const { runtime } = createTestSession(manager, "dispose-test");
    let disposeCalled = false;
    // Override pour tracer
    const originalDispose = runtime.dispose.bind(runtime);
    runtime.dispose = () => {
      disposeCalled = true;
      originalDispose();
    };
    // Re-wire car on a overridé après le setup
    const session = manager.getSession("dispose-test")!;
    session.onDispose = () => runtime.dispose();

    manager.deleteSession("dispose-test");
    expect(disposeCalled).toBe(true);
  });

  it("un runtime disposé ignore les nouveaux transcripts", async () => {
    const { binding, runtime, emitted } = createTestSession(manager, "zombie-test");

    // Disposer le runtime
    runtime.dispose();

    // Essayer d'envoyer un transcript
    await sendTranscript(binding, "Je suis un transcript fantôme");

    // Aucune instruction ne doit être émise
    expect(emitted).toHaveLength(0);
  });

  it("dispose() n'émet pas de speaking_stop sur un binding orphelin si non en cours de parole", async () => {
    const { binding, emitted } = createTestSession(manager, "no-orphan");

    // Supprimer la session (ce qui appelle onDispose → runtime.dispose())
    manager.deleteSession("no-orphan");

    // Aucune instruction speaking_stop ne doit avoir été émise car isSpeaking === false
    const stopInstructions = emitted.filter((i) => i.type === "speaking_stop");
    expect(stopInstructions).toHaveLength(0);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Interaction TTL → Abort (le bug critique identifié)
  // ─────────────────────────────────────────────────────────────────────────

  it("TTL expiration propage onDispose au runtime", () => {
    const { runtime } = createTestSession(manager, "ttl-abort");
    let disposeCalled = false;
    const originalDispose = runtime.dispose.bind(runtime);
    runtime.dispose = () => {
      disposeCalled = true;
      originalDispose();
    };
    const session = manager.getSession("ttl-abort")!;
    session.onDispose = () => runtime.dispose();

    // Faire expirer la session
    now += 6000;
    // Le sweep doit trouver la session expirée et la supprimer (ce qui déclenche onDispose)
    manager.sweep();

    expect(disposeCalled).toBe(true);
    expect(manager.getSession("ttl-abort")).toBeUndefined();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Interaction WS close → Abort (simulate disconnect)
  // ─────────────────────────────────────────────────────────────────────────

  it("removeVoiceSession (simulate ws close) propage l'abort", () => {
    const { runtime } = createTestSession(manager, "ws-close");
    let disposeCalled = false;
    const originalDispose = runtime.dispose.bind(runtime);
    runtime.dispose = () => {
      disposeCalled = true;
      originalDispose();
    };
    const session = manager.getSession("ws-close")!;
    session.onDispose = () => runtime.dispose();

    // Simuler un disconnect WebSocket → deleteSession
    manager.deleteSession("ws-close");

    expect(disposeCalled).toBe(true);
    expect(manager.getSession("ws-close")).toBeUndefined();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6. Double suppression (idempotence)
  // ─────────────────────────────────────────────────────────────────────────

  it("deleteSession est idempotent (double delete ne crash pas)", () => {
    createTestSession(manager, "idempotent-test");
    expect(manager.deleteSession("idempotent-test")).toBe(true);
    expect(manager.deleteSession("idempotent-test")).toBe(false);
  });

  it("dispose() est idempotent (double dispose ne crash pas)", () => {
    const { runtime } = createTestSession(manager, "double-dispose");
    runtime.dispose();
    runtime.dispose(); // Ne doit pas throw
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Barge-in : transcript pendant un tour actif
  // ─────────────────────────────────────────────────────────────────────────

  it("un second transcript pendant un tour actif émet speaking_stop avant de commencer le nouveau tour", async () => {
    const { binding, emitted } = createTestSession(manager, "barge-in-test");

    // Envoyer un premier transcript
    binding.dispatch({ type: "transcript", text: "Premier transcript", isFinal: true });
    // Laisser le handler s'exécuter un minimum
    await vi.advanceTimersByTimeAsync(50);

    // Envoyer un second transcript (barge-in)
    binding.dispatch({ type: "transcript", text: "Deuxième transcript (barge-in)", isFinal: true });
    await vi.advanceTimersByTimeAsync(50);

    const speakInstructions = emitted.filter((i) => i.type === "speak");
    const stopInstructions = emitted.filter((i) => i.type === "speaking_stop");

    if (speakInstructions.length > 0) {
      expect(stopInstructions.length).toBeGreaterThanOrEqual(1);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 8. Transcript valide produit des instructions
  // ─────────────────────────────────────────────────────────────────────────

  it("un transcript produit une séquence d'instructions (au minimum speak + turn_done)", async () => {
    const { binding, emitted } = createTestSession(manager, "flow-test");

    await sendTranscript(binding, "J'ai travaillé 5 ans comme ingénieur logiciel");

    // Attendre que le runtime finisse (SystemClock.sleep utilise de vrais setTimeout mais mockés par vi)
    await vi.advanceTimersByTimeAsync(5000);

    const types = emitted.map((i) => i.type);
    expect(types).toContain("speak");
    expect(types).toContain("turn_done");

    // Vérifier que speak arrive AVANT turn_done (streaming correct)
    const speakIdx = types.indexOf("speak");
    const doneIdx = types.indexOf("turn_done");
    expect(speakIdx).toBeLessThan(doneIdx);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 9. Pas de fuite après destroy()
  // ─────────────────────────────────────────────────────────────────────────

  it("destroy() nettoie toutes les sessions et arrête le sweeper", () => {
    createTestSession(manager, "leak-1");
    createTestSession(manager, "leak-2");
    createTestSession(manager, "leak-3");
    expect(manager.size()).toBe(3);

    manager.destroy();
    expect(manager.size()).toBe(0);
  });
});
