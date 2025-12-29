export interface Offer {
    id: string;
    userId: string;
    title: string;
    offer: string; // The actual item name (e.g. Bicycle)
    description: string;
    imageUrl: string;
    want: string; // Description of what they want
    price?: number; // Estimated value or price
    createdAt: Date;
}

