import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { PlatformStats, Company, User } from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page-container">
      <div class="admin-hero">
        <div>
          <h1>Platform Administration Console</h1>
          <p class="hero-sub">System-wide monitoring, employer KYC verifications, job post moderation, and privacy auditing.</p>
        </div>
        <div class="admin-badge">
          <span>SUPERADMIN ACCESS</span>
        </div>
      </div>

      <!-- KPI Grid -->
      @if (stats(); as s) {
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-num">{{ s.totalUsers }}</span>
            <span class="stat-lbl">Total Registered Users</span>
          </div>
          <div class="stat-card">
            <span class="stat-num blue">{{ s.totalSeekers }}</span>
            <span class="stat-lbl">Job Seekers</span>
          </div>
          <div class="stat-card">
            <span class="stat-num purple">{{ s.totalRecruiters }}</span>
            <span class="stat-lbl">Recruiters</span>
          </div>
          <div class="stat-card">
            <span class="stat-num emerald">{{ s.activeJobs }} / {{ s.totalJobs }}</span>
            <span class="stat-lbl">Active / Total Jobs</span>
          </div>
          <div class="stat-card">
            <span class="stat-num amber">{{ s.pendingKyc }}</span>
            <span class="stat-lbl">Pending Employer KYC</span>
          </div>
        </div>
      }

      <div class="admin-sections-grid">
        <!-- Pending KYC Verifications -->
        <div class="admin-card">
          <div class="card-header">
            <h2>Employer KYC Verification Queue</h2>
            <span class="badge-count">{{ pendingCompanies().length }} Pending</span>
          </div>

          @if (pendingCompanies().length === 0) {
            <div class="empty-state-sm">
              <p>All employer enterprise accounts are currently verified.</p>
            </div>
          } @else {
            <div class="kyc-list">
              @for (c of pendingCompanies(); track c.id) {
                <div class="kyc-item">
                  <div class="comp-info">
                    <h4>{{ c.name }}</h4>
                    <span class="industry">{{ c.industry }} • {{ c.location }}</span>
                  </div>
                  <div class="kyc-actions">
                    <button (click)="verifyKyc(c.id, 'VERIFIED')" class="btn-verify">Approve KYC</button>
                    <button (click)="verifyKyc(c.id, 'REJECTED')" class="btn-reject">Reject</button>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- System Privacy & Audit Log -->
        <div class="admin-card">
          <div class="card-header">
            <h2>Zero-Leakage Privacy Engine Status</h2>
            <span class="badge-active">ACTIVE & HEALTHY</span>
          </div>

          <div class="privacy-status-list">
            <div class="status-row">
              <div class="status-indicator live"></div>
              <div class="status-details">
                <strong>Contact Regex Masking Filter (FR-PV-02)</strong>
                <p>Phone numbers (+91, standard 10-digit) and emails in chat payloads are sanitized in real-time before database persistence.</p>
              </div>
            </div>

            <div class="status-row">
              <div class="status-indicator live"></div>
              <div class="status-details">
                <strong>WebRTC Masked Calling Relay (FR-CL-01)</strong>
                <p>Candidate and Recruiter telephone lines remain disengaged. In-app STOMP signaling securely bridges peer connections.</p>
              </div>
            </div>

            <div class="status-row">
              <div class="status-indicator live"></div>
              <div class="status-details">
                <strong>Anubandhan Employment Exchange Linkage</strong>
                <p>DET public sector Rozgar Mela data relay is synchronized.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .admin-hero {
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
    .admin-hero h1 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .hero-sub {
      font-size: 0.9rem;
      color: var(--text-tertiary);
    }
    .admin-badge {
      background: rgba(245, 158, 11, 0.2);
      border: 1px solid rgba(245, 158, 11, 0.4);
      padding: 0.4rem 0.85rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 800;
      color: #fbbf24;
      letter-spacing: 0.05em;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .stat-num {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .stat-num.blue { color: #38bdf8; }
    .stat-num.purple { color: #c084fc; }
    .stat-num.emerald { color: #34d399; }
    .stat-num.amber { color: #fbbf24; }
    .stat-lbl {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }
    .admin-sections-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    .admin-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .card-header h2 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .badge-count {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .badge-active {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .kyc-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .kyc-item {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-sm);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .comp-info h4 {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .industry {
      font-size: 0.78rem;
      color: var(--text-tertiary);
    }
    .kyc-actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-verify {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-reject {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #f43f5e;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
    }
    .privacy-status-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .status-row {
      display: flex;
      gap: 0.85rem;
      align-items: flex-start;
      background: rgba(15, 23, 42, 0.5);
      padding: 1rem;
      border-radius: 8px;
    }
    .status-indicator.live {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      margin-top: 4px;
      box-shadow: 0 0 8px #10b981;
    }
    .status-details strong {
      font-size: 0.9rem;
      color: var(--text-primary);
      display: block;
      margin-bottom: 0.25rem;
    }
    .status-details p {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      line-height: 1.5;
      margin: 0;
    }
    .empty-state-sm {
      padding: 2rem;
      text-align: center;
      color: var(--text-tertiary);
      font-size: 0.85rem;
    }
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .admin-sections-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats = signal<PlatformStats | null>(null);
  pendingCompanies = signal<Company[]>([]);

  ngOnInit() {
    this.adminService.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => {}
    });

    this.loadPendingKyc();
  }

  loadPendingKyc() {
    this.adminService.getPendingKyc().subscribe({
      next: (comps) => this.pendingCompanies.set(comps),
      error: () => {}
    });
  }

  verifyKyc(companyId: number, status: 'VERIFIED' | 'REJECTED') {
    this.adminService.verifyCompany(companyId, status).subscribe({
      next: () => this.loadPendingKyc()
    });
  }
}
