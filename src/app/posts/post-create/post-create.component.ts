import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle: string;
  enteredContent: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;

  loadingSub: Subscription;

  constructor(private postsService: PostsService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadingSub = this.postsService.isLoading.subscribe(result => {
      this.isLoading = result;
    });

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),

      content: new FormControl(null, {validators: Validators.required}),
      image: new FormControl(null, {validators: [Validators.required]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };

          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        });
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(file, this.form);
  }

  onSubmit() {
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    }
    else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }

    this.form.reset();
  }

  ngOnDestroy() {
    this.loadingSub.unsubscribe();
  }

}
