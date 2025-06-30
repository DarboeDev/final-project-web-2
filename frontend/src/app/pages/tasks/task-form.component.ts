import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { Task } from '../../interfaces/task.interface';
import { Project } from '../../interfaces/project.interface';
import { User } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  loading = false;
  error = '';
  taskId?: string;
  projects: Project[] = [];
  users: User[] = [];

  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadProjects();
    this.loadUsers();

    this.taskId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required]],
      project: ['', [Validators.required]],
      assignedTo: [''],
      priority: ['medium', [Validators.required]],
      status: ['pending', [Validators.required]],
      dueDate: [''],
      tags: [''],
    });
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (response: any) => {
        this.projects = response.data.projects;
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
      },
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.data.users;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      },
    });
  }

  loadTask(id: string) {
    this.loading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (response: any) => {
        const task = response.data.task;
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          project: task.project?._id || task.project,
          assignedTo: task.assignedTo?._id || task.assignedTo,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split('T')[0]
            : '',
          tags: task.tags?.join(', ') || '',
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load task';
        this.loading = false;
        console.error('Error loading task:', error);
      },
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.loading = true;
      this.error = '';

      const formValue = this.taskForm.value;
      const taskData = {
        ...formValue,
        tags: formValue.tags
          ? formValue.tags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag)
          : [],
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
      };

      const request =
        this.isEditMode && this.taskId
          ? this.taskService.updateTask(this.taskId, taskData)
          : this.taskService.createTask(taskData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error: any) => {
          this.error = error.error?.message || 'Operation failed';
          this.loading = false;
        },
      });
    }
  }

  onCancel() {
    this.router.navigate(['/tasks']);
  }

  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required'])
        return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['maxlength'])
        return `${this.getFieldLabel(fieldName)} is too long`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Title',
      description: 'Description',
      project: 'Project',
      assignedTo: 'Assigned To',
      priority: 'Priority',
      status: 'Status',
      dueDate: 'Due Date',
      tags: 'Tags',
    };
    return labels[fieldName] || fieldName;
  }
}
