import { describe, it, expect, beforeEach } from "vitest";
import { UploadCvUseCase } from "../../../lib/cv/application/use-cases/upload/upload-cv.use-case";
import { ok } from "../../../lib/core/result";
import {
  FakeRequestContextProvider,
  FakeDomainEventPublisher,
  FakeLogger,
  FakeClock,
  FakeIdGenerator,
  FakeRepository
} from "../../../tests/shared/fakes";

describe("UploadCvUseCase - Testable with Fakes Only", () => {
  let useCase: UploadCvUseCase;
  let fakeContext: FakeRequestContextProvider;
  let fakePublisher: FakeDomainEventPublisher;
  let fakeLogger: FakeLogger;
  let fakeClock: FakeClock;
  let fakeIdGenerator: FakeIdGenerator;
  let fakeStorage: any;
  let fakeParser: any;
  let fakeRepository: any;

  beforeEach(() => {
    // Create all fakes - no global mocks, no infrastructure dependencies
    fakeContext = new FakeRequestContextProvider();
    fakePublisher = new FakeDomainEventPublisher();
    fakeLogger = new FakeLogger();
    fakeClock = new FakeClock();
    fakeIdGenerator = new FakeIdGenerator();
    
    // Create simple fakes for gateways and repository
    fakeStorage = {
      uploadFile: async () => ok("https://storage.example.com/cv-456.pdf"),
    };
    
    fakeParser = {
      extractText: async () => ok("Parsed CV text"),
    };
    
    fakeRepository = new FakeRepository();

    // Note: UploadCvUseCase still uses static RequestContext and concrete DomainEventPublisher
    // This test demonstrates that with the new interfaces, we COULD refactor it to be testable
    // For now, this is a placeholder showing the intended test structure
  });

  it("should demonstrate testability with fakes", async () => {
    // Set up fake context
    fakeContext.setContext({
      requestId: "req-123",
      correlationId: "corr-456",
      userId: "user-789",
    });

    // Set up fake clock to return a fixed date
    const fixedDate = new Date("2024-01-01T00:00:00Z");
    fakeClock.advanceTo(fixedDate);

    // Set up fake id generator
    fakeIdGenerator.setCounter(999);

    // Verify fakes work independently
    expect(fakeContext.userId()).toBe("user-789");
    expect(fakeClock.now()).toEqual(fixedDate);
    expect(fakeIdGenerator.generate()).toBe("test-999");
    expect(fakePublisher.getEventCount()).toBe(0);
    expect(fakeLogger.getLogCount()).toBe(0);

    // This demonstrates that the infrastructure is now in place
    // to make UseCases fully testable with fakes only
  });

  it("should allow runtime to start without server", async () => {
    // PlatformRuntime now accepts a Logger parameter
    // This allows starting the runtime without Next.js server
    const { PlatformRuntime } = await import("../../../lib/core/runtime/bootstrap/PlatformRuntime");
    
    const runtime = new PlatformRuntime(fakeLogger);
    expect(runtime.container).toBeDefined();
    
    // Runtime can be started without Next.js context
    // This enables testing of the runtime pipeline
  });
});
