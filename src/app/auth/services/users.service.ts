import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class UsersService {
    private token: string;
    private tokenTimer: any;
    private authStatusListener = new BehaviorSubject<boolean>(false);
    private isAuthLoading = new BehaviorSubject<boolean>(false);
    private username = new BehaviorSubject<string>(null);

    constructor(private http: HttpClient) {}

    getToken(): string {
        return this.token;
    }

    getUsername() {
        return this.username.asObservable();
    }

    getAuthState(): Observable<boolean> {
        return this.authStatusListener.asObservable();
    }

    getAuthLoading(): Observable<boolean> {
        return this.isAuthLoading.asObservable();
    }

    createUser(username: string, email: string, password: string) {
        this.isAuthLoading.next(true);

        const data: AuthData = {
            username,
            email,
            password
        };

        this.http.post('http://localhost:3000/api/users/signup', data)
            .subscribe((_) => {
                this.isAuthLoading.next(false);
            });
    }

    login(email: string, password: string) {
        this.isAuthLoading.next(true);

        const data = {
            email,
            password
        };

        this.http.post<{message: string, username: string, token: string, expiresIn: number}>
            ('http://localhost:3000/api/users/login', data)
            .subscribe(response => {
                this.isAuthLoading.next(false);
                this.token = response.token;

                if (this.token) {
                    this.tokenTimer = setTimeout(() => {
                        this.logout();
                    }, response.expiresIn * 1000);

                    this.username.next(response.username);
                    this.authStatusListener.next(true);
                }
            });
    }

    logout() {
        this.token = null;
        clearTimeout(this.tokenTimer);
        this.authStatusListener.next(false);
    }
}
