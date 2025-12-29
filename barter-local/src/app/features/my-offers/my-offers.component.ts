import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { AuthService } from '../../core/services/auth.service';
import { OfferCardComponent } from '../dashboard/offer-card/offer-card.component';

@Component({
  selector: 'app-my-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, OfferCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
           <h1 class="text-2xl font-bold text-gray-900">My Ads</h1>
           <p class="text-gray-500">Manage your posted offers</p>
        </div>

      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let offer of myOffers()" class="relative group h-full">
            <a [routerLink]="['/offer', offer.id]" class="block h-full">
                <app-offer-card [offer]="offer"></app-offer-card>
            </a>
            <!-- Edit Button Overlay -->
            <a [routerLink]="['/edit-offer', offer.id]" class="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full shadow hover:bg-teal-50 hover:text-teal-700 transition-colors z-10" title="Edit Offer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </a>
          </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="myOffers().length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No offers yet</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new trade offer.</p>
          <div class="mt-6">
            <a routerLink="/create-offer" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Post Offer
            </a>
          </div>
      </div>
    </div>
  `
})
export class MyOffersComponent {
  offerService = inject(OfferService);
  auth = inject(AuthService);

  myOffers = computed(() => {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) return [];
    return this.offerService.allOffers().filter(o => o.userId === userId || o.userId === 'me');
  });
}
