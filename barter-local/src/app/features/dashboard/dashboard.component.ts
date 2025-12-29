import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { AuthService } from '../../core/services/auth.service';
import { OfferCardComponent } from './offer-card/offer-card.component';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, FormsModule, RouterLink, OfferCardComponent],
   template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
       <!-- Header Section -->
       <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span class="text-teal-600 font-semibold tracking-wide uppercase text-sm">Discover</span>
            <h1 class="text-4xl font-extrabold text-gray-900 mt-1 tracking-tight">Nearby Offers</h1>
            <p class="text-gray-500 mt-2 text-lg font-light">Explore what your neighbors are trading.</p>
          </div>
          
          <!-- Search Bar -->
          <div class="w-full md:max-w-md relative z-10">
             <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="h-6 w-6 text-gray-400 group-focus-within:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" [(ngModel)]="searchQuery" placeholder="Search for items, bikes, furniture..." 
                  class="block w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-gray-900 font-medium">
             </div>
          </div>
       </div>

       <!-- Active Filter / Status -->
       <div class="flex items-center space-x-2 mb-8" *ngIf="offerService.allOffers().length > 0">
           <div class="inline-flex items-center px-3 py-1 bg-teal-50 border border-teal-100 rounded-full">
              <span class="w-2 h-2 bg-teal-500 rounded-full animate-pulse mr-2"></span>
              <span class="text-xs font-bold text-teal-700 uppercase tracking-wide">Live Updates</span>
           </div>
           <span class="text-xs text-gray-400">{{offerService.allOffers().length}} items listed</span>
       </div>

       <!-- Grid -->
       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <a *ngFor="let offer of filteredOffers()" [routerLink]="['/offer', offer.id]" class="group block h-full transform transition-all duration-300 hover:-translate-y-1">
            <app-offer-card [offer]="offer" class="h-full"></app-offer-card>
          </a>
       </div>
       
       <!-- Empty State for Search -->
       <div *ngIf="filteredOffers().length === 0 && searchQuery()" class="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200">
          <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <h3 class="text-lg font-medium text-gray-900">No items found</h3>
          <p class="text-gray-500">We couldn't find anything matching "{{searchQuery()}}"</p>
       </div>
       
       <!-- Loading State (if empty) -->
       <div *ngIf="offerService.allOffers().length === 0" class="flex flex-col items-center justify-center py-32 text-gray-400">
           <div class="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-6"></div>
           <p class="text-lg font-medium">Loading offers...</p>
       </div>
    </div>
  `
})
export class DashboardComponent {
   offerService = inject(OfferService);
   auth = inject(AuthService);
   searchQuery = signal('');

   filteredOffers = computed(() => {
      const query = this.searchQuery().toLowerCase();
      // Simple filter: Exclude own offers
      const offers = this.offerService.allOffers().filter(o => o.userId !== 'me' && o.userId !== this.auth.currentUser()?.userId);

      if (!query) return offers;
      return offers.filter(o =>
         o.title.toLowerCase().includes(query) ||
         o.description.toLowerCase().includes(query) ||
         o.want.toLowerCase().includes(query)
      );
   });
}
