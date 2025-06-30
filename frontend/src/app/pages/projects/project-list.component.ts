import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../interfaces/project.interface';
import { User } from '../../interfaces/auth.interface';
import { ApiResponse } from '../../interfaces/common.interface';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  loading = true;
  error = '';
  currentUser: User | null = null;

  // Filters
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalPages = 0;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.error = '';

    const params = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
    };

    this.projectService.getAllProjects(params).subscribe({
      next: (response: ApiResponse<{ projects: Project[] }>) => {
        if (response.success && response.data) {
          this.projects = response.data.projects;
          this.filteredProjects = [...this.projects];
          this.applyFiltersAndSort();
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to load projects';
        this.loading = false;
      },
    });
  }

  applyFiltersAndSort() {
    let filtered = [...this.projects];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          (project.description &&
            project.description.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(
        (project) => project.status === this.statusFilter
      );
    }

    // Apply priority filter
    if (this.priorityFilter) {
      filtered = filtered.filter(
        (project) => project.priority === this.priorityFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[this.sortBy as keyof Project];
      let bValue: any = b[this.sortBy as keyof Project];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredProjects = filtered;
    this.totalPages = Math.ceil(this.filteredProjects.length / this.pageSize);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onSortChange(field: string) {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.applyFiltersAndSort();
  }

  getPaginatedProjects(): Project[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProjects.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
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

  canManageProjects(): boolean {
    return (
      this.currentUser?.role === 'admin' ||
      this.currentUser?.role === 'project_manager'
    );
  }
}
