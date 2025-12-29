import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../../core/models/offer.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full animate-fade-in">
      <div class="relative h-48 bg-gray-200">
        <img [src]="offer.imageUrl" alt="{{offer.title}}" class="w-full h-full object-cover">
        <div class="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-semibold">
           5km away
        </div>
      </div>
      <div class="p-4 flex-1 flex flex-col">
        <div class="flex items-center space-x-2 mb-2">
            <img [src]="offerOwner()?.avatar" class="w-6 h-6 rounded-full">
            <span class="text-xs text-gray-500">{{offerOwner()?.name}}</span>
        </div>
        <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1">{{offer.title}}</h3>
        <div class="mb-2">
            <span class="inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded">Offering: {{offer.offer}}</span>
        </div>
        <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{offer.description}}</p>
        
        <div class="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
             <div class="flex-1 min-w-0">
                 <div class="text-xs text-gray-400 uppercase tracking-wide font-semibold">Wants</div>
                 <div class="text-teal-600 font-medium truncate">{{offer.want}}</div>
             </div>
             <div *ngIf="offer.price" class="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                Rs {{offer.price}}
             </div>
        </div>
      </div>
    </div>
  `
})
export class OfferCardComponent {
  @Input({ required: true }) offer!: Offer;
  auth = inject(AuthService);

  offerOwner = computed(() => this.auth.getUserById(this.offer.userId));
}
