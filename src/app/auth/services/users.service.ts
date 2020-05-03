import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UsersService {
    private token: string;
    private authStatusListener = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {}

    getToken(): string {
        return this.token;
    }

    getAuthState() {
        return this.authStatusListener.asObservable();
    }

    createUser(username: string, email: string, password: string) {
        const data: AuthData = {
            username,
            email,
            password
        };

        this.http.post('http://localhost:3000/api/users/signup', data)
            .subscribe(result => {
                console.log(result);
            });
    }

    login(email: string, password: string) {
        const data = {
            email,
            password
        };

        this.http.post<{message: string, username: string, token: string}>('http://localhost:3000/api/users/login', data)
            .subscribe(response => {
                console.log(response);
                this.token = response.token;
                this._authStatusListener.next(true);
            });
    }
}
