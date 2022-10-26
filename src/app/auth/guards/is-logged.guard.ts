import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {
  constructor(private readonly _authSVC: AuthService, private readonly _router: Router) { }

  canActivate(): Observable<boolean> {
    return this._authSVC.user$.pipe(
      map((user) => {
        if (!user) {
          //TODO: crear alerta
          this._router.navigateByUrl('');
          console.error('Debes loguearte primero para ingresar.');
          return false;
        } else if (!user.activo) {
          //TODO: crear alerta
          this._router.navigateByUrl('');
          console.error('Tu cuenta ha sido bloqueada. Comunícate con un administrador.');
          return false;
        } else {
          return true;
        }
      })
    );

  }

}
