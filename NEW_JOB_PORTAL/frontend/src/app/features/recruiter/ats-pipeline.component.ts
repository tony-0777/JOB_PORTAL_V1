import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecruiterService } from '../../core/services/recruiter.service';
import { CallService } from '../../core/services/call.service';
import { ChatService } from '../../core/services/chat.service';
import { Job, Application } from '../../core/models/models';

@Component({
  selector: 'app-ats-pipeline',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="kanban-page-container">
      <!-- Header Controls -->
      <div class="kanban-top-bar">
        <div class="kanban-title-area">
          <h1>ATS Candidate Kanban Board</h1>
          <p class="kanban-sub">Track and advance candidates through recruitment stages with masked in-app calling.</p>
        </div>

        <div class="kanban-filters">
          <label class="filter-label">Job Requisition:</label>
          <select [(ngModel)]="selectedJobId" (change)="onJobSelected()" class="job-dropdown">
            @for (job of jobs(); track job.id) {
              <option [value]="job.id">{{ job.title }} ({{ job.applicationCount || 0 }})</option>
            }
          </select>
        </div>
      </div>

      <!-- Privacy Notice Bar -->
      <div class="ats-privacy-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        <span>Zero Contact Leakage Active: Candidate cellular numbers and email addresses are securely shielded. Conduct screening via In-App Voice Call or Chat.</span>
      </div>

      <!-- Kanban Columns Stage Board -->
      <div class="kanban-board-scroll">
        <div class="kanban-board">
          @for (stage of stages; track stage.key) {
            <div class="kanban-column" [ngClass]="stage.key.toLowerCase()">
              <div class="column-header">
                <div class="column-title-group">
                  <span class="stage-dot"></span>
                  <h3>{{ stage.title }}</h3>
                </div>
                <span class="column-count">{{ getApplicationsForStage(stage.key).length }}</span>
              </div>

              <div class="cards-column-body">
                @for (app of getApplicationsForStage(stage.key); track app.id) {
                  <div class="applicant-card" (click)="selectApplication(app)">
                    <div class="card-candidate-header">
                      <img [src]="app.seekerAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'" class="candidate-avatar" alt="Avatar">
                      <div class="candidate-info">
                        <h4>{{ app.seekerName }}</h4>
                        <p class="candidate-headline">{{ app.seekerHeadline || 'Software Engineer' }}</p>
                      </div>
                    </div>

                    <div class="card-meta-row">
                      <span class="applied-date">{{ app.appliedAt | date:'shortDate' }}</span>
                      @if (app.rating) {
                        <div class="rating-stars">
                          <span>★ {{ app.rating }}</span>
                        </div>
                      }
                    </div>

                    @if (app.coverNote) {
                      <p class="card-cover-preview">"{{ app.coverNote }}"</p>
                    }

                    <!-- Action Shortcut Buttons -->
                    <div class="card-actions-strip" (click)="$event.stopPropagation()">
                      <button (click)="triggerMaskedCall(app, false)" class="card-btn-icon call" title="Initiate Masked Audio Call">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </button>
                      <button (click)="triggerMaskedCall(app, true)" class="card-btn-icon video" title="Initiate In-App Video Call">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
                      </button>
                      <button (click)="openChat(app)" class="card-btn-icon chat" title="Open Masked Chat">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Candidate Review Drawer / Modal -->
      @if (selectedApp(); as app) {
        <div class="drawer-backdrop" (click)="closeDrawer()">
          <div class="candidate-drawer" (click)="$event.stopPropagation()">
            <div class="drawer-header">
              <div class="drawer-candidate-intro">
                <img [src]="app.seekerAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'" class="drawer-avatar" alt="Avatar">
                <div>
                  <h2>{{ app.seekerName }}</h2>
                  <p class="drawer-headline">{{ app.seekerHeadline || 'Software Engineer' }}</p>
                  <span class="privacy-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                    Contact Masked (Encrypted)
                  </span>
                </div>
              </div>
              <button (click)="closeDrawer()" class="btn-close-drawer">✕</button>
            </div>

            <!-- Communication Quick Bar -->
            <div class="drawer-comm-actions">
              <button (click)="triggerMaskedCall(app, false)" class="btn btn-call-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>Voice Call</span>
              </button>
              <button (click)="triggerMaskedCall(app, true)" class="btn btn-video-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
                <span>Video Call</span>
              </button>
              <button (click)="openChat(app)" class="btn btn-chat-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Chat</span>
              </button>
            </div>

            <!-- Stage Transition Selector -->
            <div class="drawer-field">
              <label class="drawer-label">ATS Pipeline Stage</label>
              <select [(ngModel)]="currentStage" (change)="onStatusChange()" class="drawer-select">
                @for (stage of stages; track stage.key) {
                  <option [value]="stage.key">{{ stage.title }}</option>
                }
              </select>
            </div>

            <!-- Candidate Rating -->
            <div class="drawer-field">
              <label class="drawer-label">Interviewer Rating</label>
              <div class="rating-picker">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <button (click)="setRating(star)" [class.active-star]="star <= currentRating" class="star-btn">★</button>
                }
              </div>
            </div>

            <!-- Cover Note -->
            @if (app.coverNote) {
              <div class="drawer-field">
                <label class="drawer-label">Candidate Statement / Cover Note</label>
                <div class="text-display-box">
                  {{ app.coverNote }}
                </div>
              </div>
            }

            <!-- Screening Answers -->
            @if (app.screeningAnswers && getObjectKeys(app.screeningAnswers).length > 0) {
              <div class="drawer-field">
                <label class="drawer-label">Screening Questions & Responses</label>
                <div class="screening-review-list">
                  @for (q of getObjectKeys(app.screeningAnswers); track q) {
                    <div class="screening-item">
                      <span class="q-label">Q: {{ q }}</span>
                      <p class="a-val">A: {{ app.screeningAnswers[q] }}</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Recruiter Internal Notes -->
            <div class="drawer-field">
              <label class="drawer-label">Internal Recruiter Notes</label>
              <textarea [(ngModel)]="currentNotes" rows="3" class="drawer-textarea" placeholder="Add interview feedback or next steps..."></textarea>
            </div>

            <div class="drawer-footer">
              <button (click)="saveCandidateEvaluation()" class="btn btn-primary w-100">
                <span>Save Evaluation & Notes</span>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .kanban-page-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 1.5rem 1.5rem 4rem;
    }
    .kanban-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .kanban-title-area h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .kanban-sub {
      font-size: 0.85rem;
      color: var(--text-tertiary);
    }
    .kanban-filters {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .filter-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .job-dropdown {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid var(--border-glass);
      color: var(--text-primary);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      min-width: 280px;
    }
    .ats-privacy-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 8px;
      padding: 0.6rem 1rem;
      font-size: 0.78rem;
      color: #34d399;
      margin-bottom: 1.5rem;
    }
    .kanban-board-scroll {
      overflow-x: auto;
      padding-bottom: 1.5rem;
    }
    .kanban-board {
      display: flex;
      gap: 1.25rem;
      min-width: 1400px;
    }
    .kanban-column {
      flex: 1;
      min-width: 250px;
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      height: calc(100vh - 270px);
      min-height: 550px;
    }
    .column-header {
      padding: 1rem;
      border-bottom: 1px solid var(--border-glass);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .column-title-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .stage-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #818cf8;
    }
    .new .stage-dot { background: #38bdf8; }
    .screened .stage-dot { background: #c084fc; }
    .shortlisted .stage-dot { background: #fbbf24; }
    .interview_scheduled .stage-dot { background: #10b981; }
    .offer_sent .stage-dot { background: #34d399; }
    .hired .stage-dot { background: #4ade80; }
    .rejected .stage-dot { background: #f43f5e; }
    .column-header h3 {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .column-count {
      background: rgba(255, 255, 255, 0.08);
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 12px;
      color: var(--text-secondary);
    }
    .cards-column-body {
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      overflow-y: auto;
      flex: 1;
    }
    .applicant-card {
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-sm);
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .applicant-card:hover {
      background: rgba(15, 23, 42, 0.9);
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    }
    .card-candidate-header {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .candidate-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid var(--primary-light);
    }
    .candidate-info h4 {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.15rem;
    }
    .candidate-headline {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.72rem;
      color: var(--text-tertiary);
    }
    .rating-stars {
      color: #fbbf24;
      font-weight: 700;
    }
    .card-cover-preview {
      font-size: 0.78rem;
      color: var(--text-secondary);
      font-style: italic;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-actions-strip {
      display: flex;
      gap: 0.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 0.5rem;
      justify-content: flex-end;
    }
    .card-btn-icon {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-glass);
      cursor: pointer;
      transition: all 0.2s;
    }
    .card-btn-icon.call {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    .card-btn-icon.video {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
    }
    .card-btn-icon.chat {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
    }
    .card-btn-icon:hover {
      transform: scale(1.1);
    }
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      z-index: 1200;
      display: flex;
      justify-content: flex-end;
    }
    .candidate-drawer {
      width: 100%;
      max-width: 480px;
      height: 100%;
      background: #111827;
      border-left: 1px solid var(--border-glass);
      display: flex;
      flex-direction: column;
      padding: 2rem;
      gap: 1.25rem;
      overflow-y: auto;
      box-shadow: -15px 0 35px rgba(0,0,0,0.7);
    }
    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--border-glass);
      padding-bottom: 1.25rem;
    }
    .drawer-candidate-intro {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .drawer-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-light);
    }
    .drawer-candidate-intro h2 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .drawer-headline {
      font-size: 0.8rem;
      color: var(--text-tertiary);
    }
    .privacy-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.7rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      padding: 1px 6px;
      border-radius: 4px;
    }
    .btn-close-drawer {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 1.2rem;
      cursor: pointer;
    }
    .drawer-comm-actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.6rem;
    }
    .btn-call-primary, .btn-video-primary, .btn-chat-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.6rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }
    .btn-call-primary { background: #10b981; color: white; }
    .btn-video-primary { background: #6366f1; color: white; }
    .btn-chat-primary { background: #0284c7; color: white; }
    .drawer-field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .drawer-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .drawer-select, .drawer-textarea {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-glass);
      color: var(--text-primary);
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
    }
    .rating-picker {
      display: flex;
      gap: 0.5rem;
    }
    .star-btn {
      background: transparent;
      border: none;
      font-size: 1.4rem;
      color: rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: color 0.2s;
    }
    .star-btn.active-star {
      color: #fbbf24;
    }
    .text-display-box {
      background: rgba(0, 0, 0, 0.2);
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .screening-review-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .screening-item {
      background: rgba(0, 0, 0, 0.2);
      padding: 0.65rem;
      border-radius: 6px;
    }
    .q-label {
      display: block;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--primary-light);
      margin-bottom: 0.2rem;
    }
    .a-val {
      font-size: 0.82rem;
      color: var(--text-primary);
      margin: 0;
    }
    .drawer-footer {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--border-glass);
    }
  `]
})
export class AtsPipelineComponent implements OnInit {
  private recruiterService = inject(RecruiterService);
  private callService = inject(CallService);
  private chatService = inject(ChatService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  jobs = signal<Job[]>([]);
  applications = signal<Application[]>([]);
  selectedJobId: number = 0;
  selectedApp = signal<Application | null>(null);

  currentStage: string = '';
  currentRating: number = 0;
  currentNotes: string = '';

  readonly stages = [
    { key: 'NEW', title: 'New Applied' },
    { key: 'SCREENED', title: 'Screened' },
    { key: 'SHORTLISTED', title: 'Shortlisted' },
    { key: 'INTERVIEW_SCHEDULED', title: 'Interview Set' },
    { key: 'OFFER_SENT', title: 'Offer Sent' },
    { key: 'HIRED', title: 'Hired' },
    { key: 'REJECTED', title: 'Archived' }
  ];

  ngOnInit() {
    this.recruiterService.getMyJobs().subscribe({
      next: (j) => {
        this.jobs.set(j);
        const queryJobId = Number(this.route.snapshot.queryParams['jobId']);
        if (queryJobId && j.some(job => job.id === queryJobId)) {
          this.selectedJobId = queryJobId;
        } else if (j.length > 0) {
          this.selectedJobId = j[0].id;
        }
        this.onJobSelected();
      }
    });
  }

  onJobSelected() {
    if (!this.selectedJobId) return;
    this.recruiterService.getJobApplications(this.selectedJobId).subscribe({
      next: (apps) => this.applications.set(apps)
    });
  }

  getApplicationsForStage(stageKey: string): Application[] {
    return this.applications().filter(a => a.status === stageKey);
  }

  selectApplication(app: Application) {
    this.selectedApp.set(app);
    this.currentStage = app.status;
    this.currentRating = app.rating || 0;
    this.currentNotes = app.recruiterNotes || '';
  }

  closeDrawer() {
    this.selectedApp.set(null);
  }

  setRating(star: number) {
    this.currentRating = star;
  }

  onStatusChange() {
    const app = this.selectedApp();
    if (!app) return;
    this.recruiterService.updateAtsStatus(app.id, {
      status: this.currentStage,
      recruiterNotes: this.currentNotes,
      rating: this.currentRating
    }).subscribe({
      next: (updated) => {
        this.applications.update(list => list.map(a => a.id === updated.id ? updated : a));
        this.selectedApp.set(updated);
      }
    });
  }

  saveCandidateEvaluation() {
    this.onStatusChange();
    this.closeDrawer();
  }

  triggerMaskedCall(app: Application, isVideo: boolean) {
    this.callService.startDirectCall({
      id: app.seekerId,
      displayName: app.seekerName,
      headline: app.seekerHeadline,
      avatarUrl: app.seekerAvatar,
      role: 'SEEKER'
    }, isVideo);
  }

  openChat(app: Application) {
    this.chatService.startConversation(app.seekerId, app.jobId).subscribe({
      next: () => this.router.navigate(['/chat'])
    });
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
