import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../app/material.module';
import { PostsModule } from './posts/posts.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header/header.component';
import { FormsModule } from '@angular/forms';
import { PostsService } from './posts/posts.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { UsersService } from './auth/services/users.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { SnackbarService } from './shared/snackbar.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    PostsModule
  ],
  providers: [
    PostsService,
    UsersService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    SnackbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
