/**
 * InterviewMetadata Value Object
 *
 * Additional interview metadata.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY metadata definition and helper methods.
 */
// @ts-nocheck


import { InterviewMetadataData } from "../types";

export class InterviewMetadata {
  private readonly version: string;
  private readonly generator: "AI" | "TEMPLATE" | "HYBRID";
  private readonly generatedAt: Date;
  private readonly generatedBy: string;
  private readonly tags: string[];
  private readonly customFields: Record<string, unknown>;

  constructor(data: InterviewMetadataData) {
    this.version = data.version;
    this.generator = data.generator;
    this.generatedAt = data.generatedAt;
    this.generatedBy = data.generatedBy;
    this.tags = [...data.tags];
    this.customFields = { ...data.customFields };
    Object.freeze(this);
  }

  getVersion(): string {
    return this.version;
  }

  getGenerator(): "AI" | "TEMPLATE" | "HYBRID" {
    return this.generator;
  }

  getGeneratedAt(): Date {
    return new Date(this.generatedAt);
  }

  getGeneratedBy(): string {
    return this.generatedBy;
  }

  getTags(): string[] {
    return [...this.tags];
  }

  getCustomFields(): Record<string, unknown> {
    return { ...this.customFields };
  }

  hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  getCustomField(key: string): unknown {
    return this.customFields[key];
  }

  equals(other: InterviewMetadata): boolean {
    return (
      this.version === other.getVersion() &&
      this.generator === other.getGenerator() &&
      this.generatedBy === other.getGeneratedBy()
    );
  }

  static initial(generatedBy: string): InterviewMetadata {
    return new InterviewMetadata({
      version: "1.0.0",
      generator: "TEMPLATE",
      generatedAt: new Date(),
      generatedBy,
      tags: [],
      customFields: {},
    });
  }
}
