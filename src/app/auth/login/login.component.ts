import { Component, OnInit, Type } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor() {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }
}