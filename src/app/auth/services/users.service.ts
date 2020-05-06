import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class UsersService {
    private token: string;
    private tokenTimer: any;
    private authStatusListener = new BehaviorSubject<boolean>(false);
    private isAuthLoading = new BehaviorSubject<boolean>(false);
    private username = new BehaviorSubject<string>(null);
    private _authErrorSubj = new Subject<string>();

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

    getAuthError(): Observable<string> {
        return this._authErrorSubj.asObservable();
    }

    createUser(username: string, email: string, password: string): Observable<any> {
        this.isAuthLoading.next(true);

        const data: AuthData = {
            username,
            email,
            password
        };

        return this.http.post('http://localhost:3000/api/users/signup', data)
            .pipe(tap((_) => {
                this.isAuthLoading.next(false);
            }),
            catchError(err => {
                this.isAuthLoading.next(false);
                this._authErrorSubj.next(err.error.error.message);
                return of(err);
            })
            );
    }

    login(email: string, password: string): Observable<boolean> {
        this.isAuthLoading.next(true);

        const data = {
            email,
            password
        };

        return this.http.post<{message: string, username: string, token: string, expiresIn: number}>
            ('http://localhost:3000/api/users/login', data)
            .pipe(tap(response => {
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
                }
            ),
                catchError(err => {
                    this._authErrorSubj.next(err.error.message);
                    this.isAuthLoading.next(false);
                    return of(err);
            }));
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
