import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle: string;
  enteredContent: string;
  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(private postsService: PostsService,
              private route: ActivatedRoute) {}

  onSubmit(form: NgForm) {
    this.postsService.addPost(form.value.postName, form.value.postContent);
    form.resetForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postsService.getPost(this.postId);
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

}
