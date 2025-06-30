export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
}

export interface Pagination {
  current: number;
  pages: number;
  total: number;
  limit: number;
}

export interface DashboardStats {
  taskStats: { _id: string; count: number }[];
  projectStats: { _id: string; count: number }[];
  overdueTasks: number;
  upcomingTasks: number;
}
