import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';

import { Offer } from '../models/offer.model';
import { Match } from '../models/match.model';
import { ChatMessage } from '../models/chat.model';
import { MOCK_OFFERS } from '../data/seed-data';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
    const storage = inject(StorageService);




    // Simulated network delay
    const SIMULATED_DELAY = Math.random() * 300 + 200; // 200-500ms

    // --- Helper to get data ---
    const getOffers = (): Offer[] => {
        const stored = storage.getItem<Offer[]>('app_offers');
        if (stored && stored.length > 0) return stored;
        // Seed if empty
        storage.setItem('app_offers', MOCK_OFFERS);
        return MOCK_OFFERS;
    };

    // Stored match uses IDs instead of full implementation to save space
    interface StoredMatch extends Omit<Match, 'offers'> {
        offerIds: string[];
    }

    const getMatches = (): Match[] => {
        const stored = storage.getItem<StoredMatch[]>('app_matches') || [];
        const offers = getOffers();
        const offerMap = new Map(offers.map(o => [o.id, o]));

        return stored.map(sm => {
            const offers = sm.offerIds.map(id => offerMap.get(id)).filter((o): o is Offer => !!o);
            // If we couldn't find all offers for this match, it's invalid/stale
            if (offers.length !== sm.offerIds.length) return null;

            return {
                id: sm.id,
                type: sm.type,
                score: sm.score,
                priceDiff: sm.priceDiff,
                createdAt: sm.createdAt,
                isRead: sm.isRead,
                offers: offers,
                acceptedBy: sm.acceptedBy || [],
                status: sm.status || 'active'
            } as Match;
        }).filter((m): m is Match => m !== null);
    };

    const saveMatches = (matches: Match[]) => {
        const storedMatches: StoredMatch[] = matches.map(m => ({
            id: m.id,
            type: m.type,
            score: m.score,
            priceDiff: m.priceDiff,
            createdAt: m.createdAt,
            isRead: m.isRead,
            offerIds: m.offers.map(o => o.id),
            acceptedBy: m.acceptedBy || [],
            status: m.status || 'active'
        }));
        storage.setItem('app_matches', storedMatches);
    };

    const getChats = (): Record<string, ChatMessage[]> => storage.getItem('app_chats') || {};
    const saveChats = (chats: Record<string, ChatMessage[]>) => storage.setItem('app_chats', chats);

    // --- Matching Logic (Re-implemented Client Side) ---
    // Simple Haversine implementation if library not available or for simplicity
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ1) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    const getLocation = (userId: string) => {
        // Mock location for simplicity since USER_LOCATIONS isn't easily imported
        return { lat: 31.5204, lon: 74.3587 };
    }

    const generateMatches = (offers: Offer[]) => {
        let matches: Match[] = [];
        const processedIds = new Set<string>();

        // Helper: Does Offer A want what Offer B provides?
        // A.Want matches B.Offer
        const isMatch = (a: Offer, b: Offer) => {
            if (a.userId === b.userId) return false;
            return a.want.toLowerCase().includes(b.offer.toLowerCase()) ||
                b.offer.toLowerCase().includes(a.want.toLowerCase());
        };

        // 1. Find 2-Way Matches (A <-> B)
        for (let i = 0; i < offers.length; i++) {
            for (let j = i + 1; j < offers.length; j++) {
                const a = offers[i];
                const b = offers[j];

                if (isMatch(a, b) && isMatch(b, a)) {
                    const ids = [a.id, b.id].sort().join('-');
                    if (!processedIds.has(ids)) {
                        matches.push({
                            id: crypto.randomUUID(),
                            type: 'direct', // or '2way'
                            offers: [a, b],
                            score: 1.0,
                            priceDiff: 0,
                            createdAt: new Date(),
                            isRead: false,
                            acceptedBy: [],
                            status: 'active'
                        } as Match);
                        processedIds.add(ids);
                    }
                }
            }
        }

        // 2. Find 3-Way Matches (A -> B -> C -> A)
        for (let i = 0; i < offers.length; i++) {
            for (let j = 0; j < offers.length; j++) {
                if (i === j) continue;
                for (let k = 0; k < offers.length; k++) {
                    if (k === i || k === j) continue;

                    const a = offers[i];
                    const b = offers[j];
                    const c = offers[k];

                    // Distinct users check
                    if (a.userId === b.userId || b.userId === c.userId || c.userId === a.userId) continue;

                    // Cycle Check: A wants B, B wants C, C wants A
                    if (isMatch(a, b) && isMatch(b, c) && isMatch(c, a)) {
                        const ids = [a.id, b.id, c.id].sort().join('-');
                        if (!processedIds.has(ids)) {
                            matches.push({
                                id: crypto.randomUUID(),
                                type: '3way',
                                offers: [a, b, c],
                                score: 1.0,
                                priceDiff: 0,
                                createdAt: new Date(),
                                isRead: false,
                                acceptedBy: [],
                                status: 'active'
                            } as Match);
                            processedIds.add(ids);
                        }
                    }
                }
            }
        }

        // 3. Find 4-Way Matches (A -> B -> C -> D -> A)
        // Note: O(N^4) is expensive. Keep N small (limit offers in prod or optimize graph algo).
        for (let i = 0; i < offers.length; i++) {
            for (let j = 0; j < offers.length; j++) {
                if (i === j) continue;
                for (let k = 0; k < offers.length; k++) {
                    if (k === i || k === j) continue;
                    for (let l = 0; l < offers.length; l++) {
                        if (l === i || l === j || l === k) continue;

                        const a = offers[i];
                        const b = offers[j];
                        const c = offers[k];
                        const d = offers[l];

                        // Distinct users check
                        const users = [a.userId, b.userId, c.userId, d.userId];
                        if (new Set(users).size !== 4) continue;

                        // Cycle Check
                        if (isMatch(a, b) && isMatch(b, c) && isMatch(c, d) && isMatch(d, a)) {
                            const ids = [a.id, b.id, c.id, d.id].sort().join('-');
                            if (!processedIds.has(ids)) {
                                matches.push({
                                    id: crypto.randomUUID(),
                                    type: '4way' as any, // Cast as any if model doesn't support '4way' yet
                                    offers: [a, b, c, d],
                                    score: 1.0,
                                    priceDiff: 0,
                                    createdAt: new Date(),
                                    isRead: false,
                                    acceptedBy: [],
                                    status: 'active'
                                } as Match);
                                processedIds.add(ids);
                            }
                        }
                    }
                }
            }
        }

        saveMatches(matches); // Persist
        return matches;
    };

    // --- API Routes ---

    // GET /api/offers
    if (req.url.endsWith('/api/offers') && req.method === 'GET') {
        const offers = getOffers();
        return of(new HttpResponse({ status: 200, body: offers })).pipe(delay(SIMULATED_DELAY));
    }

    // GET /api/offers/nearby
    if (req.url.includes('/api/offers/nearby') && req.method === 'GET') {
        const offers = getOffers();
        return of(new HttpResponse({ status: 200, body: offers })).pipe(delay(SIMULATED_DELAY));
    }

    // POST /api/offers
    if (req.url.endsWith('/api/offers') && req.method === 'POST') {
        const newOffer = { ...req.body as Offer, id: crypto.randomUUID(), createdAt: new Date() };
        const offers = getOffers();
        offers.unshift(newOffer);
        storage.setItem('app_offers', offers);

        return of(new HttpResponse({
            status: 200,
            body: { offer: newOffer, matchesFound: 0 } // Server handles matching now
        })).pipe(delay(SIMULATED_DELAY));
    }

    // PUT /api/offers/:id
    if (req.url.includes('/api/offers/') && req.method === 'PUT') {
        const id = req.url.split('/').pop();
        const updatedOffer = req.body as Offer;
        const offers = getOffers();
        const index = offers.findIndex(o => o.id === id);

        if (index !== -1) {
            // Keep original fields that shouldn't change
            offers[index] = { ...offers[index], ...updatedOffer, id: id!, userId: offers[index].userId, createdAt: offers[index].createdAt };
            storage.setItem('app_offers', offers);
            return of(new HttpResponse({ status: 200, body: offers[index] })).pipe(delay(SIMULATED_DELAY));
        }

        return throwError(() => new Error('Offer not found'));
    }

    // GET /api/matches/{userId}
    if (req.url.includes('/api/matches/') && req.method === 'GET') {
        const matches = getMatches();
        return of(new HttpResponse({ status: 200, body: matches })).pipe(delay(SIMULATED_DELAY));
    }

    // POST /api/matches/{matchId}/accept
    if (req.url.includes('/accept') && req.method === 'POST') {
        const matchId = req.url.split('/')[3]; // /api/matches/:id/accept
        const userId = (req.body as any).userId;
        const matches = getMatches();
        const match = matches.find(m => m.id === matchId);

        if (match) {
            if (!match.acceptedBy) match.acceptedBy = [];
            if (!match.acceptedBy.includes(userId)) {
                match.acceptedBy.push(userId);
            }

            // Check if ALL parties accepted
            const allUserIds = match.offers.map(o => o.userId);
            const distinctUsers = [...new Set(allUserIds)];
            const allAccepted = distinctUsers.every(uid => match.acceptedBy.includes(uid));

            if (allAccepted) {
                match.status = 'accepted';
            }

            saveMatches(matches);
        }
        return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(SIMULATED_DELAY));
    }

    // POST /api/offers
    if (req.url.endsWith('/api/offers') && req.method === 'POST') {
        const newOffer = { ...req.body as Offer, id: crypto.randomUUID(), createdAt: new Date() };
        const offers = getOffers();
        offers.unshift(newOffer);
        storage.setItem('app_offers', offers);

        const matches = generateMatches(offers); // Re-run matching

        // Count matches involving the new offer
        const createdMatches = matches.filter(m => m.offers.some(o => o.id === newOffer.id));

        return of(new HttpResponse({
            status: 200,
            body: { offer: newOffer, matchesFound: createdMatches.length }
        })).pipe(delay(SIMULATED_DELAY));
    }

    // PUT /api/offers/:id
    if (req.url.includes('/api/offers/') && req.method === 'PUT') {
        const id = req.url.split('/').pop();
        const updatedOffer = req.body as Offer;
        const offers = getOffers();
        const index = offers.findIndex(o => o.id === id);

        if (index !== -1) {
            // Keep original fields that shouldn't change
            offers[index] = { ...offers[index], ...updatedOffer, id: id!, userId: offers[index].userId, createdAt: offers[index].createdAt };
            storage.setItem('app_offers', offers);

            generateMatches(offers); // Re-run matching

            return of(new HttpResponse({ status: 200, body: offers[index] })).pipe(delay(SIMULATED_DELAY));
        }

        return throwError(() => new Error('Offer not found'));
    }

    // GET /api/matches
    // Supports query param ?userId=...
    if (req.url.includes('/api/matches') && req.method === 'GET') { // loose match for query params
        let matches = getMatches();
        const offers = getOffers();

        // If no matches, try generating (first run)
        if (matches.length === 0) {
            matches = generateMatches(offers);
        }

        // Filter by userId if present
        const urlObj = new URL(req.url, 'http://localhost');
        const userId = urlObj.searchParams.get('userId');

        if (userId) {
            matches = matches.filter(m => m.offers.some(o => o.userId === userId));
        }

        return of(new HttpResponse({ status: 200, body: matches })).pipe(delay(SIMULATED_DELAY));
    }

    // GET /api/chat/{matchId}
    if (req.url.includes('/api/chat/') && req.method === 'GET') {
        const matchId = req.url.split('/').pop() || '';
        const chats = getChats();
        return of(new HttpResponse({ status: 200, body: chats[matchId] || [] })).pipe(delay(SIMULATED_DELAY));
    }

    // POST /api/chat/{matchId}
    if (req.url.includes('/api/chat/') && req.method === 'POST') {
        const matchId = req.url.split('/').pop() || '';
        const chats = getChats();
        const msg = { ...(req.body as any), id: crypto.randomUUID(), matchId, timestamp: new Date() };
        if (!chats[matchId]) chats[matchId] = [];
        chats[matchId].push(msg);
        saveChats(chats);
        return of(new HttpResponse({ status: 200, body: msg })).pipe(delay(SIMULATED_DELAY));
    }

    // Pass through if not matched (e.g. assets)
    return next(req);
};
