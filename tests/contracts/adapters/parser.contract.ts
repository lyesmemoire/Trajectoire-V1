import { DocumentParser } from "@/lib/cv/ports/document-parser";

export function runParserAdapterContract(
  adapterFactory: () => DocumentParser,
  setupEnvironment?: () => Promise<void>,
  teardownEnvironment?: () => Promise<void>
) {
  describe("DocumentParser Contract", () => {
    let parser: DocumentParser;

    beforeAll(async () => {
      if (setupEnvironment) await setupEnvironment();
    });

    afterAll(async () => {
      if (teardownEnvironment) await teardownEnvironment();
    });

    beforeEach(() => {
      parser = adapterFactory();
    });

    it("should extract text from a valid buffer", async () => {
      const validBuffer = Buffer.from("simulated valid pdf");
      const result = await parser.extractText(validBuffer, "application/pdf");

      expect(result.isSuccess).toBe(true);
      expect(typeof result.unwrap()).toBe("string");
    });
  });
}
