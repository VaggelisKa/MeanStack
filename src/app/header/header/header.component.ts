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
  private destroy$ = new Subject<boolean>();
  username: string;
  isAuth = false;

  constructor(private usersService: UsersService,
              private router: Router) {}

  ngOnInit(): void {
    this.usersService.getAuthState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(authState => {
        this.isAuth = authState;
        this.router.navigate(['/']);
      });

    this.usersService.getUsername()
      .pipe(takeUntil(this.destroy$))
      .subscribe(username => {
        this.username = username;
      });

  }

  onLogout() {
    this.usersService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
