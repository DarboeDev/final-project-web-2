import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../interfaces/project.interface';
import { Task } from '../../interfaces/task.interface';
import { User } from '../../interfaces/auth.interface';
import { ApiResponse } from '../../interfaces/common.interface';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  tasks: Task[] = [];
  loading = true;
  tasksLoading = false;
  error = '';
  currentUser: User | null = null;
  projectId: string | null = null;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.projectId = this.route.snapshot.paramMap.get('id');

    if (this.projectId) {
      this.loadProject();
      this.loadProjectTasks();
    }
  }

  loadProject() {
    if (!this.projectId) return;

    this.loading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response: ApiResponse<{ project: Project }>) => {
        if (response.success && response.data) {
          this.project = response.data.project;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to load project';
        this.loading = false;
      },
    });
  }

  loadProjectTasks() {
    if (!this.projectId) return;

    this.tasksLoading = true;
    this.taskService.getAllTasks({ project: this.projectId }).subscribe({
      next: (response: ApiResponse<{ tasks: Task[] }>) => {
        if (response.success && response.data) {
          this.tasks = response.data.tasks;
        }
        this.tasksLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading project tasks:', error);
        this.tasksLoading = false;
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  canManageProject(): boolean {
    return (
      this.currentUser?.role === 'admin' ||
      this.currentUser?.role === 'project_manager'
    );
  }

  canEditProject(): boolean {
    return this.canManageProject();
  }

  canDeleteProject(): boolean {
    return this.canManageProject();
  }

  getTaskStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTaskPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  onEditProject() {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId, 'edit']);
    }
  }

  onDeleteProject() {
    if (
      !this.projectId ||
      !confirm('Are you sure you want to delete this project?')
    )
      return;

    this.projectService.deleteProject(this.projectId).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.router.navigate(['/projects']);
        }
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to delete project';
      },
    });
  }

  // Helper methods for template
  getAssignedToName(assignedTo: any): string {
    if (typeof assignedTo === 'object' && assignedTo?.fullName) {
      return assignedTo.fullName;
    }
    return assignedTo || 'Unassigned';
  }

  getManagerName(manager: any): string {
    if (typeof manager === 'object' && manager?.fullName) {
      return manager.fullName;
    }
    return manager || 'No Manager';
  }

  getManagerEmail(manager: any): string {
    if (typeof manager === 'object' && manager?.email) {
      return manager.email;
    }
    return '';
  }

  getManagerInitial(manager: any): string {
    const name = this.getManagerName(manager);
    return name.charAt(0).toUpperCase() || 'M';
  }

  getTeamMemberName(member: any): string {
    if (typeof member === 'object' && member?.fullName) {
      return member.fullName;
    }
    if (typeof member?.user === 'object' && member.user?.fullName) {
      return member.user.fullName;
    }
    return member?.user || member || 'Unknown';
  }

  getTeamMemberEmail(member: any): string {
    if (typeof member === 'object' && member?.email) {
      return member.email;
    }
    if (typeof member?.user === 'object' && member.user?.email) {
      return member.user.email;
    }
    return '';
  }

  getTeamMemberInitial(member: any): string {
    const name = this.getTeamMemberName(member);
    return name.charAt(0).toUpperCase() || 'U';
  }
}
