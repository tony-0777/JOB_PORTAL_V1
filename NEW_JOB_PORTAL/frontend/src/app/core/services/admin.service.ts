import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatformStats, Company, Job, User } from '../models/models';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<PlatformStats> {
    return this.http.get<PlatformStats>(`${API_BASE_URL}/admin/stats`);
  }

  getPendingKyc(): Observable<Company[]> {
    return this.http.get<Company[]>(`${API_BASE_URL}/admin/kyc/pending`);
  }

  verifyCompany(companyId: number, status: 'VERIFIED' | 'REJECTED'): Observable<Company> {
    return this.http.post<Company>(`${API_BASE_URL}/admin/kyc/${companyId}/verify`, { status });
  }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${API_BASE_URL}/admin/companies`);
  }

  moderateJob(jobId: number, status: string): Observable<Job> {
    return this.http.post<Job>(`${API_BASE_URL}/admin/jobs/${jobId}/moderate`, { status });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_BASE_URL}/admin/users`);
  }
}
