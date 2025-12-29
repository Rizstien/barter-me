import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';
import { ALLOWED_USERS } from '../data/users.data';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // 5 allowed users
    private readonly ALLOWED_USERS = ALLOWED_USERS;

    private currentUserSignal = signal<User | null>(null);
    readonly currentUser = computed(() => this.currentUserSignal());

    constructor(private storage: StorageService, private router: Router) {
        const storedUser = this.storage.getItem<User>('auth_user');
        if (storedUser) {
            this.currentUserSignal.set(storedUser);
        }
    }



    login(loginId: string): boolean {
        const input = loginId.toLowerCase().trim();
        const user = this.ALLOWED_USERS.find(u => u.id === input || u.userId === input);

        if (!user) {
            alert('Incorrect user ID or password.');
            return false;
        }

        // Clone user to avoid mutations affecting source, unless we want single instance
        const fullUser: User = { ...user };

        this.currentUserSignal.set(fullUser);
        this.storage.setItem('auth_user', fullUser);
        return true;
    }

    // Kept for hydrating OTHER users (e.g. from offer.userId = 'u1')
    getUserById(id: string): User {
        const found = this.ALLOWED_USERS.find(u => u.id === id || u.userId === id);
        if (found) {
            return found;
        }

        // Fallback for unknown? Should not happen in strict mode but good for safety
        // Default location if unknown
        return {
            id: id,
            userId: id,
            name: `User ${id}`,
            avatar: `https://i.pravatar.cc/150?u=${id}`,
            location: { lat: 31.5204, lon: 74.3587 }
        };
    }

    logout(): void {
        this.currentUserSignal.set(null);
        this.storage.removeItem('auth_user');
        this.router.navigate(['/auth/login']);
    }

    isLoggedIn(): boolean {
        return !!this.currentUserSignal();
    }
}
