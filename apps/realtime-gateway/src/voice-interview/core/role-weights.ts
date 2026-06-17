export type RoleType =
  | "backend"
  | "frontend"
  | "product_manager"
  | "designer"
  | "generic";

export interface RoleWeights {
  communication: number;
  technical_depth: number;
  clarity: number;
  problem_solving: number;
  confidence: number;
}

export const ROLE_WEIGHT_MATRIX: Record<RoleType, RoleWeights> = {
  backend: {
    communication: 0.15,
    technical_depth: 0.35,
    clarity: 0.15,
    problem_solving: 0.25,
    confidence: 0.10,
  },
  frontend: {
    communication: 0.20,
    technical_depth: 0.30,
    clarity: 0.20,
    problem_solving: 0.20,
    confidence: 0.10,
  },
  product_manager: {
    communication: 0.30,
    technical_depth: 0.10,
    clarity: 0.20,
    problem_solving: 0.25,
    confidence: 0.15,
  },
  designer: {
    communication: 0.25,
    technical_depth: 0.15,
    clarity: 0.25,
    problem_solving: 0.20,
    confidence: 0.15,
  },
  generic: {
    communication: 0.20,
    technical_depth: 0.20,
    clarity: 0.20,
    problem_solving: 0.20,
    confidence: 0.20,
  },
};
