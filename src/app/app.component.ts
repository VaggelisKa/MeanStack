import { Component, OnInit } from '@angular/core';
import { Post } from './posts/models/post.model';
import { UsersService } from './auth/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.autoAuthUser();
  }
}
