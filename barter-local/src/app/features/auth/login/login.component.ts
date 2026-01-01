import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    template: `
    <div class="min-h-screen flex bg-white">
      <!-- Left Side: Visual & Brand (Hidden on Mobile) -->
      <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
          <!-- Animated Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-teal-900 via-gray-900 to-black z-0 animate-gradient"></div>
          
          <!-- Abstract Shapes -->
          <div class="absolute top-0 left-0 w-full h-full opacity-30 z-0">
             <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
             <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
             <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 w-full h-full flex flex-col justify-center px-16 text-white">
              <div class="mb-8">
                  <div class="h-16 w-16 bg-teal-500 rounded-2xl mb-6 shadow-lg shadow-teal-500/20 flex items-center justify-center">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  </div>
                  <h1 class="text-5xl font-bold mb-4 tracking-tight">ScotchCorner</h1>
                  <p class="text-xl text-gray-300 font-light max-w-md">Connect with your neighborhood. Trade goods seamlessly. Build a sustainable community.</p>
              </div>
              
              <div class="space-y-4">
                  <div class="flex items-center space-x-3 text-sm text-gray-400">
                      <div class="flex -space-x-2">
                          <div class="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900"></div>
                          <div class="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-900"></div>
                          <div class="w-8 h-8 rounded-full bg-gray-500 border-2 border-gray-900"></div>
                      </div>
                      <p>Join 2,000+ neighbors trading today</p>
                  </div>
              </div>
          </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
         <!-- Mobile Background (Subtle) -->
         <div class="absolute inset-0 bg-slate-50 lg:bg-white z-0"></div>

         <div class="max-w-md w-full relative z-10">
            <div class="text-center lg:text-left mb-10">
                <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
                <p class="mt-2 text-sm text-gray-600">Please enter your details to sign in.</p>
            </div>

            <div *ngIf="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-fade-in-up">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{{ errorMessage }}</p>
                    </div>
                </div>
            </div>

            <form class="space-y-6" (ngSubmit)="onSubmit()">
                <div class="space-y-5">
                    <div>
                        <label for="user-id" class="block text-sm font-medium text-gray-700 mb-1">User ID or Email</label>
                        <input id="user-id" name="userId" type="text" required [(ngModel)]="userId" (input)="errorMessage = ''" 
                          class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-gray-900 sm:text-sm" 
                          placeholder="e.g. u1">
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                            <a href="#" class="text-sm font-medium text-teal-600 hover:text-teal-500">Forgot password?</a>
                        </div>
                        <input id="password" name="password" type="password" required [(ngModel)]="password" (input)="errorMessage = ''" 
                          class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white text-gray-900 sm:text-sm" 
                          placeholder="••••••••">
                    </div>
                </div>

                <div class="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded">
                    <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me for 30 days</label>
                </div>

                <button type="submit" 
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                  Sign in to account
                </button>
            </form>

            <div class="mt-8">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-200"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-slate-50 lg:bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-2 gap-3">
                    <button type="button" class="w-full inline-flex justify-center py-3 px-4 rounded-xl shadow-sm bg-white border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                       <span class="sr-only">Sign in with Google</span>
                       <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                    </button>
                    <button type="button" class="w-full inline-flex justify-center py-3 px-4 rounded-xl shadow-sm bg-white border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                       <span class="sr-only">Sign in with Twitter</span>
                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </button>
                </div>

                <p class="mt-8 text-center text-sm text-gray-600">
                    Don't have an account? 
                    <a href="#" class="font-medium text-teal-600 hover:text-teal-500">Sign up for free</a>
                </p>
            </div>
         </div>
      </div>
    </div>
  `,
    styles: [`
     @keyframes blob {
         0% { transform: translate(0px, 0px) scale(1); }
         33% { transform: translate(30px, -50px) scale(1.1); }
         66% { transform: translate(-20px, 20px) scale(0.9); }
         100% { transform: translate(0px, 0px) scale(1); }
     }
     .animate-blob {
         animation: blob 7s infinite;
     }
     .animation-delay-2000 {
         animation-delay: 2s;
     }
     .animation-delay-4000 {
         animation-delay: 4s;
     }
     .animate-gradient {
        background-size: 200% 200%;
        animation: gradient-flow 15s ease infinite;
     }
     @keyframes gradient-flow {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
     }
     .animate-fade-in-up {
        animation: fadeInUp 0.5s ease-out;
     }
     @keyframes fadeInUp {
         from { opacity: 0; transform: translateY(10px); }
         to { opacity: 1; transform: translateY(0); }
     }
  `]
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
