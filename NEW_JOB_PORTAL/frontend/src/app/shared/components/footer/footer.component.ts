import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-col brand-col">
            <div class="footer-brand">
              <span class="footer-title">JobPortal<span class="brand-accent">Pro</span></span>
            </div>
            <p class="footer-desc">
              India's premier employment ecosystem connecting high-caliber talent with verified enterprises, featuring privacy-first masked calling and integrated Employment Exchange drives.
            </p>
            <div class="govt-badge">
              <span class="govt-dot"></span>
              <span>Supported by Employment Exchange Portal (Anubandhan Model)</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>For Job Seekers</h4>
            <ul>
              <li><a routerLink="/jobs">Browse Verified Jobs</a></li>
              <li><a routerLink="/exchange">Employment Exchange Registration</a></li>
              <li><a routerLink="/jobs" [queryParams]="{ workMode: 'REMOTE' }">Remote Careers</a></li>
              <li><a routerLink="/seeker/dashboard">Application Tracker</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>For Employers</h4>
            <ul>
              <li><a routerLink="/recruiter/post-job">Post New Opportunity</a></li>
              <li><a routerLink="/recruiter/ats">Kanban ATS Pipeline</a></li>
              <li><a routerLink="/recruiter/candidates">Talent Search</a></li>
              <li><a routerLink="/login">Enterprise KYC Verification</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Privacy & Standards</h4>
            <ul>
              <li><a href="#privacy">Zero-Leakage Privacy Policy</a></li>
              <li><a href="#calling">WebRTC Masked Calling</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a routerLink="/admin/dashboard">Platform Moderation</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 JobPortalPro Inc. All rights reserved. Strict Candidate Contact Privacy Guaranteed.</p>
          <div class="footer-tag">
            <span>Powered by Spring Boot 3 & Angular 18+</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: #090d16;
      border-top: 1px solid var(--border-glass);
      padding: 4rem 0 2rem;
      margin-top: auto;
      color: var(--text-secondary);
    }
    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }
    .footer-title {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .brand-accent { color: var(--primary-light); }
    .footer-desc {
      font-size: 0.9rem;
      line-height: 1.6;
      margin: 1rem 0;
      color: var(--text-tertiary);
    }
    .govt-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.8rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      color: #34d399;
      font-weight: 500;
    }
    .govt-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }
    .footer-col h4 {
      color: var(--text-primary);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    .footer-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .footer-col a {
      color: var(--text-tertiary);
      text-decoration: none;
      font-size: 0.88rem;
      transition: color 0.2s;
    }
    .footer-col a:hover {
      color: var(--primary-light);
    }
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;
      color: var(--text-tertiary);
      flex-wrap: wrap;
      gap: 1rem;
    }
    @media (max-width: 900px) {
      .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
    }
  `]
})
export class FooterComponent {}
