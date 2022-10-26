import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RolesGuardAdmin implements CanActivate {
    constructor(private readonly _authSVC: AuthService) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return this._authSVC.user$.pipe(
            map(user => {
                if (user) {
                    if (this._authSVC.isSAdmin(user) && user.activo) return true;
                    else if (this._authSVC.isAdmin(user) && user.activo) return true;
                    else {
                        console.error('No cuentas con permisos para acceder ó tu cuenta se encuentra bloqueada. Comunícate con un administrador.');
                        return false;
                    }
                }
                else return false;
            })
        );
    }

}