import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    getItem<T>(key: string): T | null {
        if (isPlatformBrowser(this.platformId)) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        return null;
    }

    setItem(key: string, value: any): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    removeItem(key: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(key);
        }
    }

    clear(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.clear();
        }
    }
}
