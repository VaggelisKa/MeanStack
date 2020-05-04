import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  destroy$ = new Subject<boolean>();

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getAuthLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isLoading = result;
      });
  }

  onSignup(form: NgForm) {
    this.usersService.createUser(
      form.value.username,
      form.value.email,
      form.value.password);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
