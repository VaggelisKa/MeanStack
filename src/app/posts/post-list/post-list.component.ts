import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts: Post[] = [];
  postSub: Subscription;
  loadingSub: Subscription;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.loadingSub = this.postsService.isLoading.subscribe(result => {
      this.isLoading = result;
    });

    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }

}
