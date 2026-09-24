import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallService } from '../../../core/services/call.service';

@Component({
  selector: 'app-call-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (callService.currentCall(); as call) {
      <div class="call-overlay">
        <div class="call-dialog">
          <!-- Privacy Shield Notice -->
          <div class="call-privacy-shield">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            <span>In-App Masked WebRTC Call (Phone Number Hidden)</span>
          </div>

          <!-- Video / Avatar Stage -->
          <div class="call-stage" [class.video-active]="call.video && !callService.isVideoOff()">
            @if (call.video && !callService.isVideoOff()) {
              <div class="remote-video-placeholder">
                <div class="video-watermark">
                  <span>WebRTC Video Stream Active</span>
                </div>
                <img [src]="call.callee.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'" class="video-bg-feed" alt="Video">
              </div>
            } @else {
              <div class="avatar-ring-container" [class.ringing]="call.state === 'RINGING'">
                <img [src]="call.callee.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'" class="caller-avatar" alt="Avatar">
                <div class="ring-pulse pulse-1"></div>
                <div class="ring-pulse pulse-2"></div>
              </div>
            }

            <div class="participant-meta">
              <h2 class="participant-name">{{ call.callee.displayName }}</h2>
              <p class="participant-headline">{{ call.callee.headline || 'Software Engineer Candidate' }}</p>
              @if (call.callee.companyName) {
                <span class="company-tag">{{ call.callee.companyName }}</span>
              }

              <!-- Status / Duration -->
              <div class="call-status-indicator">
                @if (call.state === 'RINGING') {
                  <span class="status-badge ringing">
                    <span class="dot-bounce"></span> Ringing...
                  </span>
                } @else if (call.state === 'ACCEPTED') {
                  <span class="status-badge live">
                    <span class="dot-live"></span> {{ formatDuration(callService.callDuration()) }}
                  </span>
                } @else if (call.state === 'ENDED') {
                  <span class="status-badge ended">Call Ended</span>
                }
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="call-controls">
            <!-- Mute Audio -->
            <button (click)="callService.toggleMute()" 
                    [class.active-ctrl]="callService.isMuted()" 
                    class="ctrl-btn" 
                    [title]="callService.isMuted() ? 'Unmute' : 'Mute'">
              @if (callService.isMuted()) {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="2" x2="22" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              } @else {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              }
            </button>

            <!-- Toggle Video -->
            <button (click)="callService.toggleVideo()" 
                    [class.active-ctrl]="callService.isVideoOff()" 
                    class="ctrl-btn"
                    [title]="callService.isVideoOff() ? 'Turn Camera On' : 'Turn Camera Off'">
              @if (callService.isVideoOff()) {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="2" x2="22" y2="22"/><path d="m16 16-1.5-1.5"/><path d="M16 10l4.55-2.28A1 1 0 0 1 22 8.62v6.76a1 1 0 0 1-1.45.9l-4.55-2.28"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
              } @else {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
              }
            </button>

            <!-- Accept (if incoming/ringing) -->
            @if (call.state === 'RINGING') {
              <button (click)="callService.acceptCall()" class="ctrl-btn btn-accept" title="Answer Call">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </button>
            }

            <!-- End Call -->
            <button (click)="callService.endCall()" class="ctrl-btn btn-end" title="Hang Up">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .call-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 15, 29, 0.85);
      backdrop-filter: blur(20px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .call-dialog {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 480px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      animation: modalFadeIn 0.3s ease-out;
    }
    .call-privacy-shield {
      width: 100%;
      background: rgba(16, 185, 129, 0.15);
      border-bottom: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .call-stage {
      padding: 2.5rem 1.5rem 1.5rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .avatar-ring-container {
      position: relative;
      width: 110px;
      height: 110px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .caller-avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--primary-light);
      z-index: 2;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .ring-pulse {
      position: absolute;
      border-radius: 50%;
      border: 2px solid var(--primary-light);
      inset: 0;
      opacity: 0;
      pointer-events: none;
    }
    .ringing .pulse-1 {
      animation: pulseWave 2s infinite ease-out;
    }
    .ringing .pulse-2 {
      animation: pulseWave 2s 0.8s infinite ease-out;
    }
    @keyframes pulseWave {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    .remote-video-placeholder {
      width: 100%;
      height: 220px;
      border-radius: var(--radius-md);
      overflow: hidden;
      position: relative;
      background: #000;
      margin-bottom: 1.5rem;
    }
    .video-bg-feed {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.8;
    }
    .video-watermark {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 3;
      background: rgba(0,0,0,0.6);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      color: #34d399;
    }
    .participant-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }
    .participant-headline {
      font-size: 0.85rem;
      color: var(--text-tertiary);
      margin-bottom: 0.5rem;
      max-width: 340px;
    }
    .company-tag {
      background: rgba(255, 255, 255, 0.08);
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 12px;
      color: var(--text-secondary);
    }
    .call-status-indicator {
      margin-top: 1rem;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .status-badge.ringing {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .status-badge.live {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-badge.ended {
      background: rgba(244, 63, 94, 0.15);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }
    .dot-live {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      animation: pulseDot 1.5s infinite;
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .call-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      padding: 1.5rem;
      width: 100%;
      border-top: 1px solid var(--border-glass);
      background: rgba(0,0,0,0.2);
    }
    .ctrl-btn {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
    }
    .ctrl-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
    .ctrl-btn.active-ctrl {
      background: rgba(244, 63, 94, 0.2);
      color: #f43f5e;
    }
    .btn-accept {
      background: #10b981;
      color: white;
    }
    .btn-accept:hover {
      background: #059669;
    }
    .btn-end {
      background: #ef4444;
      color: white;
    }
    .btn-end:hover {
      background: #dc2626;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class CallModalComponent {
  callService = inject(CallService);

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
