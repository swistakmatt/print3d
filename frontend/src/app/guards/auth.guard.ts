import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SidebarService } from '../services/sidebar.service';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const sidebarService = inject(SidebarService);
  const toastService = inject(MessageService);
  const router = inject(Router);

  if (authService.currentUserValue) {
    return true;
  } else {
    toastService.add({
      severity: 'warn',
      summary: 'Warning',
      closable: true,
      life: 10000,
      detail: 'You need to log in to access this page.',
    });
    sidebarService.toggleLoginDialog();
    return false;
  }
};
