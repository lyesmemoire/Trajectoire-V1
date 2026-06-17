// tests/runtime/kernel/mutationResistance.test.ts

import { deepFreeze } from "../../../src/interview/runtime/utils/deepFreeze";

/**
 * Ensures that after a reducer execution, the resulting state is deeply frozen
 * and any attempted mutation throws in strict mode.
 */

test("mutationResistance.test.ts: state remains frozen after reducer", () => {
  const initialState = { count: 0, nested: { flag: true } };
  const frozenState = deepFreeze(initialState);
  // Simulate reducer that returns new state (immutable pattern)
  const newState = { ...frozenState, count: frozenState.count + 1 };
  const finalState = deepFreeze(newState);
  // Verify deep freeze applied
  expect(Object.isFrozen(finalState)).toBe(true);
  expect(Object.isFrozen(finalState.nested)).toBe(true);
  // Attempt mutation should not affect frozen object
  // @ts-ignore
  finalState.count = 999;
  expect(finalState.count).toBe(1);
});
