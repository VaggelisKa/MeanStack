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
  _destroy = new Subject<boolean>();

  constructor(private _postsService: PostsService,
              private _usersService: UsersService,
              private _dialog: MatDialog) { }

  ngOnInit(): void {
    this._postsService.getPostsLoading()
      .pipe(takeUntil(this._destroy))
      .subscribe(result => {
      this.isLoading = result;
    });

    this._postsService.getPosts(this.postsPerPage, this.currentPage);
    this._postsService.getPostUpdateListener()
      .pipe(takeUntil(this._destroy))
      .subscribe((postsData: {posts: Post[], postsCount: number}) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.postsCount;
      });

    this._usersService.getAuthState()
      .pipe(takeUntil(this._destroy))
      .subscribe(result => {
        this.isAuth = result;
      });

    this._usersService.getUsername()
      .pipe(takeUntil(this._destroy))
      .subscribe(username => {
        this.username = username;
      });
  }


  onPageChange(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this._postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    const dialogRef = this._dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(wantsToDelete => {
      if (wantsToDelete) {
        this._postsService.deletePost(postId)
        .pipe(takeUntil(this._destroy))
        .subscribe(() => {
          this._postsService.getPosts(this.postsPerPage, this.currentPage);
          this.isLoading = false;
        });
      }
    });
  }

  ngOnDestroy() {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }

}
