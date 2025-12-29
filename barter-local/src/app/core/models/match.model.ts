import { Offer } from './offer.model';

export type MatchType = 'direct' | '2way' | '3way';

export interface Match {
    id: string;
    type: MatchType;
    offers: Offer[]; // The chain of offers. For direct: [MyOffer, TheirOffer]
    score: number; // 0-1 confidence
    priceDiff: number; // calculated imbalance (mocked for now)
    createdAt: Date;
    isRead: boolean;
    acceptedBy: string[]; // List of user IDs who accepted
    status: 'active' | 'accepted' | 'completed';
}
