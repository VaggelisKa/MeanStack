import { Component, OnInit, Type, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  isLoading = false;

  constructor(private usersService: UsersService,
              private _snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.usersService.getAuthLoading().subscribe(result => {
      this.isLoading = result;
    });

    // this._snackbarService.openSnackBar()
  }

  ngAfterViewInit() {
    this.usersService.getAuthError().subscribe(error => {
      console.log(error.error.message);
    });
  }

  onSubmit(form: NgForm) {
    this.usersService.login(form.value.email, form.value.password);
  }
}
