import * as arena from "@trajectoire/arena-engine";

export type ArenaInput = {
  userId: string;
  payload: unknown;
};

export async function runScoring(input: ArenaInput) {
  if (!arena?.scoring) {
    throw new Error("Arena engine not available");
  }

  return arena.scoring.execute(input);
}
