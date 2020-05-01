import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../models/post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  postsPerPage = 3;
  currentPage = 1;
  posts: Post[] = [];
  postSub: Subscription;
  loadingSub: Subscription;


  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.loadingSub = this.postsService.isLoading.subscribe(result => {
      this.isLoading = result;
    });

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  onPageChange(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }

}
