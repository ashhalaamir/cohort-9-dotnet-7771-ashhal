import { apiClient } from './axiosConfig';
import type { DashboardStats } from '../types';

// 🔥 NEW: Team member stats type
export interface TeamMemberStats {
  userId: number;
  username: string;
  email: string;
  totalTasks: number;
  completed: number;
  overdue: number;
  completionRate: number;
}

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

  // 🔥 NEW: Get team statistics (Admin only)
  getTeamStats: async (): Promise<TeamMemberStats[]> => {
    const response = await apiClient.get<TeamMemberStats[]>('/api/dashboard/team');
    return response.data;
  },
};