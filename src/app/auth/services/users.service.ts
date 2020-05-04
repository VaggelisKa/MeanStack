import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UsersService {
    private token: string;
    private authStatusListener = new BehaviorSubject<boolean>(false);
    private isAuthLoading = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {}

    getToken(): string {
        return this.token;
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

        this.http.post<{message: string, username: string, token: string}>('http://localhost:3000/api/users/login', data)
            .subscribe(response => {
                this.isAuthLoading.next(false);
                this.token = response.token;

                if (this.token) {
                    this.authStatusListener.next(true);
                }
            });
    }

    logout() {
        this.token = null;
        this.authStatusListener.next(false);
    }
}
