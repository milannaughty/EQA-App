import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../app.config';
import { Requests } from '../_models/index';

@Injectable()
export class RequestService {
    option: any = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Requests[]>(appConfig.apiUrl + '/requests');
    }
 
    create(user: Requests) {
        return this.http.post(appConfig.apiUrl + '/requests/create', user);
    }

    getAssociateNewRequest(_associateId: string) {
        return this.http.get(appConfig.apiUrl + '/requests/associate/newrequests/' + _associateId);
    }
 
    delete(_id: string) {
        return this.http.delete(appConfig.apiUrl + '/requests/' + _id);
    }

    getTeamAllRequest(_userId: number) {
        return this.http.get(appConfig.apiUrl + '/requests/team/' + _userId);
    }

    getAssociateAllRequest(_associateId: string){
        return this.http.get(appConfig.apiUrl + '/requests/associate/' + _associateId);
    }
    updateRequest(reqObj: object){
        //debugger;
        return this.http.put(appConfig.apiUrl + '/requests/updateRequest' , reqObj);
    }
    sendMail(reqObj: object){
        console.log('in sendMail method of request Service'+reqObj);
        return this.http.post(appConfig.apiUrl + '/requests/sendMail', reqObj);
    }
}