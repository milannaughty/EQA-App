import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../app.config';
import { EmailManager } from '../app.util';
@Injectable()
export class EmailService {
    option: any = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    constructor(private http: HttpClient) { }

    sendMailToAdminAfterIQARequestInitiatedByTeam(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendMailToAdminAfterIQARequestInitiatedByTeam', recievedObject);
    }

    sendMailToPanelsAfterAssigningPanelToIQARequestByAdmin(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendMailToPanelsAfterPanelsAssignedByAdmin', recievedObject);
    }

    sendMailToAdminsAfterIQARequestRejectedByPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendMailToAdminsAfterIQARequestRejectedByPanel', recievedObject);
    }

    sendMailToPOCAfterIQARequestAcceptedByPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendMailToPOCAfterIQARequestAcceptedByPanel', recievedObject);
    }

    sendMailToPOCAfterIQARequestCompletedByPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendMailToPOCAfterIQARequestCompletedByPanel', recievedObject);
    }

    sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendMailToPOCAfterIQARequestMadeUnderVerificationByPanel', recievedObject);
    }

    sendInitialMailToPanel(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendInitialMailToPanel', recievedObject);
    }

    sendInitialMailToTeam(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendInitialMailToTeam', recievedObject);
    }

    sendNewlyGeneratedPasswordToUserMailTo(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendNewlyGeneratedMailToUserForForgotPassword', recievedObject);
    }

    /**
     * This method sends email to resepective recepeints depending upon the what action has done.
     * @param action 
     * @param mailObject 
     */
    SendEmail(action: string, mailObject: object) {
        var emailAction = EmailManager.EmailAction;
        var actionURL = '';
        switch (action) {
            case emailAction.TEAM_ADDED: actionURL = '/mail/sendInitialMailToTeam'; break;

            default:
                break;
        }

        return this.http.post(appConfig.apiUrl + actionURL, mailObject)
    }

    sendMailToAdminAftersubmitingfeedback(recievedObject) {
        return this.http.post(appConfig.apiUrl + '/mail/sendMailToAdminAftersubmitingfeedback', recievedObject);
    }    

}    
