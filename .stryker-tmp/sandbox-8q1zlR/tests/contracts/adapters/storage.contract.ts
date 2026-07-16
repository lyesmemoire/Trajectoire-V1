// @ts-nocheck
import { FileStorage } from "@/lib/cv/ports/file-storage";

export function runStorageAdapterContract(
  adapterFactory: () => FileStorage,
  setupEnvironment?: () => Promise<void>,
  teardownEnvironment?: () => Promise<void>
) {
  describe("FileStorage Contract", () => {
    let storage: FileStorage;

    beforeAll(async () => {
      if (setupEnvironment) await setupEnvironment();
    });

    afterAll(async () => {
      if (teardownEnvironment) await teardownEnvironment();
    });

    beforeEach(() => {
      storage = adapterFactory();
    });

    it("should successfully upload a file and return a URL", async () => {
      const dummyBuffer = Buffer.from("dummy pdf content");
      const result = await storage.uploadFile("user-123", dummyBuffer, "test-cv.pdf");

      expect(result.isSuccess).toBe(true);
      expect(result.unwrap()).toContain("test-cv.pdf");
    });
  });
}
