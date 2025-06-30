import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { User } from '../../interfaces/auth.interface';
import { Project } from '../../interfaces/project.interface';
import { Task } from '../../interfaces/task.interface';
import { ApiResponse } from '../../interfaces/common.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  projects: Project[] = [];
  tasks: Task[] = [];
  loading = true;

  // Stats
  totalProjects = 0;
  totalTasks = 0;
  completedTasks = 0;
  overdueTasks = 0;

  recentProjects: Project[] = [];
  recentTasks: Task[] = [];

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
  }

  private loadUserData() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  private loadDashboardData() {
    this.loading = true;

    // Load projects
    this.projectService.getAllProjects().subscribe({
      next: (response: ApiResponse<{ projects: Project[] }>) => {
        if (response.success && response.data) {
          this.projects = response.data.projects;
          this.totalProjects = this.projects.length;
          this.recentProjects = this.projects
            .sort(
              (a, b) =>
                new Date(b.updatedAt || b.createdAt || '').getTime() -
                new Date(a.updatedAt || a.createdAt || '').getTime()
            )
            .slice(0, 5);
        }
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
      },
    });

    // Load tasks
    this.taskService.getAllTasks().subscribe({
      next: (response: ApiResponse<{ tasks: Task[] }>) => {
        if (response.success && response.data) {
          this.tasks = response.data.tasks;
          this.totalTasks = this.tasks.length;
          this.completedTasks = this.tasks.filter(
            (task) => task.status === 'completed'
          ).length;
          this.overdueTasks = this.tasks.filter(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              task.status !== 'completed'
          ).length;

          this.recentTasks = this.tasks
            .sort(
              (a, b) =>
                new Date(b.updatedAt || b.createdAt || '').getTime() -
                new Date(a.updatedAt || a.createdAt || '').getTime()
            )
            .slice(0, 5);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      },
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'on_hold':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }
}
