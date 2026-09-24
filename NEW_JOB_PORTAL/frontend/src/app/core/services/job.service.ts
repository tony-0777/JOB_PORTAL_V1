import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, Application } from '../models/models';
import { API_BASE_URL } from '../constants/api.constants';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private http: HttpClient) {}

  searchJobs(filters: {
    keyword?: string;
    location?: string;
    workMode?: string;
    jobType?: string;
    category?: string;
    minSalary?: number;
    maxExp?: number;
    page?: number;
    size?: number;
  }): Observable<PageResponse<Job>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val.toString());
      }
    });
    return this.http.get<PageResponse<Job>>(`${API_BASE_URL}/jobs`, { params });
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${API_BASE_URL}/jobs/${id}`);
  }

  getFeaturedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${API_BASE_URL}/jobs/featured`);
  }

  createJob(job: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(`${API_BASE_URL}/jobs`, job);
  }

  updateJob(id: number, job: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${API_BASE_URL}/jobs/${id}`, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/jobs/${id}`);
  }

  applyJob(jobId: number, application: { coverNote?: string; screeningAnswers?: Record<string, string>; resumeUrl?: string }): Observable<Application> {
    return this.http.post<Application>(`${API_BASE_URL}/jobs/${jobId}/apply`, application);
  }
}
