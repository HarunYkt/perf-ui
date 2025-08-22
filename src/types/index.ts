export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: number;
  email: string;
  fullName?: string;
  role: UserRole;
  managerId?: number;
  createdAt?: string;
  updatedAt?: string;
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
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
