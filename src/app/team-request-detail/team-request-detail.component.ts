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
    this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      this.isDevSkillMore = true;
      this.isQaSkillMore = true;
      this.loading = false
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
    });
  }
  ShowRequestList1() {
    debugger;
    this.messageEvent.emit({ ActivateTab: 'HOME' });
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
  getEmailfromDev() {
    var arr = this.currentRequestData.assignDevPanelList;
    console.log(arr);
  }

  showUserDeatail(recievedUserData) {
    debugger;
    this.userService.getById(recievedUserData.id).subscribe(result => {
      console.log(JSON.stringify(result));
      debugger;
      this.userDetailInfo(result);
    }, err => {
      console.log(JSON.stringify(err));
    });
    console.log(recievedUserData);
  }

  userDetailInfo(data) {
    var swal_html = `<div class="card">
    <canvas class="header-bg" width="250" height="70" id="header-blur"></canvas>
    <div class="avatar">
        <img src="data:image/jpeg;base64,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" alt="">
    </div>
    <div class="content">
        <p><div><b>IQA ${ data.panelType} Panel </b></div> <br>
        <div><b>${ data.username}</b></div></p>
        <p><button type="button" class="btn btn-success" (click)="test();" >Message</button> <button type="button" class="btn btn-info">Cancel</button></p>
    </div>
</div>`
    swal({
      title: EmailManager.GetUserNameFromCommaSepratedEmailIds(data.username),
      html: swal_html,
      showCancelButton: false,
      showConfirmButton: false
    });

  }

  test(){
    console.log('user click')
  }

}
