import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/models';
import { API_BASE_URL } from '../constants/api.constants';

export interface AuthResponse {
  token: string;
  tokenType?: string;
  // Flat fields returned by the backend
  userId: number;
  email: string;
  displayName: string;
  role: 'ROLE_SEEKER' | 'ROLE_RECRUITER' | 'ROLE_ADMIN';
  avatarUrl?: string;
  headline?: string;
  companyId?: number;
  companyName?: string;
  // Convenience: mapped user object (populated by the tap in login/register)
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userSignal = signal<User | null>(null);
  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isSeeker = computed(() => this.userSignal()?.role === 'ROLE_SEEKER');
  readonly isRecruiter = computed(() => this.userSignal()?.role === 'ROLE_RECRUITER');
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ROLE_ADMIN');

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  private restoreSession() {
    const savedUser = localStorage.getItem('jobportal_user');
    const token = localStorage.getItem('jobportal_token');
    if (savedUser && token) {
      try {
        this.userSignal.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<any>(`${API_BASE_URL}/auth/login`, credentials).pipe(
      tap((raw: any) => {
        // Map flat backend response → User object
        const user: User = {
          id: raw.userId,
          email: raw.email,
          displayName: raw.displayName,
          role: raw.role,
          avatarUrl: raw.avatarUrl,
          headline: raw.headline
        };
        raw.user = user;
        localStorage.setItem('jobportal_token', raw.token);
        localStorage.setItem('jobportal_user', JSON.stringify(user));
        this.userSignal.set(user);
      })
    );
  }

  registerSeeker(payload: { email: string; password: string; displayName: string; phone?: string; headline?: string }): Observable<AuthResponse> {
    const body = { ...payload, role: 'ROLE_SEEKER' };
    return this.http.post<any>(`${API_BASE_URL}/auth/register`, body).pipe(
      tap((raw: any) => {
        const user: User = {
          id: raw.userId,
          email: raw.email,
          displayName: raw.displayName,
          role: raw.role,
          avatarUrl: raw.avatarUrl,
          headline: raw.headline
        };
        raw.user = user;
        localStorage.setItem('jobportal_token', raw.token);
        localStorage.setItem('jobportal_user', JSON.stringify(user));
        this.userSignal.set(user);
      })
    );
  }

  registerRecruiter(payload: { email: string; password: string; displayName: string; phone?: string; companyName: string; designation?: string; industry?: string; location?: string }): Observable<AuthResponse> {
    const body = { ...payload, role: 'ROLE_RECRUITER', companyIndustry: payload.industry, companyLocation: payload.location };
    return this.http.post<any>(`${API_BASE_URL}/auth/register`, body).pipe(
      tap((raw: any) => {
        const user: User = {
          id: raw.userId,
          email: raw.email,
          displayName: raw.displayName,
          role: raw.role,
          avatarUrl: raw.avatarUrl,
          headline: raw.headline
        };
        raw.user = user;
        localStorage.setItem('jobportal_token', raw.token);
        localStorage.setItem('jobportal_user', JSON.stringify(user));
        this.userSignal.set(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('jobportal_token');
    localStorage.removeItem('jobportal_user');
    this.userSignal.set(null);
  }

  setUser(user: User) {
    this.userSignal.set(user);
    localStorage.setItem('jobportal_user', JSON.stringify(user));
  }
}
