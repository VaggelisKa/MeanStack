import { Post } from './models/post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {
    private postsUpdated = new Subject<{posts: Post[], postsCount: number}>();
    private posts: Post[] = [];
    isLoading = new Subject<boolean>();

    constructor(private http: HttpClient,
                private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

        this.isLoading.next(true);
        this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
        .pipe(map(postData => {
            return {posts: postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                };
            }), maxPosts: postData.maxPosts};
        }))
        .subscribe((transformedPostData) => {
            this.posts = transformedPostData.posts;
            this.postsUpdated.next({
                posts: [...this.posts],
                postsCount: transformedPostData.maxPosts
            });
            this.isLoading.next(false);
        });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        this.isLoading.next(true);
        return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        // if image is string sending JSON
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        }
        else {
            postData = {
                id,
                title,
                content,
                imagePath: image
            };
        }

        this.isLoading.next(true);
        this.http.put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe(() => {
            this.router.navigate(['/']);
            this.isLoading.next(false);
        });
    }

    addPost(title: string, content: string, image: File) {
        this.isLoading.next(true);
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
        .subscribe(() => {
            this.router.navigate(['/']);
            this.isLoading.next(false);
        });
    }

    deletePost(id: string) {
        this.isLoading.next(true);
        return this.http.delete('http://localhost:3000/api/posts/' + id);
    }
}

