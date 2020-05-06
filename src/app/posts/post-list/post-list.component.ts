import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Post } from '../models/post.model';
import { PostsService } from '../posts.service';
import {  Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { UsersService } from 'src/app/auth/services/users.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from './dialog/delete-dialog.component';

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
  username: string;
  posts: Post[] = [];
  destroy$ = new Subject<boolean>();

  constructor(private postsService: PostsService,
              private usersService: UsersService,
              private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.postsService.getPostsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
      this.isLoading = result;
    });

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsService.getPostUpdateListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((postsData: {posts: Post[], postsCount: number}) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.postsCount;
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


  onPageChange(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    const dialogRef = this._dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(wantsToDelete => {
      if (wantsToDelete) {
        this.postsService.deletePost(postId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.postsService.getPosts(this.postsPerPage, this.currentPage);
          this.isLoading = false;
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
