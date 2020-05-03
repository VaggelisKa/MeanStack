import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../models/post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { UsersService } from 'src/app/auth/services/users.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  isAuth = false;
  postsPerPage = 3;
  currentPage = 1;
  totalPosts: number;
  posts: Post[] = [];
  postSub: Subscription;
  loadingSub: Subscription;
  authSub: Subscription;


  constructor(private postsService: PostsService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadingSub = this.postsService.postsAreLoading.subscribe(result => {
      this.isLoading = result;
    });

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postsService.getPostUpdateListener().subscribe((postsData: {posts: Post[], postsCount: number}) => {
      this.posts = postsData.posts;
      this.totalPosts = postsData.postsCount;
    });

    this.authSub = this.usersService.getAuthState().subscribe(result => {
      this.isAuth = result;
    });
  }


  onPageChange(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.loadingSub.unsubscribe();
    this.authSub.unsubscribe();
  }

}
