import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { AuthService } from '../../core/services/auth.service';
import { effect, computed } from '@angular/core';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{isEditMode ? 'Edit Trade' : 'Post a Trade'}}</h1>
      
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-6">
          
          <!-- Image Upload Preview -->
          <div class="flex justify-center">
            <div class="relative w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden" 
                 [class.cursor-pointer]="!previewUrl"
                 [class.hover:bg-gray-50]="!previewUrl"
                 (click)="!previewUrl && triggerUpload()">
                 
              <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
              
              <!-- Filled State -->
              <ng-container *ngIf="previewUrl">
                <img [src]="previewUrl" class="absolute inset-0 w-full h-full object-cover">
                
                <!-- Edit Button -->
                <button type="button" (click)="triggerUpload(); $event.stopPropagation()" class="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 z-20" title="Change Photo">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                   </svg>
                </button>
              </ng-container>

              <!-- Empty State -->
              <div *ngIf="!previewUrl" class="text-center p-4">
                 <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                 </svg>
                 <p class="mt-1 text-sm text-gray-600">Click to upload photo</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Ad Title</label>
            <input type="text" [(ngModel)]="title" name="title" required placeholder="e.g. Brand New Bike in Box!" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm px-4 py-2 border text-gray-900">
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-700">What are you Offering? (Item Name)</label>
             <input type="text" [(ngModel)]="offer" name="offer" required placeholder="e.g. Mountain Bike" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm px-4 py-2 border text-gray-900">
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-700">Price / Estimated Value (Rs)</label>
             <input type="number" [(ngModel)]="price" name="price" placeholder="e.g. 5000" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm px-4 py-2 border text-gray-900">
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-700">Description</label>
             <textarea [(ngModel)]="description" name="description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm px-4 py-2 border text-gray-900"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">What do you want in exchange?</label>
            <input type="text" [(ngModel)]="want" name="want" required placeholder="e.g. Gaming Console, Bicycle" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm px-4 py-2 border text-gray-900">
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="!title || !offer || !want || isSubmitting" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed">
               <span *ngIf="!isSubmitting">{{isEditMode ? 'Update Offer' : 'Post Offer'}}</span>
               <span *ngIf="isSubmitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
               </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class CreateOfferComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  title = '';
  offer = '';
  description = '';
  want = '';
  price: number | null = null;
  previewUrl: string | null = null;
  isSubmitting = false;

  offerService = inject(OfferService);
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isEditMode = false;
  editingId: string | null = null;

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditMode = true;
        this.editingId = id;
        // Wait for offers to be loaded? Or just check if available
        const found = this.offerService.allOffers().find(o => o.id === id);
        if (found) {
          this.title = found.title;
          this.offer = found.offer;
          this.description = found.description;
          this.want = found.want;
          this.price = found.price || null;
          this.previewUrl = found.imageUrl;
        }
      }
    });
  }

  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.compressImage(file).then(compressedDataUrl => {
        this.previewUrl = compressedDataUrl;
      }).catch(err => {
        console.error('Image compression failed', err);
        alert('Could not process image. Please try another one.');
      });
    }
  }

  compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
    });
  }

  onSubmit() {
    if (!this.title || !this.offer || !this.want || this.isSubmitting) return;

    const user = this.auth.currentUser();
    if (!user) return;

    this.isSubmitting = true;

    if (this.isEditMode && this.editingId) {
      // Update logic
      this.offerService.updateOffer({
        id: this.editingId,
        userId: user.userId,
        title: this.title,
        offer: this.offer,
        description: this.description,
        want: this.want,
        price: this.price || 0,
        imageUrl: this.previewUrl || '',
        createdAt: new Date() // Should probably keep original date, but preserving it in service/interceptor
      }).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/my-ads']);
        },
        error: (err) => {
          console.error('Failed to update', err);
          this.isSubmitting = false;
        }
      });
    } else {
      // Create logic
      this.offerService.addOffer({
        id: '',
        userId: user.userId,
        title: this.title,
        offer: this.offer,
        description: this.description,
        want: this.want,
        price: this.price || 0,
        imageUrl: this.previewUrl || 'https://placehold.co/300x200?text=' + this.offer,
        createdAt: new Date()
      }).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          // logic same as before...
          if (response.matchesFound > 0) {
            this.router.navigate(['/matches']);
          } else {
            this.router.navigate(['/my-ads']);
          }
        },
        error: (err) => {
          console.error('Failed to post offer', err);
          this.isSubmitting = false;
          alert('Failed to post offer. Please try again.');
        }
      });
    }
  }
}
