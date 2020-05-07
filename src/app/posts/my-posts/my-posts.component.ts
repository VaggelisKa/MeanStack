import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../models/post.model';
import { Subject } from 'rxjs';
import { PostsService } from '../posts.service';
import { UsersService } from 'src/app/auth/services/users.service';
import { takeUntil } from 'rxjs/operators';
import { DeleteDialogComponent } from '../post-list/dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

    this._usersService.getUsername()
      .pipe(takeUntil(this._destroy))
      .subscribe(username => {
        this.username = username;
      });

    this._postsService.getPosts(null, null);
    this._postsService.getPostUpdateListener()
      .pipe(takeUntil(this._destroy))
      .subscribe((postsData: {posts: Post[], postsCount: number}) => {
        this.posts = postsData.posts.filter(posts => posts.creator === this.username);
        console.log(this.posts);
      });

    this._usersService.getAuthState()
      .pipe(takeUntil(this._destroy))
      .subscribe(result => {
        this.isAuth = result;
      });
  }


  onDelete(postId: string) {
    const dialogRef = this._dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(wantsToDelete => {
      if (wantsToDelete) {
        this._postsService.deletePost(postId)
        .pipe(takeUntil(this._destroy))
        .subscribe(() => {
          this.isLoading = false;
          this._postsService.getPosts(null, null);
        });
      }
    });
  }

  ngOnDestroy() {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }

}
