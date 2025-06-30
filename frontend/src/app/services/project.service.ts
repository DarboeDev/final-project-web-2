import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project.interface';
import { ApiResponse } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly API_URL = 'http://localhost:5000/api/projects';

  constructor(private http: HttpClient) {}

  getAllProjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
  }): Observable<ApiResponse<{ projects: Project[] }>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<{ projects: Project[] }>>(this.API_URL, {
      params: httpParams,
    });
  }

  getProjectById(id: string): Observable<ApiResponse<{ project: Project }>> {
    return this.http.get<ApiResponse<{ project: Project }>>(
      `${this.API_URL}/${id}`
    );
  }

  createProject(
    project: Partial<Project>
  ): Observable<ApiResponse<{ project: Project }>> {
    return this.http.post<ApiResponse<{ project: Project }>>(
      this.API_URL,
      project
    );
  }

  updateProject(
    id: string,
    project: Partial<Project>
  ): Observable<ApiResponse<{ project: Project }>> {
    return this.http.put<ApiResponse<{ project: Project }>>(
      `${this.API_URL}/${id}`,
      project
    );
  }

  deleteProject(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/${id}`);
  }

  getProjectTasks(
    id: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Observable<ApiResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse>(`${this.API_URL}/${id}/tasks`, {
      params: httpParams,
    });
  }
}
