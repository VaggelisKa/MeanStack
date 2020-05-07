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
  _destroy = new Subject();

  constructor(private _usersService: UsersService,
              private _snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this._usersService.getAuthLoading()
      .pipe(takeUntil(this._destroy))
      .subscribe(result => {
        this.isLoading = result;
      });
  }


  onSubmit(form: NgForm): void {
    this._usersService.login(form.value.email, form.value.password).subscribe();

    this._usersService.getAuthError()
      .pipe(takeUntil(this._destroy))
      .subscribe(error => {
        console.log(error);
        if (error) {
          this._snackbarService.openSnackBar(error, 1500);
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }

}
