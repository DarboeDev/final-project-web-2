import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { User } from '../../interfaces/auth.interface';
import { Project } from '../../interfaces/project.interface';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  currentUser: User | null = null;
  teamMembers: User[] = [];
  projects: Project[] = [];
  loading = false;
  searchTerm = '';
  selectedRole = '';
  selectedDepartment = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.loadTeamData();
  }

  loadTeamData(): void {
    this.loading = true;

    // Load team members
    this.userService.getTeamMembers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.teamMembers = response.data.users;
          console.log('Team members loaded:', this.teamMembers);
          // Debug: Check isActive property for each member
          this.teamMembers.forEach((member) => {
            console.log(
              `Member: ${member.fullName}, isActive: ${
                member.isActive
              }, type: ${typeof member.isActive}`
            );
          });
        }
      },
      error: (error: any) =>
        console.error('Error loading team members:', error),
    });

    // Load projects for current user
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.projects = response.data.projects;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      },
    });
  }

  get filteredTeamMembers(): User[] {
    return this.teamMembers.filter((member) => {
      const matchesSearch =
        member.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (member.department || '')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesRole =
        !this.selectedRole || member.role === this.selectedRole;
      const matchesDepartment =
        !this.selectedDepartment ||
        member.department === this.selectedDepartment;

      return matchesSearch && matchesRole && matchesDepartment;
    });
  }

  get uniqueDepartments(): string[] {
    const departments = this.teamMembers
      .map((member) => member.department)
      .filter(
        (dept, index, arr) => dept && arr.indexOf(dept) === index
      ) as string[];
    return departments;
  }

  getUserProjects(userId: string): Project[] {
    return this.projects.filter((project) => {
      const managerId =
        typeof project.projectManager === 'string'
          ? project.projectManager
          : project.projectManager._id;
      const isManager = managerId === userId;
      const isTeamMember = project.teamMembers.some((member) => {
        const memberId =
          typeof member.user === 'string' ? member.user : member.user._id;
        return memberId === userId;
      });
      return isManager || isTeamMember;
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'project_manager':
        return 'bg-blue-100 text-blue-800';
      case 'team_member':
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedDepartment = '';
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map((name) => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }
}
