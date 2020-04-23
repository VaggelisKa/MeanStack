import { Post } from './post.model';

export class PostsService {
    private posts: Post[] = [];

    getPosts() {
        return [...this.posts];
    }

    addPost(title: string, content: string) {
        const post = {title, content};
        this.posts.push(post);
    }
}

