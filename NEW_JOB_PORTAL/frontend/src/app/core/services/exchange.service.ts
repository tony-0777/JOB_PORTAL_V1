import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GovtExchangeProfile } from '../models/models';
import { API_BASE_URL } from '../constants/api.constants';

export interface SchemeInfo {
  name: string;
  category: string;
  benefit: string;
  description: string;
}

export interface JobFairInfo {
  title: string;
  location: string;
  date: string;
  participatingCompanies: number;
  openings: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  constructor(private http: HttpClient) {}

  register(profile: GovtExchangeProfile): Observable<GovtExchangeProfile> {
    return this.http.post<GovtExchangeProfile>(`${API_BASE_URL}/exchange/register`, profile);
  }

  getProfile(): Observable<GovtExchangeProfile> {
    return this.http.get<GovtExchangeProfile>(`${API_BASE_URL}/exchange/profile`);
  }

  getSchemes(): Observable<SchemeInfo[]> {
    return this.http.get<SchemeInfo[]>(`${API_BASE_URL}/exchange/schemes`);
  }

  getJobFairs(): Observable<JobFairInfo[]> {
    return this.http.get<JobFairInfo[]>(`${API_BASE_URL}/exchange/fairs`);
  }
}
