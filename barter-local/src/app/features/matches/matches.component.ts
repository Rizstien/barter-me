import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../core/services/match.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
   selector: 'app-matches',
   standalone: true,
   imports: [CommonModule, RouterLink],
   template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Your Matches</h1>

      
      <div class="space-y-4">
        <div *ngFor="let match of displayedMatches()" class="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between">
            <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                    <span [class]="'px-2 py-0.5 rounded text-xs font-semibold uppercase ' + (match.type === 'direct' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800')">
                        {{match.type === 'direct' ? 'Direct Trade' : 'Multi-Way Trade'}}
                    </span>
                    <span class="text-sm text-gray-500">{{match.createdAt | date}}</span>
                    <span *ngIf="match.status === 'completed'" class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold uppercase ml-2">Completed</span>
                </div>
               
               <!-- Visual Chain -->
               <div class="flex items-center flex-wrap gap-2 mt-3">
                   <ng-container *ngFor="let offer of match.offers; let i = index">
                       <div class="flex items-center bg-gray-50 rounded-lg p-2 border border-gray-200">
                          <img [src]="offer.imageUrl" class="w-10 h-10 rounded object-cover mr-2">
                          <div>
                             <div class="text-sm font-bold text-gray-900">{{offer.title}}</div>
                             <div class="text-xs text-gray-500">{{getUserName(offer.userId)}}</div>
                          </div>
                       </div>
                       <!-- Arrow if not last -->
                       <div *ngIf="i < match.offers.length - 1" class="text-gray-400">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                       </div>
                   </ng-container>
                   
                   <!-- Closing loop arrow implication for 3way? -->
               </div>
            </div>
            
            <div class="mt-4 md:mt-0 md:ml-6 flex items-center space-x-3">
               <div class="text-center px-4">
                  <div class="text-2xl font-bold text-teal-600">{{ (match.score * 100) | number:'1.0-0' }}%</div>
                  <div class="text-xs text-gray-500">Match</div>
               </div>
               <a [routerLink]="['/chat', match.id]" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                  Chat
               </a>
            </div>
        </div>

        <div *ngIf="displayedMatches().length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p class="text-gray-500">No matches found yet. Post more offers to find trades!</p>
            <a routerLink="/create-offer" class="text-teal-600 font-medium hover:underline mt-2 inline-block">Post an Offer</a>
        </div>
      </div>
    </div>
  `
})
export class MatchesComponent implements OnInit {
   matchService = inject(MatchService);
   auth = inject(AuthService);

   activeTab: 'active' | 'completed' = 'active';

   displayedMatches = computed(() => {
      const matches = this.matchService.myMatches();
      if (this.activeTab === 'active') {
         return matches.filter(m => m.status === 'active' || m.status === 'accepted');
      }
      return matches.filter(m => m.status === 'completed');
   });

   getUserName(userId: string) {
      return this.auth.getUserById(userId).name;
   }

   ngOnInit() {
      this.matchService.loadMatches();
   }
}
