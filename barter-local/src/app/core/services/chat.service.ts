import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatMessage } from '../models/chat.model';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private http: HttpClient) { }

    getMessages(matchId: string): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(`/api/chat/${matchId}`);
    }

    sendMessage(matchId: string, text: string, senderId: string): Observable<ChatMessage> {
        return this.http.post<ChatMessage>(`/api/chat/${matchId}`, { text, senderId });
    }
}
