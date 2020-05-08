import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { DeleteDialogComponent } from './post-list/dialog/delete-dialog.component';

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
        MyPostsComponent,
        DeleteDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
    ]
})
export class PostsModule {}
