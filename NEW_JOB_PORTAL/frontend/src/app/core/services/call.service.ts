import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CallSession, Participant } from '../models/models';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  readonly currentCall = signal<CallSession | null>(null);
  readonly isMuted = signal<boolean>(false);
  readonly isVideoOff = signal<boolean>(false);
  readonly callDuration = signal<number>(0);
  private timerInterval: any = null;

  constructor(private http: HttpClient) {}

  initiateCall(conversationId: number, isVideo: boolean = false, fallbackCallee?: Participant): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/calls/initiate`, { conversationId, isVideo }).pipe(
      tap((res: any) => {
        const session: CallSession = {
          id: res.id || Date.now(),
          channelName: res.channelName || `call-ch-${Date.now()}`,
          caller: res.caller || { id: 0, displayName: 'Me', role: 'USER' },
          callee: res.callee || fallbackCallee || { id: 0, displayName: 'Candidate', role: 'USER' },
          video: isVideo,
          state: 'RINGING',
          startedAt: new Date().toISOString()
        };
        this.currentCall.set(session);
        this.startTimer();
      })
    );
  }

  startDirectCall(callee: Participant, isVideo: boolean = false) {
    const session: CallSession = {
      id: Date.now(),
      channelName: `call-ch-${Date.now()}`,
      caller: { id: 1, displayName: 'Current User', role: 'RECRUITER' },
      callee,
      video: isVideo,
      state: 'RINGING',
      startedAt: new Date().toISOString()
    };
    this.currentCall.set(session);
    this.startTimer();
  }

  acceptCall() {
    this.currentCall.update(call => call ? { ...call, state: 'ACCEPTED' } : null);
  }

  endCall() {
    this.stopTimer();
    this.currentCall.update(call => call ? { ...call, state: 'ENDED' } : null);
    setTimeout(() => {
      this.currentCall.set(null);
      this.callDuration.set(0);
    }, 1200);
  }

  toggleMute() {
    this.isMuted.update(v => !v);
  }

  toggleVideo() {
    this.isVideoOff.update(v => !v);
  }

  private startTimer() {
    this.stopTimer();
    this.callDuration.set(0);
    this.timerInterval = setInterval(() => {
      this.callDuration.update(d => d + 1);
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getCallHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE_URL}/calls/history`);
  }
}
