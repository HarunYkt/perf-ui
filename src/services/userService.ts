import api from '../lib/api';
import { User } from '../types';

export interface RegisterUserRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface UpdateUserRequest {
  fullName: string;
}

export interface AssignManagerRequest {
  managerId: number;
}

// User API Service
export const userService = {
  // POST /api/users/register
  async register(userData: RegisterUserRequest): Promise<User> {
    const { data } = await api.post('/users/register', userData);
    return data;
  },

  // GET /api/users/me
  async getMyProfile(): Promise<User> {
    const { data } = await api.get('/users/me');
    return data;
  },

  // PUT /api/users/me
  async updateMyProfile(userData: UpdateUserRequest): Promise<User> {
    const { data } = await api.put('/users/me', userData);
    return data;
  },

  // GET /api/users/email/{email}
  async getUserByEmail(email: string): Promise<User> {
    const { data } = await api.get(`/users/email/${email}`);
    return data;
  },

  // PUT /api/users/{userId}/manager/{managerId}
  async assignManager(userId: number, managerId: number): Promise<void> {
    await api.put(`/users/${userId}/manager/${managerId}`);
  }
};
