import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _usersService: UsersService, private _router: Router) {}

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot):
        boolean | UrlTree | Observable<boolean> | Promise<boolean> {
            return this._usersService.getAuthState().pipe(tap(isAuth => {
                console.log(isAuth);
                if (!isAuth) {
                    this._router.navigate(['/auth/login']);
                }
                return isAuth;
            }
            ));
    }
}
