import { Post } from './models/post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {
    private postsUpdated = new Subject<Post[]>();
    private posts: Post[] = [];
    isLoading = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        this.isLoading.next(true);
        this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
        .pipe(map(postData => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                };
            });
        }))
        .subscribe((transformedPostData) => {
            this.posts = transformedPostData;
            this.postsUpdated.next([...this.posts]);
            this.isLoading.next(false);
        });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        this.isLoading.next(true);
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
    }

    updatePost(id: string, title: string, content: string, imagePath: null) {
        const post: Post = {
            id,
            title,
            content,
            imagePath
        };

        this.isLoading.next(true);
        this.http.put('http://localhost:3000/api/posts/' + id, post)
        .subscribe(response => {
            console.log('postUpdated');
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
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
        .subscribe((responseData) => {
            const post: Post = {
                id: responseData.post.id,
                title,
                content,
                imagePath: responseData.post.imagePath
            };
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/']);
            this.isLoading.next(false);
        });
    }

    deletePost(id: string) {
        this.isLoading.next(true);
        this.http.delete('http://localhost:3000/api/posts/' + id)
        .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== id);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.isLoading.next(false);
        });
    }
}

