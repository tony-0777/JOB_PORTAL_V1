import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExchangeService, SchemeInfo, JobFairInfo } from '../../core/services/exchange.service';
import { AuthService } from '../../core/services/auth.service';
import { GovtExchangeProfile } from '../../core/models/models';

@Component({
  selector: 'app-gov-exchange',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="exchange-page-container">
      <!-- Top Banner -->
      <div class="exchange-hero-banner">
        <div class="banner-badge">
          <span>🏛️ Directorate of Employment & Training (DET)</span>
        </div>
        <h1>Gujarat State Employment Exchange (Anubandhan Model)</h1>
        <p class="banner-sub">
          Official digital facilitation linkage connecting job seekers, public apprenticeships, and Rozgar Mela job drives with statewide verified enterprises.
        </p>
      </div>

      <!-- Main Layout -->
      <div class="exchange-grid">
        <!-- Left: Digital ID Card or Registration -->
        <div class="exchange-left-col">
          @if (profile(); as p) {
            <!-- Digital Employment Card -->
            <div class="digital-card-container">
              <div class="smart-card">
                <div class="card-header">
                  <div class="emblem-box">
                    <span class="emblem-text">GOVT OF GUJARAT</span>
                    <span class="sub-emblem">DET Portal (Anubandhan)</span>
                  </div>
                  <div class="chip-graphic"></div>
                </div>

                <div class="card-body">
                  <div class="card-photo-row">
                    <img [src]="auth.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'" class="card-photo" alt="Photo">
                    <div class="card-holder-info">
                      <h3 class="holder-name">{{ auth.currentUser()?.displayName }}</h3>
                      <span class="reg-number">{{ p.registrationNumber }}</span>
                      <span class="status-verified">STATUS: VERIFIED CANDIDATE</span>
                    </div>
                  </div>

                  <div class="card-meta-grid">
                    <div class="card-meta-item">
                      <span class="meta-title">DISTRICT</span>
                      <span class="meta-val">{{ p.district }}</span>
                    </div>
                    <div class="card-meta-item">
                      <span class="meta-title">QUALIFICATION</span>
                      <span class="meta-val">{{ p.qualificationLevel }}</span>
                    </div>
                    <div class="card-meta-item">
                      <span class="meta-title">CATEGORY</span>
                      <span class="meta-val">{{ p.categoryGroup }}</span>
                    </div>
                    <div class="card-meta-item">
                      <span class="meta-title">EMPLOYMENT</span>
                      <span class="meta-val">{{ p.employmentStatus }}</span>
                    </div>
                  </div>
                </div>

                <div class="card-footer">
                  <div class="qr-simulation">
                    <div class="qr-block"></div>
                    <div class="qr-block"></div>
                    <div class="qr-block"></div>
                  </div>
                  <span class="qr-caption">Scan at Rozgar Mela entrance</span>
                </div>
              </div>

              <div class="download-card-bar">
                <button class="btn btn-secondary btn-sm">Download Digital PDF Card</button>
              </div>
            </div>
          } @else {
            <!-- Registration Form Card -->
            <div class="registration-card">
              <h2>Register for Employment Exchange</h2>
              <p class="reg-sub">Generate your state registration number to participate in public sector drives and job fairs.</p>

              @if (regError()) {
                <div class="alert-error">{{ regError() }}</div>
              }

              <form (ngSubmit)="onRegister()" class="reg-form">
                <div class="form-group">
                  <label class="form-label">District (Gujarat)</label>
                  <select [(ngModel)]="newReg.district" name="district" class="form-select">
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Gandhinagar">Gandhinagar</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Surat">Surat</option>
                    <option value="Rajkot">Rajkot</option>
                    <option value="Bhavnagar">Bhavnagar</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Highest Qualification Level</label>
                  <select [(ngModel)]="newReg.qualificationLevel" name="qualification" class="form-select">
                    <option value="Graduate (B.Tech / BE)">Graduate (B.Tech / BE)</option>
                    <option value="Post Graduate (M.Tech / MCA)">Post Graduate (M.Tech / MCA)</option>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                    <option value="Graduate (B.Sc / BCA)">Graduate (B.Sc / BCA)</option>
                    <option value="Higher Secondary (12th)">Higher Secondary (12th)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Current Employment Status</label>
                  <select [(ngModel)]="newReg.employmentStatus" name="status" class="form-select">
                    <option value="Unemployed (Seeking Job)">Unemployed (Seeking Job)</option>
                    <option value="Employed (Looking for Betterment)">Employed (Looking for Betterment)</option>
                    <option value="Apprentice Trainee">Apprentice Trainee</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Social Category</label>
                  <select [(ngModel)]="newReg.categoryGroup" name="catGroup" class="form-select">
                    <option value="General">General</option>
                    <option value="EWS">EWS</option>
                    <option value="SEBC / OBC">SEBC / OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>

                <button type="submit" [disabled]="isSubmitting()" class="btn btn-emerald w-100">
                  @if (isSubmitting()) { <span>Generating Registration...</span> }
                  @else { <span>Complete Exchange Enrollment</span> }
                </button>
              </form>
            </div>
          }
        </div>

        <!-- Right: Rozgar Mela & Government Schemes -->
        <div class="exchange-right-col">
          <!-- Upcoming Job Fairs -->
          <div class="section-box">
            <div class="section-title-row">
              <h3>Upcoming Rozgar Mela (Job Camps)</h3>
              <span class="live-pill">Direct Drives</span>
            </div>

            <div class="fairs-list">
              @for (fair of jobFairs(); track fair.title) {
                <div class="fair-card">
                  <div class="fair-date-badge">
                    <span class="fair-day">OCT</span>
                    <span class="fair-num">12</span>
                  </div>
                  <div class="fair-info">
                    <h4>{{ fair.title }}</h4>
                    <p class="fair-loc">📍 {{ fair.location }}</p>
                    <div class="fair-stats">
                      <span>{{ fair.participatingCompanies }} Participating Companies</span>
                      <span class="dot">•</span>
                      <span>{{ fair.openings }}+ Open Vacancies</span>
                    </div>
                  </div>
                  <button class="btn btn-secondary btn-sm">Register</button>
                </div>
              }
            </div>
          </div>

          <!-- Schemes List -->
          <div class="section-box">
            <div class="section-title-row">
              <h3>Government Youth & Apprentice Schemes</h3>
            </div>

            <div class="schemes-grid">
              @for (scheme of schemes(); track scheme.name) {
                <div class="scheme-card">
                  <div class="scheme-header">
                    <h4>{{ scheme.name }}</h4>
                    <span class="scheme-cat">{{ scheme.category }}</span>
                  </div>
                  <p class="scheme-desc">{{ scheme.description }}</p>
                  <div class="scheme-benefit">
                    <strong>Benefit:</strong> {{ scheme.benefit }}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exchange-page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .exchange-hero-banner {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.3) 100%);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }
    .banner-badge {
      display: inline-block;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #34d399;
      margin-bottom: 0.75rem;
    }
    .exchange-hero-banner h1 {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.5rem;
    }
    .banner-sub {
      font-size: 0.95rem;
      color: #cbd5e1;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }
    .exchange-grid {
      display: grid;
      grid-template-columns: 440px 1fr;
      gap: 2rem;
    }
    .smart-card {
      background: linear-gradient(135deg, #064e3b 0%, #022c22 100%);
      border: 1.5px solid rgba(16, 185, 129, 0.5);
      border-radius: 18px;
      padding: 1.75rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(16, 185, 129, 0.3);
      padding-bottom: 0.75rem;
    }
    .emblem-text {
      display: block;
      font-size: 0.85rem;
      font-weight: 800;
      color: #a7f3d0;
      letter-spacing: 0.05em;
    }
    .sub-emblem {
      font-size: 0.72rem;
      color: #6ee7b7;
    }
    .chip-graphic {
      width: 40px;
      height: 30px;
      background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
      border-radius: 6px;
    }
    .card-photo-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .card-photo {
      width: 68px;
      height: 68px;
      border-radius: 10px;
      object-fit: cover;
      border: 2px solid #34d399;
    }
    .holder-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.2rem;
    }
    .reg-number {
      font-family: monospace;
      font-size: 0.95rem;
      color: #fef08a;
      display: block;
      margin-bottom: 0.3rem;
    }
    .status-verified {
      font-size: 0.65rem;
      font-weight: 700;
      background: rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .card-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      background: rgba(0, 0, 0, 0.25);
      padding: 0.85rem;
      border-radius: 10px;
    }
    .meta-title {
      display: block;
      font-size: 0.65rem;
      color: #6ee7b7;
      text-transform: uppercase;
    }
    .meta-val {
      font-size: 0.82rem;
      color: white;
      font-weight: 600;
    }
    .card-footer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-top: 1px solid rgba(16, 185, 129, 0.2);
      padding-top: 0.75rem;
    }
    .qr-simulation {
      display: flex;
      gap: 2px;
    }
    .qr-block {
      width: 14px;
      height: 14px;
      background: #a7f3d0;
    }
    .qr-caption {
      font-size: 0.7rem;
      color: #6ee7b7;
    }
    .download-card-bar {
      margin-top: 1rem;
      text-align: center;
    }
    .registration-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 2rem;
    }
    .registration-card h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }
    .reg-sub {
      font-size: 0.82rem;
      color: var(--text-tertiary);
      margin-bottom: 1.5rem;
    }
    .reg-form {
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
    .form-select {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      color: var(--text-primary);
      font-size: 0.9rem;
      outline: none;
    }
    .btn-emerald {
      background: #10b981;
      color: white;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }
    .btn-emerald:hover { background: #059669; }
    .section-box {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      margin-bottom: 2rem;
    }
    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .section-title-row h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .live-pill {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      text-transform: uppercase;
    }
    .fairs-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .fair-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .fair-date-badge {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 10px;
      padding: 0.5rem 0.75rem;
      text-align: center;
      display: flex;
      flex-direction: column;
    }
    .fair-day { font-size: 0.65rem; color: #34d399; font-weight: 700; }
    .fair-num { font-size: 1.2rem; color: white; font-weight: 800; }
    .fair-info { flex: 1; }
    .fair-info h4 {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .fair-loc {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      margin-bottom: 0.3rem;
    }
    .fair-stats {
      font-size: 0.75rem;
      color: #a7f3d0;
      display: flex;
      gap: 0.4rem;
      align-items: center;
    }
    .schemes-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .scheme-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .scheme-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .scheme-header h4 {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .scheme-cat {
      font-size: 0.7rem;
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .scheme-desc {
      font-size: 0.82rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .scheme-benefit {
      font-size: 0.78rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
    }
    @media (max-width: 900px) {
      .exchange-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class GovExchangeComponent implements OnInit {
  auth = inject(AuthService);
  private exchangeService = inject(ExchangeService);

  profile = signal<GovtExchangeProfile | null>(null);
  jobFairs = signal<JobFairInfo[]>([]);
  schemes = signal<SchemeInfo[]>([]);

  newReg: GovtExchangeProfile = {
    district: 'Ahmedabad',
    qualificationLevel: 'Graduate (B.Tech / BE)',
    employmentStatus: 'Employed (Looking for Betterment)',
    categoryGroup: 'General'
  };

  isSubmitting = signal<boolean>(false);
  regError = signal<string | null>(null);

  ngOnInit() {
    this.exchangeService.getProfile().subscribe({
      next: (p) => this.profile.set(p),
      error: () => {}
    });

    this.exchangeService.getJobFairs().subscribe({
      next: (fairs) => this.jobFairs.set(fairs)
    });

    this.exchangeService.getSchemes().subscribe({
      next: (s) => this.schemes.set(s)
    });
  }

  onRegister() {
    this.isSubmitting.set(true);
    this.regError.set(null);

    this.exchangeService.register(this.newReg).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.regError.set(err.error?.message || 'Failed to register. Please ensure you are logged in as a candidate.');
      }
    });
  }
}
