// Export all services from a central location
export { authService } from '../lib/auth';
export { userService } from './userService';
export { evaluationService } from './evaluationService';

// Re-export types for convenience
export type {
  LoginRequest,
  LoginResponse,
  TokenRequest,
  AppUser
} from '../lib/auth';

export type {
  RegisterUserRequest,
  UpdateUserRequest,
  AssignManagerRequest
} from './userService';

export type {
  EvaluationSummary
} from './evaluationService';
