import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <!-- Backdrop -->
    <div *ngIf="isOpen" (click)="close.emit()" class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" aria-hidden="true"></div>

    <!-- Slide-over Panel -->
    <div [class.translate-x-full]="!isOpen" [class.translate-x-0]="isOpen" 
         class="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        
        <div class="h-full flex flex-col">
            <!-- Header -->
            <div class="bg-teal-600 px-6 py-6 text-white relative">
                <button (click)="close.emit()" class="absolute top-4 right-4 text-teal-100 hover:text-white focus:outline-none">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div class="flex flex-col items-center mt-4">
                    <div class="h-20 w-20 rounded-full bg-white p-1 shadow-md mb-3">
                        <img [src]="auth.currentUser()?.avatar" class="h-full w-full rounded-full object-cover">
                    </div>
                    <h2 class="text-xl font-bold truncate max-w-full">{{auth.currentUser()?.name}}</h2>
                    <p class="text-teal-200 text-sm">{{auth.currentUser()?.userId}}</p>
                </div>
            </div>

            <!-- Content -->
            <div class="flex-1 px-6 py-6 space-y-8">
                <!-- details -->
                 <div class="space-y-4">
                     <div>
                        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</h3>
                        <p class="mt-1 text-gray-900">{{auth.currentUser()?.location?.lat | number:'1.2-2'}}, {{auth.currentUser()?.location?.lon | number:'1.2-2'}}</p>
                     </div>
                     <div>
                        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</h3>
                        <p class="mt-1 text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">{{auth.currentUser()?.id}}</p>
                     </div>
                 </div>

                 <!-- Actions -->
                 <div class="grid grid-cols-2 gap-4">
                    <a (click)="close.emit()" routerLink="/my-ads" class="flex flex-col items-center p-3 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors cursor-pointer text-center">
                        <svg class="w-6 h-6 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        <span class="text-sm font-medium text-teal-900">My Ads</span>
                    </a>
                    <a (click)="close.emit()" routerLink="/matches" class="flex flex-col items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer text-center">
                        <svg class="w-6 h-6 text-blue-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        <span class="text-sm font-medium text-blue-900">Matches</span>
                    </a>
                 </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-6 bg-gray-50 border-t border-gray-100">
                <button (click)="onLogout()" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Sign Out
                </button>
            </div>
        </div>
    </div>
    `
})
export class ProfileComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    auth = inject(AuthService);

    onLogout() {
        this.close.emit(); // Close panel
        this.auth.logout();
    }
}
