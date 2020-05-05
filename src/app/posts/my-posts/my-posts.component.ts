import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject } from 'rxjs';
import { PostsService } from '../posts.service';
import { UsersService } from 'src/app/auth/services/users.service';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit, OnDestroy {
  isLoading = false;
  isAuth = false;
  username: string;
  posts: Post[] = [];
  destroy$ = new Subject<boolean>();


  constructor(private postsService: PostsService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.postsService.getPostsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
      this.isLoading = result;
    });

    this.postsService.getPosts(null, null);
    this.postsService.getPostUpdateListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((postsData: {posts: Post[], postsCount: number}) => {
        this.posts = postsData.posts;
      });

    this.usersService.getAuthState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isAuth = result;
      });

    this.usersService.getUsername()
      .pipe(takeUntil(this.destroy$))
      .subscribe(username => {
        this.username = username;
      });
  }


  onDelete(postId: string) {
    this.postsService.deletePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
