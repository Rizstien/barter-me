import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Match } from '../models/match.model';
import { AuthService } from './auth.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    private matchesSignal = signal<Match[]>([]);
    readonly myMatches = computed(() => this.matchesSignal());

    constructor(private http: HttpClient, private auth: AuthService) {
        // Reload matches when user changes
        // In a real app we might use an effect or rx stream. 
        // Simply loading on init and whenever we infer a change
    }

    loadMatches() {
        const user = this.auth.currentUser();
        if (!user) {
            this.matchesSignal.set([]);
            return;
        }
        this.http.get<Match[]>(`/api/matches/${user.id}`).subscribe(matches => {
            this.matchesSignal.set(matches);
        });
    }

    showInterest(matchId: string) {
        return this.http.post(`/api/interest/${matchId}`, {});
    }

    acceptTrade(matchId: string) {
        const userId = this.auth.currentUser()?.id;
        return this.http.post(`/api/matches/${matchId}/accept`, { userId });
    }

    completeTrade(matchId: string) {
        return this.http.post(`/api/matches/${matchId}/complete`, {});
    }
}
