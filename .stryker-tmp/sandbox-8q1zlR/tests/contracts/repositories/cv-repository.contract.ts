// @ts-nocheck
import { CvRepositoryPort } from "@/lib/cv/ports/cv-repository.port";

export function runCvRepositoryContract(
  repositoryFactory: () => CvRepositoryPort,
  setupEnvironment?: () => Promise<void>,
  teardownEnvironment?: () => Promise<void>
) {
  describe("CvRepository Contract", () => {
    let repository: CvRepositoryPort;

    beforeAll(async () => {
      if (setupEnvironment) await setupEnvironment();
    });

    afterAll(async () => {
      if (teardownEnvironment) await teardownEnvironment();
    });

    beforeEach(() => {
      repository = repositoryFactory();
    });

    it("should create a CV entity", async () => {
      const result = await repository.create("user-123", "Some original text", "http://storage.url");
      expect(result.isSuccess).toBe(true);
      const cv = result.unwrap();
      expect(cv.userId).toBe("user-123");
      expect(cv.originalText).toBe("Some original text");
      expect(cv.storageUrl).toBe("http://storage.url");
    });

    it("should find an existing CV by ID", async () => {
      const created = await repository.create("user-456", "text");
      const cvId = created.unwrap().id;

      const result = await repository.findById(cvId);
      expect(result.isSuccess).toBe(true);
      expect(result.unwrap().id).toBe(cvId);
    });

    it("should return failure if CV is not found", async () => {
      const result = await repository.findById("non-existent-id");
      expect(result.isFailure).toBe(true);
    });
  });
}
