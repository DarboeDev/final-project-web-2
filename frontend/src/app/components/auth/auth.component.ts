import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  isLogin = true;
  authForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (!this.isLogin) {
      this.authForm.addControl(
        'fullName',
        this.fb.control('', [Validators.required])
      );
      this.authForm.addControl(
        'confirmPassword',
        this.fb.control('', [Validators.required])
      );
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
    this.initForm();
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.loading = true;
      this.error = '';

      const formValue = this.authForm.value;

      if (this.isLogin) {
        this.authService
          .login({ email: formValue.email, password: formValue.password })
          .subscribe({
            next: () => {
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              this.error = error.error?.message || 'Authentication failed';
              this.loading = false;
            },
          });
      } else {
        if (formValue.password !== formValue.confirmPassword) {
          this.error = 'Passwords do not match';
          this.loading = false;
          return;
        }

        this.authService
          .register({
            fullName: formValue.fullName,
            email: formValue.email,
            password: formValue.password,
          })
          .subscribe({
            next: () => {
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              this.error = error.error?.message || 'Registration failed';
              this.loading = false;
            },
          });
      }
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.authForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['minlength'])
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
