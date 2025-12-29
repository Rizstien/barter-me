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
      <div class="mb-10">
          <span class="text-teal-600 font-semibold tracking-wide uppercase text-sm">Action Required</span>
          <h1 class="text-4xl font-extrabold text-gray-900 mt-1">Your Matches</h1>
          <p class="text-gray-500 mt-2 text-lg font-light">Connect with traders to finalize these deals.</p>
      </div>
      
      <div class="space-y-6">
        <div *ngFor="let match of displayedMatches()" class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            <!-- decorative bar -->
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-blue-500"></div>

            <div class="p-6 md:p-8 flex flex-col xl:flex-row items-center justify-between gap-6">
                <div class="flex-1 w-full">
                    <div class="flex items-center justify-between xl:justify-start xl:space-x-4 mb-6">
                        <div class="flex items-center space-x-2">
                            <span [class]="'px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ' + (match.type === 'direct' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-purple-50 text-purple-700 border border-purple-100')">
                                {{match.type === 'direct' ? 'Direct Trade' : 'Multi-Way Trade'}}
                            </span>
                            <span class="text-xs text-gray-400 font-medium">{{match.createdAt | date:'mediumDate'}}</span>
                        </div>
                        <span *ngIf="match.status === 'completed'" class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase border border-gray-200">Completed</span>
                    </div>
                   
                   <!-- Visual Chain -->
                   <div class="flex flex-col sm:flex-row items-center sm:flex-wrap gap-4">
                       <ng-container *ngFor="let offer of getSortedOffers(match); let i = index">
                           <!-- Card item -->
                           <div class="relative group/item flex items-center bg-gray-50 rounded-xl p-3 pr-6 border border-gray-200 transition-colors hover:border-teal-200 hover:bg-teal-50" [ngClass]="{'ring-2 ring-teal-500 ring-offset-2': offer.userId === auth.currentUser()?.userId}">
                              <img [src]="offer.imageUrl" class="w-12 h-12 rounded-lg object-cover mr-3 shadow-sm">
                              <div>
                                 <div class="text-sm font-bold text-gray-900 leading-tight mb-0.5">{{offer.title}}</div>
                                 <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {{offer.userId === auth.currentUser()?.userId ? 'You' : getUserName(offer.userId)}}
                                 </div>
                              </div>
                           </div>

                           <!-- Connector Arrow -->
                           <div *ngIf="i < match.offers.length - 1" class="hidden sm:flex text-gray-300 transform rotate-90 sm:rotate-0">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                           </div>
                           <div *ngIf="i < match.offers.length - 1" class="flex sm:hidden text-gray-300 my-2">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                           </div>
                       </ng-container>
                   </div>
                </div>
                
                <!-- Right Action Section -->
                <div class="w-full xl:w-auto flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center border-t xl:border-t-0 border-gray-100 pt-4 xl:pt-0">
                   <div class="text-left xl:text-right mb-0 xl:mb-3">
                      <div class="flex items-center xl:justify-end gap-2">
                          <span class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">{{ (match.score * 100) | number:'1.0-0' }}%</span>
                      </div>
                      <div class="text-xs font-bold text-gray-400 uppercase tracking-widest">Match Score</div>
                   </div>
                   
                   <a [routerLink]="['/chat', match.id]" class="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-800">
                      <span>Open Chat</span>
                      <svg class="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                   </a>
                </div>
            </div>
        </div>

        <div *ngIf="displayedMatches().length === 0" class="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">No matches yet</h3>
            <p class="text-gray-500 max-w-sm mx-auto mt-1 mb-6">Matches will appear here once our algorithm finds a trade partner for you.</p>
            <a routerLink="/create-offer" class="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                Post New Offer
            </a>
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

   getSortedOffers(match: any) {
      const myId = this.auth.currentUser()?.userId;
      if (!myId || !match.offers) return match.offers;

      // Return copy to avoid mutation issues, sorted with me First
      return [...match.offers].sort((a, b) => {
         if (a.userId === myId) return -1;
         if (b.userId === myId) return 1;
         return 0;
      });
   }

   ngOnInit() {
      this.matchService.loadMatches();
   }
}
