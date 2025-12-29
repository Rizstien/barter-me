import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div class="text-center">
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">BarterLocal</h2>
            <p class="mt-2 text-sm text-gray-600">Trade goods in your neighborhood</p>
        </div>

        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {{ errorMessage }}
        </div>

        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="user-id" class="sr-only">User ID / Email</label>
              <input id="user-id" name="userId" type="text" required [(ngModel)]="userId" (input)="errorMessage = ''" 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="User ID (e.g. u1) or Email">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" type="password" required [(ngModel)]="password" (input)="errorMessage = ''" 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Password">
            </div>
          </div>

          <div>
            <button type="submit" 
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200">
              Sign in
            </button>
          </div>
          
           <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
             <button type="button" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Google
             </button>
             <button type="button" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Facebook
             </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  userId = '';
  password = '';
  errorMessage = '';

  auth = inject(AuthService);
  router = inject(Router);

  onSubmit() {
    if (this.userId) {
      if (this.auth.login(this.userId)) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Incorrect user ID or password.';
      }
    }
  }
}
