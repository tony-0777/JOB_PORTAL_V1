import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../core/services/job.service';
import { AuthService } from '../../core/services/auth.service';
import { Job } from '../../core/models/models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (isLoading()) {
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading role details...</p>
      </div>
    } @else if (job(); as j) {
      <div class="detail-page-container">
        <!-- Breadcrumb & Back -->
        <div class="detail-top-nav">
          <a routerLink="/jobs" class="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            <span>Back to Opportunities</span>
          </a>
        </div>

        <div class="detail-layout">
          <!-- Main Content Left -->
          <div class="detail-main">
            <!-- Hero Header Card -->
            <div class="job-hero-card">
              <div class="hero-header-row">
                <img [src]="j.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120'" alt="Logo" class="detail-company-logo">
                <div class="hero-title-box">
                  <div class="badges-row">
                    <span class="badge badge-mode">{{ j.workMode }}</span>
                    <span class="badge badge-type">{{ j.jobType }}</span>
                    @if (j.urgent) {
                      <span class="badge badge-urgent">Urgent Need</span>
                    }
                  </div>
                  <h1 class="detail-job-title">{{ j.title }}</h1>
                  <div class="company-sub-row">
                    <span class="company-name-bold">{{ j.companyName }}</span>
                    <span class="dot">•</span>
                    <span>{{ j.location || 'Remote' }}</span>
                  </div>
                </div>
              </div>

              <!-- Quick Meta Highlights -->
              <div class="meta-stats-strip">
                <div class="meta-item">
                  <span class="meta-label">Offered Compensation</span>
                  <span class="meta-value salary">
                    ₹{{ (j.salaryMin ? j.salaryMin / 100000 : 15) | number:'1.0-1' }} - {{ (j.salaryMax ? j.salaryMax / 100000 : 30) | number:'1.0-1' }} LPA
                  </span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Experience Required</span>
                  <span class="meta-value">{{ j.experienceMin }} - {{ j.experienceMax }} Years</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Applicants</span>
                  <span class="meta-value">{{ j.applicationCount || 0 }} Applied</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Contact Privacy</span>
                  <span class="meta-value privacy">100% Masked</span>
                </div>
              </div>
            </div>

            <!-- Job Description -->
            <div class="content-block">
              <h2>Role Overview</h2>
              <p class="description-text">{{ j.description }}</p>
            </div>

            <!-- Requirements -->
            @if (j.requirements) {
              <div class="content-block">
                <h2>Key Requirements & Qualifications</h2>
                <div class="requirements-box">
                  <pre class="requirements-text">{{ j.requirements }}</pre>
                </div>
              </div>
            }

            <!-- Required Skills Tags -->
            @if (j.skills) {
              <div class="content-block">
                <h2>Core Tech Stack & Competencies</h2>
                <div class="skills-tag-cloud">
                  @for (skill of getSkills(j.skills); track skill) {
                    <span class="skill-bubble">{{ skill }}</span>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Right Sidebar: Company Card & Apply Actions -->
          <div class="detail-sidebar">
            <div class="apply-action-card">
              <h3>Ready to make an impact?</h3>
              <p class="apply-sub">Submit your candidacy in seconds. Your cellular number and email remain encrypted and hidden from unsolicited scrapers.</p>

              @if (applicationSuccess()) {
                <div class="success-banner">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <div>
                    <strong>Application Received!</strong>
                    <p>The hiring team has been notified. Track progress on your Seeker Dashboard.</p>
                  </div>
                  <a routerLink="/seeker/dashboard" class="btn btn-secondary btn-sm mt-2">Go to Dashboard</a>
                </div>
              } @else {
                <button (click)="openApplyModal()" class="btn btn-primary btn-apply-lg">
                  <span>Quick Apply Now</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              }

              <div class="privacy-guarantee-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                <span>Zero unsolicited calls. Recruiters reach out solely via verified in-app chat or masked WebRTC audio call.</span>
              </div>
            </div>

            <!-- Company Snapshot Card -->
            <div class="company-card-side">
              <h4>About the Employer</h4>
              <div class="company-mini-row">
                <img [src]="j.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'" alt="Logo" class="comp-thumb">
                <div>
                  <h5 class="comp-title">{{ j.companyName }}</h5>
                  <span class="kyc-badge verified">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified Enterprise
                  </span>
                </div>
              </div>
              <p class="comp-loc">📍 {{ j.location || 'Bengaluru, India' }}</p>
            </div>
          </div>
        </div>

        <!-- Apply Modal -->
        @if (showApplyModal()) {
          <div class="apply-modal-backdrop">
            <div class="apply-modal-box">
              <div class="modal-header">
                <div>
                  <h3>Apply for {{ j.title }}</h3>
                  <span class="modal-company">{{ j.companyName }}</span>
                </div>
                <button (click)="closeApplyModal()" class="btn-close-modal">✕</button>
              </div>

              <div class="modal-body">
                <div class="privacy-callout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  <span>Candidate Privacy Shield: Your direct contact info is masked. Recruiters can only chat or voice call you through JobPortalPro.</span>
                </div>

                <div class="form-group">
                  <label class="form-label">Cover Note / Why You're a Fit</label>
                  <textarea [(ngModel)]="coverNote" rows="3" class="form-control" placeholder="Briefly highlight your relevant experience and excitement for this role..."></textarea>
                </div>

                <!-- Screening Questions if available -->
                @if (j.screeningQuestions && j.screeningQuestions.length > 0) {
                  <div class="screening-section">
                    <label class="form-label">Screening Questions from Employer</label>
                    @for (q of j.screeningQuestions; track q; let i = $index) {
                      <div class="question-row">
                        <span class="q-text">{{ q }}</span>
                        <input type="text" [(ngModel)]="screeningAnswers[q]" class="form-control" placeholder="Your answer...">
                      </div>
                    }
                  </div>
                }

                @if (applyError()) {
                  <div class="error-msg">{{ applyError() }}</div>
                }
              </div>

              <div class="modal-footer">
                <button (click)="closeApplyModal()" class="btn btn-secondary">Cancel</button>
                <button (click)="submitApplication()" [disabled]="isSubmitting()" class="btn btn-primary">
                  @if (isSubmitting()) {
                    <span>Submitting Application...</span>
                  } @else {
                    <span>Confirm & Submit Application</span>
                  }
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .detail-page-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .detail-top-nav {
      margin-bottom: 1.5rem;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .back-link:hover { color: var(--primary-light); }
    .detail-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2.5rem;
    }
    .job-hero-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 2rem;
      margin-bottom: 2rem;
    }
    .hero-header-row {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .detail-company-logo {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      object-fit: cover;
      background: white;
      border: 1px solid var(--border-glass);
    }
    .hero-title-box {
      flex: 1;
    }
    .badges-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .badge-mode { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; }
    .badge-type { background: rgba(16, 185, 129, 0.15); color: #6ee7b7; }
    .badge-urgent { background: rgba(244, 63, 94, 0.15); color: #f43f5e; }
    .detail-job-title {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.25;
      margin-bottom: 0.4rem;
    }
    .company-sub-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .company-name-bold {
      font-weight: 600;
      color: var(--primary-light);
    }
    .meta-stats-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1.5rem;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .meta-label {
      font-size: 0.72rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .meta-value {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .meta-value.salary { color: #34d399; }
    .meta-value.privacy { color: #818cf8; }
    .content-block {
      background: rgba(30, 41, 59, 0.25);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.75rem;
      margin-bottom: 1.5rem;
    }
    .content-block h2 {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }
    .description-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.7;
    }
    .requirements-box pre {
      white-space: pre-wrap;
      font-family: var(--font-body);
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.7;
    }
    .skills-tag-cloud {
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }
    .skill-bubble {
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.25);
      color: #c7d2fe;
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 500;
    }
    .detail-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .apply-action-card {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .apply-action-card h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .apply-sub {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .btn-apply-lg {
      width: 100%;
      padding: 0.85rem;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      border-radius: 10px;
    }
    .privacy-guarantee-note {
      display: flex;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      line-height: 1.4;
    }
    .company-card-side {
      background: rgba(30, 41, 59, 0.25);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.5rem;
    }
    .company-card-side h4 {
      font-size: 0.95rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .company-mini-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .comp-thumb {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      object-fit: cover;
    }
    .comp-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .kyc-badge.verified {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.7rem;
      color: #34d399;
      font-weight: 600;
    }
    .comp-loc {
      font-size: 0.82rem;
      color: var(--text-secondary);
    }
    .success-banner {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 10px;
      padding: 1.25rem;
      color: #34d399;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .success-banner p {
      font-size: 0.82rem;
      color: var(--text-secondary);
    }
    .apply-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(10px);
      z-index: 1500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .apply-modal-box {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 580px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: 0 25px 50px rgba(0,0,0,0.8);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .modal-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .modal-company {
      font-size: 0.85rem;
      color: var(--text-tertiary);
    }
    .btn-close-modal {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 1.2rem;
      cursor: pointer;
    }
    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .privacy-callout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      font-size: 0.75rem;
      color: #a5b4fc;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .form-control {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      color: var(--text-primary);
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
    }
    .screening-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: rgba(0,0,0,0.15);
      padding: 1rem;
      border-radius: 8px;
    }
    .question-row {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .q-text {
      font-size: 0.82rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .error-msg {
      color: #f43f5e;
      font-size: 0.82rem;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-top: 1px solid var(--border-glass);
      padding-top: 1rem;
    }
    @media (max-width: 900px) {
      .detail-layout { grid-template-columns: 1fr; }
      .meta-stats-strip { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private auth = inject(AuthService);

  job = signal<Job | null>(null);
  isLoading = signal<boolean>(true);
  showApplyModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  applicationSuccess = signal<boolean>(false);
  applyError = signal<string | null>(null);

  coverNote = '';
  screeningAnswers: Record<string, string> = {};

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.jobService.getJobById(id).subscribe({
        next: (j) => {
          this.job.set(j);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  getSkills(skills: string): string[] {
    return skills.split(',').map(s => s.trim());
  }

  openApplyModal() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/jobs/${this.job()?.id}` } });
      return;
    }
    this.showApplyModal.set(true);
  }

  closeApplyModal() {
    this.showApplyModal.set(false);
    this.applyError.set(null);
  }

  submitApplication() {
    const currentJob = this.job();
    if (!currentJob) return;

    this.isSubmitting.set(true);
    this.applyError.set(null);

    this.jobService.applyJob(currentJob.id, {
      coverNote: this.coverNote,
      screeningAnswers: this.screeningAnswers
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showApplyModal.set(false);
        this.applicationSuccess.set(true);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.applyError.set(err.error?.message || 'Failed to submit application. You may have already applied.');
      }
    });
  }
}
