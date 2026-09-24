import { Component, OnInit, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { CallService } from '../../core/services/call.service';
import { Conversation, ChatMessage, Participant } from '../../core/models/models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="chat-page-container">
      <div class="chat-glass-frame">
        <!-- Left Sidebar: Conversations List -->
        <aside class="conversations-sidebar">
          <div class="sidebar-header">
            <h2>Messages</h2>
            <span class="active-badge">{{ conversations().length }}</span>
          </div>

          <div class="conversations-list">
            @if (isLoadingList()) {
              <div class="loading-state">
                <div class="spinner-sm"></div>
                <p>Loading chats...</p>
              </div>
            } @else if (conversations().length === 0) {
              <div class="empty-chats">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <p>No conversations yet.</p>
                <p class="empty-hint">Go to <strong>Candidates</strong> and click <em>Send Message</em> to start one.</p>
              </div>
            } @else {
              @for (conv of conversations(); track conv.id) {
                <div class="conv-item"
                     [class.active]="selectedConversation()?.id === conv.id"
                     (click)="selectConversation(conv)">
                  <div class="avatar-wrap">
                    @if (getParticipant(conv)?.avatarUrl) {
                      <img [src]="getParticipant(conv)!.avatarUrl" class="conv-avatar" alt="Avatar">
                    } @else {
                      <div class="conv-avatar-initials">{{ getInitials(getParticipant(conv)?.displayName) }}</div>
                    }
                    <span class="online-dot"></span>
                  </div>
                  <div class="conv-meta">
                    <div class="conv-name-row">
                      <h4 class="conv-name">{{ getParticipant(conv)?.displayName || 'Unknown' }}</h4>
                      <span class="conv-time">{{ conv.lastMessageAt | date:'shortTime' }}</span>
                    </div>
                    @if (conv.jobTitle) {
                      <span class="conv-job-tag">{{ conv.jobTitle }}</span>
                    }
                    <p class="conv-snippet">{{ conv.lastMessage || 'No messages yet' }}</p>
                  </div>
                  @if (conv.unreadCount && conv.unreadCount > 0) {
                    <span class="unread-pill">{{ conv.unreadCount }}</span>
                  }
                </div>
              }
            }
          </div>
        </aside>

        <!-- Right Main: Active Message Thread -->
        <main class="chat-thread-pane">
          @if (selectedConversation(); as conv) {
            <!-- Chat Header -->
            <div class="thread-header">
              <div class="header-user-info">
                @if (getParticipant(conv)?.avatarUrl) {
                  <img [src]="getParticipant(conv)!.avatarUrl" class="thread-avatar" alt="Avatar">
                } @else {
                  <div class="thread-avatar-initials">{{ getInitials(getParticipant(conv)?.displayName) }}</div>
                }
                <div>
                  <h3 class="thread-name">{{ getParticipant(conv)?.displayName || 'Unknown User' }}</h3>
                  <div class="thread-sub-meta">
                    <span class="online-status-dot"></span>
                    <span class="thread-headline">{{ getParticipant(conv)?.headline || 'Verified User' }}</span>
                    @if (getParticipant(conv)?.companyName) {
                      <span class="dot">•</span>
                      <span class="thread-company">{{ getParticipant(conv)?.companyName }}</span>
                    }
                  </div>
                </div>
              </div>

              <!-- Call Buttons -->
              <div class="thread-actions">
                <button (click)="triggerCall(conv, false)" class="btn-chat-call audio" title="Masked Voice Call">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>Audio</span>
                </button>
                <button (click)="triggerCall(conv, true)" class="btn-chat-call video" title="Masked Video Call">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
                  <span>Video</span>
                </button>
              </div>
            </div>

            <!-- Privacy Banner -->
            <div class="privacy-alert-strip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              <span>Privacy Engine Active — Phone numbers & emails are auto-masked in this chat.</span>
            </div>

            <!-- Messages Stream -->
            <div class="messages-stream" #messagesContainer>
              @if (isLoadingMessages()) {
                <div class="loading-state">
                  <div class="spinner-sm"></div>
                  <p>Loading messages...</p>
                </div>
              } @else if (messages().length === 0) {
                <div class="no-messages-yet">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <p>No messages yet. Say hello! 👋</p>
                </div>
              } @else {
                @for (msg of messages(); track msg.id) {
                  <div class="message-row" [class.outgoing]="isOwnMessage(msg)">
                    @if (!isOwnMessage(msg)) {
                      @if (getParticipant(conv)?.avatarUrl) {
                        <img [src]="getParticipant(conv)!.avatarUrl" class="msg-avatar" alt="">
                      } @else {
                        <div class="msg-avatar-initials">{{ getInitials(getParticipant(conv)?.displayName) }}</div>
                      }
                    }
                    <div class="message-bubble" [class.masked]="isContactMasked(msg)">
                      <p class="message-text">{{ msg.body }}</p>
                      @if (isContactMasked(msg)) {
                        <div class="masked-note">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                          <span>Contact info masked for privacy</span>
                        </div>
                      }
                      <div class="message-footer">
                        <span class="message-time">{{ msg.sentAt | date:'shortTime' }}</span>
                        @if (isOwnMessage(msg)) {
                          <span class="status-tick">✓✓</span>
                        }
                      </div>
                    </div>
                  </div>
                }
              }
            </div>

            <!-- Input Bar -->
            <div class="chat-input-bar">
              @if (sendError()) {
                <div class="send-error-banner">{{ sendError() }}</div>
              }
              <div class="input-row">
                <input type="text"
                       [(ngModel)]="newMessageText"
                       (keyup.enter)="sendMessage()"
                       placeholder="Type a message..."
                       class="chat-text-input"
                       [disabled]="isSending()">
                <button (click)="sendMessage()"
                        [disabled]="!newMessageText.trim() || isSending()"
                        class="btn-send-message"
                        [class.sending]="isSending()">
                  @if (isSending()) {
                    <div class="spinner-xs"></div>
                  } @else {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  }
                </button>
              </div>
            </div>
          } @else {
            <div class="select-prompt">
              <div class="select-prompt-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3>Select a Conversation</h3>
              <p>Choose a conversation from the left, or go to <strong>Candidates</strong> and click <em>Send Message</em>.</p>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      min-height: 0;
    }
    .chat-page-container {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      /* Fill the flex parent (app-main-content) exactly */
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .chat-glass-frame {
      display: grid;
      grid-template-columns: 320px 1fr;
      flex: 1;
      min-height: 0;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    }

    /* ========= Sidebar ========= */
    .conversations-sidebar {
      background: rgba(10, 17, 35, 0.85);
      border-right: 1px solid rgba(255,255,255,0.07);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .sidebar-header {
      padding: 1.25rem 1.25rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(15,23,42,0.6);
    }
    .sidebar-header h2 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0;
    }
    .active-badge {
      background: rgba(99, 102, 241, 0.25);
      color: #a5b4fc;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 9px;
      border-radius: 12px;
      border: 1px solid rgba(99,102,241,0.3);
    }
    .conversations-list {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.1) transparent;
    }

    /* ========= Conversation Items ========= */
    .conv-item {
      display: flex;
      gap: 0.85rem;
      padding: 0.9rem 1.1rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      cursor: pointer;
      transition: background 0.18s;
      align-items: center;
      position: relative;
    }
    .conv-item:hover { background: rgba(255,255,255,0.04); }
    .conv-item.active {
      background: rgba(99,102,241,0.15);
      border-left: 3px solid #818cf8;
    }
    .avatar-wrap { position: relative; flex-shrink: 0; }
    .conv-avatar {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255,255,255,0.12);
      display: block;
    }
    .conv-avatar-initials {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #4338ca);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
      border: 2px solid rgba(255,255,255,0.12);
    }
    .online-dot {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid #0a1123;
    }
    .conv-meta { flex: 1; overflow: hidden; min-width: 0; }
    .conv-name-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.15rem;
    }
    .conv-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }
    .conv-time {
      font-size: 0.68rem;
      color: #64748b;
      white-space: nowrap;
      flex-shrink: 0;
      margin-left: 0.4rem;
    }
    .conv-job-tag {
      font-size: 0.7rem;
      color: #818cf8;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.15rem;
    }
    .conv-snippet {
      font-size: 0.76rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }
    .unread-pill {
      background: #ef4444;
      color: white;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 10px;
      flex-shrink: 0;
    }
    .empty-chats {
      padding: 3rem 1.5rem;
      text-align: center;
      color: #475569;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .empty-chats p { margin: 0; font-size: 0.85rem; }
    .empty-hint { font-size: 0.78rem !important; color: #64748b !important; }

    /* ========= Chat Thread Pane ========= */
    .chat-thread-pane {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: rgba(13, 20, 38, 0.5);
      min-width: 0;
    }
    .thread-header {
      padding: 0.9rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      background: rgba(10,17,35,0.7);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .header-user-info {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .thread-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #6366f1;
    }
    .thread-avatar-initials {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #4338ca);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 700;
      color: white;
      border: 2px solid #6366f1;
      flex-shrink: 0;
    }
    .thread-name {
      font-size: 1rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 0.15rem;
    }
    .thread-sub-meta {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.76rem;
      color: #64748b;
    }
    .online-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      flex-shrink: 0;
    }
    .thread-actions { display: flex; gap: 0.5rem; }
    .btn-chat-call {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.75rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .btn-chat-call.audio {
      background: rgba(16,185,129,0.12);
      color: #34d399;
      border-color: rgba(16,185,129,0.25);
    }
    .btn-chat-call.audio:hover { background: rgba(16,185,129,0.25); }
    .btn-chat-call.video {
      background: rgba(99,102,241,0.12);
      color: #a5b4fc;
      border-color: rgba(99,102,241,0.25);
    }
    .btn-chat-call.video:hover { background: rgba(99,102,241,0.25); }

    /* ========= Privacy Banner ========= */
    .privacy-alert-strip {
      background: rgba(16,185,129,0.08);
      border-bottom: 1px solid rgba(16,185,129,0.15);
      padding: 0.45rem 1.5rem;
      font-size: 0.73rem;
      color: #34d399;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    /* ========= Messages ========= */
    .messages-stream {
      flex: 1;
      padding: 1.25rem 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.08) transparent;
    }
    .no-messages-yet {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #475569;
      gap: 0.6rem;
      text-align: center;
      font-size: 0.9rem;
    }
    .message-row {
      display: flex;
      align-items: flex-end;
      gap: 0.6rem;
      justify-content: flex-start;
    }
    .message-row.outgoing {
      justify-content: flex-end;
    }
    .msg-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
    .msg-avatar-initials {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #4338ca);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .message-bubble {
      max-width: 62%;
      padding: 0.75rem 1rem;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      background: rgba(30,41,59,0.85);
      border: 1px solid rgba(255,255,255,0.07);
      color: #e2e8f0;
    }
    .outgoing .message-bubble {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 4px;
      border-color: transparent;
      color: white;
    }
    .message-text {
      font-size: 0.88rem;
      line-height: 1.55;
      margin: 0 0 0.3rem;
      word-break: break-word;
    }
    .masked-note {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.68rem;
      color: #fbbf24;
      margin-bottom: 0.3rem;
    }
    .message-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.25rem;
      font-size: 0.65rem;
      color: rgba(255,255,255,0.5);
    }
    .status-tick { font-weight: 700; color: #60a5fa; }

    /* ========= Input Bar ========= */
    .chat-input-bar {
      padding: 0.85rem 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.07);
      background: rgba(10,17,35,0.7);
      flex-shrink: 0;
    }
    .send-error-banner {
      background: rgba(239,68,68,0.15);
      border: 1px solid rgba(239,68,68,0.3);
      color: #f87171;
      font-size: 0.78rem;
      padding: 0.4rem 0.75rem;
      border-radius: 8px;
      margin-bottom: 0.6rem;
    }
    .input-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .chat-text-input {
      flex: 1;
      background: rgba(30,41,59,0.7);
      border: 1px solid rgba(255,255,255,0.1);
      color: #f1f5f9;
      padding: 0.7rem 1.1rem;
      border-radius: 24px;
      outline: none;
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }
    .chat-text-input:focus { border-color: #6366f1; }
    .chat-text-input:disabled { opacity: 0.5; }
    .chat-text-input::placeholder { color: #475569; }
    .btn-send-message {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #6366f1;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .btn-send-message:hover:not(:disabled) {
      background: #4f46e5;
      transform: scale(1.08);
      box-shadow: 0 4px 14px rgba(99,102,241,0.5);
    }
    .btn-send-message:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-send-message.sending { background: #4338ca; }

    /* ========= Spinners ========= */
    .spinner-sm {
      width: 22px; height: 22px;
      border: 2px solid rgba(255,255,255,0.1);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      margin: 0 auto 0.5rem;
    }
    .spinner-xs {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.2);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: #475569;
      font-size: 0.85rem;
      gap: 0.25rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ========= Select Prompt ========= */
    .select-prompt {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #475569;
      gap: 0.85rem;
      text-align: center;
      padding: 2rem;
    }
    .select-prompt-icon {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: rgba(99,102,241,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4f46e5;
      margin-bottom: 0.5rem;
    }
    .select-prompt h3 { color: #e2e8f0; font-size: 1.15rem; margin: 0; }
    .select-prompt p { font-size: 0.85rem; max-width: 320px; line-height: 1.6; margin: 0; }

    /* ========= Responsive ========= */
    @media (max-width: 900px) {
      .chat-glass-frame { grid-template-columns: 1fr; }
      .conversations-sidebar { display: none; }
    }
  `]
})
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);
  auth = inject(AuthService);
  private callService = inject(CallService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  get conversations() { return this.chatService.activeConversations; }
  selectedConversation = signal<Conversation | null>(null);
  messages = signal<ChatMessage[]>([]);
  isLoadingList = signal<boolean>(true);
  isLoadingMessages = signal<boolean>(false);
  isSending = signal<boolean>(false);
  sendError = signal<string | null>(null);
  newMessageText = '';

  ngOnInit() {
    this.chatService.getConversations().subscribe({
      next: (convs) => {
        this.isLoadingList.set(false);
        if (convs.length > 0) {
          this.selectConversation(convs[0]);
        }
      },
      error: () => this.isLoadingList.set(false)
    });
  }

  /**
   * Resolve the other participant regardless of whether the backend
   * sends the field as `counterpart` or `otherParticipant`.
   * Also normalises `userId` → `id` so guards work properly.
   */
  getParticipant(conv: Conversation): Participant | undefined {
    const p = conv.counterpart ?? conv.otherParticipant;
    if (!p) return undefined;
    // Normalise userId → id
    if (p.userId && !p.id) {
      (p as any).id = p.userId;
    }
    return p;
  }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  isOwnMessage(msg: ChatMessage): boolean {
    const myId = this.auth.currentUser()?.id;
    if (!myId) return false;
    // Handle both nested sender object and flat senderId
    if (msg.sender?.userId) return msg.sender.userId === myId;
    if (msg.sender?.id) return msg.sender.id === myId;
    if (msg.senderId) return msg.senderId === myId;
    return false;
  }

  isContactMasked(msg: ChatMessage): boolean {
    return !!(msg.isContactMasked || msg.contactMasked);
  }

  selectConversation(conv: Conversation) {
    this.selectedConversation.set(conv);
    this.isLoadingMessages.set(true);
    this.sendError.set(null);
    this.chatService.getMessages(conv.id).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.isLoadingMessages.set(false);
        this.chatService.markAsRead(conv.id).subscribe();
        this.scrollToBottom();
      },
      error: () => this.isLoadingMessages.set(false)
    });
  }

  sendMessage() {
    const text = this.newMessageText.trim();
    const currentConv = this.selectedConversation();
    if (!text || !currentConv || this.isSending()) return;

    this.isSending.set(true);
    this.sendError.set(null);
    this.newMessageText = '';

    this.chatService.sendMessage(currentConv.id, text).subscribe({
      next: (sent) => {
        this.messages.update(list => [...list, sent]);
        this.isSending.set(false);
        // Update conversation snippet in sidebar
        this.chatService.activeConversations.update(list =>
          list.map(c => c.id === currentConv.id
            ? { ...c, lastMessage: sent.body, lastMessageAt: sent.sentAt }
            : c)
        );
        this.scrollToBottom();
      },
      error: (err) => {
        this.isSending.set(false);
        // Restore the unsent text so user doesn't lose it
        this.newMessageText = text;
        this.sendError.set(err?.error?.message || 'Failed to send message. Please try again.');
      }
    });
  }

  triggerCall(conv: Conversation, isVideo: boolean) {
    const participant = this.getParticipant(conv);
    if (participant) {
      this.callService.startDirectCall(participant, isVideo);
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer?.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 80);
  }
}
