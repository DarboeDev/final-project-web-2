import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { ApiResponse } from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API_URL = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getAllTasks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    project?: string;
    assignedTo?: string;
  }): Observable<ApiResponse<{ tasks: Task[] }>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<{ tasks: Task[] }>>(this.API_URL, {
      params: httpParams,
    });
  }

  getMyTasks(params?: {
    status?: string;
    priority?: string;
  }): Observable<ApiResponse<{ tasks: Task[] }>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<{ tasks: Task[] }>>(
      `${this.API_URL}/my-tasks`,
      { params: httpParams }
    );
  }

  getTaskById(id: string): Observable<ApiResponse<{ task: Task }>> {
    return this.http.get<ApiResponse<{ task: Task }>>(`${this.API_URL}/${id}`);
  }

  createTask(task: Partial<Task>): Observable<ApiResponse<{ task: Task }>> {
    return this.http.post<ApiResponse<{ task: Task }>>(this.API_URL, task);
  }

  updateTask(
    id: string,
    task: Partial<Task>
  ): Observable<ApiResponse<{ task: Task }>> {
    return this.http.put<ApiResponse<{ task: Task }>>(
      `${this.API_URL}/${id}`,
      task
    );
  }

  deleteTask(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/${id}`);
  }

  addComment(taskId: string, text: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/${taskId}/comments`, {
      text,
    });
  }

  uploadAttachment(taskId: string, file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(
      `${this.API_URL}/${taskId}/attachments`,
      formData
    );
  }
}
