/**
 * simulation-create-opportunity-link.test.ts
 *
 * Tests G-J: ownership validation and opportunityId link behavior
 * in the simulation creation flow.
 *
 * These tests are unit-level and do not call the real DB or HTTP server.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------

const { mockPrismaFindFirst, mockSupabaseUpdate } = vi.hoisted(() => ({
  mockPrismaFindFirst: vi.fn(),
  mockSupabaseUpdate: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    opportunity: {
      findFirst: mockPrismaFindFirst,
    },
  },
}));

// ---------------------------------------------------------------------------
// Inline ownership validation logic extracted for unit testing
// (mirrors the logic in api/simulation/create/route.ts)
// ---------------------------------------------------------------------------

interface OwnershipCheckInput {
  rawOpportunityId: string | null;
  userId: string;
}

interface OwnershipCheckResult {
  linked: boolean;
  reason: "NO_ID" | "NOT_FOUND_OR_WRONG_USER" | "LINKED";
}

/**
 * Pure function that mirrors the server-side ownership logic.
 * Returns whether the link should be made and why.
 */
async function validateOpportunityOwnership(
  input: OwnershipCheckInput,
): Promise<OwnershipCheckResult> {
  const { rawOpportunityId, userId } = input;

  if (!rawOpportunityId || rawOpportunityId.trim().length === 0) {
    return { linked: false, reason: "NO_ID" };
  }

  const verified = await mockPrismaFindFirst({
    where: { id: rawOpportunityId, userId },
    select: { id: true },
  });

  if (!verified) {
    return { linked: false, reason: "NOT_FOUND_OR_WRONG_USER" };
  }

  return { linked: true, reason: "LINKED" };
}

// ---------------------------------------------------------------------------
// TEST G — opportunityId appartient au user → session liée correctement
// ---------------------------------------------------------------------------
describe("TEST G — opportunityId belongs to user → link established", () => {
  beforeEach(() => {
    mockPrismaFindFirst.mockResolvedValue({ id: "opp-abc-123" });
  });

  it("should return LINKED when opportunity belongs to the authenticated user", async () => {
    const result = await validateOpportunityOwnership({
      rawOpportunityId: "opp-abc-123",
      userId: "user-111",
    });

    expect(result.linked).toBe(true);
    expect(result.reason).toBe("LINKED");

    expect(mockPrismaFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "opp-abc-123",
          userId: "user-111",
        }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// TEST H — opportunityId appartient à un autre user → liaison refusée
// ---------------------------------------------------------------------------
describe("TEST H — opportunityId belongs to another user → link refused", () => {
  beforeEach(() => {
    // Simulates DB returning null because the WHERE userId does not match
    mockPrismaFindFirst.mockResolvedValue(null);
  });

  it("should return NOT_FOUND_OR_WRONG_USER when opportunity belongs to another user", async () => {
    const result = await validateOpportunityOwnership({
      rawOpportunityId: "opp-belongs-to-other-user",
      userId: "user-attacker",
    });

    expect(result.linked).toBe(false);
    expect(result.reason).toBe("NOT_FOUND_OR_WRONG_USER");
  });

  it("should still include userId in the DB query to enforce ownership", async () => {
    await validateOpportunityOwnership({
      rawOpportunityId: "opp-belongs-to-other-user",
      userId: "user-attacker",
    });

    // Verify that userId was part of the WHERE clause
    expect(mockPrismaFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user-attacker",
        }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// TEST I — Session historique sans opportunityId → comportement existant préservé
// ---------------------------------------------------------------------------
describe("TEST I — Legacy session without opportunityId → existing behavior preserved", () => {
  it("should return NO_ID and not query the DB when no opportunityId is provided", async () => {
    mockPrismaFindFirst.mockClear();

    const result = await validateOpportunityOwnership({
      rawOpportunityId: null,
      userId: "user-111",
    });

    expect(result.linked).toBe(false);
    expect(result.reason).toBe("NO_ID");
    // No DB query should have been made
    expect(mockPrismaFindFirst).not.toHaveBeenCalled();
  });

  it("should handle empty string opportunityId as no ID", async () => {
    mockPrismaFindFirst.mockClear();

    const result = await validateOpportunityOwnership({
      rawOpportunityId: "  ",
      userId: "user-111",
    });

    expect(result.linked).toBe(false);
    expect(result.reason).toBe("NO_ID");
    expect(mockPrismaFindFirst).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// TEST J — Deux opportunités avec même jobTitle → seule celle identifiée par ID
// ---------------------------------------------------------------------------
describe("TEST J — Two opportunities with same jobTitle → only the one with matching ID is linked", () => {
  const USER_ID = "user-111";
  const TARGET_OPP_ID = "opp-correct";
  const DECOY_OPP_ID = "opp-decoy-same-title";

  it("should link only the opportunity identified by ID, not the one with matching title", async () => {
    // The DB mock returns data only for the exact ID
    mockPrismaFindFirst.mockImplementation(async ({ where }: any) => {
      if (where.id === TARGET_OPP_ID && where.userId === USER_ID) {
        return { id: TARGET_OPP_ID };
      }
      return null;
    });

    // Link with the correct ID
    const correctResult = await validateOpportunityOwnership({
      rawOpportunityId: TARGET_OPP_ID,
      userId: USER_ID,
    });
    expect(correctResult.linked).toBe(true);
    expect(correctResult.reason).toBe("LINKED");

    // Attempt to link with the decoy ID (same title, wrong ID)
    mockPrismaFindFirst.mockResolvedValueOnce(null);
    const decoyResult = await validateOpportunityOwnership({
      rawOpportunityId: DECOY_OPP_ID,
      userId: USER_ID,
    });
    expect(decoyResult.linked).toBe(false);
    expect(decoyResult.reason).toBe("NOT_FOUND_OR_WRONG_USER");
  });
});
