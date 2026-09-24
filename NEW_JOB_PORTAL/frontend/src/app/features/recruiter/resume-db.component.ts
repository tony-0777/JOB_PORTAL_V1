import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecruiterService, CandidateResult } from '../../core/services/recruiter.service';
import { CallService } from '../../core/services/call.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-resume-db',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="candidates-page-container">
      <div class="candidates-hero">
        <div>
          <h1>Candidate Talent Search</h1>
          <p class="hero-sub">Direct access to verified candidates with zero contact scraping. All communications are masked and audited.</p>
        </div>
        <div class="privacy-seal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          <span>Anti-Scraping Protection Active</span>
        </div>
      </div>

      <!-- Search Controls -->
      <div class="search-filter-card">
        <div class="filter-inputs">
          <div class="field-item">
            <label class="field-label">Required Skills (Comma-separated)</label>
            <input type="text" [(ngModel)]="skillsQuery" (keyup.enter)="onSearch()" class="form-control" placeholder="e.g. Java, Spring Boot, Angular, Kubernetes">
          </div>
          <div class="field-item min-exp-box">
            <label class="field-label">Min Experience</label>
            <input type="number" [(ngModel)]="minExp" (keyup.enter)="onSearch()" class="form-control" min="0" max="25" placeholder="0">
          </div>
          <button (click)="onSearch()" class="btn btn-primary btn-search-talent">
            <span>Find Candidates</span>
          </button>
        </div>
      </div>

      <!-- Results Grid -->
      <div class="candidates-results">
        <div class="results-header">
          <h3>{{ candidates().length }} Qualified Candidates Found</h3>
          <span class="sub-privacy">Only in-app messaging and WebRTC calling permitted</span>
        </div>

        @if (isLoading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Searching talent database...</p>
          </div>
        } @else if (candidates().length === 0) {
          <div class="empty-state">
            <p>No candidates match your specific filter.</p>
            <button (click)="resetSearch()" class="btn btn-secondary btn-sm">Clear Search</button>
          </div>
        } @else {
          <div class="candidates-grid">
            @for (c of candidates(); track c.id) {
              <div class="candidate-card">
                <div class="candidate-card-top">
                  <img [src]="c.participant?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120'" alt="Avatar" class="avatar-lg">
                  <div class="candidate-details">
                    <h3 class="candidate-name">{{ c.participant?.displayName }}</h3>
                    <p class="candidate-headline">{{ c.headline || 'Software Engineer' }}</p>
                    <div class="candidate-badges">
                      <span class="badge-exp">{{ c.experienceYears }} Years Exp</span>
                      <span class="badge-score">{{ c.completenessScore }}% Complete</span>
                      @if (c.exchangeRegistrationNo) {
                        <span class="badge-exchange" title="Verified Gujarat Employment Exchange Registration">Govt Exchange</span>
                      }
                    </div>
                  </div>
                </div>

                @if (c.bio) {
                  <p class="candidate-bio">"{{ c.bio }}"</p>
                }

                @if (c.skills) {
                  <div class="skills-chips">
                    @for (s of getSkills(c.skills); track s) {
                      <span class="chip-skill">{{ s }}</span>
                    }
                  </div>
                }

                <div class="candidate-card-actions">
                  <button (click)="triggerMaskedCall(c, false)" class="btn btn-outline-call">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>Masked Call</span>
                  </button>
                  <button (click)="openChat(c)" class="btn btn-primary-chat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .candidates-page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }
    .candidates-hero {
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
    .candidates-hero h1 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .hero-sub {
      font-size: 0.88rem;
      color: var(--text-tertiary);
    }
    .privacy-seal {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 30px;
      color: #34d399;
      font-size: 0.78rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .search-filter-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
    }
    .filter-inputs {
      display: flex;
      align-items: flex-end;
      gap: 1.25rem;
    }
    .field-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .min-exp-box {
      max-width: 140px;
    }
    .field-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .form-control {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-glass);
      border-radius: 8px;
      padding: 0.65rem 0.85rem;
      color: var(--text-primary);
      font-size: 0.9rem;
      outline: none;
    }
    .btn-search-talent {
      padding: 0.65rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      white-space: nowrap;
    }
    .candidates-results {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .results-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .sub-privacy {
      font-size: 0.8rem;
      color: var(--text-tertiary);
    }
    .candidates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
      gap: 1.5rem;
    }
    .candidate-card {
      background: rgba(30, 41, 59, 0.35);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.2s ease;
    }
    .candidate-card:hover {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(99, 102, 241, 0.3);
      transform: translateY(-2px);
    }
    .candidate-card-top {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .avatar-lg {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-light);
    }
    .candidate-details h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .candidate-headline {
      font-size: 0.82rem;
      color: var(--text-secondary);
      margin-bottom: 0.4rem;
    }
    .candidate-badges {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .badge-exp {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .badge-score {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .badge-exchange {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .candidate-bio {
      font-size: 0.85rem;
      color: var(--text-tertiary);
      line-height: 1.5;
      font-style: italic;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .skills-chips {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .chip-skill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      color: #cbd5e1;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .candidate-card-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 1rem;
    }
    .btn-outline-call {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 0.55rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-outline-call:hover { background: rgba(16, 185, 129, 0.25); }
    .btn-primary-chat {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      background: var(--primary);
      border: none;
      color: white;
      padding: 0.55rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary-chat:hover { background: var(--primary-hover); }
    @media (max-width: 768px) {
      .filter-inputs { flex-direction: column; align-items: stretch; }
      .min-exp-box { max-width: 100%; }
      .candidates-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ResumeDbComponent implements OnInit {
  private recruiterService = inject(RecruiterService);
  private callService = inject(CallService);
  private chatService = inject(ChatService);
  private router = inject(Router);

  candidates = signal<CandidateResult[]>([]);
  isLoading = signal<boolean>(true);
  skillsQuery = '';
  minExp = 0;

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    this.isLoading.set(true);
    this.recruiterService.searchCandidates(this.skillsQuery || undefined, this.minExp).subscribe({
      next: (res) => {
        this.candidates.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  resetSearch() {
    this.skillsQuery = '';
    this.minExp = 0;
    this.onSearch();
  }

  getSkills(skills: string): string[] {
    return skills.split(',').map(s => s.trim()).slice(0, 5);
  }

  triggerMaskedCall(c: CandidateResult, isVideo: boolean) {
    if (c.participant) {
      this.callService.startDirectCall(c.participant, isVideo);
    }
  }

  openChat(c: CandidateResult) {
    // participant.id or participant.userId (backend sends userId in ParticipantDto)
    const targetId = c.participant?.id ?? c.participant?.userId;
    if (!targetId) return;
    this.chatService.startConversation(targetId).subscribe({
      next: () => this.router.navigate(['/chat'])
    });
  }
}
