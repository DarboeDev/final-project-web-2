import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  error = '';
  currentUser: any;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: (response: any) => {
        this.tasks = response.data.tasks;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load tasks';
        this.loading = false;
        console.error('Error loading tasks:', error);
      },
    });
  }

  onDeleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks(); // Reload tasks after deletion
        },
        error: (error: any) => {
          this.error = 'Failed to delete task';
          console.error('Error deleting task:', error);
        },
      });
    }
  }

  // Quick status update methods for list view
  updateTaskStatus(
    taskId: string,
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  ) {
    const updateData: any = { status };

    // If marking as completed, also update progress
    if (status === 'completed') {
      updateData.progress = 100;
    }

    this.taskService.updateTask(taskId, updateData).subscribe({
      next: () => {
        this.loadTasks(); // Reload tasks to update the list
      },
      error: (error: any) => {
        this.error = 'Failed to update task status';
        console.error('Error updating task status:', error);
      },
    });
  }

  markAsCompleted(taskId: string, event: Event) {
    event.stopPropagation(); // Prevent navigation when clicking the button
    if (confirm('Are you sure you want to mark this task as completed?')) {
      this.updateTaskStatus(taskId, 'completed');
    }
  }

  markAsInProgress(taskId: string, event: Event) {
    event.stopPropagation();
    this.updateTaskStatus(taskId, 'in-progress');
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

  canEditTask(task: Task): boolean {
    return (
      this.currentUser.role === 'admin' ||
      this.currentUser.role === 'manager' ||
      task.assignedTo === this.currentUser.id
    );
  }

  canDeleteTask(task: Task): boolean {
    return (
      this.currentUser.role === 'admin' || this.currentUser.role === 'manager'
    );
  }

  // Helper methods for template
  getProjectName(project: any): string {
    if (typeof project === 'object' && project?.name) {
      return project.name;
    }
    return project || 'Unknown Project';
  }

  getAssignedToName(assignedTo: any): string {
    if (typeof assignedTo === 'object' && assignedTo?.fullName) {
      return assignedTo.fullName;
    }
    return assignedTo || 'Unassigned';
  }

  // Quick action methods for task completion
  quickCompleteTask(task: Task) {
    this.taskService
      .updateTask(task._id!, { status: 'completed', progress: 100 })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            // Update the task in the local array
            const taskIndex = this.tasks.findIndex((t) => t._id === task._id);
            if (taskIndex !== -1) {
              this.tasks[taskIndex] = response.data.task;
            }
          }
        },
        error: (error: any) => {
          this.error = 'Failed to complete task';
          console.error('Error completing task:', error);
        },
      });
  }

  quickStartTask(task: Task) {
    this.taskService
      .updateTask(task._id!, { status: 'in-progress' })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            const taskIndex = this.tasks.findIndex((t) => t._id === task._id);
            if (taskIndex !== -1) {
              this.tasks[taskIndex] = response.data.task;
            }
          }
        },
        error: (error: any) => {
          this.error = 'Failed to start task';
          console.error('Error starting task:', error);
        },
      });
  }

  canUpdateTask(task: Task): boolean {
    if (!this.currentUser) return false;

    // User can update if they are the assignee, creator, admin, or project manager
    return (
      this.currentUser._id === task.assignedTo ||
      this.currentUser._id === task.createdBy ||
      this.currentUser.role === 'admin' ||
      this.currentUser.role === 'project_manager'
    );
  }

  canCompleteTask(task: Task): boolean {
    if (!this.currentUser) return false;

    // Debug logging
    console.log('Task:', task);
    console.log('Current User:', this.currentUser);
    console.log('Task Project:', task.project);

    // Check if assigned to current user
    const isAssignedToUser =
      (typeof task.assignedTo === 'string' &&
        task.assignedTo === this.currentUser._id) ||
      (typeof task.assignedTo === 'object' &&
        task.assignedTo?._id === this.currentUser._id);

    // Check if current user is project manager
    const isProjectManager =
      task.project &&
      typeof task.project === 'object' &&
      task.project.projectManager &&
      ((typeof task.project.projectManager === 'object' &&
        task.project.projectManager._id === this.currentUser._id) ||
        (typeof task.project.projectManager === 'string' &&
          task.project.projectManager === this.currentUser._id));

    console.log('Is Assigned to User:', isAssignedToUser);
    console.log('Is Project Manager:', isProjectManager);
    console.log('User Role:', this.currentUser.role);

    return (
      this.currentUser.role === 'admin' ||
      isAssignedToUser ||
      Boolean(isProjectManager)
    );
  }
}
