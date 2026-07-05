import { TextRewriter } from "@/lib/cv/ports/text-rewriter";

export function runRewriteAdapterContract(
  adapterFactory: () => TextRewriter,
  setupEnvironment?: () => Promise<void>,
  teardownEnvironment?: () => Promise<void>
) {
  describe("TextRewriter Contract", () => {
    let rewriter: TextRewriter;

    beforeAll(async () => {
      if (setupEnvironment) await setupEnvironment();
    });

    afterAll(async () => {
      if (teardownEnvironment) await teardownEnvironment();
    });

    beforeEach(() => {
      rewriter = adapterFactory();
    });

    it("should rewrite content and return a non-empty string", async () => {
      const result = await rewriter.rewriteCvContent(
        "Développeur fullstack avec 5 ans d'expérience",
        "Améliore cette expérience pour la rendre plus percutante."
      );

      expect(result.isSuccess).toBe(true);
      expect(result.unwrap().length).toBeGreaterThan(0);
    });
  });
}
