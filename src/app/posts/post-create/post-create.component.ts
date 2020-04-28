import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { Subscription, Observable, of } from 'rxjs';

import * as fromRoot from '../../app.reducer';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle: string;
  enteredContent: string;
  post: Post;
  isLoading$: Observable<boolean>;
  private mode = 'create';
  private postId: string;

  constructor(private postsService: PostsService,
              private route: ActivatedRoute,
              private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(fromRoot.getIsLoading));

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading$ = of(false);
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
        });
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.postName, form.value.postContent);
    }
    else {
      this.postsService.updatePost(this.postId, form.value.postName, form.value.postContent);
    }

    form.resetForm();
  }

  ngOnDestroy() {
  }

}
