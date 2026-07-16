// @ts-nocheck
import { CandidateProfile } from "../types";
import { JobOfferGraph } from "../profile/JobOfferGraph";
import { MatchingCoreOutput } from "./careerCopilotMatchingIntelligenceEngine";

/**
 * Transferable Skills Intelligence Engine
 * 
 * Responsibilities:
 * - Determine which missing skills can be reasonably compensated by existing skills
 * - Assess transferability based on conceptual similarity and learning patterns
 * - NO global scoring, risk detection, opportunity detection, decision-making
 * - NO recommendations, interview preparation, or planning
 * - ONLY transferability assessment with explainability
 */

export interface Explainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
}

export interface TransferableSkill {
  missingSkill: string;
  sourceSkill: string | null;
  transferPath: string[];
  transferEvidence: string[];
  transferConfidence: number;
  transferExplanation: string;
  transferReasoning: string;
  explainability: Explainability;
}

export interface TransferableSkillsOutput {
  transferableSkills: {
    directTransferable: TransferableSkill[];
    partialTransferable: TransferableSkill[];
    notTransferable: TransferableSkill[];
  };
  metadata: {
    analyzedAt: string;
    candidateGraphId: string;
    jobOfferGraphId: string;
    matchingCoreContextId: string;
    explainability: Explainability;
  };
}

// Transferability rules - deterministic mappings
const TRANSFER_RULES: Record<string, { source: string; confidence: number; path: string[]; evidence: string[]; reasoning: string }[]> = {
  // Technologies Proches
  "kubernetes": [
    {
      source: "docker",
      confidence: 88,
      path: ["Docker", "Containers", "Container Orchestration", "Kubernetes"],
      evidence: ["Docker provides containerization fundamentals", "Kubernetes builds on Docker concepts", "Both use container images and orchestration"],
      reasoning: "Docker knowledge provides the foundation for understanding containers, which is essential for Kubernetes. The transition involves learning orchestration concepts rather than containerization basics."
    }
  ],
  "vue": [
    {
      source: "react",
      confidence: 85,
      path: ["React", "Component-based UI", "Virtual DOM", "Vue"],
      evidence: ["Both use component-based architecture", "Both use virtual DOM for performance", "Similar state management patterns"],
      reasoning: "React and Vue share the same fundamental concepts: components, virtual DOM, and reactive state management. The transition involves learning Vue's syntax and specific APIs."
    }
  ],
  "react": [
    {
      source: "angular",
      confidence: 75,
      path: ["Angular", "Component-based UI", "TypeScript", "React"],
      evidence: ["Both use component-based architecture", "Both support TypeScript", "Similar lifecycle concepts"],
      reasoning: "Angular and React both use component-based architecture, but React's approach is more functional. The transition involves learning React's hooks and functional components."
    }
  ],
  "laravel": [
    {
      source: "symfony",
      confidence: 80,
      path: ["Symfony", "PHP MVC", "Laravel"],
      evidence: ["Both are PHP MVC frameworks", "Similar architecture patterns", "Both use dependency injection"],
      reasoning: "Symfony and Laravel share the same MVC architecture and PHP ecosystem. The transition involves learning Laravel's specific conventions and helper methods."
    }
  ],
  "asp.net": [
    {
      source: "laravel",
      confidence: 60,
      path: ["Laravel", "MVC Framework", "ASP.NET"],
      evidence: ["Both use MVC pattern", "Similar routing concepts", "Both support dependency injection"],
      reasoning: "Laravel and ASP.NET both follow MVC patterns, but ASP.NET uses C#/.NET instead of PHP. The transition involves learning the .NET ecosystem and C# language."
    }
  ],
  "postgresql": [
    {
      source: "mysql",
      confidence: 90,
      path: ["MySQL", "Relational Database", "SQL", "PostgreSQL"],
      evidence: ["Both are relational databases", "Both use SQL", "Similar data modeling concepts"],
      reasoning: "MySQL and PostgreSQL are both relational databases using SQL. The transition involves learning PostgreSQL-specific features and syntax differences."
    }
  ],
  "azure": [
    {
      source: "aws",
      confidence: 75,
      path: ["AWS", "Cloud Platform", "Azure"],
      evidence: ["Both are major cloud platforms", "Similar service categories (compute, storage, networking)", "Similar deployment patterns"],
      reasoning: "AWS and Azure provide similar cloud services but with different naming conventions and specific implementations. The transition involves learning Azure's portal and service names."
    }
  ],
  "gcp": [
    {
      source: "aws",
      confidence: 70,
      path: ["AWS", "Cloud Platform", "GCP"],
      evidence: ["Both are major cloud platforms", "Similar service categories", "Similar deployment patterns"],
      reasoning: "AWS and GCP provide similar cloud services. The transition involves learning GCP's console and service-specific implementations."
    }
  ],
  "github actions": [
    {
      source: "gitlab ci",
      confidence: 85,
      path: ["GitLab CI", "CI/CD Pipeline", "GitHub Actions"],
      evidence: ["Both are CI/CD platforms", "Similar pipeline configuration concepts", "Both use YAML for configuration"],
      reasoning: "GitLab CI and GitHub Actions both provide CI/CD capabilities with YAML-based configuration. The transition involves learning GitHub Actions syntax and marketplace integrations."
    }
  ],
  "azure devops": [
    {
      source: "jenkins",
      confidence: 65,
      path: ["Jenkins", "CI/CD Pipeline", "Azure DevOps"],
      evidence: ["Both are CI/CD platforms", "Similar pipeline concepts", "Both support multiple stages"],
      reasoning: "Jenkins and Azure DevOps both provide CI/CD capabilities. The transition involves learning Azure DevOps's YAML-based pipelines and integration with Azure services."
    }
  ],
  
  // Compétences Métier
  "kanban": [
    {
      source: "scrum",
      confidence: 85,
      path: ["Scrum", "Agile Methodology", "Kanban"],
      evidence: ["Both are agile methodologies", "Similar focus on iterative delivery", "Both use visual boards"],
      reasoning: "Scrum and Kanban are both agile methodologies with similar principles. The transition involves moving from time-boxed sprints to continuous flow."
    }
  ],
  "product manager": [
    {
      source: "product owner",
      confidence: 80,
      path: ["Product Owner", "Product Management", "Product Manager"],
      evidence: ["Both roles involve product strategy", "Both require stakeholder management", "Both work with development teams"],
      reasoning: "Product Owner and Product Manager share similar responsibilities but Product Manager typically has broader scope and strategic focus."
    }
  ],
  "engineering manager": [
    {
      source: "team lead",
      confidence: 75,
      path: ["Team Lead", "Team Management", "Engineering Manager"],
      evidence: ["Both involve team leadership", "Both require technical oversight", "Both work with cross-functional teams"],
      reasoning: "Team Lead and Engineering Manager both involve leadership, but Engineering Manager typically has broader scope including hiring, performance management, and strategic planning."
    }
  ],
  
  // Langages
  "kotlin": [
    {
      source: "java",
      confidence: 90,
      path: ["Java", "JVM Language", "Kotlin"],
      evidence: ["Both run on JVM", "Similar syntax and concepts", "Interoperable with Java"],
      reasoning: "Kotlin is designed to be fully interoperable with Java and runs on the JVM. The transition involves learning Kotlin's concise syntax and null safety features."
    }
  ],
  "java": [
    {
      source: "c#",
      confidence: 75,
      path: ["C#", "Object-Oriented Language", "Java"],
      evidence: ["Both are object-oriented", "Similar syntax and concepts", "Both have strong typing"],
      reasoning: "C# and Java are both object-oriented languages with similar syntax. The transition involves learning Java's ecosystem and specific APIs."
    }
  ],
  "typescript": [
    {
      source: "javascript",
      confidence: 95,
      path: ["JavaScript", "Dynamic Language", "TypeScript"],
      evidence: ["TypeScript is a superset of JavaScript", "Same runtime environment", "Similar syntax with added types"],
      reasoning: "TypeScript is essentially JavaScript with static typing. The transition is very smooth as existing JavaScript code is valid TypeScript."
    }
  ],
  "go": [
    {
      source: "python",
      confidence: 55,
      path: ["Python", "Modern Language", "Go"],
      evidence: ["Both are modern languages", "Both emphasize simplicity", "Different paradigms (imperative vs concurrent)"],
      reasoning: "Python and Go are both modern languages but have different paradigms. Python is dynamically typed and interpreted, while Go is statically typed and compiled with built-in concurrency."
    }
  ],
  
  // Cloud Concepts
  "azure ad": [
    {
      source: "aws iam",
      confidence: 75,
      path: ["AWS IAM", "Identity Management", "Azure AD"],
      evidence: ["Both manage identity and access", "Similar RBAC concepts", "Both support SSO and federation"],
      reasoning: "AWS IAM and Azure AD both provide identity and access management. The transition involves learning Azure AD's specific features and integration with Microsoft ecosystem."
    }
  ],
  "azure vm": [
    {
      source: "aws ec2",
      confidence: 80,
      path: ["AWS EC2", "Compute Service", "Azure VM"],
      evidence: ["Both provide virtual machines", "Similar configuration options", "Both support scaling"],
      reasoning: "AWS EC2 and Azure VM both provide compute services. The transition involves learning Azure's portal and VM-specific features."
    }
  ],
  "azure blob": [
    {
      source: "aws s3",
      confidence: 85,
      path: ["AWS S3", "Object Storage", "Azure Blob"],
      evidence: ["Both provide object storage", "Similar API concepts", "Both support lifecycle policies"],
      reasoning: "AWS S3 and Azure Blob both provide object storage. The transition involves learning Azure Blob's specific features and API."
    }
  ],
  
  // DevOps Tools
  "cloudformation": [
    {
      source: "terraform",
      confidence: 75,
      path: ["Terraform", "Infrastructure as Code", "CloudFormation"],
      evidence: ["Both are infrastructure as code tools", "Similar resource management concepts", "Both support state management"],
      reasoning: "Terraform and CloudFormation both provide infrastructure as code capabilities. The transition involves learning CloudFormation's JSON/YAML syntax and AWS-specific resources."
    }
  ],
  "arm templates": [
    {
      source: "terraform",
      confidence: 70,
      path: ["Terraform", "Infrastructure as Code", "ARM Templates"],
      evidence: ["Both are infrastructure as code tools", "Similar resource management concepts", "Both support Azure resources"],
      reasoning: "Terraform and ARM Templates both provide infrastructure as code for Azure. The transition involves learning ARM's JSON syntax and Azure-specific resource types."
    }
  ],
  "gitlab ci": [
    {
      source: "jenkins",
      confidence: 75,
      path: ["Jenkins", "CI/CD Pipeline", "GitLab CI"],
      evidence: ["Both are CI/CD platforms", "Similar pipeline concepts", "Both support multiple stages"],
      reasoning: "Jenkins and GitLab CI both provide CI/CD capabilities. The transition involves learning GitLab CI's YAML-based configuration and GitLab integration."
    }
  ],
  "grafana": [
    {
      source: "prometheus",
      confidence: 80,
      path: ["Prometheus", "Monitoring", "Grafana"],
      evidence: ["Grafana is commonly used with Prometheus", "Both are monitoring tools", "Similar visualization concepts"],
      reasoning: "Prometheus and Grafana are commonly used together for monitoring. The transition involves learning Grafana's dashboard configuration and visualization features."
    }
  ],
  "azure monitor": [
    {
      source: "cloudwatch",
      confidence: 70,
      path: ["CloudWatch", "Monitoring", "Azure Monitor"],
      evidence: ["Both are cloud monitoring services", "Similar metrics and logging concepts", "Both support alerting"],
      reasoning: "CloudWatch and Azure Monitor both provide monitoring capabilities. The transition involves learning Azure Monitor's specific features and integration with Azure services."
    }
  ]
};

export class CareerCopilotTransferableSkillsIntelligenceEngine {
  /**
   * Assess transferability of missing skills based on existing skills
   */
  static assessTransferability(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph,
    matchingCoreContext: MatchingCoreOutput
  ): TransferableSkillsOutput {
    const analyzedAt = new Date(0).toISOString(); // Fixed date for determinism

    const candidateSkills = candidateProfile.skills.hardSkills.map(s => s.name.toLowerCase());
    const missingSkills = matchingCoreContext.hardSkills.missing.map(s => s.name.toLowerCase());

    const directTransferable: TransferableSkill[] = [];
    const partialTransferable: TransferableSkill[] = [];
    const notTransferable: TransferableSkill[] = [];

    missingSkills.forEach(missingSkill => {
      const transferRule = TRANSFER_RULES[missingSkill];
      
      if (transferRule) {
        // Check if candidate has the source skill
        const matchingRule = transferRule.find(rule => 
          candidateSkills.includes(rule.source.toLowerCase())
        );

        if (matchingRule) {
          if (matchingRule.confidence >= 80) {
            directTransferable.push(this.createTransferableSkill(
              missingSkill,
              matchingRule.source,
              matchingRule.path,
              matchingRule.evidence,
              matchingRule.confidence,
              matchingRule.reasoning
            ));
          } else {
            partialTransferable.push(this.createTransferableSkill(
              missingSkill,
              matchingRule.source,
              matchingRule.path,
              matchingRule.evidence,
              matchingRule.confidence,
              matchingRule.reasoning
            ));
          }
        } else {
          // Source skill not found in candidate
          notTransferable.push(this.createTransferableSkill(
            missingSkill,
            null,
            [],
            [],
            0,
            `No transferable source skill found for ${missingSkill} in candidate's profile`
          ));
        }
      } else {
        // No transfer rule defined
        notTransferable.push(this.createTransferableSkill(
          missingSkill,
          null,
          [],
          [],
          0,
          `No transferability rule defined for ${missingSkill}`
        ));
      }
    });

    return {
      transferableSkills: {
        directTransferable,
        partialTransferable,
        notTransferable
      },
      metadata: {
        analyzedAt,
        candidateGraphId: candidateProfile.identity.id,
        jobOfferGraphId: jobOfferGraph.id,
        matchingCoreContextId: matchingCoreContext.metadata.comparedAt,
        explainability: {
          source: "Transferable Skills Intelligence",
          proof: "Transferability analysis performed at " + analyzedAt,
          confidence: 85,
          explanation: "Structured assessment of skill transferability based on conceptual similarity and learning patterns"
        }
      }
    };
  }

  /**
   * Create a transferable skill object
   */
  private static createTransferableSkill(
    missingSkill: string,
    sourceSkill: string | null,
    transferPath: string[],
    transferEvidence: string[],
    transferConfidence: number,
    transferReasoning: string
  ): TransferableSkill {
    return {
      missingSkill,
      sourceSkill,
      transferPath,
      transferEvidence,
      transferConfidence,
      transferExplanation: sourceSkill 
        ? `${missingSkill} can be transferred from ${sourceSkill} with ${transferConfidence}% confidence`
        : `${missingSkill} is not transferable from existing skills`,
      transferReasoning,
      explainability: {
        source: sourceSkill ? "CandidateGraph.skills.hardSkills, Transfer Rules" : "Transfer Rules",
        proof: sourceSkill 
          ? `Candidate has ${sourceSkill}, which can transfer to ${missingSkill} via: ${transferPath.join(" → ")}`
          : `No source skill found for transfer to ${missingSkill}`,
        confidence: transferConfidence,
        explanation: sourceSkill
          ? `Transfer path: ${transferPath.join(" → ")}. Evidence: ${transferEvidence.join(", ")}`
          : "No transferable source skill available"
      }
    };
  }
}
