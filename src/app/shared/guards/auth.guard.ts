import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/auth-storage.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);
  if (authStorage.isLoggedIn()) {
    return true;
  }
  else {
    router.navigate(['/login'], {
      queryParams: {
        accessDenied: true
      }
    });
    return false;
  }
};