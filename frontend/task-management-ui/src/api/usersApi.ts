import { apiClient } from './axiosConfig';
import type { User } from '../types';

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>('/api/users/profile', data);
    return response.data;
  },

  // 🔥 NEW: Get all users (Admin only)
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/api/users/all');
    return response.data;
  },
};