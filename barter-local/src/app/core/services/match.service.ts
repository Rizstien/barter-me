import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Match } from '../models/match.model';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    private matchesSignal = signal<Match[]>([]);
    readonly myMatches = computed(() => this.matchesSignal());

    private http = inject(HttpClient);
    private auth = inject(AuthService);

    constructor() {
        // Reload matches periodically or when needed
    }

    loadMatches() {
        const user = this.auth.currentUser();
        if (!user) return;

        this.http.get<Match[]>(`/api/matches?userId=${user.userId}`)
            .subscribe(matches => {
                this.matchesSignal.set(matches);
            });
    }

    acceptTrade(matchId: string) {
        const user = this.auth.currentUser();
        if (!user) return new Observable(); // Should handle error
        return this.http.post(`/api/matches/${matchId}/accept`, { userId: user.userId });
    }

    completeTrade(matchId: string) {
        const user = this.auth.currentUser();
        if (!user) return new Observable();
        return this.http.post(`/api/matches/${matchId}/complete`, { userId: user.userId });
    }
}
import { Observable, of } from 'rxjs'; // Fix import

