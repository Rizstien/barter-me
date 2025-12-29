import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Offer } from '../models/offer.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OfferService {
    private offersSignal = signal<Offer[]>([]);
    readonly allOffers = computed(() => this.offersSignal());

    constructor(private http: HttpClient) {
        this.loadOffers();
    }

    loadOffers() {
        console.log('Fetching offers from /api/offers...');
        this.http.get<Offer[]>('/api/offers')
            .subscribe({
                next: (offers) => {
                    console.log('Offers loaded:', offers.length);
                    this.offersSignal.set(offers);
                },
                error: (err) => {
                    console.error('Failed to load offers:', err);
                    this.offersSignal.set([]); // Stop loading state
                }
            });
    }

    addOffer(offer: Offer): Observable<{ offer: Offer, matchesFound: number }> {
        return this.http.post<{ offer: Offer, matchesFound: number }>('/api/offers', offer).pipe(
            tap(response => {
                // Optimistic update or wait for reload?
                // Let's just append for now
                this.offersSignal.update(offers => [response.offer, ...offers]);
            })
        );
    }

    updateOffer(offer: Offer): Observable<Offer> {
        return this.http.put<Offer>(`/api/offers/${offer.id}`, offer).pipe(
            tap(updated => {
                this.offersSignal.update(offers => offers.map(o => o.id === updated.id ? updated : o));
            })
        );
    }
}
