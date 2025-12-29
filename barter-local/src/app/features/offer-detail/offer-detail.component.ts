import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
   selector: 'app-offer-detail',
   standalone: true,
   imports: [CommonModule, RouterLink],
   template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a routerLink="/dashboard" class="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Dashboard
      </a>

      <div *ngIf="offer()" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
         <div class="md:flex">
            <!-- Image Section -->
            <div class="md:w-1/2 h-80 md:h-auto bg-gray-100 relative">
               <img [src]="offer()?.imageUrl" class="w-full h-full object-cover">
            </div>

            <!-- Details Section -->
            <div class="md:w-1/2 p-8 flex flex-col">
                <div class="flex items-center space-x-3 mb-4">
                  <img [src]="offerOwner()?.avatar" class="w-10 h-10 rounded-full border border-gray-200">
                  <div>
                     <h3 class="text-sm font-bold text-gray-900">{{offerOwner()?.name}}</h3>
                     <p class="text-xs text-gray-500">Member since 2023</p>
                  </div>
               </div>

               <h1 class="text-3xl font-bold text-gray-900 mb-2">{{offer()?.title}}</h1>
               <div class="mb-4 flex flex-wrap gap-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-bold">
                     Offering: {{offer()?.offer}}
                  </span>
                  <span *ngIf="offer()?.condition" class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium capitalize">
                     {{offer()?.condition?.replace('-', ' ')}}
                  </span>
               </div>
               <div class="flex items-center space-x-2 mb-6 flex-wrap gap-2">
                   <div class="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
                      Wants: {{offer()?.want}}
                   </div>
                   <div *ngIf="offer()?.price" class="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                      Rs {{offer()?.price}}
                   </div>
               </div>

               <p class="text-gray-600 mb-8 leading-relaxed">
                  {{offer()?.description}}
               </p>

                <div class="mt-auto space-y-3">
                  <!-- Edit Button for Owner -->
                  <a *ngIf="auth.currentUser()?.userId === offer()?.userId" 
                     [routerLink]="['/edit-offer', offer()?.id]"
                     class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                     Edit Offer
                  </a>

                  <!-- Trade Button for Others -->
                  <button *ngIf="auth.currentUser()?.userId !== offer()?.userId"
                          class="w-full bg-teal-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-teal-700 transition-shadow shadow-md hover:shadow-lg">
                     Request Trade
                  </button>
                  <div class="text-center text-xs text-gray-400">
                     Posted on {{offer()?.createdAt | date:'mediumDate'}}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div *ngIf="!offer()" class="text-center py-20">
         <p class="text-gray-500">Offer not found.</p>
      </div>
    </div>
  `
})
export class OfferDetailComponent {
   route = inject(ActivatedRoute);
   offerService = inject(OfferService);
   auth = inject(AuthService);

   offerId = this.route.snapshot.paramMap.get('id');

   offer = computed(() => {
      return this.offerService.allOffers().find(o => o.id === this.offerId);
   });

   offerOwner = computed(() => {
      const o = this.offer();
      return o ? this.auth.getUserById(o.userId) : null;
   });


}
