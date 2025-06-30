export interface Project {
  _id?: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: Date;
  endDate?: Date;
  projectManager: string | User;
  manager?: User; // For populated manager field
  teamMembers: TeamMember[];
  team?: User[]; // For team members count in list view
  budget?: number;
  progress?: number;
  tags?: string[];
  isArchived?: boolean;
  createdBy?: string | User;
  createdAt?: Date;
  updatedAt?: Date;
  taskCount?: number;
  completedTasks?: number;
  progressPercentage?: number;
}

export interface TeamMember {
  user: string | User;
  fullName?: string; // For populated user fields
  email?: string; // For populated user fields
  role: 'developer' | 'designer' | 'tester' | 'analyst';
  joinedAt?: Date;
}

import { User } from './auth.interface';

export interface ProjectStats {
  taskStats: { _id: string; count: number }[];
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}
