import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { BehaviorSubject, Observable } from 'rxjs';

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

    getUsername(): Observable<string> {
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

                this.setTokenTimer(response.expiresIn);

                if (this.token) {
                    this.username.next(response.username);
                    this.authStatusListener.next(true);

                    const currentDate = new Date();
                    this.saveAuthData(
                        response.username,
                        this.token,
                        new Date(currentDate.getTime() + response.expiresIn * 1000)
                        );
                }
            });
    }

    autoAuthUser() {
        const currentDate = new Date();
        if (!this.getAuthData()) {
            return;
        }
        const expiresIn = this.getAuthData().expirationDate.getTime() - currentDate.getTime();
        if (expiresIn > 0) {
            this.token = this.getAuthData().token;
            this.setTokenTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
            this.username.next(this.getAuthData().username);
        }
    }

    logout() {
        this.token = null;
        clearTimeout(this.tokenTimer);
        this.authStatusListener.next(false);
        this.clearAuthData();
    }

    private saveAuthData(username: string, token: string, expirationDate: Date) {
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private setTokenTimer(duration: number) {
        console.log('setting timer: ' + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private clearAuthData() {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData(): {username: string, token: string, expirationDate: Date} {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }

        return {
            username,
            token,
            expirationDate: new Date(expirationDate)
        };
    }
}
