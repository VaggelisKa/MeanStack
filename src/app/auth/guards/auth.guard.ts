import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UsersService } from '../services/users.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private usersService: UsersService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | UrlTree | Observable<boolean> | Promise<boolean> {
            return this.usersService.getAuthState().pipe(tap(isAuth => {
                console.log(isAuth);
                if (!isAuth) {
                    this.router.navigate(['/login']);
                }
                return isAuth;
            }
            ));

    }
}
