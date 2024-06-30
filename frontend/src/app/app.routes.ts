import { Routes } from '@angular/router';
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
    title: 'Profile - print3d',
  },
  {
    path: 'marketplace',
    component: MarketplaceComponent,
    title: 'Marketplace - print3d',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
