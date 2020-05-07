import { Post } from './models/post.model';
import { Subject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {
    private postsUpdated = new Subject<{posts: Post[], postsCount: number}>();
    private posts: Post[] = [];
    private postsAreLoading = new Subject<boolean>();

    constructor(private http: HttpClient,
                private router: Router) {}

    getPostsLoading(): Observable<boolean> {
        return this.postsAreLoading.asObservable();
    }

    getPostUpdateListener(): Observable<{posts: Post[], postsCount: number}> {
        return this.postsUpdated.asObservable();
    }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

        this.postsAreLoading.next(true);
        this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
        .pipe(map(postData => {
            return {posts: postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                };
            }), maxPosts: postData.maxPosts};
        }))
        .subscribe(transformedPostData => {
            console.log(transformedPostData);
            this.posts = transformedPostData.posts;
            this.postsUpdated.next({
                posts: [...this.posts],
                postsCount: transformedPostData.maxPosts,
            });
            this.postsAreLoading.next(false);
        });
    }


    getPost(id: string) {
        this.postsAreLoading.next(true);
        return this.http.get<{
            _id: string,
            title: string,
            content: string,
            imagePath: string,
            creator: string
        }>('http://localhost:3000/api/posts/' + id);
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
                imagePath: image,
                creator: null
            };
        }

        this.postsAreLoading.next(true);
        this.http.put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe(() => {
            this.router.navigate(['/']);
            this.postsAreLoading.next(false);
        });
    }

    addPost(title: string, content: string, image: File) {
        this.postsAreLoading.next(true);
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
        .subscribe(() => {
            this.router.navigate(['/']);
            this.postsAreLoading.next(false);
        });
    }

    deletePost(id: string): Observable<any> {
        this.postsAreLoading.next(true);
        return this.http.delete('http://localhost:3000/api/posts/' + id);
    }
}

