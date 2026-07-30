// ===================================================================
// FACT BUILDER — Uniform Fact Construction
// ===================================================================

export interface Fact {
  id: string;
  type: string;
  source: string;
  confidence: number;
  timestamp: Date;
  data: Record<string, any>;
}

export class FactBuilder {
  static metric(data: {
    name: string;
    value: number;
    unit?: string;
    source: string;
    confidence?: number;
  }): Fact {
    return {
      id: crypto.randomUUID(),
      type: "METRIC",
      source: data.source,
      confidence: data.confidence ?? 1.0,
      timestamp: new Date(),
      data: {
        name: data.name,
        value: data.value,
        unit: data.unit,
      },
    };
  }

  static entity(data: {
    name: string;
    type: string;
    attributes: Record<string, any>;
    source: string;
    confidence?: number;
    canonicalName?: string;
    aliases?: string[];
    provider?: string;
    category?: string;
    sourceText?: string;
  }): Fact {
    return {
      id: crypto.randomUUID(),
      type: "ENTITY",
      source: data.source,
      confidence: data.confidence ?? 1.0,
      timestamp: new Date(),
      data: {
        name: data.name,
        entityType: data.type,
        attributes: data.attributes,
        canonicalName: data.canonicalName,
        aliases: data.aliases,
        provider: data.provider,
        category: data.category,
        sourceText: data.sourceText,
      },
    };
  }

  static claim(data: {
    statement: string;
    evidence: string[];
    source: string;
    confidence?: number;
  }): Fact {
    return {
      id: crypto.randomUUID(),
      type: "CLAIM",
      source: data.source,
      confidence: data.confidence ?? 1.0,
      timestamp: new Date(),
      data: {
        statement: data.statement,
        evidence: data.evidence,
      },
    };
  }

  static timeline(data: {
    timestamp: Date;
    event: string;
    description?: string;
    source: string;
    confidence?: number;
  }): Fact {
    return {
      id: crypto.randomUUID(),
      type: "TIMELINE",
      source: data.source,
      confidence: data.confidence ?? 1.0,
      timestamp: new Date(),
      data: {
        timestamp: data.timestamp,
        event: data.event,
        description: data.description,
      },
    };
  }

  static observation(data: {
    content: string;
    category?: string;
    source: string;
    confidence?: number;
    observationType?: string;
    expectedFields?: string[];
    sourceText?: string;
  }): Fact {
    return {
      id: crypto.randomUUID(),
      type: "OBSERVATION",
      source: data.source,
      confidence: data.confidence ?? 1.0,
      timestamp: new Date(),
      data: {
        content: data.content,
        category: data.category,
        observationType: data.observationType,
        expectedFields: data.expectedFields,
        sourceText: data.sourceText,
      },
    };
  }
}
