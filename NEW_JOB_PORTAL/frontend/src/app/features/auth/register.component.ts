import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page-wrapper">
      <div class="auth-card-glass">
        <div class="auth-header">
          <div class="auth-icon-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h2 class="auth-title">Create Your Free Account</h2>
          <p class="auth-sub">Choose your persona to get started</p>
        </div>

        <!-- Role Selector Tabs -->
        <div class="role-tabs">
          <button (click)="selectedRole.set('SEEKER')" 
                  [class.active]="selectedRole() === 'SEEKER'" 
                  class="role-tab-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Job Seeker</span>
          </button>
          <button (click)="selectedRole.set('RECRUITER')" 
                  [class.active]="selectedRole() === 'RECRUITER'" 
                  class="role-tab-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span>Employer / Recruiter</span>
          </button>
        </div>

        <!-- Privacy Shield Notice -->
        <div class="privacy-badge-notice">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          <span>Privacy Guaranteed: Contact numbers & emails are encrypted and never shown publicly.</span>
        </div>

        @if (errorMessage()) {
          <div class="alert-error">
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <!-- Seeker Registration Form -->
        @if (selectedRole() === 'SEEKER') {
          <form (ngSubmit)="onRegisterSeeker()" class="auth-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" [(ngModel)]="seekerName" name="seekerName" class="form-control" placeholder="e.g. Alex Sharma" required>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" [(ngModel)]="seekerEmail" name="seekerEmail" class="form-control" placeholder="alex@example.com" required>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" [(ngModel)]="seekerPassword" name="seekerPassword" class="form-control" placeholder="••••••••" required>
            </div>

            <div class="form-group">
              <label class="form-label">Professional Headline / Role</label>
              <input type="text" [(ngModel)]="seekerHeadline" name="seekerHeadline" class="form-control" placeholder="e.g. Full Stack Developer | Java & Angular">
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number (Encrypted for Verification)</label>
              <input type="tel" [(ngModel)]="seekerPhone" name="seekerPhone" class="form-control" placeholder="+91 9876543210">
            </div>

            <button type="submit" [disabled]="isLoading()" class="btn btn-primary btn-submit">
              @if (isLoading()) { <span>Creating account...</span> }
              @else { <span>Join as Job Seeker</span> }
            </button>
          </form>
        }

        <!-- Recruiter Registration Form -->
        @if (selectedRole() === 'RECRUITER') {
          <form (ngSubmit)="onRegisterRecruiter()" class="auth-form">
            <div class="form-group">
              <label class="form-label">Your Full Name</label>
              <input type="text" [(ngModel)]="recruiterName" name="recruiterName" class="form-control" placeholder="e.g. Vikram Malhotra" required>
            </div>

            <div class="form-group">
              <label class="form-label">Work Email</label>
              <input type="email" [(ngModel)]="recruiterEmail" name="recruiterEmail" class="form-control" placeholder="vikram@techcorp.com" required>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" [(ngModel)]="recruiterPassword" name="recruiterPassword" class="form-control" placeholder="••••••••" required>
            </div>

            <div class="form-group">
              <label class="form-label">Company Name</label>
              <input type="text" [(ngModel)]="companyName" name="companyName" class="form-control" placeholder="e.g. TechCorp Innovations" required>
            </div>

            <div class="form-group">
              <label class="form-label">Your Designation / Department</label>
              <input type="text" [(ngModel)]="designation" name="designation" class="form-control" placeholder="e.g. Head of Talent Acquisition">
            </div>

            <div class="form-group">
              <label class="form-label">Industry</label>
              <input type="text" [(ngModel)]="industry" name="industry" class="form-control" placeholder="e.g. Technology, AI, Finance">
            </div>

            <button type="submit" [disabled]="isLoading()" class="btn btn-primary btn-submit">
              @if (isLoading()) { <span>Registering Employer...</span> }
              @else { <span>Create Employer Profile</span> }
            </button>
          </form>
        }

        <div class="auth-footer-prompt">
          <span>Already registered?</span>
          <a routerLink="/login" class="signup-link">Sign In</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page-wrapper {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1.5rem;
    }
    .auth-card-glass {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .auth-icon-badge {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
    }
    .auth-title {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .auth-sub {
      font-size: 0.85rem;
      color: var(--text-tertiary);
    }
    .role-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      background: rgba(15, 23, 42, 0.6);
      padding: 0.35rem;
      border-radius: 10px;
      border: 1px solid var(--border-glass);
      margin-bottom: 1.25rem;
    }
    .role-tab-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.65rem 0.5rem;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .role-tab-btn.active {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary-light);
      border: 1px solid rgba(99, 102, 241, 0.4);
    }
    .privacy-badge-notice {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      color: #34d399;
      margin-bottom: 1.25rem;
      line-height: 1.4;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .form-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .form-control {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      color: var(--text-primary);
      font-size: 0.9rem;
      outline: none;
    }
    .btn-submit {
      width: 100%;
      padding: 0.8rem;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 8px;
      margin-top: 0.5rem;
    }
    .alert-error {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #f43f5e;
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      font-size: 0.82rem;
      margin-bottom: 1rem;
    }
    .auth-footer-prompt {
      text-align: center;
      margin-top: 1.25rem;
      font-size: 0.85rem;
      color: var(--text-tertiary);
      display: flex;
      justify-content: center;
      gap: 0.4rem;
    }
    .signup-link {
      color: var(--primary-light);
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  selectedRole = signal<'SEEKER' | 'RECRUITER'>('SEEKER');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Seeker fields
  seekerName = '';
  seekerEmail = '';
  seekerPassword = '';
  seekerHeadline = '';
  seekerPhone = '';

  // Recruiter fields
  recruiterName = '';
  recruiterEmail = '';
  recruiterPassword = '';
  companyName = '';
  designation = '';
  industry = '';

  onRegisterSeeker() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.registerSeeker({
      displayName: this.seekerName,
      email: this.seekerEmail,
      password: this.seekerPassword,
      headline: this.seekerHeadline,
      phone: this.seekerPhone
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/seeker/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Registration failed. Email might already exist.');
      }
    });
  }

  onRegisterRecruiter() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.registerRecruiter({
      displayName: this.recruiterName,
      email: this.recruiterEmail,
      password: this.recruiterPassword,
      companyName: this.companyName,
      designation: this.designation,
      industry: this.industry
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/recruiter/ats']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Employer registration failed. Email might already exist.');
      }
    });
  }
}
