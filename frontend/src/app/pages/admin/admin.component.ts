import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { User } from '../../interfaces/auth.interface';
import { Project } from '../../interfaces/project.interface';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  users: User[] = [];
  projects: Project[] = [];
  tasks: Task[] = [];
  loading = false;
  stats = {
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.loadAdminData();
  }

  loadAdminData(): void {
    this.loading = true;

    // Load users
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data.users;
          this.stats.totalUsers = this.users.length;
        }
      },
      error: (error: any) => console.error('Error loading users:', error),
    });

    // Load projects
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.projects = response.data.projects;
          this.stats.totalProjects = this.projects.length;
          this.stats.activeProjects = this.projects.filter(
            (p) => p.status === 'active'
          ).length;
        }
      },
      error: (error: any) => console.error('Error loading projects:', error),
    });

    // Load tasks
    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.tasks = response.data.tasks;
          this.stats.totalTasks = this.tasks.length;
          this.stats.completedTasks = this.tasks.filter(
            (t) => t.status === 'completed'
          ).length;
          this.stats.pendingTasks = this.tasks.filter(
            (t) => t.status === 'pending'
          ).length;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      },
    });
  }

  updateUserRole(userId: string, newRole: string): void {
    this.userService.updateUserRole(userId, newRole).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Update the user in the local array
          const userIndex = this.users.findIndex((u) => u._id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].role = newRole as
              | 'admin'
              | 'project_manager'
              | 'team_member';
          }
        }
      },
      error: (error: any) => console.error('Error updating user role:', error),
    });
  }

  onRoleChange(event: Event, userId: string): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.updateUserRole(userId, target.value);
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          if (response.success) {
            this.users = this.users.filter((u) => u._id !== userId);
            this.stats.totalUsers = this.users.length;
          }
        },
        error: (error) => console.error('Error deleting user:', error),
      });
    }
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map((name) => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'developer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'planning':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
