import { Post } from './models/post.model';
import { Subject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {
    private _postsUpdated = new Subject<{posts: Post[], postsCount: number}>();
    private _postsAreLoading = new Subject<boolean>();
    private posts: Post[] = [];

    constructor(private _http: HttpClient,
                private _router: Router) {}

    getPostsLoading(): Observable<boolean> {
        return this._postsAreLoading.asObservable();
    }

    getPostUpdateListener(): Observable<{posts: Post[], postsCount: number}> {
        return this._postsUpdated.asObservable();
    }

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

        this._postsAreLoading.next(true);
        this._http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
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
            this._postsUpdated.next({
                posts: [...this.posts],
                postsCount: transformedPostData.maxPosts,
            });
            this._postsAreLoading.next(false);
        });
    }


    getPost(id: string) {
        this._postsAreLoading.next(true);
        return this._http.get<{
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

        this._postsAreLoading.next(true);
        this._http.put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe(() => {
            this._router.navigate(['/']);
            this._postsAreLoading.next(false);
        });
    }

    addPost(title: string, content: string, image: File) {
        this._postsAreLoading.next(true);
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this._http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
        .subscribe(() => {
            this._router.navigate(['/']);
            this._postsAreLoading.next(false);
        });
    }

    deletePost(id: string): Observable<any> {
        this._postsAreLoading.next(true);
        return this._http.delete('http://localhost:3000/api/posts/' + id);
    }
}

