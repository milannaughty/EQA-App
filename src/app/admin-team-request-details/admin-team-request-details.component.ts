import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { appConfig, adminConfig } from '../app.config';
import { EmailService } from "../_services/mail.service";
import { CommonUtil, EmailManager } from '../app.util';

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
  qaSkillSetPanel: any;
  devSkillSetPanel: any;
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

  constructor(private userService: UserService,
    private requestService: RequestService,
    private emailService: EmailService) { }

  ngOnInit() {
    this.ShowRequestDetails();
  }
  ShowRequestDetails() {
    console.log(this.isSkillLoaded)
    debugger;
    this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      this.isDevSkillMore = true;
      this.isQaSkillMore = true;
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));
      debugger;
      if (this.currentRequestData.skillSet) {
        var devstr = this.currentRequestData.skillSet.map(x => x.itemName).join(',');
        var arr = devstr.split(',');
        var count = arr.length;
        if (count <= 3) {
          this.isDevSkillMore = false;
        }
        this.devSkillSet = devstr.substring(0, CommonUtil.getNthIndexOfString(devstr, ',', 3));
      } else {
        this.devSkillSet = "NA";
      }
      if (this.currentRequestData.qaSkillSet) {
        var qaStr = this.currentRequestData.qaSkillSet.map(x => x.itemName).join(',');
        var arr = qaStr.split(',');
        var count = arr.length;
        if (count <= 3) {
          this.isQaSkillMore = false;
        }
        this.qaSkillSet = qaStr.substring(0, CommonUtil.getNthIndexOfString(qaStr, ',', 3));
      } else {
        this.qaSkillSet = "NA";
      }

      if (this.currentRequestData.assignedDevPanelList) {
        this.devPanel = this.currentRequestData.assignedDevPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) }));
      } else {
        this.devPanel = [];
      }
      if (this.currentRequestData.assignedQAPanelList) {
        this.qaPanel = this.currentRequestData.assignedQAPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) }));
      } else {
        this.qaPanel = [];
      }
      this.devDropdownSettings = {
        singleSelection: true,
        text: "Select Panel",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
      };

      this.qaDropdownSettings = {
        singleSelection: true,
        text: "Select Panel",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
      };
      if (this.currentRequestData.verificationStatus != undefined) {
        this.isUnderVerification = this.currentRequestData.status == adminConfig.RequestStatus.UNDER_VERIFICATION.DBStatus;
        this.verificationStatus = this.currentRequestData.verificationStatus;
      }
    });
  }
  ShowRequestList() {
    this.loading = true;
    this.messageEvent.emit({ ActivateTab: this.currentRequestData.CurrentActionName });
    this.loading = false;
  }

  assignSelectedUsers() {
    debugger;
    console.log('In assignSelectedUsers start');
    var requestDto = {
      "_id": this.currentRequestData._id,
      "status": "PanelAssigned"
    };

    if (this.model.devSkillSetPanel)
      requestDto["assignedDevPanelList"] = this.model.devSkillSetPanel;
    if (this.model.qaSkillSetPanel)
      requestDto["assignedQAPanelList"] = this.model.qaSkillSetPanel;
    this.loading = true;
    this.requestService.updateRequest(requestDto).subscribe(
      res => {

        console.log('Updated requested completed.');
        console.log('mail sending function starts here for Assigning QA and Dev to Request By admin');
        this.currentRequestData;
        var ccPersonList = (this.currentRequestData.initiatedBy.DAMEmail ? this.currentRequestData.initiatedBy.DAMEmail + ',' : '')
          + (this.currentRequestData.initiatedBy.PMEmail ? this.currentRequestData.initiatedBy.PMEmail + ',' : '')
          + (this.currentRequestData.initiatedBy.POCEmail ? this.currentRequestData.initiatedBy.POCEmail : '');
        if (ccPersonList.lastIndexOf(',') == ccPersonList.length - 1) {
          ccPersonList = ccPersonList.substring(0, ccPersonList.length - 1);
        }
        var toPersonList = "";
        toPersonList += requestDto["assignedDevPanelList"] ? requestDto["assignedDevPanelList"].map(x => x.itemName).join(",") : '';
        toPersonList += ",";
        toPersonList += requestDto["assignedQAPanelList"] ? requestDto["assignedQAPanelList"].map(x => x.itemName).join(",") : '';

        var toPersonNames = "";
        if (requestDto["assignedDevPanelList"])
          toPersonNames += requestDto["assignedDevPanelList"].map(x => x.itemName.substring(0, x.itemName.indexOf('.', 0)).charAt(0).toUpperCase() + x.itemName.substring(0, x.itemName.indexOf('.', 0)).slice(1)).join(', ');

        toPersonNames = toPersonNames ? toPersonNames + ", " : toPersonNames;
        if (requestDto["assignedQAPanelList"])
          toPersonNames += requestDto["assignedQAPanelList"].map(x => x.itemName.substring(0, x.itemName.indexOf('.', 0)).charAt(0).toUpperCase() + x.itemName.substring(0, x.itemName.indexOf('.', 0)).slice(1)).join(', ');

        var teamName = this.currentRequestData.initiatedBy.TeamName;

        var mailSubject = "Panels are assigned for IQA Request Sprint " + this.currentRequestData.name;
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
            CommonUtil.ShowSuccessAlert('Request successfully assigned to Selected panels and Mail sent to selected panel list');
            this.ShowRequestList();
          }, error => {
            CommonUtil.ShowInfoAlert('Panel Assigned', 'Request successfully assigned to Selected panels and Error while sending Mail to selected panel list');
            this.ShowRequestList();
          });
        this.loading = false;
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
    var qaStr = type == 'Dev' ? this.GetCommaSepratedSkills(this.currentRequestData.skillSet) : this.GetCommaSepratedSkills(this.currentRequestData.qaSkillSet);
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
}
