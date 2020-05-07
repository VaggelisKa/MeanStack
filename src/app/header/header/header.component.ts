import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/auth/services/users.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _destroy = new Subject<boolean>();
  username: string;
  isAuth = false;

  constructor(private _usersService: UsersService,
              private _router: Router) {}

  ngOnInit(): void {
    this._usersService.getAuthState()
      .pipe(takeUntil(this._destroy))
      .subscribe(authState => {
        this.isAuth = authState;
        this._router.navigate(['/']);
      });

    this._usersService.getUsername()
      .pipe(takeUntil(this._destroy))
      .subscribe(username => {
        this.username = username;
      });

  }

  onLogout() {
    this._usersService.logout();
    this._router.navigate(['/login']);
  }

  ngOnDestroy() {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }

}
