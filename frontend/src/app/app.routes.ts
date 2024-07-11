import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home - print3d',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'Profile - print3d',
  },
  {
    path: 'marketplace',
    component: MarketplaceComponent,
    canActivate: [roleGuard],
    title: 'Marketplace - print3d',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
