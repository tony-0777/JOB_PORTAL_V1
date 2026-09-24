import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Conversation, ChatMessage } from '../models/models';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  readonly activeConversations = signal<Conversation[]>([]);
  readonly unreadTotal = signal<number>(0);

  constructor(private http: HttpClient) { }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${API_BASE_URL}/chat/conversations`).pipe(
      tap(convs => {
        this.activeConversations.set(convs);
        const total = convs.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        this.unreadTotal.set(total);
      })
    );
  }

  startConversation(targetUserId?: number, jobId?: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${API_BASE_URL}/chat/conversations`, { targetUserId, jobId });
  }

  getMessages(conversationId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`);
  }

  sendMessage(conversationId: number, body: string): Observable<ChatMessage> {
    const payload = {
      body,
      clientMsgId: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
    };
    return this.http.post<ChatMessage>(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, payload);
  }

  markAsRead(conversationId: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/chat/conversations/${conversationId}/read`, {}).pipe(
      tap(() => {
        this.activeConversations.update(list =>
          list.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c)
        );
        const total = this.activeConversations().reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        this.unreadTotal.set(total);
      })
    );
  }
}
