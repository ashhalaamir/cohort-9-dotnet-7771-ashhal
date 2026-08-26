export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'RegularUser';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
  tokenExpiry: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string | null;
  userId: number;
  userName: string;
  user?: {  // 🔥 Add this for the nested user object
    id: number;
    username: string;
    email: string;
  };
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  dueDate: string;
  assignToUserId?: number;
}

export interface TaskUpdateRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  dueDate: string;
}

export interface TaskFilter {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalTasks: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
  details?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}