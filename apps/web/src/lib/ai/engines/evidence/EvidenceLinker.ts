// ===================================================================
// EVIDENCE LINKER — Deterministic Component for Evidence Links
// ===================================================================

export type EvidenceLinkType = "supports" | "duplicates" | "contradicts" | "extends" | "refines" | "supersedes";

export interface EvidenceLink {
  id: string;
  sourceObservationId: string;
  targetObservationId: string;
  linkType: EvidenceLinkType;
  confidence: number;
  reason: string;
  timestamp: Date;
}

export interface EvidenceLinkCandidate {
  sourceObservationId: string;
  targetObservationId: string;
  confidence: number;
  reason: string;
}

export class EvidenceLinker {
  /**
   * Determines the actual link type based on LLM-provided candidate
   * This is deterministic logic, not LLM-dependent
   */
  static determineLink(candidate: EvidenceLinkCandidate): EvidenceLink {
    const { sourceObservationId, targetObservationId, confidence, reason } = candidate;

    // Deterministic rules for link type classification
    let linkType: EvidenceLinkType;

    if (confidence < 0.3) {
      // Low confidence -> potential conflict or weak support
      linkType = "contradicts";
    } else if (confidence > 0.8) {
      // High confidence -> strong support or duplicate
      if (reason.toLowerCase().includes("duplicate") || reason.toLowerCase().includes("same")) {
        linkType = "duplicates";
      } else if (reason.toLowerCase().includes("extends") || reason.toLowerCase().includes("builds on")) {
        linkType = "extends";
      } else if (reason.toLowerCase().includes("refines") || reason.toLowerCase().includes("clarifies")) {
        linkType = "refines";
      } else if (reason.toLowerCase().includes("supersedes") || reason.toLowerCase().includes("replaces")) {
        linkType = "supersedes";
      } else {
        linkType = "supports";
      }
    } else {
      // Medium confidence -> moderate support
      linkType = "supports";
    }

    return {
      id: crypto.randomUUID(),
      sourceObservationId,
      targetObservationId,
      linkType,
      confidence,
      reason,
      timestamp: new Date(),
    };
  }

  /**
   * Creates a potential conflict reference for ContradictionEngine to evaluate
   */
  static createPotentialConflictReference(
    sourceObservationId: string,
    targetObservationId: string,
    reason: string
  ): EvidenceLink {
    return {
      id: crypto.randomUUID(),
      sourceObservationId,
      targetObservationId,
      linkType: "contradicts",
      confidence: 0.5, // Neutral confidence for potential conflicts
      reason: `Potential conflict: ${reason}`,
      timestamp: new Date(),
    };
  }

  /**
   * Batch processes multiple link candidates
   */
  static batchDetermineLinks(candidates: EvidenceLinkCandidate[]): EvidenceLink[] {
    return candidates.map((candidate) => this.determineLink(candidate));
  }

  /**
   * Filters links by type
   */
  static filterLinksByType(links: EvidenceLink[], linkType: EvidenceLinkType): EvidenceLink[] {
    return links.filter((link) => link.linkType === linkType);
  }

  /**
   * Gets high-confidence links (confidence >= 0.7)
   */
  static getHighConfidenceLinks(links: EvidenceLink[]): EvidenceLink[] {
    return links.filter((link) => link.confidence >= 0.7);
  }

  /**
   * Gets low-confidence links (confidence < 0.4)
   */
  static getLowConfidenceLinks(links: EvidenceLink[]): EvidenceLink[] {
    return links.filter((link) => link.confidence < 0.4);
  }
}
