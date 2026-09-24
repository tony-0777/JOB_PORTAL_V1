import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecruiterService } from '../../core/services/recruiter.service';
import { AuthService } from '../../core/services/auth.service';
import { Job } from '../../core/models/models';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="recruiter-page-container">
      <div class="recruiter-hero">
        <div>
          <h1>Employer Hiring Portal</h1>
          <p class="hero-sub">Manage active requisitions, ATS applicant pipeline, and masked candidate communications.</p>
        </div>
        <div class="hero-actions">
          <a routerLink="/recruiter/post-job" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Post New Requisition</span>
          </a>
          <a routerLink="/recruiter/ats" class="btn btn-secondary">
            <span>Open ATS Kanban</span>
          </a>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="metrics-row">
        <div class="metric-card">
          <span class="m-val">{{ jobs().length }}</span>
          <span class="m-lbl">Active Requisitions</span>
        </div>
        <div class="metric-card">
          <span class="m-val">{{ totalApplicants() }}</span>
          <span class="m-lbl">Total Candidates in ATS</span>
        </div>
        <div class="metric-card">
          <span class="m-val highlight">100%</span>
          <span class="m-lbl">Zero-Spam Contact Privacy</span>
        </div>
      </div>

      <!-- Posted Jobs Table -->
      <div class="jobs-table-card">
        <div class="table-header">
          <h2>Active Job Requisitions</h2>
          <a routerLink="/recruiter/post-job" class="btn btn-primary btn-sm">+ Post Role</a>
        </div>

        @if (isLoading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading your jobs...</p>
          </div>
        } @else if (jobs().length === 0) {
          <div class="empty-state">
            <p>No job requisitions created yet.</p>
            <a routerLink="/recruiter/post-job" class="btn btn-primary btn-sm">Post First Job</a>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Work Mode</th>
                  <th>Applications</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (job of jobs(); track job.id) {
                  <tr>
                    <td>
                      <div class="job-cell">
                        <strong>{{ job.title }}</strong>
                        <span class="loc">{{ job.location || 'Remote' }}</span>
                      </div>
                    </td>
                    <td><span class="chip-mode">{{ job.workMode }}</span></td>
                    <td>
                      <span class="app-count-badge">{{ job.applicationCount || 0 }} Candidates</span>
                    </td>
                    <td>{{ job.viewCount || 0 }}</td>
                    <td>
                      <span class="status-pill active">{{ job.status }}</span>
                    </td>
                    <td>
                      <div class="actions-cell">
                        <a [routerLink]="['/recruiter/ats']" [queryParams]="{ jobId: job.id }" class="btn-action ats" title="Open in Kanban ATS">
                          ATS Pipeline
                        </a>
                        <a [routerLink]="['/jobs', job.id]" class="btn-action view" title="View Public Post">
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .recruiter-page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .recruiter-hero {
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
    .recruiter-hero h1 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .hero-sub {
      font-size: 0.9rem;
      color: var(--text-tertiary);
    }
    .hero-actions {
      display: flex;
      gap: 0.75rem;
    }
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .metric-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .m-val {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .m-val.highlight {
      color: #34d399;
    }
    .m-lbl {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .jobs-table-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .table-header h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .table-responsive {
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th {
      padding: 0.85rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-glass);
    }
    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .job-cell {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .job-cell strong {
      color: var(--text-primary);
    }
    .loc {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }
    .chip-mode {
      background: rgba(99, 102, 241, 0.12);
      color: #a5b4fc;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .app-count-badge {
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .status-pill {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    .status-pill.active {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }
    .btn-action {
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-action.ats {
      background: rgba(99, 102, 241, 0.2);
      color: #c7d2fe;
    }
    .btn-action.ats:hover {
      background: var(--primary);
      color: white;
    }
    .btn-action.view {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
    }
    .btn-action.view:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
    }
    @media (max-width: 900px) {
      .recruiter-hero { flex-direction: column; align-items: flex-start; }
      .metrics-row { grid-template-columns: 1fr; }
    }
  `]
})
export class RecruiterDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private recruiterService = inject(RecruiterService);

  jobs = signal<Job[]>([]);
  totalApplicants = signal<number>(0);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.recruiterService.getMyJobs().subscribe({
      next: (j) => {
        this.jobs.set(j);
        const total = j.reduce((acc, curr) => acc + (curr.applicationCount || 0), 0);
        this.totalApplicants.set(total);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
