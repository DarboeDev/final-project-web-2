import { User } from './auth.interface';
import { Project } from './project.interface';

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assignedTo?: string | User;
  createdBy?: string | User;
  project?: string | Project;
  category?: string | Category;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  completedAt?: Date;
  isArchived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isOverdue?: boolean;
}

export interface TaskComment {
  _id?: string;
  user: string | User;
  text: string;
  createdAt?: Date;
}

export interface TaskAttachment {
  _id?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string | User;
  uploadedAt?: Date;
}

export interface Category {
  _id?: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isActive?: boolean;
  createdBy?: string | User;
  createdAt?: Date;
  updatedAt?: Date;
  taskCount?: number;
}
