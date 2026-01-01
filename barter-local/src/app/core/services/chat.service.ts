import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from '../models/chat.model';
import { map, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private channel: BroadcastChannel | null = null;
    private messagesSubject = new Subject<ChatMessage>();

    // Observable for real-time messages from other tabs
    public realtimeMessages$ = this.messagesSubject.asObservable();

    constructor(private http: HttpClient) { }

    joinMatch(matchId: string) {
        this.leaveMatch(); // Cleanup previous if any

        this.channel = new BroadcastChannel(`match-${matchId}`);
        this.channel.onmessage = (event) => {
            if (event.data && event.data.type === 'NEW_MESSAGE') {
                this.messagesSubject.next(event.data.payload);
            }
        };
    }

    leaveMatch() {
        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }
    }

    getMessages(matchId: string): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(`/api/chat/${matchId}`);
    }

    sendMessage(matchId: string, text: string, senderId: string): Observable<ChatMessage> {
        return this.http.post<ChatMessage>(`/api/chat/${matchId}`, { text, senderId }).pipe(
            tap(msg => {
                // Broadcast to other tabs
                if (this.channel) {
                    this.channel.postMessage({
                        type: 'NEW_MESSAGE',
                        payload: msg
                    });
                }
            })
        );
    }
}
