import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  error = '';
  success = '';
  currentUser: User | null = null;
  profileUser: User | null = null;
  isViewingOtherUser = false;
  isEditMode = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUser;

    // Check if we're viewing a specific user's profile
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      if (this.userId) {
        this.isViewingOtherUser = true;
        this.loadUserProfile(this.userId);
      } else {
        this.isViewingOtherUser = false;
        this.profileUser = this.currentUser;
        this.initForm();
      }
    });

    // Check if we're in edit mode
    this.route.queryParams.subscribe((params) => {
      this.isEditMode = params['edit'] === 'true';
    });
  }

  loadUserProfile(userId: string) {
    this.loading = true;
    this.userService.getUserById(userId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profileUser = response.data.user;
          this.initForm();
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load user profile';
        this.loading = false;
        console.error('Error loading user profile:', error);
      },
    });
  }

  initForm() {
    this.profileForm = this.fb.group({
      fullName: [this.profileUser?.fullName || '', [Validators.required]],
      email: [
        this.profileUser?.email || '',
        [Validators.required, Validators.email],
      ],
      department: [this.profileUser?.department || ''],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
    });

    // Disable form if viewing another user's profile and current user is not admin, or not in edit mode
    if (
      this.isViewingOtherUser &&
      (this.currentUser?.role !== 'admin' || !this.isEditMode)
    ) {
      this.profileForm.disable();
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formValue = this.profileForm.value;

      // Check if passwords match when changing password
      if (
        formValue.newPassword &&
        formValue.newPassword !== formValue.confirmPassword
      ) {
        this.error = 'New passwords do not match';
        this.loading = false;
        return;
      }

      const updateData: any = {
        fullName: formValue.fullName,
        email: formValue.email,
        department: formValue.department,
      };

      // Only include password fields if user wants to change password
      if (formValue.newPassword) {
        updateData.currentPassword = formValue.currentPassword;
        updateData.newPassword = formValue.newPassword;
      }

      // Use appropriate service method based on whether editing own profile or another user's
      const updateObservable =
        this.isViewingOtherUser && this.userId
          ? this.userService.updateUser(this.userId, updateData)
          : this.userService.updateProfile(updateData);

      updateObservable.subscribe({
        next: (response: any) => {
          this.success = 'Profile updated successfully!';
          this.loading = false;
          // Reset password fields
          this.profileForm.patchValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });

          // Reload user data if viewing another user
          if (this.isViewingOtherUser && this.userId) {
            this.loadUserProfile(this.userId);
          }
        },
        error: (error: any) => {
          this.error = error.error?.message || 'Failed to update profile';
          this.loading = false;
        },
      });
    }
  }

  canEdit(): boolean {
    return (
      !this.isViewingOtherUser ||
      (this.currentUser?.role === 'admin' && this.isEditMode)
    );
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  goBack(): void {
    // If viewing another user's profile from team page, go back to team
    // Otherwise go back to previous page or dashboard
    const navigation = this.router.getCurrentNavigation();
    const previousUrl = navigation?.previousNavigation?.finalUrl?.toString();

    if (this.isViewingOtherUser && previousUrl?.includes('/team')) {
      this.router.navigate(['/team']);
    } else {
      window.history.back();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['minlength'])
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
