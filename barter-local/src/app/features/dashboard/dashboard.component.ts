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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Nearby Offers</h1>
            <p class="text-gray-500">Discover trades around Lahore</p>
          </div>
          
          <div class="flex items-center space-x-4 flex-1 md:max-w-md">
             <div class="relative flex-1">
                <input type="text" [(ngModel)]="searchQuery" placeholder="Search items..." 
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-gray-900">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
             </div>
             
             <div class="hidden md:flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm whitespace-nowrap">
                <span class="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                <span class="text-sm font-medium text-gray-700">Live</span>
             </div>
          </div>
       </div>

       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <a *ngFor="let offer of filteredOffers()" [routerLink]="['/offer', offer.id]" class="block h-full">
            <app-offer-card [offer]="offer"></app-offer-card>
          </a>
       </div>
       
       <!-- Empty State for Search -->
       <div *ngIf="filteredOffers().length === 0 && searchQuery()" class="text-center py-12">
          <p class="text-gray-500">No items found matching "{{searchQuery()}}"</p>
       </div>
       
       <!-- Loading State (if empty) -->
       <div *ngIf="offerService.allOffers().length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
           <svg class="w-12 h-12 mb-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
           <p>Loading offers...</p>
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
