import { describe, it, expect } from "vitest";
import { CVAggregate } from "../../../lib/cv/domain/aggregates/cv.aggregate";
import {
  CvUploaded,
  CvParsed,
  CvAnalyzed,
  AnalysisFailed,
  CvRewritten,
  RewriteFailed,
  CvExported,
  CvDeleted
} from "../../../lib/cv/domain/events/cv-events";

describe("CVAggregate", () => {
  describe("creation", () => {
    it("should create a new CV from upload", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      
      expect(cv.id).toBe("cv-1");
      expect(cv.userId).toBe("user-1");
      expect(cv.props.pdfUrl).toBe("https://storage.example.com/cv.pdf");
      expect(cv.originalText).toBeUndefined();
      expect(cv.optimizedText).toBeUndefined();
      expect(cv.props.atsScore).toBeUndefined();
    });

    it("should emit CvUploaded event on creation", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CvUploaded);
      
      const eventPayload = (events[0] as CvUploaded).payload;
      expect(eventPayload.cvId).toBe("cv-1");
      expect(eventPayload.storageUrl).toBe("https://storage.example.com/cv.pdf");
    });

    it("should load from persistence", () => {
      const props = {
        id: "cv-1",
        userId: "user-1",
        title: "Software Engineer CV",
        originalText: "Original CV text",
        optimizedText: "Optimized CV text",
        pdfUrl: "https://storage.example.com/cv.pdf",
        atsScore: 85,
        metadata: { skills: ["JavaScript", "TypeScript"] },
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-02T00:00:00Z"),
      };
      
      const cv = CVAggregate.load(props);
      
      expect(cv.id).toBe("cv-1");
      expect(cv.userId).toBe("user-1");
      expect(cv.originalText).toBe("Original CV text");
      expect(cv.optimizedText).toBe("Optimized CV text");
      expect(cv.props.atsScore).toBe(85);
    });
  });

  describe("attachParsedText", () => {
    it("should attach parsed text and emit CvParsed event", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.attachParsedText("Parsed CV content");
      
      expect(cv.originalText).toBe("Parsed CV content");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CvParsed);
      
      const eventPayload = (events[0] as CvParsed).payload;
      expect(eventPayload.cvId).toBe("cv-1");
    });

    it("should update updatedAt timestamp", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      const originalUpdatedAt = cv.props.updatedAt;
      
      const delay = new Promise(resolve => setTimeout(resolve, 10));
      
      return delay.then(() => {
        cv.attachParsedText("Parsed content");
        
        expect(cv.props.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe("attachAnalysis", () => {
    it("should attach analysis and emit CvAnalyzed event", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.attachAnalysis(85, { skills: ["JavaScript", "TypeScript"] });
      
      expect(cv.props.atsScore).toBe(85);
      expect(cv.props.metadata?.skills).toEqual(["JavaScript", "TypeScript"]);
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CvAnalyzed);
      
      const eventPayload = (events[0] as CvAnalyzed).payload;
      expect(eventPayload.cvId).toBe("cv-1");
      expect(eventPayload.atsScore).toBe(85);
    });

    it("should merge metadata with existing metadata", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      cv.attachAnalysis(75, { skills: ["JavaScript"] });
      (cv as any).clearEvents();
      
      cv.attachAnalysis(85, { experience: "5 years" });
      
      expect(cv.props.metadata?.skills).toEqual(["JavaScript"]);
      expect(cv.props.metadata?.experience).toBe("5 years");
    });

    it("should update updatedAt timestamp", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      const originalUpdatedAt = cv.props.updatedAt;
      
      const delay = new Promise(resolve => setTimeout(resolve, 10));
      
      return delay.then(() => {
        cv.attachAnalysis(85);
        
        expect(cv.props.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe("failAnalysis", () => {
    it("should emit AnalysisFailed event", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.failAnalysis("PDF parsing failed");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(AnalysisFailed);
      
      const eventPayload = (events[0] as AnalysisFailed).payload;
      expect(eventPayload.cvId).toBe("cv-1");
      expect(eventPayload.reason).toBe("PDF parsing failed");
    });
  });

  describe("rewrite", () => {
    it("should rewrite CV and emit CvRewritten event", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.rewrite("improve_clarity", "Improved CV content");
      
      expect(cv.optimizedText).toBe("Improved CV content");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CvRewritten);
      
      const eventPayload = (events[0] as CvRewritten).payload;
      expect(eventPayload.cvId).toBe("cv-1");
      expect(eventPayload.action).toBe("improve_clarity");
    });

    it("should update updatedAt timestamp", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      const originalUpdatedAt = cv.props.updatedAt;
      
      const delay = new Promise(resolve => setTimeout(resolve, 10));
      
      return delay.then(() => {
        cv.rewrite("improve_clarity", "New content");
        
        expect(cv.props.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });
  });

  describe("failRewrite", () => {
    it("should emit RewriteFailed event", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.failRewrite("AI service unavailable");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(RewriteFailed);
      
      const eventPayload = (events[0] as RewriteFailed).payload;
      expect(eventPayload.cvId).toBe("cv-1");
      expect(eventPayload.reason).toBe("AI service unavailable");
    });
  });

  describe("export", () => {
    it("should emit CvExported event for PDF", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.export("pdf");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CvExported);
      
      const eventPayload = (events[0] as CvExported).payload;
      expect(eventPayload.cvId).toBe("cv-1");
      expect(eventPayload.format).toBe("pdf");
    });

    it("should emit CvExported event for DOCX", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.export("docx");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      
      const eventPayload = (events[0] as CvExported).payload;
      expect(eventPayload.format).toBe("docx");
    });

    it("should emit CvExported event for JSON", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.export("json");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      
      const eventPayload = (events[0] as CvExported).payload;
      expect(eventPayload.format).toBe("json");
    });
  });

  describe("delete", () => {
    it("should emit CvDeleted event", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      (cv as any).clearEvents();
      
      cv.delete();
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CvDeleted);
      
      const eventPayload = (events[0] as CvDeleted).payload;
      expect(eventPayload.cvId).toBe("cv-1");
    });
  });

  describe("event ordering", () => {
    it("should emit events in correct order", () => {
      const cv = CVAggregate.upload("user-1", "cv-1", "https://storage.example.com/cv.pdf");
      
      cv.attachParsedText("Parsed content");
      cv.attachAnalysis(85);
      cv.rewrite("improve_clarity", "New content");
      
      const events = (cv as any).pullEvents();
      expect(events).toHaveLength(4);
      expect(events[0]).toBeInstanceOf(CvUploaded);
      expect(events[1]).toBeInstanceOf(CvParsed);
      expect(events[2]).toBeInstanceOf(CvAnalyzed);
      expect(events[3]).toBeInstanceOf(CvRewritten);
    });
  });
});
