import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="header-container">
        <!-- Logo -->
        <a routerLink="/" class="brand-logo">
          <div class="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-title">JobPortal<span class="brand-accent">Pro</span></span>
            <span class="brand-tagline">Careers & Exchange</span>
          </div>
        </a>

        <!-- Main Nav Links -->
        <nav class="main-nav">
          <a routerLink="/jobs" routerLinkActive="active" class="nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Explore Jobs</span>
          </a>

          <a routerLink="/exchange" routerLinkActive="active" class="nav-link exchange-link">
            <span class="badge-pulse"></span>
            <span>Govt Exchange</span>
          </a>

          @if (auth.isSeeker()) {
            <a routerLink="/seeker/dashboard" routerLinkActive="active" class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              <span>My Dashboard</span>
            </a>
            <a routerLink="/seeker/profile" routerLinkActive="active" class="nav-link">
              <span>My Profile</span>
            </a>
          }

          @if (auth.isRecruiter()) {
            <a routerLink="/recruiter/ats" routerLinkActive="active" class="nav-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
              <span>ATS Kanban</span>
            </a>
            <a routerLink="/recruiter/candidates" routerLinkActive="active" class="nav-link">
              <span>Talent Search</span>
            </a>
            <a routerLink="/recruiter/post-job" routerLinkActive="active" class="nav-link post-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              <span>Post a Job</span>
            </a>
          }

          @if (auth.isAdmin()) {
            <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link admin-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              <span>Admin Console</span>
            </a>
          }
        </nav>

        <!-- Right User Actions -->
        <div class="user-actions">
          @if (auth.isAuthenticated()) {
            <!-- Chat link -->
            <a routerLink="/chat" routerLinkActive="active" class="icon-btn-badge" title="Messages">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              @if (chatService.unreadTotal() > 0) {
                <span class="notif-count">{{ chatService.unreadTotal() }}</span>
              }
            </a>

            <!-- User Menu Pill -->
            <div class="user-pill">
              <img [src]="auth.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'" 
                   alt="Avatar" class="avatar-sm">
              <div class="user-info-text">
                <span class="user-name">{{ auth.currentUser()?.displayName }}</span>
                <span class="role-badge" [ngClass]="auth.currentUser()?.role?.toLowerCase()">
                  {{ auth.currentUser()?.role === 'ROLE_SEEKER' ? 'Job Seeker' : (auth.currentUser()?.role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Admin') }}
                </span>
              </div>
              <button (click)="logout()" class="btn-logout" title="Sign Out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </button>
            </div>
          } @else {
            <div class="auth-buttons">
              <a routerLink="/login" class="btn btn-secondary btn-sm">Sign In</a>
              <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-glass);
      padding: 0.75rem 0;
    }
    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .brand-accent {
      color: var(--primary-light);
    }
    .brand-tagline {
      display: block;
      font-size: 0.7rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .main-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.85rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.06);
    }
    .nav-link.active {
      color: var(--primary-light);
      font-weight: 600;
    }
    .exchange-link {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
    }
    .exchange-link:hover {
      background: rgba(16, 185, 129, 0.2);
    }
    .badge-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }
    .post-btn {
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
    }
    .admin-link {
      color: #fbbf24;
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .icon-btn-badge {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .icon-btn-badge:hover, .icon-btn-badge.active {
      background: rgba(99, 102, 241, 0.15);
      color: var(--primary-light);
    }
    .notif-count {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #f43f5e;
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(244, 63, 94, 0.5);
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.35rem 0.6rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-glass);
      border-radius: 30px;
    }
    .avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid var(--primary-light);
    }
    .user-info-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .user-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .role-badge {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .role-badge.role_seeker { color: #60a5fa; }
    .role-badge.role_recruiter { color: #c084fc; }
    .role-badge.role_admin { color: #f59e0b; }
    .btn-logout {
      background: transparent;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: color 0.2s;
    }
    .btn-logout:hover {
      color: #f43f5e;
    }
    .auth-buttons {
      display: flex;
      gap: 0.75rem;
    }
    @media (max-width: 900px) {
      .main-nav { display: none; }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  chatService = inject(ChatService);
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
