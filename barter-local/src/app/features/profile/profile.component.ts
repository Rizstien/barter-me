import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <!-- Invisible Backdrop to close when clicking outside -->
    <div *ngIf="isOpen" (click)="close.emit()" class="fixed inset-0 z-40 cursor-default" aria-hidden="true"></div>

    <!-- Dropdown Panel -->
    <div *ngIf="isOpen" 
         class="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1rem)] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-6 text-center">
             <div class="h-16 w-16 mx-auto rounded-full bg-white p-1 shadow-md mb-2">
                 <img [src]="auth.currentUser()?.avatar" class="h-full w-full rounded-full object-cover">
             </div>
             <h2 class="text-white font-bold text-lg truncate">{{auth.currentUser()?.name}}</h2>
             <p class="text-teal-100 text-xs">{{auth.currentUser()?.userId}}</p>
        </div>

        <!-- Content -->
        <div class="p-4">
             <!-- Stats/Info -->
             <div class="flex items-center justify-between text-sm text-gray-600 mb-4 px-2">
                <div class="flex flex-col items-center">
                    <span class="font-bold text-gray-900">Location</span>
                    <span class="text-xs">{{auth.currentUser()?.location?.lat | number:'1.1-1'}}, {{auth.currentUser()?.location?.lon | number:'1.1-1'}}</span>
                </div>
                <div class="h-8 w-px bg-gray-200"></div>
                <div class="flex flex-col items-center">
                    <span class="font-bold text-gray-900">ID</span>
                    <span class="text-xs">#{{auth.currentUser()?.id}}</span>
                </div>
             </div>
             
             <div class="border-t border-gray-100 my-2"></div>

             <!-- Menu Items -->
             <div class="space-y-1">
                 <a routerLink="/my-ads" (click)="close.emit()" class="flex items-center px-3 py-2 rounded-lg hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-colors group">
                    <div class="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3 group-hover:bg-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <span class="font-medium">My Ads</span>
                 </a>
                 
                 <a routerLink="/matches" (click)="close.emit()" class="flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group">
                    <div class="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 group-hover:bg-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <span class="font-medium">Matches</span>
                 </a>

                 <a routerLink="/completed-trades" (click)="close.emit()" class="flex items-center px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors group">
                    <div class="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 group-hover:bg-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <span class="font-medium">Completed Trades</span>
                 </a>
             </div>

             <div class="border-t border-gray-100 my-2"></div>

             <button (click)="onLogout()" class="w-full flex items-center px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                 <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                 <span class="font-medium">Sign Out</span>
             </button>
        </div>
    </div>
    `
})
export class ProfileComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    auth = inject(AuthService);

    onLogout() {
        this.close.emit();
        this.auth.logout();
    }
}
