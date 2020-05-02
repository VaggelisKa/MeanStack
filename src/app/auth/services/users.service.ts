import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';

@Injectable()
export class UsersService {

    constructor(private http: HttpClient) {}

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
}
