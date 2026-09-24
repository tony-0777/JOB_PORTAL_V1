import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page-wrapper">
      <div class="auth-card-glass">
        <!-- Brand Header -->
        <div class="auth-header">
          <div class="auth-icon-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h2 class="auth-title">Welcome to JobPortal<span class="accent">Pro</span></h2>
          <p class="auth-sub">Sign in to your account or choose a demo persona below</p>
        </div>

        <!-- 1-Click Demo Profiles (For quick verification) -->
        <div class="demo-quick-box">
          <span class="demo-quick-title">Quick Demo Login (1-Click):</span>
          <div class="demo-btn-group">
            <button (click)="quickLogin('seeker@example.com', 'password123')" class="btn-demo seeker">
              <span class="demo-role">Job Seeker</span>
              <span class="demo-name">Alex Sharma</span>
            </button>
            <button (click)="quickLogin('recruiter@techcorp.com', 'password123')" class="btn-demo recruiter">
              <span class="demo-role">Recruiter</span>
              <span class="demo-name">TechCorp (Vikram)</span>
            </button>
            <button (click)="quickLogin('admin@jobportal.com', 'password123')" class="btn-demo admin">
              <span class="demo-role">Platform Admin</span>
              <span class="demo-name">SuperAdmin</span>
            </button>
          </div>
        </div>

        <div class="divider-text">
          <span>or sign in with credentials</span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="auth-form">
          @if (errorMessage()) {
            <div class="alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" class="form-control" placeholder="name@company.com" required>
          </div>

          <div class="form-group">
            <div class="label-row">
              <label class="form-label">Password</label>
              <a href="javascript:void(0)" class="forgot-link">Forgot password?</a>
            </div>
            <input type="password" [(ngModel)]="password" name="password" class="form-control" placeholder="••••••••" required>
          </div>

          <button type="submit" [disabled]="isLoading()" class="btn btn-primary btn-submit">
            @if (isLoading()) {
              <span>Signing in...</span>
            } @else {
              <span>Sign In to Account</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            }
          </button>
        </form>

        <div class="auth-footer-prompt">
          <span>Don't have an account yet?</span>
          <a routerLink="/register" class="signup-link">Create an account</a>
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
      max-width: 480px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.75rem;
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
      margin-bottom: 0.35rem;
    }
    .accent { color: var(--primary-light); }
    .auth-sub {
      font-size: 0.85rem;
      color: var(--text-tertiary);
    }
    .demo-quick-box {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .demo-quick-title {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-light);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.6rem;
    }
    .demo-btn-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }
    .btn-demo {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem 0.3rem;
      border-radius: 8px;
      border: 1px solid var(--border-glass);
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255, 255, 255, 0.04);
    }
    .btn-demo:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .btn-demo.seeker:hover { border-color: #60a5fa; background: rgba(96, 165, 250, 0.15); }
    .btn-demo.recruiter:hover { border-color: #c084fc; background: rgba(192, 132, 252, 0.15); }
    .btn-demo.admin:hover { border-color: #fbbf24; background: rgba(251, 191, 36, 0.15); }
    .demo-role {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-secondary);
    }
    .demo-name {
      font-size: 0.72rem;
      color: var(--text-tertiary);
      white-space: nowrap;
    }
    .divider-text {
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      line-height: 0.1em;
      margin: 1.5rem 0 1.5rem;
    }
    .divider-text span {
      background: #151e33;
      padding: 0 10px;
      font-size: 0.78rem;
      color: var(--text-tertiary);
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .forgot-link {
      font-size: 0.78rem;
      color: var(--primary-light);
      text-decoration: none;
    }
    .form-control {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      padding: 0.7rem 0.9rem;
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
      transition: border 0.2s;
    }
    .form-control:focus {
      border-color: var(--primary-light);
    }
    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 10px;
      margin-top: 0.5rem;
    }
    .alert-error {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #f43f5e;
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .auth-footer-prompt {
      text-align: center;
      margin-top: 1.5rem;
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
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  quickLogin(email: string, pass: string) {
    this.email = email;
    this.password = pass;
    this.onSubmit();
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please provide both email and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (res.user.role === 'ROLE_SEEKER') {
          this.router.navigate(['/seeker/dashboard']);
        } else if (res.user.role === 'ROLE_RECRUITER') {
          this.router.navigate(['/recruiter/ats']);
        } else if (res.user.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Invalid email or password. Please try again.');
      }
    });
  }
}
