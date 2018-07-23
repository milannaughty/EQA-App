import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../app.config';

@Injectable()
export class EmailService {
    option: any = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    constructor(private http: HttpClient) { }

    sendMailToAdminAfterIQARequestInitiatedByTeam(recievedObject) {
        return this.http.post(appConfig.apiUrl+'/mail/sendMailToAdminAfterIQARequestInitiatedByTeam',recievedObject);
    }

    sendMailToPanelsAfterAssigningPanelToIQARequestByAdmin(recievedObject) {
        return this.http.post(appConfig.apiUrl+'/mail/sendMailToPanelsAfterPanelsAssignedByAdmin',recievedObject);
    }
    
}    
