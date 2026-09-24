import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, Application, Company, Participant } from '../models/models';
import { API_BASE_URL } from '../constants/api.constants';

export interface CandidateResult {
  id: number;
  participant?: Participant;
  skills: string;
  experienceYears: number;
  completenessScore: number;
  headline: string;
  bio: string;
  exchangeRegistrationNo?: string;
}

export interface AtsUpdatePayload {
  status: string;
  recruiterNotes?: string;
  rating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {
  constructor(private http: HttpClient) { }

  getMyJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${API_BASE_URL}/recruiter/jobs`);
  }

  getJobApplications(jobId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${API_BASE_URL}/recruiter/jobs/${jobId}/applications`);
  }

  updateAtsStatus(applicationId: number, payload: AtsUpdatePayload): Observable<Application> {
    return this.http.patch<Application>(`${API_BASE_URL}/recruiter/applications/${applicationId}/status`, payload);
  }

  searchCandidates(skills?: string, minExp?: number): Observable<CandidateResult[]> {
    let params = new HttpParams();
    if (skills) params = params.set('skills', skills);
    if (minExp !== undefined && minExp !== null) params = params.set('minExp', minExp.toString());
    return this.http.get<CandidateResult[]>(`${API_BASE_URL}/recruiter/candidates`, { params });
  }

  getCompany(): Observable<Company> {
    return this.http.get<Company>(`${API_BASE_URL}/recruiter/company`);
  }

  updateCompany(company: Partial<Company>): Observable<Company> {
    return this.http.put<Company>(`${API_BASE_URL}/recruiter/company`, company);
  }
}
