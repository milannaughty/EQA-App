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
        console.log("GetAssociateNewRequest"+_associateId);
        return this.http.get(appConfig.apiUrl +'/users/associatenewrequest/' + _associateId);
    }

    GetAssociateAllRequest(_associateId: number) {
        console.log("GetAssociateAllRequest"+_associateId);
        return this.http.get(appConfig.apiUrl +'/users/associateallrequest/' + _associateId);
    }
    getPanelBySkills(devSkillSet: any, qaSkillSet: any) {
        var skills = { devSkillSet: devSkillSet, qaSkillSet: qaSkillSet }
        return this.http.post(appConfig.apiUrl + '/users/getPanelBySkills/', skills);
    }
    getAllUsersByRole(roleName: string) {
        console.log("in getAllUsersByRole source role name is "+roleName);
        return this.http.get<User[]>(appConfig.apiUrl +'/users/getUsersByRole?roleName=' + roleName);
    }

}