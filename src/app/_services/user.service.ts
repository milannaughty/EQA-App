import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../app.config';
import { User } from '../_models/index';

@Injectable()
export class UserService {
    option: any = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(appConfig.apiUrl + '/users');
    }

    getById(_id: number) {
        return this.http.get(appConfig.apiUrl + '/users/' + _id);
    }

    create(user: User) {

        return this.http.post(appConfig.apiUrl + '/users/register', user);
    }

    update(user: User) {
        return this.http.put(appConfig.apiUrl + '/users/' + user.id, user);
    }

    delete(_id: number) {
        return this.http.delete(appConfig.apiUrl + '/users/' + _id);
    }

    GetAssociateNewRequest(_associateId: number) {
        return this.http.get('/api/users/associatenewrequest/' + _associateId);
    }

    GetAssociateAllRequest(_associateId: number) {
        return this.http.get('/api/users/associateallrequest/' + _associateId);
    }
    getPanelBySkills(devSkillSet: any, qaSkillSet: any) {
        debugger;
        var skills = { devSkillSet: devSkillSet, qaSkillSet: qaSkillSet }
        return this.http.post(appConfig.apiUrl + '/users/getPanelBySkills/', skills);
    }

}