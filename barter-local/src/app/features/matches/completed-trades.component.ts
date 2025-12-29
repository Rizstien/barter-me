import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../core/services/match.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-completed-trades',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Completed Trades</h1>
      
      <div class="space-y-4">
        <div *ngFor="let match of displayedMatches()" class="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between opacity-90 hover:opacity-100 transition-opacity">
            <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                    <span [class]="'px-2 py-0.5 rounded text-xs font-semibold uppercase grayscale ' + (match.type === 'direct' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800')">
                        {{match.type === 'direct' ? 'Direct Trade' : 'Multi-Way Trade'}}
                    </span>
                    <span class="text-sm text-gray-500">{{match.createdAt | date}}</span>
                    <span class="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold uppercase ml-2">Completed</span>
                </div>
               
               <!-- Visual Chain -->
               <div class="flex items-center flex-wrap gap-2 mt-3">
                   <ng-container *ngFor="let offer of match.offers; let i = index">
                       <div class="flex items-center bg-white rounded-lg p-2 border border-gray-200 grayscale">
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
               </div>
            </div>
            
            <div class="mt-4 md:mt-0 md:ml-6 flex items-center space-x-3">
               <div class="text-center px-4">
                  <div class="text-xs text-gray-500">Match</div>
                  <div class="text-xl font-bold text-gray-500">{{ (match.score * 100) | number:'1.0-0' }}%</div>
               </div>
               <a [routerLink]="['/chat', match.id]" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View History
               </a>
            </div>
        </div>

        <div *ngIf="displayedMatches().length === 0" class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p class="text-gray-500">No completed trades yet.</p>
        </div>
      </div>
    </div>
  `
})
export class CompletedTradesComponent implements OnInit {
    matchService = inject(MatchService);
    auth = inject(AuthService);

    displayedMatches = computed(() => {
        const matches = this.matchService.myMatches();
        return matches.filter(m => m.status === 'completed');
    });

    getUserName(userId: string) {
        return this.auth.getUserById(userId).name;
    }

    ngOnInit() {
        this.matchService.loadMatches();
    }
}
