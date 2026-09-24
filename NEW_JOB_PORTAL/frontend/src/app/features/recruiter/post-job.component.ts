import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="post-job-container">
      <div class="post-header-card">
        <div>
          <h1>Create New Job Opportunity</h1>
          <p class="sub">Publish your opening across our verified developer network and employment exchange channels.</p>
        </div>
        <a routerLink="/recruiter/dashboard" class="btn btn-secondary btn-sm">Cancel</a>
      </div>

      @if (errorMessage()) {
        <div class="alert-error">{{ errorMessage() }}</div>
      }

      <form (ngSubmit)="onSubmit()" class="job-form">
        <!-- Basic Info Card -->
        <div class="form-section-card">
          <h2>1. Basic Role Details</h2>

          <div class="form-group">
            <label class="form-label">Job Title *</label>
            <input type="text" [(ngModel)]="job.title" name="title" class="form-control" placeholder="e.g. Lead Java Full Stack Architect (Spring Boot + Angular)" required>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Domain / Category</label>
              <select [(ngModel)]="job.category" name="category" class="form-select">
                <option value="Engineering">Engineering / Software</option>
                <option value="Data & AI">Data & Artificial Intelligence</option>
                <option value="Product">Product Management</option>
                <option value="Government">Government / Public Sector</option>
              </select>
            </div>

            <div class="form-group flex-1">
              <label class="form-label">Work Mode *</label>
              <select [(ngModel)]="job.workMode" name="workMode" class="form-select">
                <option value="REMOTE">Fully Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-Site</option>
              </select>
            </div>

            <div class="form-group flex-1">
              <label class="form-label">Employment Type</label>
              <select [(ngModel)]="job.jobType" name="jobType" class="form-select">
                <option value="FULL_TIME">Full-Time</option>
                <option value="CONTRACT">Contract / Consultant</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" [(ngModel)]="job.location" name="location" class="form-control" placeholder="e.g. Bengaluru, Karnataka or Pan-India">
          </div>
        </div>

        <!-- Compensation & Experience -->
        <div class="form-section-card">
          <h2>2. Experience & Compensation</h2>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Min Experience (Years)</label>
              <input type="number" [(ngModel)]="job.experienceMin" name="expMin" class="form-control" min="0" max="25">
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Max Experience (Years)</label>
              <input type="number" [(ngModel)]="job.experienceMax" name="expMax" class="form-control" min="0" max="30">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Minimum Salary (INR / Annum)</label>
              <input type="number" [(ngModel)]="job.salaryMin" name="salaryMin" class="form-control" placeholder="e.g. 2000000">
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Maximum Salary (INR / Annum)</label>
              <input type="number" [(ngModel)]="job.salaryMax" name="salaryMax" class="form-control" placeholder="e.g. 3500000">
            </div>
          </div>
        </div>

        <!-- Description & Skills -->
        <div class="form-section-card">
          <h2>3. Description & Tech Stack</h2>

          <div class="form-group">
            <label class="form-label">Job Description *</label>
            <textarea [(ngModel)]="job.description" name="description" rows="5" class="form-control" placeholder="Detailed description of responsibilities and day-to-day impact..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Key Requirements & Qualifications</label>
            <textarea [(ngModel)]="job.requirements" name="requirements" rows="4" class="form-control" placeholder="- 5+ years experience in Java 17/21, Spring Boot 3&#10;- Angular 17/18+ deep expertise&#10;- Experience building real-time WebSocket applications"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Required Skills (Comma-separated)</label>
            <input type="text" [(ngModel)]="job.skills" name="skills" class="form-control" placeholder="Java, Spring Boot, Angular, Redis, Kafka, PostgreSQL">
          </div>
        </div>

        <!-- Screening Questions -->
        <div class="form-section-card">
          <div class="section-title-between">
            <h2>4. Custom Screening Questions</h2>
            <button type="button" (click)="addQuestion()" class="btn btn-secondary btn-sm">+ Add Question</button>
          </div>
          <p class="section-desc">Candidates will answer these questions during application.</p>

          <div class="questions-list">
            @for (q of screeningQuestions; track $index; let i = $index) {
              <div class="question-input-row">
                <input type="text" [(ngModel)]="screeningQuestions[i]" [name]="'q_' + i" class="form-control" placeholder="e.g. How many years experience do you have with Spring Boot 3?">
                <button type="button" (click)="removeQuestion(i)" class="btn-remove-q">✕</button>
              </div>
            }
          </div>
        </div>

        <!-- Flags & Publish -->
        <div class="form-section-card">
          <div class="checkbox-row">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="job.urgent" name="urgent">
              <span>Mark as <strong>Urgent Hiring Need</strong></span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="job.featured" name="featured">
              <span>Promote as <strong>Featured Job Post</strong></span>
            </label>
          </div>

          <div class="form-actions-bottom">
            <button type="submit" [disabled]="isSubmitting()" class="btn btn-primary btn-publish">
              @if (isSubmitting()) { <span>Publishing Job...</span> }
              @else { <span>Publish Job Opportunity</span> }
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .post-job-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .post-header-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .post-header-card h1 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .sub {
      font-size: 0.88rem;
      color: var(--text-tertiary);
    }
    .job-form {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .form-section-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-section-card h2 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-glass);
      padding-bottom: 0.6rem;
    }
    .section-title-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-desc {
      font-size: 0.82rem;
      color: var(--text-tertiary);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .flex-1 { flex: 1; }
    .form-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .form-control, .form-select {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      color: var(--text-primary);
      font-size: 0.9rem;
      outline: none;
    }
    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .question-input-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .btn-remove-q {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #f43f5e;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
    }
    .checkbox-row {
      display: flex;
      gap: 2rem;
      padding: 0.5rem 0;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .checkbox-label input {
      accent-color: var(--primary);
    }
    .form-actions-bottom {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid var(--border-glass);
      padding-top: 1.25rem;
    }
    .btn-publish {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
    }
    .alert-error {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #f43f5e;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 768px) {
      .form-row { flex-direction: column; }
      .checkbox-row { flex-direction: column; gap: 0.75rem; }
    }
  `]
})
export class PostJobComponent {
  private jobService = inject(JobService);
  private router = inject(Router);

  job: any = {
    title: '',
    category: 'Engineering',
    workMode: 'REMOTE',
    jobType: 'FULL_TIME',
    location: '',
    experienceMin: 3,
    experienceMax: 7,
    salaryMin: 2000000,
    salaryMax: 3500000,
    salaryCurrency: 'INR',
    description: '',
    requirements: '',
    skills: '',
    urgent: false,
    featured: false,
    status: 'ACTIVE'
  };

  screeningQuestions: string[] = [
    'How many years of relevant production experience do you have in this stack?',
    'What is your current notice period?'
  ];

  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  addQuestion() {
    this.screeningQuestions.push('');
  }

  removeQuestion(index: number) {
    this.screeningQuestions.splice(index, 1);
  }

  onSubmit() {
    if (!this.job.title || !this.job.description) {
      this.errorMessage.set('Please provide both job title and description.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      ...this.job,
      screeningQuestions: this.screeningQuestions.filter(q => q.trim().length > 0)
    };

    this.jobService.createJob(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/recruiter/ats']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to publish job.');
      }
    });
  }
}
