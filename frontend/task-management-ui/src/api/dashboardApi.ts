import { apiClient } from './axiosConfig';
import type { DashboardStats } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },

  getAdminStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/api/dashboard/stats/admin');
    return response.data;
  },

  getUserStats: async (userId: number): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>(`/api/dashboard/stats/user/${userId}`);
    return response.data;
  },
};