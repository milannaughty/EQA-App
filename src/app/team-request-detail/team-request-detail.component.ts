import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
import { CommonUtil } from '../app.util';
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

      debugger;
      var devAssignEmailIdList = this.currentRequestData.assignedDevPanelList;
      var devAssignEmailIdList = this.currentRequestData.assignedDevPanelList.map(x => x.itemName).join(',');

      var qaAssignEmailIdList = this.currentRequestData.assignedQAPanelList.map(x => x.itemName).join(',');
      console.log(devAssignEmailIdList);
    });
  }

  ShowRequestList1() {
    debugger;
    this.messageEvent.emit({ ActivateTab: 'HOME' });
  }

  devSkillAlert() {
    //var devstr = '<div style="font-family:calibri;font-size:14px">' + this.currentRequestData.skillSet.map(x => x.itemName).join(',') + '<div>';
    var devstr = this.currentRequestData.skillSet.map(x => x.itemName).join(',');
    debugger;
    var title = 'Required Dev Skill';
    var htmlContent = CommonUtil.GetTabularData(devstr, 5, title);
    CommonUtil.ShowInfoAlert('Required Dev Skills', htmlContent);
    //  swal(" IQA required Dev Skill!", CommonUtil.GetTabularData(devstr, 5));
  }

  qaSkillAlert() {
    // var qaStr = '<div style="font-family:calibri;font-size:14px">' + this.currentRequestData.qaSkillSet.map(x => x.itemName).join(',') + '<div>';
    var qaStr = this.currentRequestData.qaSkillSet.map(x => x.itemName).join(',');
    var title = 'Required Qa Skill';
    var htmlContent = CommonUtil.GetTabularData(qaStr, 5, title);
    CommonUtil.ShowInfoAlert('Required QA Skills', htmlContent);
    //  swal("IQA required Qa skill !", CommonUtil.GetTabularData(qaStr, 5));
  }

  getEmailfromDev() {
    var arr = this.currentRequestData.assignDevPanelList;
    console.log(arr);
  }
}
