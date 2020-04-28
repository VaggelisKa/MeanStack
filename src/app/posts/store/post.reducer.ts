import * as PostActions from './post.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface State {
    isLoading: boolean;
}

export const initialState: State = {
    isLoading: false
};

const postReducer = createReducer(
    initialState,
    on(PostActions.startLoading, state => ({
        ...state,
        isLoading: true
    })),

    on(PostActions.stopLoading, state => ({
        ...state,
        isLoading: false
    }))
);

export function reducer(state: State, action: Action) {
    return postReducer(state, action);
}

export const getIsLoading = (state: State) => state.isLoading;
