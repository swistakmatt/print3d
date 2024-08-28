import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { FilesComponent } from './components/files/files.component';
import { ItemsComponent } from './components/items/items.component';
import { AdminComponent } from './components/admin/admin.component';
import { OrderComponent } from './components/order/order.component';
import { OrdersComponent } from './components/orders/orders.component';
import { StlPreviewComponent } from './components/stl-preview/stl-preview.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

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
    path: 'stl-preview',
    component: StlPreviewComponent,
    canActivate: [authGuard],
    title: 'STL Preview - print3d',
  },
  {
    path: 'items',
    component: ItemsComponent,
    canActivate: [authGuard],
    title: 'Items - print3d',
  },
  {
    path: 'order/:id',
    component: OrderComponent,
    canActivate: [authGuard],
    title: 'Order - print3d',
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard],
    title: 'Orders - print3d',
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    canActivate: [authGuard],
    title: 'Shopping Cart - print3d',
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
