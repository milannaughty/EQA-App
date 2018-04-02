import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { appConfig } from '../app.config';
import { User } from '../_models/index';

@Injectable()
export class UserService {
    option: any = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>('/api/users');
    }

    getById(_id: number) {
        return this.http.get('/api/users/' + _id);
    }

    create(user: User) {

        return this.http.post('/api/users', user);
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user);
    }

    delete(_id: number) {
        return this.http.delete('/api/users/' + _id);
    }
}