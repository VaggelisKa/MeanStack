import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  _destroy = new Subject<boolean>();

  constructor(private _usersService: UsersService,
              private _snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this._usersService.getAuthLoading()
      .pipe(takeUntil(this._destroy))
      .subscribe(result => {
        this.isLoading = result;
      });
  }

  onSignup(form: NgForm) {
    this._usersService.createUser(
      form.value.username,
      form.value.email,
      form.value.password)
      .subscribe((_) => {
        this._usersService.login(form.value.email, form.value.password).subscribe();
      });

    this._usersService.getAuthError()
      .pipe(takeUntil(this._destroy))
      .subscribe(error => {
        console.log(error);
        if (error) {
          this._snackbarService.openSnackBar(error, 8000);
        }
      });
  }

  ngOnDestroy() {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }

}
