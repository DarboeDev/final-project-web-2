import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  task: Task | null = null;
  loading = true;
  error = '';
  currentUser: any;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  loadTask(id: string) {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (response: any) => {
        this.task = response.data.task;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load task';
        this.loading = false;
        console.error('Error loading task:', error);
      },
    });
  }

  onDeleteTask() {
    if (
      this.task?._id &&
      confirm('Are you sure you want to delete this task?')
    ) {
      this.taskService.deleteTask(this.task._id).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error: any) => {
          this.error = 'Failed to delete task';
          console.error('Error deleting task:', error);
        },
      });
    }
  }
  // Quick status update methods
  updateTaskStatus(
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ) {
    if (!this.task?._id) return;

    const updateData: any = { status };

    // If marking as completed, also update progress
    if (status === 'completed') {
      updateData.progress = 100;
    }

    this.taskService.updateTask(this.task._id, updateData).subscribe({
      next: (response: any) => {
        this.task = response.data.task;
        // Show success message briefly
        this.error = '';
      },
      error: (error: any) => {
        this.error = 'Failed to update task status';
        console.error('Error updating task status:', error);
      },
    });
  }

  markAsCompleted() {
    if (confirm('Are you sure you want to mark this task as completed?')) {
      this.updateTaskStatus('completed');
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  canEditTask(): boolean {
    if (!this.task || !this.currentUser) return false;

    // Check if assigned to current user
    const isAssignedToUser =
      (typeof this.task.assignedTo === 'string' &&
        this.task.assignedTo === this.currentUser._id) ||
      (typeof this.task.assignedTo === 'object' &&
        this.task.assignedTo?._id === this.currentUser._id);

    // Check if current user is project manager
    const isProjectManager =
      this.task.project &&
      typeof this.task.project === 'object' &&
      this.task.project.projectManager &&
      ((typeof this.task.project.projectManager === 'object' &&
        this.task.project.projectManager._id === this.currentUser._id) ||
        (typeof this.task.project.projectManager === 'string' &&
          this.task.project.projectManager === this.currentUser._id));

    return (
      this.currentUser.role === 'admin' ||
      this.currentUser.role === 'project_manager' ||
      isAssignedToUser ||
      Boolean(isProjectManager)
    );
  }

  canCompleteTask(): boolean {
    if (!this.task || !this.currentUser) return false;

    // Check if assigned to current user
    const isAssignedToUser =
      (typeof this.task.assignedTo === 'string' &&
        this.task.assignedTo === this.currentUser._id) ||
      (typeof this.task.assignedTo === 'object' &&
        this.task.assignedTo?._id === this.currentUser._id);

    // Check if current user is project manager
    const isProjectManager =
      this.task.project &&
      typeof this.task.project === 'object' &&
      this.task.project.projectManager &&
      ((typeof this.task.project.projectManager === 'object' &&
        this.task.project.projectManager._id === this.currentUser._id) ||
        (typeof this.task.project.projectManager === 'string' &&
          this.task.project.projectManager === this.currentUser._id));

    return (
      this.currentUser.role === 'admin' ||
      isAssignedToUser ||
      Boolean(isProjectManager)
    );
  }

  canDeleteTask(): boolean {
    return (
      this.currentUser &&
      (this.currentUser.role === 'admin' || this.currentUser.role === 'manager')
    );
  }

  // Helper methods for template
  getProjectName(project: any): string {
    if (typeof project === 'object' && project?.name) {
      return project.name;
    }
    return project || 'Unknown Project';
  }

  getProjectId(project: any): string | null {
    if (typeof project === 'object' && project?._id) {
      return project._id;
    }
    return null;
  }

  getAssignedToName(assignedTo: any): string {
    if (typeof assignedTo === 'object' && assignedTo?.fullName) {
      return assignedTo.fullName;
    }
    return assignedTo || 'Unassigned';
  }

  getAssignedToEmail(assignedTo: any): string {
    if (typeof assignedTo === 'object' && assignedTo?.email) {
      return assignedTo.email;
    }
    return '';
  }

  getAssignedToInitial(assignedTo: any): string {
    const name = this.getAssignedToName(assignedTo);
    return name.charAt(0).toUpperCase() || 'U';
  }

  getCreatedByName(createdBy: any): string {
    if (typeof createdBy === 'object' && createdBy?.fullName) {
      return createdBy.fullName;
    }
    return createdBy || 'Unknown User';
  }

  getCreatedByInitial(createdBy: any): string {
    const name = this.getCreatedByName(createdBy);
    return name.charAt(0).toUpperCase() || 'U';
  }
}
