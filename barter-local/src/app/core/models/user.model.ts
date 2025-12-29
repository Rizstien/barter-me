export interface User {
    id: string;
    name: string;
    userId: string;
    avatar: string; // URL
    location: {
        lat: number;
        lon: number;
    };
}
