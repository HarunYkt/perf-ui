export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: number;
  email: string;
  fullName?: string;
  role: UserRole;
}

export type EvaluationType = "SELF" | "PEER" | "MANAGER";
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export interface Evaluation {
  id: number;
  evaluateeId: number;
  evaluatorId?: number;
  type: EvaluationType;
  score: number;
  comment?: string;
  periodYear: number;
  periodQuarter: Quarter;
  createdAt?: string;
}
