import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../interfaces/project.interface';
import { User } from '../../interfaces/auth.interface';
import { ApiResponse } from '../../interfaces/common.interface';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  loading = false;
  error = '';
  isEditMode = false;
  projectId: string | null = null;
  currentUser: User | null = null;
  availableUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    this.initForm();
    this.loadAvailableUsers();

    if (this.isEditMode) {
      this.loadProject();
    }
  }

  initForm() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      projectManager: ['', [Validators.required]],
      status: ['planning', [Validators.required]],
      priority: ['medium', [Validators.required]],
      startDate: [''],
      endDate: [''],
      budget: [''],
      team: [[]],
      tags: [''],
    });
  }

  loadAvailableUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response: ApiResponse<{ users: User[] }>) => {
        if (response.success && response.data) {
          this.availableUsers = response.data.users;
        }
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
      },
    });
  }

  loadProject() {
    if (!this.projectId) return;

    this.loading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (response: ApiResponse<{ project: Project }>) => {
        if (response.success && response.data) {
          const project = response.data.project;
          this.projectForm.patchValue({
            name: project.name,
            description: project.description,
            projectManager:
              typeof project.projectManager === 'object'
                ? project.projectManager._id
                : project.projectManager,
            status: project.status,
            priority: project.priority,
            startDate: project.startDate
              ? new Date(project.startDate).toISOString().split('T')[0]
              : '',
            endDate: project.endDate
              ? new Date(project.endDate).toISOString().split('T')[0]
              : '',
            budget: project.budget,
            team: project.teamMembers
              ? project.teamMembers.map((member: any) =>
                  typeof member === 'object' && member.user
                    ? typeof member.user === 'object'
                      ? member.user._id
                      : member.user
                    : member
                )
              : [],
            tags: project.tags ? project.tags.join(', ') : '',
          });
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to load project';
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.loading = true;
      this.error = '';

      const formValue = this.projectForm.value;
      const projectData: Partial<Project> = {
        name: formValue.name,
        description: formValue.description,
        projectManager: formValue.projectManager,
        status: formValue.status,
        priority: formValue.priority,
        startDate: formValue.startDate
          ? new Date(formValue.startDate)
          : undefined,
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
        budget: formValue.budget ? parseFloat(formValue.budget) : undefined,
        teamMembers: formValue.team
          ? formValue.team.map((userId: string) => ({
              user: userId,
              role: 'developer',
              joinedAt: new Date(),
            }))
          : [],
        tags: formValue.tags
          ? formValue.tags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag)
          : [],
      };

      const operation = this.isEditMode
        ? this.projectService.updateProject(this.projectId!, projectData)
        : this.projectService.createProject(projectData);

      operation.subscribe({
        next: (response: ApiResponse<{ project: Project }>) => {
          if (response.success) {
            this.router.navigate(['/projects']);
          }
        },
        error: (error: any) => {
          this.error = error.error?.message || 'Failed to save project';
          this.loading = false;
        },
      });
    }
  }

  onTeamMemberChange(userId: string, event: any) {
    const team = this.projectForm.get('team')?.value || [];
    if (event.target.checked) {
      if (!team.includes(userId)) {
        team.push(userId);
      }
    } else {
      const index = team.indexOf(userId);
      if (index > -1) {
        team.splice(index, 1);
      }
    }
    this.projectForm.patchValue({ team });
  }

  isTeamMemberSelected(userId: string): boolean {
    const team = this.projectForm.get('team')?.value || [];
    return team.includes(userId);
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
    }
    return '';
  }

  onCancel() {
    this.router.navigate(['/projects']);
  }

  get managersOnly(): User[] {
    return this.availableUsers.filter(
      (user) => user.role === 'admin' || user.role === 'project_manager'
    );
  }
}
