import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeekerService, SeekerProfile } from '../../core/services/seeker.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seeker-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="profile-page-container">
      <div class="profile-header-card">
        <div class="profile-avatar-row">
          <img [src]="auth.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'" alt="Avatar" class="profile-avatar">
          <div class="profile-intro">
            <h2>{{ auth.currentUser()?.displayName }}</h2>
            <p class="email-masked">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              <span>Email & Phone Encrypted (Protected from Talent Scrapers)</span>
            </p>
          </div>
        </div>

        <div class="strength-meter-box">
          <div class="meter-text">
            <span>Profile Completeness</span>
            <strong>{{ profile.completenessScore || 90 }}%</strong>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" [style.width.%]="profile.completenessScore || 90"></div>
          </div>
        </div>
      </div>

      @if (saveSuccess()) {
        <div class="alert-success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Profile changes saved successfully!</span>
        </div>
      }

      <div class="profile-form-grid">
        <div class="form-card">
          <h3>Professional Profile</h3>

          <div class="form-group">
            <label class="form-label">Professional Headline</label>
            <input type="text" [(ngModel)]="profile.headline" class="form-control" placeholder="e.g. Senior Full-Stack Engineer | Java & Angular">
          </div>

          <div class="form-group">
            <label class="form-label">Professional Summary & Bio</label>
            <textarea [(ngModel)]="profile.bio" rows="4" class="form-control" placeholder="Brief summary of your key engineering strengths and architectural background..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Total Experience (Years)</label>
              <input type="number" [(ngModel)]="profile.experienceYears" class="form-control" min="0" max="40">
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Resume PDF Link</label>
              <input type="url" [(ngModel)]="profile.resumeUrl" class="form-control" placeholder="https://example.com/my-resume.pdf">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Skills & Tech Stack (Comma-separated)</label>
            <input type="text" [(ngModel)]="profile.skills" class="form-control" placeholder="Java, Spring Boot, Angular, TypeScript, PostgreSQL, Docker, Redis">
          </div>
        </div>

        <div class="form-card">
          <h3>Privacy & Employment Exchange</h3>

          <div class="form-group">
            <label class="form-label">Profile Visibility</label>
            <select [(ngModel)]="profile.privacyVisibility" class="form-select">
              <option value="PUBLIC">Public to All Verified Recruiters (Masked Contacts)</option>
              <option value="ANONYMOUS">Anonymous (Hide Name & Current Employer until matched)</option>
              <option value="PRIVATE">Private (Only visible to jobs I actively apply to)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Govt Employment Exchange Reg No.</label>
            <input type="text" [(ngModel)]="profile.exchangeRegistrationNo" class="form-control" placeholder="e.g. GJ-EXCH-2026-89412">
            <span class="help-text">Directly links your profile to Gujarat Rozgar Mela government drives.</span>
          </div>

          <div class="privacy-reassurance-box">
            <div class="shield-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              <span>Zero Contact Leakage Promise</span>
            </div>
            <p>Your actual cellular number and personal email are never rendered to hiring managers. Recruiter calls and chats occur strictly inside the secure browser session.</p>
          </div>

          <button (click)="onSave()" [disabled]="isSaving()" class="btn btn-primary btn-save mt-3">
            @if (isSaving()) { <span>Saving changes...</span> }
            @else { <span>Save Profile Settings</span> }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .profile-header-card {
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
    .profile-avatar-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .profile-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-light);
    }
    .profile-intro h2 {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.3rem;
    }
    .email-masked {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      color: #34d399;
    }
    .strength-meter-box {
      width: 240px;
    }
    .meter-text {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 0.4rem;
    }
    .meter-text strong {
      color: var(--primary-light);
    }
    .progress-bar-bg {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1 0%, #10b981 100%);
      border-radius: 4px;
      transition: width 0.4s ease;
    }
    .profile-form-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 2rem;
    }
    .form-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-glass);
      padding-bottom: 0.75rem;
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
    .help-text {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }
    .privacy-reassurance-box {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 8px;
      padding: 1rem;
    }
    .shield-badge {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #34d399;
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
    }
    .privacy-reassurance-box p {
      font-size: 0.78rem;
      color: #cbd5e1;
      line-height: 1.5;
    }
    .btn-save {
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
    }
    .alert-success {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.88rem;
    }
    @media (max-width: 900px) {
      .profile-header-card { flex-direction: column; align-items: flex-start; }
      .profile-form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SeekerProfileComponent implements OnInit {
  auth = inject(AuthService);
  private seekerService = inject(SeekerService);

  profile: SeekerProfile = {
    headline: '',
    bio: '',
    experienceYears: 5,
    skills: '',
    completenessScore: 92,
    privacyVisibility: 'PUBLIC',
    exchangeRegistrationNo: ''
  };

  isSaving = signal<boolean>(false);
  saveSuccess = signal<boolean>(false);

  ngOnInit() {
    this.seekerService.getProfile().subscribe({
      next: (p) => {
        if (p) this.profile = p;
      }
    });
  }

  onSave() {
    this.isSaving.set(true);
    this.saveSuccess.set(false);

    this.seekerService.updateProfile(this.profile).subscribe({
      next: (res) => {
        this.profile = res;
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: () => this.isSaving.set(false)
    });
  }
}
