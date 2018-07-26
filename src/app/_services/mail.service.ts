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

    sendMailToAdminsAfterIQARequestRejectedByPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl+'/mail/sendMailToAdminsAfterIQARequestRejectedByPanel',recievedObject);
    }

    sendMailToPOCAfterIQARequestAcceptedByPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl+'/mail/sendMailToPOCAfterIQARequestAcceptedByPanel',recievedObject);
    } 
    
    sendMailToPOCAfterIQARequestCompletedByPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl+'/mail/sendMailToPOCAfterIQARequestCompletedByPanel',recievedObject);
    }

    sendInitialMailToPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl+'/mail/sendInitialMailToPanel',recievedObject);
    }     

    sendInitialMailToTeam(recievedObject) {
        return this.http.post(appConfig.apiUrl+'/mail/sendInitialMailToTeam',recievedObject);
    } 

}    
