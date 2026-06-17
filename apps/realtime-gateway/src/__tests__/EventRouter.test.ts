import { EventRouter } from "../interview/runtime/fsm/utils/EventRouter";

describe("EventRouter", () => {
  const validPayload = {
    eventId: "test-123",
    sessionId: "sess-abc",
    timestamp: 1600000000000,
    sequence: 1,
    source: "client",
    type: "ANSWER_RECEIVED",
    payload: {
      questionId: "q1",
      answer: "yes",
    },
    optionalField: undefined, // Should be stripped
  };

  test("should parse and validate valid event", () => {
    const routed = EventRouter.route(validPayload);
    
    expect(routed.eventId).toBe("test-123");
    expect(routed.type).toBe("ANSWER_RECEIVED");
    // @ts-expect-error
    expect(routed.payload.questionId).toBe("q1");
  });

  test("should throw on invalid payload (missing sequence)", () => {
    const invalidPayload = { ...validPayload };
    // @ts-expect-error
    delete invalidPayload.sequence;

    expect(() => {
      EventRouter.route(invalidPayload);
    }).toThrow();
  });

  test("should strip undefined values for canonicalization", () => {
    const routed = EventRouter.route(validPayload);
    expect(routed).not.toHaveProperty("optionalField");
  });

  test("should deep freeze the output event", () => {
    const routed = EventRouter.route(validPayload);

    expect(() => {
      // @ts-expect-error
      routed.timestamp = 999;
    }).toThrow(TypeError);

    expect(() => {
      // @ts-expect-error
      routed.payload.answer = "no";
    }).toThrow(TypeError);
  });
});
