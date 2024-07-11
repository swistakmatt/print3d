import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const toastService = inject(MessageService);
  const router = inject(Router);

  const currentUser = authService.currentUserValue;

  if (currentUser && currentUser.admin === true) {
    return true;
  } else {
    toastService.add({
      severity: 'error',
      summary: 'Error',
      closable: true,
      life: 10000,
      detail: 'You don`t have permissions to access this page.',
    });
    router.navigate(['/']);
    return false;
  }
};
