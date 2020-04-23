import { Post } from './post.model';
import { Subject } from 'rxjs';

export class PostsService {
    private postsUpdated = new Subject<Post[]>();
    private posts: Post[] = [];

    getPosts() {
        return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post = {title, content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}

