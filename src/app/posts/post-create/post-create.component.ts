import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle: string;
  enteredContent: string;

  constructor(private postsService: PostsService) {}

  onSubmit(form: NgForm) {
    this.postsService.addPost(form.value.postName, form.value.postContent);
  }

  ngOnInit(): void {
  }

}
