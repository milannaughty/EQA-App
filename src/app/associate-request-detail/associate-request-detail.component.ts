import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { appConfig } from '../app.config';
import { EmailService } from '../_services/mail.service';
import { AlertService } from '../_services/alert.service';
import { adminConfig } from "../app.config";

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
    private emailService: EmailService,
    private alertService: AlertService) {

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
      set["rejectReason"] = this.reasonText;
      if (this.currentRequestData.currentUser.panelType == 'Dev')
        set["assignedDevPanelList"] = null;
      if (this.currentRequestData.currentUser.panelType == 'QA' || this.currentRequestData.currentUser.panelType == 'Qa')
        set["assignedQAPanelList"] = null;
    }
    else if (this.isCompleteRequestOperation) {
      var modelRdbSelectedItem = this.modelRdbSelectedItem;
      var isAnyChecklistItemOpen = modelRdbSelectedItem.some(x => x != undefined && x != null && x != 0)
      set.status = isAnyChecklistItemOpen ? adminConfig.RequestStatus.VERIFIED_BY_PANEL : adminConfig.RequestStatus.COMPLETED;
      set['CheckListDetails'] = this.requestCheckListItem.map(x => ({ _Id: x._Id, status: modelRdbSelectedItem[x._Id] || 0 }));
    }
    debugger;
    this.requestService.updateStatusOfRequest(set).subscribe(
      result => {
        this.ShowRequestList();
        debugger;
        var data = this.currentRequestData;
        if (set.status == "Rejected") {//code after rejection
          var ccPersonList = (data.initiatedBy.DAMEmail ? data.initiatedBy.DAMEmail + ',' : '')
            + (data.initiatedBy.PMEmail ? data.initiatedBy.PMEmail + ',' : '')
            + (data.initiatedBy.POCEmail ? data.initiatedBy.POCEmail : '');
          if (ccPersonList.lastIndexOf(',') == ccPersonList.length - 1) {
            ccPersonList = ccPersonList.substring(0, ccPersonList.length - 1);
          }
          var toPerssonList = "";
          this.userService.getAllUsersByRole("admin").subscribe(adminList => {
            debugger;
            if (adminList instanceof Array)
              toPerssonList = adminList.map(x => x.username).join(',');
            else
              toPerssonList = adminList["username"];
            var currentUser = sessionStorage.getItem('currentUser');
            var cUser = JSON.parse(currentUser);
            var mailSubject = "IQA Request [Sprint Name :" + data.name + "] Rejected by Panel " + cUser.username;


            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": "Admin",
              "toPersonMailId": toPerssonList,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": cUser.username,
              "rejectReason": this.reasonText
            };


            this.emailService.sendMailToAdminsAfterIQARequestRejectedByPanel(mailObject).subscribe(
              success => {
                //this.alertService.success("IQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("mail sent to admin with rejection details");
              }, err => {
                //this.alertService.success(" ErrorIQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("Error while sending mail to admin with rejection details");
              }
            );

          }, err => {
            console.log("Error while sending mail to admin with rejection details : for fetching admin details");
          });
        } else if (set.status == "InProgress") {//code after acceptance

          var ccPersonList = (data.initiatedBy.DAMEmail ? data.initiatedBy.DAMEmail + ',' : '')
            + (data.initiatedBy.PMEmail ? data.initiatedBy.PMEmail + ',' : '');
          if (ccPersonList.lastIndexOf(',') != ccPersonList.length - 1) {
            ccPersonList += ',';
          }

          var toPerssonListAcceptance = data.initiatedBy.POCEmail;
          var toPersonName = toPerssonListAcceptance.substring(0, toPerssonListAcceptance.indexOf('.', 0)).charAt(0).toUpperCase()
            + toPerssonListAcceptance.substring(0, toPerssonListAcceptance.indexOf('.', 0)).slice(1);
          this.userService.getAllUsersByRole("admin").subscribe(adminList => {
            debugger;
            if (adminList instanceof Array)
              ccPersonList += adminList.map(x => x.username).join(',');
            else
              ccPersonList += adminList["username"];
            var currentUser = sessionStorage.getItem('currentUser');
            var cUser = JSON.parse(currentUser);

            var mailSubject = "IQA Request [Sprint Name :" + data.name + "] Accepted by Panel " + cUser.FName + " " + cUser.LName;

            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": toPersonName,
              "toPersonMailId": toPerssonListAcceptance,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": cUser.username,
            };

            this.emailService.sendMailToPOCAfterIQARequestAcceptedByPanel(mailObject).subscribe(
              success => {
                //this.alertService.success("IQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("mail sent to admin with rejection details");
              }, err => {
                //this.alertService.success(" ErrorIQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("Error while sending mail to admin with rejection details");
              }
            );

          }, err => {//error while fething admin role users
            console.log("Error while sending mail to admin with rejection details : for fetching admin details");
          });
        }//acceptance block ends here
        if (set.status == "Completed") {//if panel has completed IQA request
          var ccPersonList = (data.initiatedBy.DAMEmail ? data.initiatedBy.DAMEmail + ',' : '')
            + (data.initiatedBy.PMEmail ? data.initiatedBy.PMEmail + ',' : '');
          if (ccPersonList.lastIndexOf(',') != ccPersonList.length - 1) {
            ccPersonList += ',';
          }

          var toPerssonListAcceptance = data.initiatedBy.POCEmail;
          var toPersonName = toPerssonListAcceptance.substring(0, toPerssonListAcceptance.indexOf('.', 0)).charAt(0).toUpperCase()
            + toPerssonListAcceptance.substring(0, toPerssonListAcceptance.indexOf('.', 0)).slice(1);
          this.userService.getAllUsersByRole("admin").subscribe(adminList => {
            debugger;
            if (adminList instanceof Array)
              ccPersonList += adminList.map(x => x.username).join(',');
            else
              ccPersonList += adminList["username"];
            var currentUser = sessionStorage.getItem('currentUser');
            var cUser = JSON.parse(currentUser);

            var mailSubject = "IQA Request [Sprint Name :" + data.name + "] Accepted by Panel " + cUser.FName + " " + cUser.LName;

            var mailObject = {
              "fromPersonName": appConfig.fromPersonName,
              "fromPersonMailId": appConfig.fromPersonMailId,
              "toPersonName": toPersonName,
              "toPersonMailId": toPerssonListAcceptance,
              "ccPersonList": ccPersonList,
              "mailSubject": mailSubject,
              "mailContent": "",
              "sprintName": data.name,
              "panelName": cUser.username,
            };

            this.emailService.sendMailToPOCAfterIQARequestCompletedByPanel(mailObject).subscribe(
              success => {
                //this.alertService.success("IQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("mail sent to admin with rejection details");
              }, err => {
                //this.alertService.success(" ErrorIQA Request having sprint name "+data.name+" is rejected successfully");
                console.log("Error while sending mail to admin with rejection details");
              }
            );

          }, err => {//error while fething admin role users
            console.log("Error while sending mail to admin with rejection details : for fetching admin details");
          });
        }//if panel has completed IQA request If block ends

      }, err => {
        this.alertService.error('Error while rejecting IQA Request ', true);
      });
  }

  PopulateStatusDropdown() {
    if (this.currentRequestData.status == 'PanelAssigned') {
      this.statusList.push({ "Id": "InProgress", "Name": "Accept" })
    }
    else if (this.currentRequestData.status == 'InProgress' || adminConfig.RequestStatus.VERIFIED_BY_PANEL) {
      this.statusList.push({ "Id": "Completed", "Name": "Complete" })
    }
    this.statusList.push({ "Id": "Rejected", "Name": "Rejected" })
    this.model.selectedStatus = this.statusList[0].Name;
  }

  PopulateCheckList() {
    //TODO:: Fetch data from database
    this.requestCheckListItem = [
      { _Id: 1, CheckListItem: 'Commenting & Documentatio', Description: 'Code needs to be properly documented and only keep the necessary commented code.' },
      { _Id: 2, CheckListItem: 'Consistent indentation', Description: 'Use tools like sonar qube for code review.' },
      { _Id: 3, CheckListItem: 'Consistent naming scheme', Description: 'Follow the consistent naming standards all over application.' },
      { _Id: 4, CheckListItem: 'Code reusability', Description: 'Code duplication should be avoided wherever possible. Try to reuse the existing code.' },
      { _Id: 5, CheckListItem: 'Limit the length of functions', Description: 'Don’t put too much code into single function. Try to make multiple functions as per logical grouping of code.' },
      { _Id: 6, CheckListItem: 'File and folder organisation', Description: 'Files and folders should be organised properly in application.' },
      { _Id: 7, CheckListItem: 'File and folder organisation', Description: 'Files and folders should be organised properly in application.' }]
  }

}
