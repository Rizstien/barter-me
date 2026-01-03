import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './features/profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ProfileComponent],
  styles: [`
    .fixed-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -10;
      background-color: #f8fafc;
      background-image: 
        radial-gradient(at 0% 0%, hsla(190, 80%, 94%, 0.8) 0px, transparent 50%),
        radial-gradient(at 100% 0%, hsla(210, 80%, 96%, 0.8) 0px, transparent 50%),
        radial-gradient(at 100% 100%, hsla(180, 70%, 95%, 0.8) 0px, transparent 50%),
        radial-gradient(at 0% 100%, hsla(200, 70%, 93%, 0.8) 0px, transparent 50%);
      pointer-events: none;
      /* Removed heavy SVG noise filter and background-attachment: fixed which causes repaints */
    }
  `],
  template: `
    <!-- Dedicated Static Background Layer -->
    <div class="fixed-bg"></div>

    <div class="min-h-screen flex flex-col font-sans text-slate-800 relative">
      <!-- Top Navbar (Desktop/Mobile) -->
      <nav *ngIf="auth.isLoggedIn()" class="bg-white/80 backdrop-blur-md shadow-sm z-30 sticky top-0 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
                ScotchCorner
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="hidden md:flex items-center space-x-4">
                <a routerLink="/dashboard" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-gray-900 font-medium">Explore</a>
                <a routerLink="/matches" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-gray-900 font-medium">Matches</a>
                <a routerLink="/completed-trades" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-gray-900 font-medium">Completed</a>
                <a routerLink="/my-ads" routerLinkActive="text-teal-600" class="text-gray-600 hover:text-gray-900 font-medium">My Ads</a>
                <a routerLink="/create-offer" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md">Post Trade</a>
                
                <div class="relative ml-2">
                   <button (click)="toggleProfile()" class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform active:scale-95">
                      <span class="sr-only">Open user menu</span>
                      <img class="h-10 w-10 rounded-full object-cover border-2 border-gray-200" [src]="auth.currentUser()?.avatar" alt="">
                   </button>
                   <!-- Profile Dropdown Component -->
                   <app-profile [isOpen]="isProfileOpen" (close)="isProfileOpen = false"></app-profile>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
        <router-outlet></router-outlet>
      </main>

      <!-- Bottom Tab Bar (Mobile Only) -->
      <nav *ngIf="auth.isLoggedIn()" class="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe" [class.z-50]="isProfileOpen" [class.z-20]="!isProfileOpen">
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
          <!-- My Ads / Profile for Mobile -->
          <div class="flex flex-col items-center justify-center text-gray-500 relative">
             <button (click)="toggleProfile()" class="focus:outline-none flex flex-col items-center">
                <img class="h-6 w-6 rounded-full object-cover border border-gray-300" [src]="auth.currentUser()?.avatar">
                <span class="text-xs mt-1">Profile</span>
             </button>
             <!-- Mobile Dropdown opening upwards -->
             <app-profile *ngIf="isProfileOpen" [isOpen]="isProfileOpen" alignment="bottom" (close)="isProfileOpen = false" class="absolute bottom-0 right-0 z-50"></app-profile>
          </div>
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
