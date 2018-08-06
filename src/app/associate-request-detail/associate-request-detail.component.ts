import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { appConfig } from '../app.config';
import { EmailService } from '../_services/mail.service';
import { adminConfig } from "../app.config";
import { CommonUtil, EmailManager } from '../app.util';

@Component({
  selector: 'app-associate-request-detail',
  templateUrl: './associate-request-detail.component.html',
  styleUrls: ['./associate-request-detail.component.css']
})
export class AssociateRequestDetailComponent implements OnInit {
  isCompleteRequestOperation: boolean;
  isRejectRequestOperation: boolean;
  requestCheckListItem: { _Id: number; CheckListItem: string; Description: string; }[];
  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  model: any = {};
  modelRdbSelectedItem = []
  qaSkillSetPanel: any;
  devSkillSetPanel: any;
  isSkillLoaded: boolean = false;
  reasonText: string = '';
  statusList: any = [];
  ddlId: number;
  showCheckList: boolean;

  constructor(private userService: UserService,
    private requestService: RequestService,
    private emailService: EmailService) {

  }

  ngOnInit() {

    this.ShowRequestDetails();
    this.PopulateStatusDropdown();
    this.PopulateCheckList();
    // this.reasonText = `${this.currentRequestData.currentUser.FName} ${this.currentRequestData.currentUser.LName} has rejected IQA request on ${Date.now() }`
  }

  onStatusChange(event) {
    this.isRejectRequestOperation = this.model.selectedStatus == "Rejected";
    this.isCompleteRequestOperation = this.model.selectedStatus == "Completed";
    this.currentRequestData.showRemark = this.isRejectRequestOperation;
    this.currentRequestData.showSaveButton = this.isCompleteRequestOperation || this.isRejectRequestOperation || this.model.selectedStatus == "InProgress";;
    this.showCheckList = this.isCompleteRequestOperation;
  }

  ShowRequestDetails() {
    console.log('In Request Detail Method')
    // this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
    //   this.isSkillLoaded = true
    //   var r = result as Object[];
    //   this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
    //   this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));

    // });

  }

  ShowRequestList() {
    this.messageEvent.emit({ ActivateTab: this.currentRequestData.prevActiveTab || 'HOME' });
  }

  OnCancelClick() {
    this.showCheckList = false;
    this.model.selectedStatus = '';
    this.onStatusChange(null);
  }

  OnSaveClick() {
    debugger;
    var set = {
      "status": this.model.selectedStatus,
      "requestId": this.currentRequestData._id
    };

    if (this.isRejectRequestOperation) {
      debugger;
      set["rejectReason"] = this.reasonText;
      if (this.currentRequestData.currentUser.panelType == 'Dev')
        set["assignedDevPanelList"] = null;
      if (this.currentRequestData.currentUser.panelType == 'QA' || this.currentRequestData.currentUser.panelType == 'Qa')
        set["assignedQAPanelList"] = null;
    }
    else if (this.isCompleteRequestOperation) {
      var modelRdbSelectedItem = this.modelRdbSelectedItem;
      var isAnyChecklistItemOpen = modelRdbSelectedItem.some(x => x != undefined && x != null && x != 0)
      set.status = isAnyChecklistItemOpen ? adminConfig.RequestStatus.UNDER_VERIFICATION : adminConfig.RequestStatus.COMPLETED;
      set['CheckListDetails'] = this.requestCheckListItem.map(x => ({ _Id: x._Id, status: modelRdbSelectedItem[x._Id] || 0 }));
      //set['DevReviewComment'] = this.model.DevReviewComment;
      //set['QAReviewComment'] = this.model.QAReviewComment;

      var isDevPanel = this.currentRequestData.currentUser.panelType == 'Dev';
      var qaReviewStatus = this.currentRequestData.verificationStatus && this.currentRequestData.verificationStatus.QAReviewStatus;
      var devReviewStatus = this.currentRequestData.verificationStatus && this.currentRequestData.verificationStatus.DevReviewStatus;
      var teamReviewStatus = this.currentRequestData.verificationStatus && this.currentRequestData.verificationStatus.TeamReviewStatus;
      var teamReplyReviewComment = this.currentRequestData.verificationStatus && this.currentRequestData.verificationStatus.TeamReplyReviewComment;
      var qaReviewComment = this.model.QAReviewComment;
      var devReviewComment = this.model.DevReviewComment

      if (isDevPanel)
        devReviewStatus = adminConfig.RequestStatus.VERIFIED_BY_DEV_PANEL
      else
        qaReviewStatus = adminConfig.RequestStatus.VERIFIED_BY_QA_PANEL

      set["verificationStatus"] = { //MUST PASS FOLLOWING PROPERTIES UNDER verificationStatus Attr.
        QAReviewStatus: qaReviewStatus,
        DevReviewStatus: devReviewStatus,
        QAReviewComment: qaReviewComment,
        DevReviewComment: devReviewComment,
        TeamReviewStatus: teamReviewStatus,
        TeamReplyReviewComment: teamReplyReviewComment
      }
    }
    debugger;
    this.requestService.updateStatusOfRequest(set).subscribe(
      result => {
        var data = this.currentRequestData;
        debugger;
        if (this.isRejectRequestOperation) {//code after rejection
          var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([data.initiatedBy.DAMEmail, data.initiatedBy.PMEmail, data.initiatedBy.POCEmail])
          var toPerssonList = "";
          this.userService.getAllUsersByRole("admin").subscribe(adminList => {
            if (adminList instanceof Array)
              toPerssonList = EmailManager.GetCommaSepratedEmailIDs(adminList.map(x => x.username)); //Pass list of admin user name's i.e email id's
            else
              toPerssonList = adminList["username"];

            var mailSubject = EmailManager.GetRejectRequestSubjectLine(data.name, this.currentRequestData.currentUser.username);
            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": "Admin",
              "toPersonMailId": toPerssonList,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": this.currentRequestData.currentUser.username,
              "rejectReason": this.reasonText
            };

            console.log('Mail Object: Request Rejected');
            console.log(mailObject)
            this.emailService.sendMailToAdminsAfterIQARequestRejectedByPanel(mailObject).subscribe(
              success => {
                CommonUtil.ShowInfoAlert("Request Rejected", "Mail sent to admin with rejection details");
                this.ShowRequestList();
              }, err => {
                CommonUtil.ShowSuccessAlert("Request Rejected successfully. Error while sending mail to admin with rejection details");
                this.ShowRequestList();
              }
            );

          }, err => {
            CommonUtil.ShowSuccessAlert("Request Rejected successfully. Error while sending mail to admin with rejection details : for fetching admin details");
            this.ShowRequestList();
          });
        }
        else if (set.status == "InProgress") {//code after acceptance

          var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([data.initiatedBy.DAMEmail, data.initiatedBy.PMEmail])
          var toPerssonListAcceptance = data.initiatedBy.POCEmail;
          var toPersonName = EmailManager.GetUserNameFromCommaSepratedEmailIds(toPerssonListAcceptance);

          this.userService.getAllUsersByRole("admin").subscribe(adminList => {
            if (adminList instanceof Array)
              ccPersonList += ',' + EmailManager.GetCommaSepratedEmailIDs(adminList.map(x => x.username));
            else
              ccPersonList += ',' + adminList["username"];

            var mailSubject = EmailManager.GetRequestAcceptSubjectLine(data.name, this.currentRequestData.currentUser.FName + " " + this.currentRequestData.currentUser.LName);
            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": toPersonName,
              "toPersonMailId": toPerssonListAcceptance,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": this.currentRequestData.currentUser.username,
            };
            console.log('Mail Object: Request Accpeted');
            console.log(mailObject)
            this.emailService.sendMailToPOCAfterIQARequestAcceptedByPanel(mailObject).subscribe(
              success => {
                CommonUtil.ShowInfoAlert("Request Accepted","IQA Request for sprint name " + data.name + " is accepted");
                this.ShowRequestList();
              }, err => {
                CommonUtil.ShowSuccessAlert("Request Accepted successfully. Error while sending mail.");
                this.ShowRequestList();
              }
            );

          }, err => {//error while fething admin role users
            CommonUtil.ShowSuccessAlert("Request Accepted successfully, Error while sending mail to admin with rejection details : for fetching admin details");
            this.ShowRequestList();
          });
        }//acceptance block ends here
        if (set.status == "Completed") {//if panel has completed IQA request
          var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([data.initiatedBy.DAMEmail, data.initiatedBy.PMEmail]);
          var toPerssonListAcceptance = data.initiatedBy.POCEmail;
          var toPersonName = toPerssonListAcceptance.substring(0, toPerssonListAcceptance.indexOf('.', 0)).charAt(0).toUpperCase() + toPerssonListAcceptance.substring(0, toPerssonListAcceptance.indexOf('.', 0)).slice(1);
          this.userService.getAllUsersByRole("admin").subscribe(adminList => {

            if (adminList instanceof Array)
              ccPersonList += ',' + adminList.map(x => x.username).join(',');
            else
              ccPersonList += ',' + adminList["username"];

            var mailSubject = EmailManager.GetIQACompletedSubjectLine(data.name, this.currentRequestData.currentUser.FName + " " + this.currentRequestData.currentUser.LName);

            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": toPersonName,
              "toPersonMailId": toPerssonListAcceptance,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": this.currentRequestData.currentUser.username,
            };
            console.log('Mail Object: Request Completed');
            console.log(mailObject)
            this.emailService.sendMailToPOCAfterIQARequestCompletedByPanel(mailObject).subscribe(
              success => {
                CommonUtil.ShowSuccessAlert("IQA Request completed for sprint name " + data.name);
                this.ShowRequestList();
              }, err => {
                CommonUtil.ShowSuccessAlert("IQA Request Completed successfully. Email not send to respective team and administration");
                this.ShowRequestList();
              }
            );

          }, err => {//error while fething admin role users
            CommonUtil.ShowSuccessAlert("IQA Request Completed successfully. Error while fetching admin details");
            this.ShowRequestList();
          });
        }//if panel has completed IQA request If block ends

      }, err => {
        CommonUtil.ShowErrorAlert('Error while rejecting IQA Request ');
        this.ShowRequestList();
      });
  }

  PopulateStatusDropdown() {
    if (this.currentRequestData.status == 'PanelAssigned') {
      this.statusList.push({ "Id": "InProgress", "Name": "Accept" })
    }
    else if (this.currentRequestData.status == 'InProgress' || adminConfig.RequestStatus.UNDER_VERIFICATION) {
      this.statusList.push({ "Id": "Completed", "Name": "Complete" })
    }
    this.statusList.push({ "Id": "Rejected", "Name": "Rejected" })
    this.model.selectedStatus = this.statusList[0].Name;
  }

  PopulateCheckList() {
    //TODO:: Fetch data from database
    this.requestCheckListItem = CommonUtil.CheckListDetails;
    //debugger;
    //this.currentRequestData.CheckListDetails.map(x => { this.modelRdbSelectedItem[x._Id] = x.status == 1 })

  }

}
