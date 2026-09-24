import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/models';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="search-page-container">
      <!-- Search Top Bar -->
      <div class="search-hero-bar">
        <div class="search-inputs-wrap">
          <div class="input-group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" [(ngModel)]="keyword" (keyup.enter)="loadJobs()" placeholder="Search title, skills, keywords">
          </div>
          <div class="input-group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <input type="text" [(ngModel)]="location" (keyup.enter)="loadJobs()" placeholder="City, State, or 'Remote'">
          </div>
          <button (click)="loadJobs()" class="btn btn-primary btn-filter-search">Filter Jobs</button>
        </div>
      </div>

      <!-- Main Layout: Filters Sidebar + Results -->
      <div class="search-main-grid">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filter-header">
            <h3>Filters</h3>
            <button (click)="resetFilters()" class="btn-clear">Reset All</button>
          </div>

          <!-- Work Mode -->
          <div class="filter-group">
            <label class="filter-title">Work Mode</label>
            <div class="radio-options">
              <label class="option-row">
                <input type="radio" name="workMode" value="" [(ngModel)]="workMode" (change)="loadJobs()">
                <span>All Modes</span>
              </label>
              <label class="option-row">
                <input type="radio" name="workMode" value="REMOTE" [(ngModel)]="workMode" (change)="loadJobs()">
                <span>Remote Only</span>
              </label>
              <label class="option-row">
                <input type="radio" name="workMode" value="HYBRID" [(ngModel)]="workMode" (change)="loadJobs()">
                <span>Hybrid</span>
              </label>
              <label class="option-row">
                <input type="radio" name="workMode" value="ONSITE" [(ngModel)]="workMode" (change)="loadJobs()">
                <span>On-Site</span>
              </label>
            </div>
          </div>

          <!-- Job Type -->
          <div class="filter-group">
            <label class="filter-title">Employment Type</label>
            <div class="radio-options">
              <label class="option-row">
                <input type="radio" name="jobType" value="" [(ngModel)]="jobType" (change)="loadJobs()">
                <span>All Types</span>
              </label>
              <label class="option-row">
                <input type="radio" name="jobType" value="FULL_TIME" [(ngModel)]="jobType" (change)="loadJobs()">
                <span>Full-Time</span>
              </label>
              <label class="option-row">
                <input type="radio" name="jobType" value="CONTRACT" [(ngModel)]="jobType" (change)="loadJobs()">
                <span>Contract / Freelance</span>
              </label>
              <label class="option-row">
                <input type="radio" name="jobType" value="INTERNSHIP" [(ngModel)]="jobType" (change)="loadJobs()">
                <span>Internship</span>
              </label>
            </div>
          </div>

          <!-- Category -->
          <div class="filter-group">
            <label class="filter-title">Domain / Category</label>
            <select [(ngModel)]="category" (change)="loadJobs()" class="form-select">
              <option value="">All Categories</option>
              <option value="Engineering">Engineering / Software</option>
              <option value="Data & AI">Data & Artificial Intelligence</option>
              <option value="Government">Government / Public Sector</option>
              <option value="Product">Product Management</option>
            </select>
          </div>

          <!-- Experience Filter -->
          <div class="filter-group">
            <div class="filter-title-row">
              <label class="filter-title">Max Experience</label>
              <span class="range-val">{{ maxExp }} Years</span>
            </div>
            <input type="range" min="0" max="15" [(ngModel)]="maxExp" (change)="loadJobs()" class="range-slider">
          </div>
        </aside>

        <!-- Results Area -->
        <main class="results-container">
          <div class="results-header">
            <h2>{{ totalElements() }} Opportunities Found</h2>
            <span class="privacy-guarantee">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              Masked In-App Application & Calling Guaranteed
            </span>
          </div>

          @if (isLoading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Searching verified opportunities...</p>
            </div>
          } @else if (jobs().length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <h3>No matching jobs found</h3>
              <p>Try adjusting your search keywords, location or removing some filters.</p>
              <button (click)="resetFilters()" class="btn btn-secondary btn-sm">Clear Filters</button>
            </div>
          } @else {
            <div class="job-list">
              @for (job of jobs(); track job.id) {
                <div class="job-row-card">
                  <div class="job-row-main" [routerLink]="['/jobs', job.id]">
                    <img [src]="job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'" 
                         alt="Logo" class="company-logo">
                    <div class="job-info">
                      <div class="title-row">
                        <h3 class="job-title">{{ job.title }}</h3>
                        @if (job.urgent) {
                          <span class="badge-urgent">Urgent</span>
                        }
                        @if (job.featured) {
                          <span class="badge-featured">Featured</span>
                        }
                      </div>
                      <div class="company-meta">
                        <span class="company-name">{{ job.companyName }}</span>
                        <span class="dot-sep">•</span>
                        <span class="location">{{ job.location || 'Remote' }}</span>
                      </div>
                      <p class="job-desc-snippet">{{ job.description }}</p>
                      
                      <div class="tags-row">
                        <span class="tag-chip mode">{{ job.workMode }}</span>
                        <span class="tag-chip type">{{ job.jobType }}</span>
                        @if (job.skills) {
                          @for (skill of getSkillList(job.skills); track skill) {
                            <span class="tag-chip skill">{{ skill }}</span>
                          }
                        }
                      </div>
                    </div>
                  </div>

                  <div class="job-row-aside">
                    <div class="salary-box">
                      <span class="salary-lbl">Offered CTC</span>
                      <span class="salary-val">
                        ₹{{ (job.salaryMin ? job.salaryMin / 100000 : 12) | number:'1.0-1' }} - {{ (job.salaryMax ? job.salaryMax / 100000 : 25) | number:'1.0-1' }} LPA
                      </span>
                    </div>
                    <a [routerLink]="['/jobs', job.id]" class="btn btn-primary btn-apply-row">
                      <span>View & Apply</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              }
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .search-page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .search-hero-bar {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 1rem 1.25rem;
      margin-bottom: 2rem;
    }
    .search-inputs-wrap {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .input-group {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-sm);
      padding: 0.6rem 1rem;
      color: var(--text-secondary);
    }
    .input-group input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      width: 100%;
      font-size: 0.95rem;
    }
    .btn-filter-search {
      padding: 0.65rem 1.5rem;
      border-radius: var(--radius-sm);
      white-space: nowrap;
    }
    .search-main-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
    }
    .filters-sidebar {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: fit-content;
    }
    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-glass);
      padding-bottom: 0.75rem;
    }
    .filter-header h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .btn-clear {
      background: transparent;
      border: none;
      color: var(--primary-light);
      font-size: 0.8rem;
      cursor: pointer;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .filter-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .filter-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .range-val {
      font-size: 0.85rem;
      color: var(--primary-light);
      font-weight: 600;
    }
    .radio-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .option-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .option-row input {
      accent-color: var(--primary);
    }
    .form-select {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      color: var(--text-primary);
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      outline: none;
      font-size: 0.9rem;
    }
    .range-slider {
      accent-color: var(--primary);
    }
    .results-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .results-header h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .privacy-guarantee {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .job-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .job-row-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.2s ease;
    }
    .job-row-card:hover {
      background: rgba(30, 41, 59, 0.7);
      border-color: rgba(99, 102, 241, 0.35);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.5);
    }
    .job-row-main {
      display: flex;
      gap: 1.25rem;
      flex: 1;
      cursor: pointer;
      text-decoration: none;
    }
    .company-logo {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      object-fit: cover;
      background: white;
      border: 1px solid var(--border-glass);
    }
    .job-info {
      flex: 1;
    }
    .title-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.25rem;
      flex-wrap: wrap;
    }
    .job-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .badge-urgent {
      background: rgba(244, 63, 94, 0.15);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.3);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 8px;
    }
    .badge-featured {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 8px;
    }
    .company-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-tertiary);
      margin-bottom: 0.5rem;
    }
    .dot-sep { color: var(--text-tertiary); }
    .job-desc-snippet {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .tags-row {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .tag-chip {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
    }
    .tag-chip.mode { background: rgba(99, 102, 241, 0.12); color: #a5b4fc; }
    .tag-chip.type { background: rgba(16, 185, 129, 0.12); color: #6ee7b7; }
    .job-row-aside {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1rem;
      min-width: 170px;
    }
    .salary-box {
      text-align: right;
    }
    .salary-lbl {
      display: block;
      font-size: 0.7rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }
    .salary-val {
      font-size: 1.05rem;
      font-weight: 700;
      color: #34d399;
    }
    .btn-apply-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      border-radius: 8px;
      text-decoration: none;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(30, 41, 59, 0.2);
      border-radius: var(--radius-md);
      color: var(--text-tertiary);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    @media (max-width: 900px) {
      .search-main-grid { grid-template-columns: 1fr; }
      .search-inputs-wrap { flex-direction: column; }
      .job-row-card { flex-direction: column; align-items: flex-start; }
      .job-row-aside { align-items: flex-start; width: 100%; flex-direction: row; justify-content: space-between; }
    }
  `]
})
export class JobSearchComponent implements OnInit {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);

  jobs = signal<Job[]>([]);
  totalElements = signal<number>(0);
  isLoading = signal<boolean>(true);

  keyword = '';
  location = '';
  workMode = '';
  jobType = '';
  category = '';
  maxExp = 10;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['keyword']) this.keyword = params['keyword'];
      if (params['location']) this.location = params['location'];
      if (params['workMode']) this.workMode = params['workMode'];
      if (params['category']) this.category = params['category'];
      this.loadJobs();
    });
  }

  loadJobs() {
    this.isLoading.set(true);
    this.jobService.searchJobs({
      keyword: this.keyword || undefined,
      location: this.location || undefined,
      workMode: this.workMode || undefined,
      jobType: this.jobType || undefined,
      category: this.category || undefined,
      maxExp: this.maxExp
    }).subscribe({
      next: (res) => {
        this.jobs.set(res.content || []);
        this.totalElements.set(res.totalElements || 0);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  resetFilters() {
    this.keyword = '';
    this.location = '';
    this.workMode = '';
    this.jobType = '';
    this.category = '';
    this.maxExp = 10;
    this.loadJobs();
  }

  getSkillList(skills: string): string[] {
    return skills.split(',').map(s => s.trim()).slice(0, 3);
  }
}
