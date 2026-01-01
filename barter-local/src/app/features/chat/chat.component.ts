import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { MatchService } from '../../core/services/match.service';
import { ChatMessage } from '../../core/models/chat.model';
import { Offer } from '../../core/models/offer.model';

@Component({
   selector: 'app-chat',
   standalone: true,
   imports: [CommonModule, FormsModule, RouterLink],
   template: `
    <div class="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-gray-50">
       
       <!-- Sidebar: Trade Details -->
       <div class="hidden md:flex md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col overflow-y-auto">
          
          <!-- Status Banner -->
          <div *ngIf="activeMatch()?.status === 'accepted'" class="bg-green-100 p-4 border-b border-green-200 text-center">
              <p class="text-green-800 font-bold">Trade Accepted!</p>
              <p class="text-xs text-green-600">All parties have agreed.</p>
          </div>
          <div *ngIf="activeMatch()?.status === 'completed'" class="bg-gray-800 p-4 border-b border-gray-700 text-center">
              <p class="text-white font-bold">Trade Completed</p>
          </div>

          <!-- Offer Detail View (when selected) -->
          <div *ngIf="selectedOffer()" class="flex-1 overflow-y-auto">
             <div class="p-6">
                <!-- Close Button -->
                <div class="mb-4 flex items-center justify-between">
                   <button (click)="clearSelectedOffer()" class="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                      <span class="text-sm font-medium">Back to Trade Details</span>
                   </button>
                   <button (click)="clearSelectedOffer()" class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Close">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                   </button>
                </div>

                <!-- Full Offer Details -->
                <div class="space-y-4">
                   <div class="rounded-lg overflow-hidden bg-gray-100">
                      <img [src]="selectedOffer()?.imageUrl" class="w-full h-64 object-cover">
                   </div>

                   <div>
                      <div class="flex items-center space-x-3 mb-4">
                         <img [src]="getOfferOwner(selectedOffer())?.avatar" class="w-10 h-10 rounded-full border border-gray-200">
                         <div>
                            <h3 class="text-sm font-bold text-gray-900">{{getOfferOwner(selectedOffer())?.name}}</h3>
                            <p class="text-xs text-gray-500">Member since 2023</p>
                         </div>
                      </div>

                      <h1 class="text-2xl font-bold text-gray-900 mb-3">{{selectedOffer()?.title}}</h1>
                      
                      <div class="mb-4 flex flex-wrap gap-2">
                         <span class="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-bold">
                            Offering: {{selectedOffer()?.offer}}
                         </span>
                         <span *ngIf="selectedOffer()?.condition" class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium capitalize">
                            {{selectedOffer()?.condition?.replace('-', ' ')}}
                         </span>
                      </div>
                      
                      <div class="flex items-center space-x-2 mb-4 flex-wrap gap-2">
                         <div class="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
                            Wants: {{selectedOffer()?.want}}
                         </div>
                         <div *ngIf="selectedOffer()?.price" class="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                            Rs {{selectedOffer()?.price}}
                         </div>
                      </div>

                      <p class="text-gray-600 mb-4 leading-relaxed text-sm">
                         {{selectedOffer()?.description || 'No description provided.'}}
                      </p>

                      <div class="text-xs text-gray-400 pt-4 border-t border-gray-200">
                         Posted on {{selectedOffer()?.createdAt | date:'mediumDate'}}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Trade Details List (default view) -->
          <div *ngIf="!selectedOffer()" class="p-6 border-b border-gray-100 flex-1">
             <h2 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trade Details</h2>
             
              <!-- My Offer (First) -->
              <div *ngIf="myOffer()" class="">
                 <p class="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">You are offering</p>
                 
                 <div (click)="selectOffer(myOffer()!)" class="cursor-pointer hover:opacity-90 transition-opacity border-2 border-teal-100 rounded-xl p-2 bg-teal-50">
                    <div class="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-white mb-3">
                        <img [src]="myOffer()?.imageUrl" class="object-cover w-full h-48 rounded-lg opacity-90">
                    </div>
                    
                    <h3 class="text-lg font-bold text-gray-900 mb-1 leading-tight">{{myOffer()?.title}}</h3>
                    <div class="mb-2">
                        <span class="text-xs font-semibold text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200">Item: {{myOffer()?.offer}}</span>
                    </div>
                    
                    <div class="flex flex-col space-y-1 mt-2">
                        <div class="inline-block px-2 py-1 bg-white text-gray-700 text-xs font-bold rounded w-fit border border-gray-200">
                            Wants: {{myOffer()?.want}}
                        </div>
                        <div class="text-xs font-semibold text-gray-500">
                            Value: Rs {{myOffer()?.price}}
                        </div>
                    </div>
                 </div>
              </div>

              <!-- Swap Icon Separator -->
              <div class="flex justify-center my-6">
                 <div class="bg-gray-100 p-2 rounded-full">
                    <svg class="w-5 h-5 text-gray-400 transform rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                 </div>
              </div>

              <!-- Other Offers -->
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Trading For</p>
              <div *ngFor="let offer of otherOffers(); let last = last" class="mb-4 relative">
                 <div (click)="selectOffer(offer)" class="cursor-pointer hover:opacity-90 transition-opacity">
                    <div class="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100 mb-3">
                       <img [src]="offer.imageUrl" class="object-cover w-full h-48 rounded-lg">
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1 leading-tight">{{offer.title}}</h3>
                    <div class="mb-2">
                        <span class="text-xs font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Item: {{offer.offer}}</span>
                    </div>
                    <div class="flex items-center space-x-2 mb-3">
                       <img [src]="getUserAvatar(offer.userId)" class="w-6 h-6 rounded-full">
                       <span class="text-sm font-medium" [ngClass]="getColorClass(offer.userId)">{{getUserName(offer.userId)}}</span>
                    </div>
                    <div class="flex flex-col space-y-1">
                        <div class="inline-block px-2 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded w-fit">
                            Wants: {{offer.want}}
                        </div>
                        <div class="text-xs font-semibold text-gray-500">
                            Value: Rs {{offer.price}}
                        </div>
                    </div>
                 </div>

                 <!-- Link/Arrow to next item if not last -->
                 <div *ngIf="!last" class="flex justify-center my-6">
                     <div class="bg-gray-100 p-2 rounded-full">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                     </div>
                 </div>
              </div>
          </div>

          <!-- Actions Area -->
          <div class="p-4 bg-gray-50 border-t border-gray-200">
             
             <!-- Accept Button -->
             <div *ngIf="activeMatch()?.status === 'active'" class="mb-3">
                 <button *ngIf="!hasAccepted()" (click)="acceptTrade()" [disabled]="isAccepting" 
                    class="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 flex justify-center items-center">
                    <span *ngIf="isAccepting" class="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Accept Trade
                 </button>
                 <div *ngIf="hasAccepted()" class="w-full bg-teal-50 text-teal-700 py-3 rounded-lg font-medium text-center border border-teal-200">
                    Waiting for others...
                 </div>
                 <p class="text-xs text-center text-gray-400 mt-2">
                    {{activeMatch()?.acceptedBy?.length || 0}} of {{activeMatch()?.offers?.length}} acceptances
                 </p>
             </div>

             <!-- Complete Button (Only if Accepted) -->
             <div *ngIf="activeMatch()?.status === 'accepted'">
                 <button *ngIf="!hasCompleted()" (click)="showConfirmationModal = true" class="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors">
                    Mark as Completed
                 </button>
                 <div *ngIf="hasCompleted()" class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-center font-medium border border-gray-200">
                    Waiting for others... ({{activeMatch()?.completedBy?.length || 0}}/{{activeMatch()?.offers?.length}})
                 </div>
             </div>
          </div>
       </div>

       <!-- Mobile Header (Only visible on small screens) -->
       <div class="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between border-b border-gray-200 z-10"
            [ngClass]="getMobileHeaderClass()">
          <div class="flex items-center">
             <a routerLink="/matches" class="mr-3 text-gray-500">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
             </a>
             <div class="flex items-center overflow-hidden">
                <div class="flex -space-x-2 mr-2">
                    <img *ngFor="let offer of otherOffers()" [src]="getUserAvatar(offer.userId)" class="w-8 h-8 rounded-full border-2 border-white bg-gray-200">
                </div>
                <div>
                   <h2 class="text-sm font-bold text-gray-900 truncate max-w-[120px]">{{otherOffers().length > 1 ? 'Multi-way Trade' : getUserName(otherOffers()[0]?.userId)}}</h2>
                   <p class="text-xs text-gray-500 truncate max-w-[120px]">
                      {{activeMatch()?.status === 'accepted' ? 'Trade Accepted!' : (otherOffers()[0]?.title + (otherOffers().length > 1 ? ' + others' : ''))}}
                   </p>
                </div>
             </div>
          </div>
          <button (click)="showDetailsMobile = !showDetailsMobile" class="text-teal-600 font-medium text-sm">
             {{showDetailsMobile ? 'Hide Info' : 'Info'}}
          </button>
       </div>

       <!-- Mobile Details Overlay -->
       <div *ngIf="showDetailsMobile" class="md:hidden bg-white border-b border-gray-200 p-4 transition-all max-h-[80vh] overflow-y-auto absolute w-full z-20 top-14 shadow-xl">
          <!-- Mobile Actions -->
          <div class="mb-6 pb-6 border-b border-gray-100">
                <div *ngIf="activeMatch()?.status === 'active'" class="mb-3">
                    <button *ngIf="!hasAccepted()" (click)="acceptTrade()" [disabled]="isAccepting" class="w-full bg-teal-600 text-white py-3 rounded-lg font-bold">
                        Accept Trade
                    </button>
                    <div *ngIf="hasAccepted()" class="w-full bg-teal-50 text-teal-700 py-3 rounded-lg text-center border border-teal-200">Waiting...</div>
                </div>
                <div *ngIf="activeMatch()?.status === 'accepted'">
                    <button *ngIf="!hasCompleted()" (click)="showConfirmationModal = true" class="w-full bg-gray-900 text-white py-3 rounded-lg font-bold">
                        Mark as Completed ({{activeMatch()?.completedBy?.length || 0}}/{{activeMatch()?.offers?.length}})
                    </button>
                    <div *ngIf="hasCompleted()" class="w-full bg-gray-100 text-gray-700 py-3 rounded-lg text-center font-medium border border-gray-200">
                        Waiting for others... ({{activeMatch()?.completedBy?.length || 0}}/{{activeMatch()?.offers?.length}})
                    </div>
                </div>
          </div>

          <!-- Your Offer (First) -->
          <div class="border-b border-gray-100 pb-3 mb-3">
             <p class="text-xs text-teal-600 font-bold uppercase mb-2">Your Offer</p>
             <div *ngIf="myOffer()" (click)="selectOffer(myOffer()!)" class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors border border-teal-100 bg-teal-50">
                <span class="text-sm font-bold text-gray-900">{{myOffer()?.title}}</span>
                <span class="text-xs bg-white text-gray-500 px-1 rounded border border-gray-200">You</span>
             </div>
          </div>

          <!-- Other Offers -->
          <p class="text-xs text-gray-400 uppercase mb-2">Trading For</p>
          <div *ngFor="let offer of otherOffers()" (click)="selectOffer(offer)" class="flex items-start space-x-3 mb-4 last:mb-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
             <img [src]="offer.imageUrl" class="w-16 h-16 rounded-lg object-cover bg-gray-100">
             <div>
                <div class="flex items-center space-x-2">
                    <h3 class="font-bold text-gray-900">{{offer.title}}</h3>
                    <span class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{{getUserName(offer.userId)}}</span>
                </div>
                <p class="text-sm text-gray-500">Wants: {{offer.want}}</p>
                <p class="text-xs text-gray-400">Val: {{offer.price}}</p>
             </div>
          </div>
       </div>

       <!-- Chat Area -->
       <div class="flex-1 flex flex-col min-w-0 bg-gray-50">
          <!-- Messages -->
          <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-6">
             <!-- Welcome Message -->
             <div class="flex justify-center my-4">
                <span class="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                   Trade started on {{activeMatch()?.createdAt | date:'mediumDate'}}
                </span>
             </div>

             <div *ngFor="let msg of messages" class="flex flex-col" [ngClass]="{'items-end': isMe(msg), 'items-start': !isMe(msg)}">
                
                <!-- Sender Name (Only for others) -->
                <div *ngIf="!isMe(msg)" class="ml-4 mb-1 text-xs font-medium" [ngClass]="getColorClass(msg.senderId)">
                    {{ getUserName(msg.senderId) }}
                </div>

                <div [ngClass]="isMe(msg) ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'" 
                     class="max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-2xl shadow-sm relative text-sm sm:text-base">
                   <p>{{msg.text}}</p>
                   <div [ngClass]="isMe(msg) ? 'text-teal-100' : 'text-gray-400'" class="text-[10px] mt-1 text-right">
                      {{msg.timestamp | date:'shortTime'}}
                   </div>
                </div>
             </div>
          </div>

          <!-- Input -->
          <div *ngIf="activeMatch()?.status !== 'completed'" class="bg-white p-3 sm:p-4 border-t border-gray-200">
             <form (ngSubmit)="sendMessage()" class="max-w-4xl mx-auto flex items-center space-x-2">
                <input type="text" [(ngModel)]="newMessage" name="message" placeholder="Type a message..." 
                  class="flex-1 border-gray-300 rounded-full focus:ring-teal-500 focus:border-teal-500 px-4 py-3 bg-gray-100 border-0 text-gray-900 placeholder-gray-500">
                <button type="submit" [disabled]="!newMessage.trim()" class="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                   <svg class="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                </button>
             </form>
          </div>
          <div *ngIf="activeMatch()?.status === 'completed'" class="bg-gray-50 p-4 text-center text-gray-500 text-sm">
              This trade has been completed. Chat is closed.
          </div>
       </div>
    </div>

    <!-- Confirmation Modal -->
    <div *ngIf="showConfirmationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
       <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100">
          <div class="p-6 text-center">
             <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
             <h3 class="text-xl font-bold text-gray-900 mb-2">Complete Trade?</h3>
             <p class="text-gray-500 text-sm mb-6">
                Are you sure you want to mark this trade as completed? This action cannot be undone.
             </p>
             <div class="grid grid-cols-2 gap-3">
                <button (click)="showConfirmationModal = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                   Cancel
                </button>
                <button (click)="confirmCompleteTrade()" class="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors">
                   Yes, Complete
                </button>
             </div>
          </div>
       </div>
    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy {
   @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

   messages: ChatMessage[] = [];
   newMessage = '';
   matchId = '';
   intervalId: any;
   showDetailsMobile = false;
   isAccepting = false;
   selectedOffer = signal<Offer | null>(null);
   showConfirmationModal = false;

   chatService = inject(ChatService);
   matchService = inject(MatchService);
   auth = inject(AuthService);
   route = inject(ActivatedRoute);

   // Compute active match
   activeMatch = computed(() => {
      const matches = this.matchService.myMatches();
      return matches.find(m => m.id === this.matchId);
   });

   // All offers that aren't mine (handles multi-way)
   otherOffers = computed(() => {
      const match = this.activeMatch();
      const myId = this.auth.currentUser()?.userId;
      return match?.offers.filter(o => o.userId !== myId && o.userId !== 'me') || [];
   });

   // My offer
   myOffer = computed(() => {
      const match = this.activeMatch();
      const myId = this.auth.currentUser()?.userId;
      return match?.offers.find(o => o.userId === myId || o.userId === 'me');
   });

   // Check if I have accepted
   hasAccepted = computed(() => {
      const match = this.activeMatch();
      const myId = this.auth.currentUser()?.userId;
      if (!match || !myId) return false;
      return match.acceptedBy?.includes(myId) || false;
   });

   // Check if I have marked as completed
   hasCompleted = computed(() => {
      const match = this.activeMatch();
      const myId = this.auth.currentUser()?.userId;
      if (!match || !myId) return false;
      return match.completedBy?.includes(myId) || false;
   });

   // Map of UserID -> Name
   userMap = computed(() => {
      const map: Record<string, string> = {};
      this.activeMatch()?.offers.forEach(o => {
         if (o.userId) { // strict check
            map[o.userId] = this.auth.getUserById(o.userId).name;
         }
      });
      return map;
   });

   // Map of UserID -> Color Class
   colorMap = computed(() => {
      const map: Record<string, string> = {};
      const colors = ['text-blue-600', 'text-purple-600', 'text-pink-600', 'text-orange-600', 'text-indigo-600'];
      this.activeMatch()?.offers.forEach((o, index) => {
         map[o.userId] = colors[index % colors.length];
      });
      return map;
   });

   realtimeSubscription: any;

   ngOnInit() {
      this.matchId = this.route.snapshot.paramMap.get('id') || '';
      this.matchService.loadMatches();
      this.loadMessages();

      // Join real-time channel
      this.chatService.joinMatch(this.matchId);
      this.realtimeSubscription = this.chatService.realtimeMessages$.subscribe(msg => {
         // Only add if it belongs to this match (channel separation handles it, but safety check)
         if (msg.matchId === this.matchId) {
            this.messages.push(msg);
            this.scrollToBottom();
         }
      });

      // Polling fallback (1 second as requested)
      this.intervalId = setInterval(() => {
         // We can perhaps be smarter here and only rely on polling for re-sync
         // But for simple demo, we keep polling to ensure consistency
         this.loadMessages();
         this.matchService.loadMatches();
      }, 1000);
   }

   ngOnDestroy() {
      if (this.intervalId) clearInterval(this.intervalId);
      if (this.realtimeSubscription) this.realtimeSubscription.unsubscribe();
      this.chatService.leaveMatch();
   }

   loadMessages() {
      this.chatService.getMessages(this.matchId).subscribe(msgs => {
         // Avoid full replacement flicker if length is same (simple optimization)
         if (msgs.length !== this.messages.length) {
            const wasAtBottom = this.isAtBottom();
            this.messages = msgs;
            if (wasAtBottom) this.scrollToBottom();
         }
      });
   }

   sendMessage() {
      if (!this.newMessage.trim()) return;
      const user = this.auth.currentUser();
      if (!user) return;
      const text = this.newMessage;
      this.newMessage = '';
      this.chatService.sendMessage(this.matchId, text, user.id).subscribe(msg => {
         this.messages.push(msg);
         this.scrollToBottom();
      });
   }

   acceptTrade() {
      if (this.isAccepting) return;
      this.isAccepting = true;
      this.matchService.acceptTrade(this.matchId).subscribe(() => {
         this.isAccepting = false;
         this.matchService.loadMatches(); // refresh immediately
      });
   }

   completeTrade() {
      // Logic moved to confirmCompleteTrade, this just opens modal
      // This implementation is now redundant if the button directly toggles the modal, 
      // but kept as placeholder if called programmatically.
      this.showConfirmationModal = true;
   }

   confirmCompleteTrade() {
      this.showConfirmationModal = false;
      this.matchService.completeTrade(this.matchId).subscribe(() => {
         this.matchService.loadMatches();
      });
   }

   getMobileHeaderClass() {
      if (this.activeMatch()?.status === 'accepted') return 'bg-green-50 border-green-200';
      return 'bg-white border-gray-200';
   }

   isMe(msg: ChatMessage): boolean {
      return msg.senderId === this.auth.currentUser()?.id;
   }

   getUserName(userId: string | undefined): string {
      if (!userId) return 'Unknown';
      // userMap only indexed by email, so we use the robust service method
      // which handles both ID types (numeric and email)
      return this.auth.getUserById(userId).name;
   }

   getUserAvatar(userId: string | undefined): string {
      if (!userId) return '';
      return this.auth.getUserById(userId).avatar;
   }

   getColorClass(userId: string): string {
      if (!userId) return 'text-gray-600';
      return this.colorMap()[userId] || 'text-gray-600';
   }

   isAtBottom(): boolean {
      if (!this.scrollContainer) return true;
      const { scrollTop, scrollHeight, clientHeight } = this.scrollContainer.nativeElement;
      return scrollHeight - scrollTop - clientHeight < 50;
   }

   scrollToBottom() {
      setTimeout(() => {
         if (this.scrollContainer) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
         }
      }, 100);
   }

   selectOffer(offer: Offer) {
      this.selectedOffer.set(offer);
   }

   clearSelectedOffer() {
      this.selectedOffer.set(null);
   }

   getOfferOwner(offer: Offer | null) {
      if (!offer) return null;
      return this.auth.getUserById(offer.userId);
   }
}
