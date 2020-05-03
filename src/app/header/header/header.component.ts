import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/auth/services/users.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  isAuth = false;

  constructor(private usersService: UsersService,
              private router: Router) {}

  ngOnInit(): void {
    this.authSub = this.usersService.getAuthState().subscribe(result => {
      this.isAuth = result;
      this.router.navigate(['/']);
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
