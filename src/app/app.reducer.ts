import * as fromPosts from './posts/store/post.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
    posts: fromPosts.State;
}

export const reducers: ActionReducerMap<State> = {
    posts: fromPosts.reducer
};

export const getPostsState = createFeatureSelector<fromPosts.State>('posts');
export const getIsLoading = createSelector(getPostsState, fromPosts.getIsLoading);

