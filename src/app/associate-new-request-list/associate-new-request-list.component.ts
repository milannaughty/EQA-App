import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RequestService, UserService, EmailService } from '../_services/index';
import { appConfig, adminConfig } from '../app.config';
import { CommonUtil, EmailManager, MessageManager } from '../app.util';
import { debug } from 'util';

@Component({
  selector: 'associate-new-request-list',
  templateUrl: './associate-new-request-list.component.html',
  styleUrls: ['./associate-new-request-list.component.css']
})
export class AssociateNewRequestListComponent implements OnInit {

  NewRequest: any;
  loading: boolean;
  isDevPanel: boolean;
  panelList: any;
  currentPanelData: any;
  assignedDevPanelListString: string = 'assignedDevPanelList';
  assignedQAPanelListString: string = 'assignedQAPanelList';

  @Input() currentUser: any;
  @Output() messageEvent = new EventEmitter<any>();
  newRequestResponse: any;

  constructor(private requestService: RequestService, private userService: UserService, private emailService: EmailService) { }

  ngOnInit() {
    this.LoadNewRequestForAssociate();
  }

  OnAccept(currentRequestData: any) {

    this.currentPanelData = this.LoadCurrentPanelData(currentRequestData);
    this.currentPanelData.lastActivity = new Date().toDateString();
    this.currentPanelData.status = adminConfig.RequestStatus.IN_PROGRESS.DBStatus;
    //let isAllPanelAcceptedRequest = this.CheckAllPanelRequestStatus(currentRequestData, adminConfig.RequestStatus.IN_PROGRESS.DBStatus);
    //currentRequestData.status = isAllPanelAcceptedRequest ? adminConfig.RequestStatus.IN_PROGRESS.DBStatus : currentRequestData.status;
    currentRequestData.status = CommonUtil.GetRequestStatus(currentRequestData.assignedDevPanelList, currentRequestData.assignedQAPanelList);
    this.RemoveUnwantedProperties(currentRequestData);
    CommonUtil.ShowLoading();
    this.requestService.updateStatusOfRequest(currentRequestData).subscribe(
      result => {
        //this.loading = true;
        var toPerssonList = currentRequestData.initiatedBy.POCEmail;
        var toPersonName = EmailManager.GetUserNameFromCommaSepratedEmailIds(toPerssonList);
        var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([currentRequestData.initiatedBy.DAMEmail, currentRequestData.initiatedBy.PMEmail]);
        ccPersonList += CommonUtil.GetAdminContactDetails().emailIDs;

        var mailSubject = EmailManager.GetRequestAcceptSubjectLine(currentRequestData.name, this.currentUser.FName + " " + this.currentUser.LName);
        var mailObject = {
          "fromPersonName": appConfig.fromPersonName,
          "fromPersonMailId": appConfig.fromPersonMailId,
          "toPersonName": toPersonName,
          "toPersonMailId": toPerssonList,
          "ccPersonList": ccPersonList,
          "mailSubject": mailSubject,
          "mailContent": "",
          "sprintName": currentRequestData.name,
          "panelName": this.currentUser.username,
        };

        this.emailService.sendMailToPOCAfterIQARequestAcceptedByPanel(mailObject).subscribe(
          success => {
            console.log("mail sent to admin with rejection details");
            CommonUtil.ShowSuccessAlert(MessageManager.RequestUpdateSuccess);
            this.LoadNewRequestForAssociate();
            this.ShowRequestDetails(null, null, true);
          }, err => {
            CommonUtil.ShowErrorAlert(MessageManager.RequestUpdateSuccessWithErrorEmailSending);
            this.LoadNewRequestForAssociate();
          }
        );



        /** sending mail ends */
      }, err => {
        console.log("Error while accepting IQA request ");
        CommonUtil.ShowErrorAlert(MessageManager.RequestAcceptError);
        this.LoadNewRequestForAssociate();
      });
  }

  private ShowRequestDetails(currentRequestData, showRemarkBox, updateRequestCount) {
    //console.log(currentRequestData);
    console.log('Redirecting from request list to request detail view');
    this.messageEvent.emit({ ActivateTab: 'Request Detail', data: currentRequestData, updateRequestCount });
  }

  private LoadNewRequestForAssociate() {
    this.loading = true;
    this.isDevPanel = this.currentUser.panelType == 'Dev';
    this.panelList = this.isDevPanel ? this.assignedDevPanelListString : this.assignedQAPanelListString;

    this.requestService.getAssociateNewRequest(this.currentUser._id).subscribe(result => {
      this.loading = false;
      this.NewRequest = result;
      this.NewRequest = this.NewRequest.map(requestData => { this.GetCurrPanelReviewStatusForRequest(requestData); return requestData; });
    });
  }

  private LoadCurrentPanelData(currentRequestData) {
    return currentRequestData[this.panelList].filter(x => x.id == this.currentUser._id)[0];
  }

  private GetCurrPanelReviewStatusForRequest(requestData) {
    let panelData = this.LoadCurrentPanelData(requestData);
    requestData.CurrPanelReviewStatusForRequest = panelData.status;
  }

  CheckAllPanelRequestStatus(currentRequestData, inputStatus) {
    return currentRequestData.assignedDevPanelList.some(panel => panel.status == inputStatus) && currentRequestData.assignedQAPanelList.some(panel => panel.status == inputStatus);
  }

  RemoveUnwantedProperties(currentRequestData) {
    //CurrPanelReviewStatusForRequest
    delete currentRequestData.CurrPanelReviewStatusForRequest;
  }

}
