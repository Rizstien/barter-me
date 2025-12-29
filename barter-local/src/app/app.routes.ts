import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { CreateOfferComponent } from './features/create-offer/create-offer.component';
import { MatchesComponent } from './features/matches/matches.component';
import { ChatComponent } from './features/chat/chat.component';
import { OfferDetailComponent } from './features/offer-detail/offer-detail.component';
import { MyOffersComponent } from './features/my-offers/my-offers.component';
import { ProfileComponent } from './features/profile/profile.component';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isLoggedIn()) return true;
    return router.parseUrl('/auth/login');
};

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'auth/login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'offer/:id', component: OfferDetailComponent, canActivate: [authGuard] },
    { path: 'create-offer', component: CreateOfferComponent, canActivate: [authGuard] },
    { path: 'edit-offer/:id', component: CreateOfferComponent, canActivate: [authGuard] },
    { path: 'matches', component: MatchesComponent, canActivate: [authGuard] },
    { path: 'chat/:id', component: ChatComponent, canActivate: [authGuard] },
    { path: 'my-ads', component: MyOffersComponent, canActivate: [authGuard] },

    { path: '**', redirectTo: 'dashboard' }
];
