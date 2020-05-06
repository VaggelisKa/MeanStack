import { Component, OnInit, Type, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  destroy$ = new Subject();

  constructor(private usersService: UsersService,
              private _snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.usersService.getAuthLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isLoading = result;
      });
  }


  onSubmit(form: NgForm) {
    this.usersService.login(form.value.email, form.value.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.usersService.getAuthError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        console.log(error);
        if (error) {
          this._snackbarService.openSnackBar(error, 1500);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
