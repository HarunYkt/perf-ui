import api from './api';

export type AppUser = {
  id?: string | number;
  email?: string;
  fullName?: string;
  role?: string; // "EMPLOYEE" | "MANAGER" | "ADMIN"
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AppUser;
}

export interface TokenRequest {
  refreshToken?: string;
}

// Auth API Service
export const authService = {
  // POST /api/auth/login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // POST /api/auth/token
  async refreshToken(request: TokenRequest = {}): Promise<LoginResponse> {
    const { data } = await api.post('/auth/token', request);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout() {
    localStorage.clear();
    window.location.assign('/login');
  }
};

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUser(): AppUser | null {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}

export function hasRole(roles?: string[] | string): boolean {
  const u = getUser();
  if (!roles) return true;
  const r = Array.isArray(roles) ? roles : [roles];
  return !!u?.role && r.includes(u.role);
}

export function logout() {
  localStorage.clear();
  window.location.assign("/login");
}
