import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-glow"></div>
        <div class="hero-container">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Over 12,000+ Verified Jobs & Public Exchange Drives</span>
          </div>
          <h1 class="hero-title">
            Discover Your Next Career Step with <span class="gradient-text">Complete Privacy</span>
          </h1>
          <p class="hero-subtitle">
            Connect with leading technology companies and government employment exchanges. Zero phone spam, masked in-app calling, and high-growth opportunities.
          </p>

          <!-- Search Bar Box -->
          <div class="hero-search-box">
            <div class="search-field">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" [(ngModel)]="searchKeyword" (keyup.enter)="onSearch()" placeholder="Job title, skills (e.g. Java, Angular, AI)">
            </div>
            <div class="search-divider"></div>
            <div class="search-field">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <input type="text" [(ngModel)]="searchLocation" (keyup.enter)="onSearch()" placeholder="City or 'Remote'">
            </div>
            <button (click)="onSearch()" class="btn btn-primary btn-search">
              <span>Search Opportunities</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Quick Category Tags -->
          <div class="quick-tags">
            <span class="quick-tags-label">Popular Searches:</span>
            <button (click)="searchTag('Java')" class="tag-pill">Java Architect</button>
            <button (click)="searchTag('Angular')" class="tag-pill">Angular 18</button>
            <button (click)="searchTag('AI')" class="tag-pill">GenAI & ML</button>
            <button (click)="searchTag('Kubernetes')" class="tag-pill">DevOps / Cloud</button>
            <button (click)="searchTag('Government')" class="tag-pill govt-tag">Govt Exchange</button>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      <section class="stats-section">
        <div class="stats-container">
          <div class="stat-card">
            <span class="stat-number">15,400+</span>
            <span class="stat-desc">Active Job Openings</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">850+</span>
            <span class="stat-desc">Verified Enterprises</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">100%</span>
            <span class="stat-desc">Zero Contact Spam / Masked Calling</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">33</span>
            <span class="stat-desc">District Employment Exchanges</span>
          </div>
        </div>
      </section>

      <!-- Government Employment Exchange Banner -->
      <section class="exchange-highlight-section">
        <div class="exchange-highlight-box">
          <div class="exchange-highlight-content">
            <div class="exchange-tag">
              <span class="sparkle-icon">🏛️</span>
              <span>Anubandhan Model Integrated</span>
            </div>
            <h2>Gujarat State Employment Exchange Linkage</h2>
            <p>
              Looking for direct government job camps (Rozgar Mela) or state-sponsored apprentice schemes? Register your unique Employment Exchange ID to receive certified priority alerts.
            </p>
            <div class="exchange-cta-group">
              <a routerLink="/exchange" class="btn btn-emerald">
                <span>Access Govt Exchange Portal</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <span class="free-enroll-note">Free registration for all eligible candidates</span>
            </div>
          </div>
          <div class="exchange-highlight-badge-card">
            <div class="digital-card-preview">
              <div class="card-chip"></div>
              <div class="card-org">Directorate of Employment & Training</div>
              <div class="card-id">REG: GJ-EXCH-2026-XXXXX</div>
              <div class="card-verified">Verified Jobseeker Status: Active</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Jobs Section -->
      <section class="featured-jobs-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured High-Impact Roles</h2>
            <p class="section-sub">Verified enterprise opportunities with direct interview pathways</p>
          </div>
          <a routerLink="/jobs" class="view-all-link">
            <span>View All Jobs</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        @if (isLoading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading premier career opportunities...</p>
          </div>
        } @else {
          <div class="jobs-grid">
            @for (job of featuredJobs(); track job.id) {
              <div class="job-card-premium" [routerLink]="['/jobs', job.id]">
                <div class="card-header">
                  <img [src]="job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'" 
                       alt="Logo" class="company-logo">
                  <div class="card-title-group">
                    <h3 class="job-title">{{ job.title }}</h3>
                    <span class="company-name">{{ job.companyName }}</span>
                  </div>
                  @if (job.urgent) {
                    <span class="urgent-badge">Urgent</span>
                  }
                </div>

                <div class="job-tags-row">
                  <span class="chip chip-mode">{{ job.workMode }}</span>
                  <span class="chip chip-type">{{ job.jobType }}</span>
                  @if (job.experienceMin !== undefined) {
                    <span class="chip chip-exp">{{ job.experienceMin }}-{{ job.experienceMax }} Yrs</span>
                  }
                </div>

                <p class="job-snippet">{{ job.description }}</p>

                <div class="card-footer">
                  <div class="salary-tag">
                    <span class="salary-amount">
                      ₹{{ (job.salaryMin ? job.salaryMin / 100000 : 15) | number:'1.0-1' }} - {{ (job.salaryMax ? job.salaryMax / 100000 : 25) | number:'1.0-1' }} LPA
                    </span>
                  </div>
                  <div class="location-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{{ job.location || 'Remote' }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </section>

      <!-- Key Benefits / Why Us -->
      <section class="benefits-section">
        <div class="section-header text-center">
          <h2 class="section-title">Engineered for Privacy, Speed & Trust</h2>
          <p class="section-sub">Why thousands of candidates and employers choose JobPortalPro</p>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon icon-shield">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <h3>Zero-Leakage Privacy</h3>
            <p>Your phone number and email are never shown publicly or in recruiter talent searches. Recruiter outreach occurs securely within the platform.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon icon-call">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h3>Masked In-App Calling</h3>
            <p>Screen candidates or take screening interviews instantly using browser WebRTC voice/video. Neither party ever reveals their cellular number.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon icon-kanban">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/></svg>
            </div>
            <h3>Live ATS Kanban Pipeline</h3>
            <p>Recruiters manage candidate progression visually (Screened -> Shortlisted -> Interview -> Hired) with real-time candidate updates.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
      gap: 4rem;
      padding-bottom: 5rem;
    }
    .hero-section {
      position: relative;
      padding: 5rem 1.5rem 3rem;
      text-align: center;
      overflow: hidden;
    }
    .hero-glow {
      position: absolute;
      top: -20%;
      left: 50%;
      transform: translateX(-50%);
      width: 650px;
      height: 450px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
      pointer-events: none;
    }
    .hero-container {
      position: relative;
      z-index: 1;
      max-width: 900px;
      margin: 0 auto;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 30px;
      font-size: 0.82rem;
      color: var(--primary-light);
      margin-bottom: 1.5rem;
    }
    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #6366f1;
      box-shadow: 0 0 8px #6366f1;
    }
    .hero-title {
      font-family: var(--font-heading);
      font-size: 3.2rem;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 1.25rem;
      color: var(--text-primary);
    }
    .gradient-text {
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      line-height: 1.6;
      color: var(--text-secondary);
      max-width: 720px;
      margin: 0 auto 2.5rem;
    }
    .hero-search-box {
      display: flex;
      align-items: center;
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-glass);
      border-radius: 16px;
      padding: 0.5rem 0.6rem;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
      margin-bottom: 1.5rem;
      gap: 0.5rem;
    }
    .search-field {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      color: var(--text-secondary);
    }
    .search-field input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 0.95rem;
      width: 100%;
    }
    .search-divider {
      width: 1px;
      height: 32px;
      background: var(--border-glass);
    }
    .btn-search {
      padding: 0.85rem 1.75rem;
      font-size: 0.95rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      white-space: nowrap;
    }
    .quick-tags {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }
    .quick-tags-label {
      font-size: 0.82rem;
      color: var(--text-tertiary);
    }
    .tag-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      color: var(--text-secondary);
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tag-pill:hover {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary-light);
      border-color: rgba(99, 102, 241, 0.4);
    }
    .govt-tag {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.3);
      color: #34d399;
    }
    .stats-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      width: 100%;
    }
    .stats-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 2rem;
    }
    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .stat-number {
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary-light);
      margin-bottom: 0.25rem;
    }
    .stat-desc {
      font-size: 0.82rem;
      color: var(--text-tertiary);
    }
    .exchange-highlight-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      width: 100%;
    }
    .exchange-highlight-box {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.25) 100%);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2.5rem;
    }
    .exchange-highlight-content {
      max-width: 650px;
    }
    .exchange-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .exchange-highlight-content h2 {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.75rem;
    }
    .exchange-highlight-content p {
      color: #cbd5e1;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .exchange-cta-group {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .btn-emerald {
      background: #10b981;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-emerald:hover { background: #059669; }
    .free-enroll-note {
      font-size: 0.8rem;
      color: #a7f3d0;
    }
    .digital-card-preview {
      background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 16px;
      padding: 1.5rem;
      width: 280px;
      box-shadow: 0 15px 30px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .card-chip {
      width: 36px;
      height: 28px;
      background: #fbbf24;
      border-radius: 5px;
    }
    .card-org {
      font-size: 0.75rem;
      color: #6ee7b7;
      font-weight: 600;
    }
    .card-id {
      font-family: monospace;
      font-size: 0.9rem;
      color: white;
      font-weight: 700;
    }
    .card-verified {
      font-size: 0.7rem;
      color: #34d399;
    }
    .featured-jobs-section, .benefits-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      width: 100%;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
    }
    .section-header.text-center {
      text-align: center;
      flex-direction: column;
      align-items: center;
    }
    .section-title {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }
    .section-sub {
      color: var(--text-tertiary);
      font-size: 0.9rem;
    }
    .view-all-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--primary-light);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.5rem;
    }
    .job-card-premium {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .job-card-premium:hover {
      background: rgba(30, 41, 59, 0.7);
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
    }
    .card-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .company-logo {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      object-fit: cover;
      background: white;
    }
    .card-title-group {
      flex: 1;
    }
    .job-title {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.3;
      margin-bottom: 0.25rem;
    }
    .company-name {
      font-size: 0.82rem;
      color: var(--text-tertiary);
    }
    .urgent-badge {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #f43f5e;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    .job-tags-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
      flex-wrap: wrap;
    }
    .chip {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
    }
    .chip-mode {
      background: rgba(99, 102, 241, 0.1);
      color: #a5b4fc;
    }
    .chip-type {
      background: rgba(16, 185, 129, 0.1);
      color: #6ee7b7;
    }
    .job-snippet {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 1.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 1rem;
      font-size: 0.82rem;
    }
    .salary-amount {
      color: #34d399;
      font-weight: 700;
    }
    .location-tag {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--text-tertiary);
    }
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    .benefit-card {
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 2rem;
      text-align: left;
    }
    .benefit-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }
    .icon-shield { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .icon-call { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .icon-kanban { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .benefit-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.6rem;
    }
    .benefit-card p {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    @media (max-width: 900px) {
      .hero-title { font-size: 2.2rem; }
      .hero-search-box { flex-direction: column; }
      .search-divider { display: none; }
      .stats-container { grid-template-columns: 1fr 1fr; }
      .exchange-highlight-box { flex-direction: column; text-align: center; }
      .digital-card-preview { margin: 0 auto; }
      .benefits-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private jobService = inject(JobService);
  private router = inject(Router);

  featuredJobs = signal<Job[]>([]);
  isLoading = signal<boolean>(true);
  searchKeyword = '';
  searchLocation = '';

  ngOnInit() {
    this.jobService.getFeaturedJobs().subscribe({
      next: (jobs) => {
        this.featuredJobs.set(jobs);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch() {
    this.router.navigate(['/jobs'], {
      queryParams: {
        keyword: this.searchKeyword || undefined,
        location: this.searchLocation || undefined
      }
    });
  }

  searchTag(tag: string) {
    if (tag === 'Government') {
      this.router.navigate(['/exchange']);
    } else {
      this.router.navigate(['/jobs'], { queryParams: { keyword: tag } });
    }
  }
}
