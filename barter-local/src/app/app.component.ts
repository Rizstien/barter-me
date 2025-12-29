import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './features/profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ProfileComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Top Navbar (Desktop/Mobile) -->
      <nav *ngIf="auth.isLoggedIn()" class="bg-white shadow-sm z-10 sticky top-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
                BarterLocal
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="hidden md:flex items-center space-x-4">
                <a routerLink="/dashboard" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-gray-900 font-medium">Explore</a>
                <a routerLink="/matches" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-gray-900 font-medium">Matches</a>
                <a routerLink="/completed-trades" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-gray-900 font-medium">Completed</a>
                <a routerLink="/my-ads" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-gray-900 font-medium">My Ads</a>
                <button (click)="toggleProfile()" class="text-gray-600 hover:text-gray-900 font-medium focus:outline-none">Profile</button>
                <a routerLink="/create-offer" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm">Post Trade</a>
              </div>
              <!-- Profile link replaces logout in main nav, moved logout to profile page -->
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
        <router-outlet></router-outlet>
      </main>

      <!-- Profile Slide-Over -->
      <app-profile [isOpen]="isProfileOpen" (close)="isProfileOpen = false"></app-profile>

      <!-- Bottom Tab Bar (Mobile Only) -->
      <nav *ngIf="auth.isLoggedIn()" class="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-20 pb-safe">
        <div class="grid grid-cols-5 h-16">
          <a routerLink="/dashboard" routerLinkActive="text-teal-600" class="flex flex-col items-center justify-center text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span class="text-xs mt-1">Explore</span>
          </a>
          <a routerLink="/create-offer" routerLinkActive="text-teal-600" class="flex flex-col items-center justify-center text-gray-500">
             <div class="bg-teal-500 text-white p-3 rounded-full -mt-6 shadow-lg border-4 border-gray-50">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
             </div>
          </a>
          <a routerLink="/matches" routerLinkActive="text-teal-600" class="flex flex-col items-center justify-center text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span class="text-xs mt-1">Matches</span>
          </a>
          <a routerLink="/completed-trades" routerLinkActive="text-teal-600" class="flex flex-col items-center justify-center text-gray-500">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <span class="text-xs mt-1">Completed</span>
          </a>
          <a routerLink="/my-ads" routerLinkActive="text-teal-600" class="flex flex-col items-center justify-center text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <span class="text-xs mt-1">My Ads</span>
          </a>
          <button (click)="toggleProfile()" class="flex flex-col items-center justify-center text-gray-500 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span class="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  isProfileOpen = false;

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }
}
