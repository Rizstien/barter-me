import { User } from '../models/user.model';

export const ALLOWED_USERS: User[] = [
    {
        id: '1',
        userId: 'user1@barter.com',
        name: 'Ali',
        avatar: 'https://i.pravatar.cc/150?u=user1@barter.com',
        location: { lat: 31.5204, lon: 74.3587 }
    },
    {
        id: '2',
        userId: 'user2@barter.com',
        name: 'Sara',
        avatar: 'https://i.pravatar.cc/150?u=user2@barter.com',
        location: { lat: 31.5304, lon: 74.3487 }
    },
    {
        id: '3',
        userId: 'user3@barter.com',
        name: 'Usman',
        avatar: 'https://i.pravatar.cc/150?u=user3@barter.com',
        location: { lat: 31.5104, lon: 74.3687 }
    },
    {
        id: '4',
        userId: 'user4@barter.com',
        name: 'Hamza',
        avatar: 'https://i.pravatar.cc/150?u=user4@barter.com',
        location: { lat: 31.5254, lon: 74.3537 }
    },
    {
        id: '5',
        userId: 'user5@barter.com',
        name: 'Bilal',
        avatar: 'https://i.pravatar.cc/150?u=user5@barter.com',
        location: { lat: 31.5154, lon: 74.3637 }
    }
];
