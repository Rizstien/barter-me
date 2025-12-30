import { User } from '../models/user.model';

export const ALLOWED_USERS: User[] = [
    {
        id: '1',
        userId: 'user1@barter.com',
        name: 'Ali',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        location: { lat: 31.5204, lon: 74.3587 }
    },
    {
        id: '2',
        userId: 'user2@barter.com',
        name: 'Sara',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        location: { lat: 31.5304, lon: 74.3487 }
    },
    {
        id: '3',
        userId: 'user3@barter.com',
        name: 'Usman',
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        location: { lat: 31.5104, lon: 74.3687 }
    },
    {
        id: '4',
        userId: 'user4@barter.com',
        name: 'Hamza',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        location: { lat: 31.5254, lon: 74.3537 }
    },
    {
        id: '5',
        userId: 'user5@barter.com',
        name: 'Bilal',
        avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
        location: { lat: 31.5154, lon: 74.3637 }
    }
];
