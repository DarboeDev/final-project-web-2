import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.tokenSubject.next(token);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.logout();
      }
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setAuthData(response.data.user, response.data.token);
          }
        })
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setAuthData(response.data.user, response.data.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.API_URL}/profile`);
  }

  updateProfile(userData: Partial<User>): Observable<AuthResponse> {
    return this.http
      .put<AuthResponse>(`${this.API_URL}/profile`, userData)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        })
      );
  }

  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.put(`${this.API_URL}/change-password`, passwordData);
  }

  private setAuthData(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.token;
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser;
    return user ? roles.includes(user.role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole(['admin']);
  }

  isManager(): boolean {
    return this.hasRole(['admin', 'project_manager']);
  }
}
