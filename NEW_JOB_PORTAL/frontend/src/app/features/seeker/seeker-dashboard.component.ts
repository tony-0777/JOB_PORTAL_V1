import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeekerService, SeekerDashboardData } from '../../core/services/seeker.service';
import { AuthService } from '../../core/services/auth.service';
import { Application } from '../../core/models/models';

@Component({
  selector: 'app-seeker-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page-container">
      <!-- Welcome Header -->
      <div class="dashboard-hero">
        <div class="user-greeting">
          <img [src]="auth.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'" alt="Avatar" class="hero-avatar">
          <div>
            <h1>Welcome back, {{ auth.currentUser()?.displayName }}!</h1>
            <p class="hero-subtitle">{{ auth.currentUser()?.headline || 'Senior Full-Stack Engineer' }}</p>
          </div>
        </div>
        <div class="quick-actions">
          <a routerLink="/jobs" class="btn btn-primary btn-sm">Browse New Jobs</a>
          <a routerLink="/seeker/profile" class="btn btn-secondary btn-sm">Edit Profile</a>
        </div>
      </div>

      <!-- Stats Overview Row -->
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-icon-wrap icon-purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="stat-data">
            <span class="stat-val">{{ dashboardData()?.totalApplications || 0 }}</span>
            <span class="stat-lbl">Jobs Applied</span>
          </div>
        </div>

        <div class="stat-box">
          <div class="stat-icon-wrap icon-amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
          </div>
          <div class="stat-data">
            <span class="stat-val">{{ dashboardData()?.shortlistedCount || 0 }}</span>
            <span class="stat-lbl">Shortlisted</span>
          </div>
        </div>

        <div class="stat-box">
          <div class="stat-icon-wrap icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div class="stat-data">
            <span class="stat-val">{{ dashboardData()?.interviewCount || 0 }}</span>
            <span class="stat-lbl">In-App Interviews</span>
          </div>
        </div>

        <div class="stat-box">
          <div class="stat-icon-wrap icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div class="stat-data">
            <span class="stat-val">{{ dashboardData()?.profileCompleteness || 92 }}%</span>
            <span class="stat-lbl">Profile Strength</span>
          </div>
        </div>
      </div>

      <!-- Main Layout: Applications Tracker + Recommended Feed -->
      <div class="dashboard-columns">
        <!-- Left: Applications Tracker with Interactive Timeline -->
        <div class="main-column">
          <div class="section-card">
            <div class="card-title-bar">
              <h2>My Applications & ATS Progress</h2>
              <span class="active-badge">{{ applications().length }} Active</span>
            </div>

            @if (isLoading()) {
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Retrieving your application history...</p>
              </div>
            } @else if (applications().length === 0) {
              <div class="empty-state">
                <p>You haven't submitted any job applications yet.</p>
                <a routerLink="/jobs" class="btn btn-primary btn-sm">Explore Open Positions</a>
              </div>
            } @else {
              <div class="applications-list">
                @for (app of applications(); track app.id) {
                  <div class="app-card">
                    <div class="app-top-row">
                      <div class="job-meta">
                        <h3 class="app-job-title">{{ app.jobTitle }}</h3>
                        <span class="app-comp-name">{{ app.companyName }}</span>
                      </div>
                      <span class="app-status-badge" [ngClass]="app.status.toLowerCase()">
                        {{ formatStatus(app.status) }}
                      </span>
                    </div>

                    <!-- Visual ATS Stage Progress Bar -->
                    <div class="ats-timeline">
                      <div class="timeline-step" [class.completed]="isStepCompleted(app.status, 'APPLIED')">
                        <div class="step-dot"></div>
                        <span class="step-label">Applied</span>
                      </div>
                      <div class="timeline-line" [class.active]="isStepCompleted(app.status, 'SCREENED')"></div>
                      <div class="timeline-step" [class.completed]="isStepCompleted(app.status, 'SCREENED')">
                        <div class="step-dot"></div>
                        <span class="step-label">Screened</span>
                      </div>
                      <div class="timeline-line" [class.active]="isStepCompleted(app.status, 'SHORTLISTED')"></div>
                      <div class="timeline-step" [class.completed]="isStepCompleted(app.status, 'SHORTLISTED')">
                        <div class="step-dot"></div>
                        <span class="step-label">Shortlisted</span>
                      </div>
                      <div class="timeline-line" [class.active]="isStepCompleted(app.status, 'INTERVIEW_SCHEDULED')"></div>
                      <div class="timeline-step" [class.completed]="isStepCompleted(app.status, 'INTERVIEW_SCHEDULED')">
                        <div class="step-dot"></div>
                        <span class="step-label">Interview</span>
                      </div>
                      <div class="timeline-line" [class.active]="isStepCompleted(app.status, 'HIRED')"></div>
                      <div class="timeline-step" [class.completed]="isStepCompleted(app.status, 'HIRED')">
                        <div class="step-dot"></div>
                        <span class="step-label">Offer / Hired</span>
                      </div>
                    </div>

                    <!-- Note / Feedback from Recruiter if any -->
                    @if (app.recruiterNotes) {
                      <div class="recruiter-feedback-box">
                        <strong>Recruiter Note:</strong> {{ app.recruiterNotes }}
                      </div>
                    }

                    <div class="app-bottom-row">
                      <span class="app-date">Applied on {{ app.appliedAt | date:'mediumDate' }}</span>
                      <a routerLink="/chat" class="chat-shortcut-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <span>Message Hiring Team</span>
                      </a>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Right Side: Govt Exchange Status & Recommended Jobs -->
        <div class="side-column">
          <!-- Employment Exchange Card -->
          <div class="section-card govt-card">
            <div class="govt-badge-small">Anubandhan Model</div>
            <h3>Public Employment Services</h3>
            <p>Your unique registration gives priority access to Gujarat State Rozgar Mela job camps.</p>
            <div class="exchange-status-pill">
              <span class="dot-green"></span>
              <span>Registration Status: <strong>Active</strong></span>
            </div>
            <a routerLink="/exchange" class="btn btn-secondary btn-sm mt-3 w-100 text-center">Open Exchange Hub</a>
          </div>

          <!-- Privacy Reminder -->
          <div class="section-card privacy-card">
            <div class="privacy-icon-bar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              <h4>Zero Contact Leakage</h4>
            </div>
            <p>Your phone number (+91 9876543210) is encrypted. Employers connect with you solely via in-app STOMP chat or masked WebRTC calling.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page-container {
      max-width: 1350px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .dashboard-hero {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1.5rem;
    }
    .user-greeting {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .hero-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-light);
    }
    .user-greeting h1 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .hero-subtitle {
      font-size: 0.9rem;
      color: var(--text-tertiary);
    }
    .quick-actions {
      display: flex;
      gap: 0.75rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .stat-box {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .stat-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-purple { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .icon-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .icon-green { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .icon-blue { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .stat-data {
      display: flex;
      flex-direction: column;
    }
    .stat-val {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .stat-lbl {
      font-size: 0.78rem;
      color: var(--text-tertiary);
    }
    .dashboard-columns {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 2rem;
    }
    .section-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
    }
    .card-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .card-title-bar h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .active-badge {
      background: rgba(99, 102, 241, 0.15);
      color: var(--primary-light);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
    }
    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .app-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .app-top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .app-job-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .app-comp-name {
      font-size: 0.85rem;
      color: var(--primary-light);
    }
    .app-status-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      text-transform: uppercase;
    }
    .app-status-badge.new { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .app-status-badge.screened { background: rgba(147, 51, 234, 0.15); color: #c084fc; }
    .app-status-badge.shortlisted { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .app-status-badge.interview_scheduled { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .app-status-badge.offer_sent { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
    .app-status-badge.hired { background: rgba(16, 185, 129, 0.3); color: #10b981; }
    .app-status-badge.rejected { background: rgba(244, 63, 94, 0.15); color: #f43f5e; }
    .ats-timeline {
      display: flex;
      align-items: center;
      margin: 0.5rem 0;
    }
    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      position: relative;
    }
    .step-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    .completed .step-dot {
      background: #10b981;
      border-color: #34d399;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
    }
    .step-label {
      font-size: 0.68rem;
      color: var(--text-tertiary);
    }
    .completed .step-label {
      color: #34d399;
      font-weight: 600;
    }
    .timeline-line {
      flex: 1;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      margin: 0 4px;
      transform: translateY(-8px);
    }
    .timeline-line.active {
      background: #10b981;
    }
    .recruiter-feedback-box {
      background: rgba(99, 102, 241, 0.1);
      border-left: 3px solid var(--primary-light);
      padding: 0.6rem 0.85rem;
      border-radius: 4px;
      font-size: 0.82rem;
      color: var(--text-secondary);
    }
    .app-bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 0.75rem;
      font-size: 0.78rem;
      color: var(--text-tertiary);
    }
    .chat-shortcut-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--primary-light);
      text-decoration: none;
      font-weight: 600;
    }
    .side-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .govt-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 78, 59, 0.2) 100%);
      border-color: rgba(16, 185, 129, 0.3);
    }
    .govt-badge-small {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      color: #34d399;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .govt-card h3 {
      font-size: 1.1rem;
      color: white;
      margin-bottom: 0.5rem;
    }
    .govt-card p {
      font-size: 0.82rem;
      color: #cbd5e1;
      line-height: 1.5;
    }
    .exchange-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.2);
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.78rem;
      color: #a7f3d0;
      margin-top: 0.75rem;
    }
    .dot-green {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
    }
    .privacy-card {
      background: rgba(30, 41, 59, 0.25);
    }
    .privacy-icon-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #818cf8;
      margin-bottom: 0.5rem;
    }
    .privacy-icon-bar h4 {
      font-size: 0.95rem;
      color: var(--text-primary);
    }
    .privacy-card p {
      font-size: 0.82rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    @media (max-width: 900px) {
      .dashboard-hero { flex-direction: column; align-items: flex-start; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .dashboard-columns { grid-template-columns: 1fr; }
    }
  `]
})
export class SeekerDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private seekerService = inject(SeekerService);

  dashboardData = signal<SeekerDashboardData | null>(null);
  applications = signal<Application[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.seekerService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        if (data.recentApplications) {
          this.applications.set(data.recentApplications);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.seekerService.getApplications().subscribe({
      next: (apps) => {
        if (apps && apps.length > 0) {
          this.applications.set(apps);
        }
      }
    });
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  isStepCompleted(currentStatus: string, step: string): boolean {
    const order = ['APPLIED', 'SCREENED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFER_SENT', 'HIRED'];
    const statusMap: Record<string, string> = {
      'NEW': 'APPLIED',
      'SCREENED': 'SCREENED',
      'SHORTLISTED': 'SHORTLISTED',
      'INTERVIEW_SCHEDULED': 'INTERVIEW_SCHEDULED',
      'OFFER_SENT': 'OFFER_SENT',
      'HIRED': 'HIRED',
      'REJECTED': 'APPLIED'
    };
    const mappedCurrent = statusMap[currentStatus] || 'APPLIED';
    return order.indexOf(mappedCurrent) >= order.indexOf(step);
  }
}
