import { Component, OnInit, Type } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.usersService.login(form.value.email, form.value.password);
  }
}
