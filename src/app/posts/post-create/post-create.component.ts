import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle: string;
  enteredContent: string;

  @Output() postCreated = new EventEmitter<Post>();

  onSubmit(form: NgForm) {
    const post: Post = {
      title: form.value.postName,
      content: form.value.postContent
    };
    this.postCreated.emit(post);
  }

  ngOnInit(): void {
  }

}
