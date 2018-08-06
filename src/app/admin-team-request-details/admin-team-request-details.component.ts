import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { appConfig } from '../app.config';
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
  isDevSkillMore:boolean;
  isQaSkillMore:boolean;
  
  constructor(private userService: UserService,
    private requestService: RequestService,
    private emailService: EmailService) { }

  ngOnInit() {
    this.ShowRequestDetails();
  }
  ShowRequestDetails() {
    console.log(this.isSkillLoaded)
    this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      this.isDevSkillMore = true;
      this.isQaSkillMore = true;
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));

      var devstr = this.currentRequestData.skillSet.map(x => x.itemName).join(',');
      var arr = devstr.split(',');
      var count = arr.length;
      if (count <= 3) {
        this.isDevSkillMore = false;
      }
      this.devSkillSet = devstr.substring(0, CommonUtil.getNthIndexOfString(devstr, ',', 3));
      var qaStr = this.currentRequestData.qaSkillSet.map(x => x.itemName).join(',');
      var arr = qaStr.split(',');
      var count = arr.length;
      if (count <= 3) {
        this.isQaSkillMore = false;
      }
      this.qaSkillSet = qaStr.substring(0, CommonUtil.getNthIndexOfString(qaStr, ',', 3));
      this.devPanel = this.currentRequestData.assignedDevPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) }));
      this.qaPanel = this.currentRequestData.assignedQAPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) }));


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
    });
  }
  ShowRequestList() {
    this.messageEvent.emit({ ActivateTab: this.currentRequestData.CurrentActionName });
  }

  assignSelectedUsers() {
    console.log('In assignSelectedUsers start');
    var requestDto = {
      "_id": this.currentRequestData._id,
      "status": "PanelAssigned"
    };

    if (this.model.devSkillSetPanel)
      requestDto["assignedDevPanelList"] = this.model.devSkillSetPanel;
    if (this.model.qaSkillSetPanel)
      requestDto["assignedQAPanelList"] = this.model.qaSkillSetPanel;

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
            debugger;
            CommonUtil.ShowSuccessAlert('Request successfully assigned to Selected panels and Mail sent to selected panel list');
          }, error => {
            debugger;
            CommonUtil.ShowErrorAlert('Request successfully assigned to Selected panels and Error while sending Mail to selected panel list');
          });
        console.log('mail sending function ends here for Assigning QA and Dev to Request By admin');
        this.ShowRequestList()
      },
      err => {
        console.log('Updated requested completed with error.');
        console.log(err)
        CommonUtil.ShowErrorAlert('Error while assigning request to panel.');
        this.ShowRequestList()
      }
    );
  }
  devSkillAlert() {
    var devstr = this.currentRequestData.skillSet.map(x => x.itemName).join(',');
    debugger;
    var title = 'Required Dev Skill';
    var htmlContent = CommonUtil.GetTabularData(devstr, 5, title);
    CommonUtil.ShowInfoAlert('Required Dev Skills', htmlContent);
  }
  qaSkillAlert() {
    var qaStr = this.currentRequestData.qaSkillSet.map(x => x.itemName).join(',');
    var title = 'Required Qa Skill';
    var htmlContent = CommonUtil.GetTabularData(qaStr, 5, title);
    CommonUtil.ShowInfoAlert('Required QA Skills', htmlContent);
  }
  showUserDeatail(recievedUserData) {
    debugger;
    this.userService.getById(recievedUserData.id).subscribe(result => {
      console.log(JSON.stringify(result));
      debugger;
      EmailManager.userDetailInfo(result);
    }, err => {
      console.log(JSON.stringify(err));
    });
    console.log(recievedUserData);
  }
}
