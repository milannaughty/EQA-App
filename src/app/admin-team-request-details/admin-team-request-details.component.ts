import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { appConfig, adminConfig } from '../app.config';
import { EmailService } from "../_services/mail.service";
import { CommonUtil, EmailManager, MessageManager } from '../app.util';

@Component({
  moduleId: module.id,
  selector: 'app-admin-team-request-details',
  templateUrl: './admin-team-request-details.component.html',
  styleUrls: ['./admin-team-request-details.component.css']
})
export class AdminTeamRequestDetailsComponent implements OnInit {

  devDropdownSettings: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  qaDropdownSettings: { singleSelection: boolean; text: string; selectAllText: string; unSelectAllText: string; enableSearchFilter: boolean; };
  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  model: any = {};
  qaSkillSetPanel: any = [];
  devSkillSetPanel: any = [];
  devSkillSet: any;
  qaSkillSet: any;
  qaPanel: any;
  devPanel: any;
  isSkillLoaded: boolean = false;
  isDevSkillMore: boolean;
  isQaSkillMore: boolean;
  verificationStatus: any;
  isUnderVerification: boolean;
  loading = false;
  enableAssignButton: any;

  constructor(private userService: UserService,
    private requestService: RequestService,
    private emailService: EmailService) { }

  ngOnInit() {
    this.ShowRequestDetails();
  }
  ShowRequestDetails() {
    this.userService.getPanelBySkills(this.currentRequestData.body.skillSet, this.currentRequestData.body.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      this.isDevSkillMore = true;
      this.isQaSkillMore = true;
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], emailID: x["username"], itemName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x["username"]) }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], emailID: x["username"], itemName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x["username"]) }));
      //Create skillsets comma sepreted list
      if (this.currentRequestData.body.skillSet) {
        this.devSkillSet = this.currentRequestData.body.skillSet.slice(0, 3).map(x => x.itemName).join(',');
        if (this.currentRequestData.body.skillSet.length <= 3)
          this.isDevSkillMore = false;
      }
      else {
        this.devSkillSet = "NA";
      }
      if (this.currentRequestData.body.qaSkillSet) {
        this.qaSkillSet = this.currentRequestData.body.qaSkillSet.map(x => x.itemName).slice(0, 3).join(',');
        if (this.currentRequestData.body.qaSkillSet.length <= 3) {
          this.isQaSkillMore = false;
        }
      }
      else {
        this.qaSkillSet = "NA";
      }

      this.devPanel = this.currentRequestData.body.assignedDevPanelList ? this.currentRequestData.body.assignedDevPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) })) : [];
      this.qaPanel = this.currentRequestData.body.assignedQAPanelList ? this.currentRequestData.body.assignedQAPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) })) : [];

      this.devDropdownSettings = {
        singleSelection: false,
        text: "Select Dev Panel",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
      };

      this.qaDropdownSettings = {
        singleSelection: true,
        text: "Select QA Panel",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
      };


      // if (this.currentRequestData.body.verificationStatus != undefined) {
      //   this.isUnderVerification = this.currentRequestData.body.status == adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus;
      //   this.verificationStatus = this.currentRequestData.body.verificationStatus;
      // }
    });
  }
  ShowRequestList() {
    this.loading = true;
    this.messageEvent.emit({ ActivateTab: this.currentRequestData.CurrentActionName });
    this.loading = false;
  }

  AssignSelectedUsers() {
    debugger;
    console.log('In assignSelectedUsers start');
    // var this.currentRequestData.body = {
    //   "_id": this.currentRequestData.body._id,
    //   "status": "PanelAssigned"
    // };


    // if (this.model.devSkillSetPanel) {
    //   if (!this.currentRequestData.assignedDevPanelList)
    //     //this.currentRequestData.body["assignedDevPanelList"] = this.model.devSkillSetPanel;
    //     this.currentRequestData.assignedDevPanelList = this.model.devSkillSetPanel.map(x => { x["status"] = adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus; return x; });
    //   else 
    //     this.currentRequestData.assignedDevPanelList = this.GetUpdateAssignedPanelList(this.currentRequestData.assignedDevPanelList, this.model.devSkillSetPanel);

    // }
    debugger;
    this.currentRequestData.body.assignedDevPanelList = this.GetUpdateAssignedPanelList(this.currentRequestData.body.assignedDevPanelList, this.model.devSkillSetPanel);
    this.currentRequestData.body.assignedQAPanelList = this.GetUpdateAssignedPanelList(this.currentRequestData.body.assignedQAPanelList, this.model.qaSkillSetPanel);
    this.currentRequestData.body.status = this.GetIQARequestStatus();
    this.currentRequestData.body.updatedBy = this.currentRequestData.currentUser.FName + ' ' + this.currentRequestData.currentUser.LName;
    this.currentRequestData.body.updatedDate = new Date();
    // if (this.model.qaSkillSetPanel)
    //   this.currentRequestData.body["assignedQAPanelList"] = this.model.qaSkillSetPanel;
    this.loading = true;
    //
    this.requestService.updateRequest(this.currentRequestData.body).subscribe(
      res => {
        debugger;
        console.log('Updated requested completed.');
        console.log('mail sending function starts here for Assigning QA and Dev to Request By admin');
        //this.currentRequestData.body;
        // var ccPersonList = (this.currentRequestData.body.initiatedBy.DAMEmail ? this.currentRequestData.body.initiatedBy.DAMEmail + ',' : '')
        //   + (this.currentRequestData.body.initiatedBy.PMEmail ? this.currentRequestData.body.initiatedBy.PMEmail + ',' : '')
        //   + (this.currentRequestData.body.initiatedBy.POCEmail ? this.currentRequestData.body.initiatedBy.POCEmail : '');
        var requestData = this.currentRequestData.body;
        // if (ccPersonList.lastIndexOf(',') == ccPersonList.length - 1) {
        //   ccPersonList = ccPersonList.substring(0, ccPersonList.length - 1);
        // }

        // var toPersonList = "";
        // toPersonList += this.currentRequestData.body.assignedDevPanelList ? this.currentRequestData.body.assignedDevPanelList.map(x => x.itemName).join(",") : '';
        // toPersonList += ",";
        // toPersonList += this.currentRequestData.body.assignedQAPanelList ? this.currentRequestData.body.assignedQAPanelList.map(x => x.itemName).join(",") : '';

        var assignedDevPanelEmails = EmailManager.GetAssignedPanelEmailIDs(requestData.assignedDevPanelList);
        var assignedQAPanelEmails = EmailManager.GetAssignedPanelEmailIDs(requestData.assignedQAPanelList);
        var allAssignedPanel = assignedDevPanelEmails.concat(assignedQAPanelEmails);
        var toPersonList = EmailManager.GetCommaSepratedEmailIDs(allAssignedPanel);
        var ccPersonList = EmailManager.GetCommaSepratedEmailIDs([requestData.initiatedBy.DAMEmail, requestData.initiatedBy.PMEmail, requestData.initiatedBy.POCEmail])
        var toPersonNames = EmailManager.GetUserNameFromCommaSepratedEmailIds(toPersonList);
        toPersonNames = CommonUtil.Capitalize(toPersonNames);
        var teamName = CommonUtil.Capitalize(requestData.initiatedBy.TeamName);
        var mailSubject = EmailManager.GetPanelAssignedSubjectLine(teamName) //this.currentRequestData.body.name;

        //var toPersonNames = "";
        // if (this.currentRequestData.body.assignedDevPanelList)
        //   toPersonNames += this.currentRequestData.body.assignedDevPanelList.map(x => x.itemName.substring(0, x.itemName.indexOf('.', 0)).charAt(0).toUpperCase() + x.itemName.substring(0, x.itemName.indexOf('.', 0)).slice(1)).join(', ');

        // toPersonNames = toPersonNames ? toPersonNames + ", " : toPersonNames;
        // if (this.currentRequestData.body.assignedQAPanelList)
        //   toPersonNames += this.currentRequestData.body.assignedQAPanelList.map(x => x.itemName.substring(0, x.itemName.indexOf('.', 0)).charAt(0).toUpperCase() + x.itemName.substring(0, x.itemName.indexOf('.', 0)).slice(1)).join(', ');


        var mailObject = {
          "fromPersonName": appConfig.fromPersonName,
          "fromPersonMailId": appConfig.fromPersonMailId,
          "toPersonName": toPersonNames,
          "toPersonMailId": toPersonList,
          "ccPersonList": ccPersonList,
          "mailSubject": mailSubject,
          "mailContent": "",
          "teamName": teamName
        };

        this.emailService.sendMailToPanelsAfterAssigningPanelToIQARequestByAdmin(mailObject)
          .subscribe(result => {
            CommonUtil.ShowSuccessAlert(MessageManager.PanelAssignedSuccess);
            this.ShowRequestList();
          }, error => {
            CommonUtil.ShowInfoAlert(MessageManager.PanelAssignedTitle, MessageManager.PanelAssignedSuccessWithErrorEmailSending);
            this.ShowRequestList();
          });
      },
      err => {
        console.log('Updated requested completed with error.');
        console.log(err)
        CommonUtil.ShowErrorAlert('Error while assigning request to panel.');
        this.ShowRequestList()
      }
    );
  }

  ShowSkillPopup(type: string) {
    var qaStr = type == 'Dev' ? this.GetCommaSepratedSkills(this.currentRequestData.body.skillSet) : this.GetCommaSepratedSkills(this.currentRequestData.body.qaSkillSet);
    var htmlContent = CommonUtil.GetTabularData(qaStr, 5, null);
    CommonUtil.ShowInfoAlert(`Required ${type} Skills`, htmlContent);
  }

  GetCommaSepratedSkills(skill) {
    return skill.map(x => x.itemName).join(',');
  }
  showUserDeatail(recievedUserData) {
    this.userService.getById(recievedUserData.id).subscribe(result => {
      console.log(JSON.stringify(result));
      debugger;
      EmailManager.userDetailInfo(result);
    }, err => {
      console.log(JSON.stringify(err));
      CommonUtil.ShowErrorAlert(err.error)
    });
    console.log(recievedUserData);
  }

  getTeamDetails(id) {
    this.userService.getById(id).subscribe(result => {
      console.log(JSON.stringify(result));
      debugger;
      EmailManager.teamDetailInfo(result);
    }, err => {
      console.log(JSON.stringify(err));
      CommonUtil.ShowErrorAlert(err.error)
    });
  }

  GetUpdateAssignedPanelList(existingAssignedPanel, newAssignedPanel) {
    //if existingAssignedPanel not exist then return newly assigned panel with status as panel assigned
    if (!(existingAssignedPanel)) {
      return newAssignedPanel ? newAssignedPanel.map(x => { x["status"] = adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus; return x; }) : [];
    }

    let newPanelList = [];
    if (newAssignedPanel && newAssignedPanel.length) {
      newPanelList = newAssignedPanel.map(function (newPanel) {
        let existingPanel = existingAssignedPanel.filter(panel => panel.id == newPanel.id)[0];
        if (existingPanel) {
          //existingPanel["status"] = adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus;
          return existingPanel;
        }
        newPanel["status"] = adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus;
        return newPanel;
      })
    }
    return newPanelList;
  }

  GetIQARequestStatus() {
    let earlierStatus = this.currentRequestData.body.status;
    let panelAssignedStatus = adminConfig.RequestStatus.PANEL_ASSIGNED.DBStatus;
    let statusList = [adminConfig.RequestStatus.IN_PROGRESS.DBStatus, adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus];
    let keepEarlierStatus = this.currentRequestData.body.assignedDevPanelList.some(x => statusList.includes(x.status)) || this.currentRequestData.body.assignedQAPanelList.some(x => statusList.includes(x.status));
    return keepEarlierStatus ? earlierStatus : panelAssignedStatus;
  }

  OnPanelDropDownChange() {
    this.enableAssignButton = (this.model.devSkillSetPanel && this.model.devSkillSetPanel.length) || (this.model.qaSkillSetPanel && this.model.qaSkillSetPanel.length);
  }
}
