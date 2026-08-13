import { apiClient } from './axiosConfig';
import type { Task, TaskCreateRequest, TaskUpdateRequest, TaskFilter } from '../types';

export const tasksApi = {
  getTasks: async (filters?: TaskFilter): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await apiClient.get<Task[]>(`/api/tasks?${params.toString()}`);
    return response.data;
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: TaskCreateRequest): Promise<Task> => {
    const response = await apiClient.post<Task>('/api/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: TaskUpdateRequest): Promise<Task> => {
    const response = await apiClient.put<Task>(`/api/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/tasks/${id}`);
  },

  assignTask: async (taskId: number, userId: number): Promise<Task> => {
    const response = await apiClient.post<Task>(`/api/tasks/${taskId}/assign`, { userId });
    return response.data;
  },
};