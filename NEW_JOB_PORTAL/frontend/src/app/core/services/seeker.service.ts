import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, Job } from '../models/models';
import { API_BASE_URL } from '../constants/api.constants';

export interface SeekerProfile {
  id?: number;
  headline?: string;
  bio?: string;
  experienceYears?: number;
  skills?: string;
  educationJson?: string;
  experienceJson?: string;
  completenessScore?: number;
  privacyVisibility?: string;
  resumeUrl?: string;
  exchangeRegistrationNo?: string;
  openToContact?: boolean;
}

export interface SeekerDashboardData {
  profileCompleteness: number;
  totalApplications: number;
  shortlistedCount: number;
  interviewCount: number;
  recentApplications: Application[];
  recommendedJobs: Job[];
}

@Injectable({
  providedIn: 'root'
})
export class SeekerService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<SeekerProfile> {
    return this.http.get<SeekerProfile>(`${API_BASE_URL}/seeker/profile`);
  }

  updateProfile(profile: SeekerProfile): Observable<SeekerProfile> {
    return this.http.put<SeekerProfile>(`${API_BASE_URL}/seeker/profile`, profile);
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${API_BASE_URL}/seeker/applications`);
  }

  getDashboard(): Observable<SeekerDashboardData> {
    return this.http.get<SeekerDashboardData>(`${API_BASE_URL}/seeker/dashboard`);
  }
}
