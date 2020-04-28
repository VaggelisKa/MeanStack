import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as fromRoot from '.././app.reducer';
import { Store } from '@ngrx/store';
import { startLoading, stopLoading } from './store/post.actions';

@Injectable()
export class PostsService {
    private postsUpdated = new Subject<Post[]>();
    private posts: Post[] = [];
    isLoading = new Subject<boolean>();

    constructor(private http: HttpClient,
                private router: Router,
                private store: Store<fromRoot.State>) {}

    getPosts() {
        this.store.dispatch(startLoading());
        this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
        .pipe(map(postData => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe((transformedPostData) => {
            this.posts = transformedPostData;
            this.postsUpdated.next([...this.posts]);
            this.store.dispatch(stopLoading());
        });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        this.store.dispatch(startLoading());
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {
            id,
            title,
            content
        };

        this.store.dispatch(startLoading());
        this.http.put('http://localhost:3000/api/posts/' + id, post)
        .subscribe(response => {
            console.log('postUpdated');
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
            this.store.dispatch(stopLoading());
        });
    }

    addPost(title: string, content: string) {
        this.store.dispatch(startLoading());
        const post = {id: null, title, content};

        this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
        .subscribe((responseData) => {
            console.log(responseData.message);
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
            this.store.dispatch(stopLoading());
        });
    }

    deletePost(id: string) {
        this.store.dispatch(startLoading());
        this.http.delete('http://localhost:3000/api/posts/' + id)
        .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== id);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.store.dispatch(stopLoading());
        });
    }
}

