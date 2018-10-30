import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { CommonUtil, EmailManager } from '../app.util';
import swal from 'sweetalert2';

@Component({
  selector: 'app-team-request-detail',
  templateUrl: './team-request-detail.component.html',
  styleUrls: ['./team-request-detail.component.css']
})

export class TeamRequestDetailComponent implements OnInit {
  @Input() currentRequestData: any;
  @Output() messageEvent = new EventEmitter<any>();
  model: any = {};
  qaSkillSetPanel: any;
  devSkillSetPanel: any;
  isSkillLoaded: boolean = false;
  devSkillSet: any;
  qaSkillSet: any;
  loading: boolean;
  isDevSkillMore: boolean;
  isQaSkillMore: boolean;
  assignDevPanelList: any;
  assignQaPanelList: any;
  devPanel: any;
  qaPanel: any;
  Infodeails: any;

  constructor(private userService: UserService, private requestService: RequestService) {

  }

  ngOnInit() {

    this.ShowRequestDetails();
  }
  ShowRequestDetails() {
    debugger;
    console.log('In Request Detail Method')
    this.loading = true
    this.userService.getPanelBySkills(this.currentRequestData.body.skillSet, this.currentRequestData.body.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      this.isDevSkillMore = true;
      this.isQaSkillMore = true;
      this.loading = false
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));
      var devstr = this.currentRequestData.body.skillSet.map(x => x.itemName).join(',');
      var arr = devstr.split(',');
      var count = arr.length;
      if (count <= 3) {
        this.isDevSkillMore = false;
      }
      this.devSkillSet = devstr.substring(0, CommonUtil.getNthIndexOfString(devstr, ',', 3));
      var qaStr = this.currentRequestData.body.qaSkillSet.map(x => x.itemName).join(',');
      var arr = qaStr.split(',');
      var count = arr.length;
      if (count <= 3) {
        this.isQaSkillMore = false;
      }
      this.qaSkillSet = qaStr.substring(0, CommonUtil.getNthIndexOfString(qaStr, ',', 3));
      this.devPanel = this.currentRequestData.body.assignedDevPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) }));
      this.qaPanel = this.currentRequestData.body.assignedQAPanelList.map(x => ({ id: x.id, emailId: x.itemName, fullName: EmailManager.GetUserNameFromCommaSepratedEmailIds(x.itemName) }));
    });
  }
  ShowRequestList1() {
    debugger;
    this.messageEvent.emit({ ActivateTab: 'HOME' });
  }

  devSkillAlert() {
    var devstr = this.currentRequestData.body.skillSet.map(x => x.itemName).join(',');
    debugger;
    var title = 'Required Dev Skill';
    var htmlContent = CommonUtil.GetTabularData(devstr, 5, title);
    CommonUtil.ShowInfoAlert('Required Dev Skills', htmlContent);
  }
  qaSkillAlert() {
    var qaStr = this.currentRequestData.body.qaSkillSet.map(x => x.itemName).join(',');
    var title = 'Required Qa Skill';
    var htmlContent = CommonUtil.GetTabularData(qaStr, 5, title);
    CommonUtil.ShowInfoAlert('Required QA Skills', htmlContent);
  }
  getEmailfromDev() {
    var arr = this.currentRequestData.body.assignDevPanelList;
    console.log(arr);
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
  test(){
    console.log('user click')
  }

}
