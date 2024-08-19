import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { FilesComponent } from './components/files/files.component';
import { ItemsComponent } from './components/items/items.component';
import { AdminComponent } from './components/admin/admin.component';

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
    canActivate: [authGuard],
    title: 'Marketplace - print3d',
  },
  {
    path: 'files',
    component: FilesComponent,
    canActivate: [authGuard],
    title: 'Files - print3d',
  },
  {
    path: 'items',
    component: ItemsComponent,
    canActivate: [authGuard],
    title: 'Items - print3d',
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    title: 'Admin - print3d',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
