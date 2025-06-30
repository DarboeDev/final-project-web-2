import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/auth.interface';
import { ApiResponse, DashboardStats } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Observable<ApiResponse<{ users: User[] }>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<{ users: User[] }>>(this.API_URL, {
      params: httpParams,
    });
  }

  getUserById(id: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.API_URL}/${id}`);
  }

  updateUser(
    id: string,
    userData: Partial<User>
  ): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(
      `${this.API_URL}/${id}`,
      userData
    );
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/${id}`);
  }

  getTeamMembers(): Observable<ApiResponse<{ users: User[] }>> {
    return this.http.get<ApiResponse<{ users: User[] }>>(
      `${this.API_URL}/team-members`
    );
  }

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(
      `${this.API_URL}/dashboard-stats`
    );
  }

  updateProfile(profileData: any): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(
      `${this.API_URL}/profile`,
      profileData
    );
  }

  updateUserRole(
    id: string,
    role: string
  ): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(
      `${this.API_URL}/${id}/role`,
      { role }
    );
  }
}
