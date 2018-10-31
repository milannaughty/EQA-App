import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RequestService, UserService } from '../_services/index';
import { appConfig } from '../app.config';
import { CommonUtil, EmailManager } from '../app.util';

@Component({
  selector: 'app-team-panel-list',
  templateUrl: './team-panel-list.component.html',
  styleUrls: ['./team-panel-list.component.css']
})
export class TeamPanelListComponent implements OnInit {
  @Input() currentUser: any;
  @Output() messageEvent = new EventEmitter<any>();
  allPanel: any;
  loading: boolean;
  Name: any;
  panelSkill: any;
  panelSkillSet: any;
  isPanelSkillMore: boolean;
  obsoluteFlag: boolean = false;
  addedBy: any;
  isMakeActive: boolean = false;
  constructor(private requestService: RequestService, private userService: UserService) { }

  ngOnInit() {
    //debugger;
    this.getAllPanelList();
  }

  getAllPanelList() {
    this.loading=true;
    this.userService.getAllUsersByRole("panel").subscribe(result => {
      console.log(result);
      //debugger;
     var activePanelList= result.filter(x => !x["isDeleted"]);
      this.allPanel = activePanelList.map(x => {
        if (x["AddedBy"])
          x["AddedBy"].AdminUser = EmailManager.GetUserNameFromCommaSepratedEmailIds(x["AddedBy"].AdminUser);
        
        //debugger;
        x["isObsolute"] = x["obsolute"] == true
        return x;
      });
      this.loading=false;
      console.log(this.allPanel.obsolute);

    }, err => {
      console.log("error : " + err);
    });
  }
  SkillAlert(data) {
    var devstr = data.map(x => x.itemName).join(',');
    //debugger;
    var title = 'Panel Skill';
    var htmlContent = CommonUtil.GetTabularData(devstr, 4, title);
    CommonUtil.ShowInfoAlert('Panel Skills', htmlContent);
  }

  UpdatePanelStatus(id, isObsolute) {
    var set = {
      "obsolute": isObsolute,
      "panelId": id
    };
    this.userService.UpdatePanelStatus(set).subscribe(
      result => {
        this.loading = true;
        //debugger;
        console.log(result);
        CommonUtil.ShowSuccessAlert("Panel Updated Successfully.");
        this.loading = false;
        this.getAllPanelList();
      },
      error => {
        //debugger;
        this.loading = true;
        CommonUtil.ShowErrorAlert(error.error);
        this.loading = false;
      });
  }
  deletePanelDetails(id){
    //debugger;
    var set = {
      "isDeleted": true,
      "panelId": id
    };
    this.userService.panelSoftDelete(set).subscribe(
      result => {
        //debugger;
        this.loading = true;
        CommonUtil.ShowSuccessAlert("Panel Deleted Successfully.");
        this.loading = false;
        this.getAllPanelList();
      },
      error => {
        this.loading = true;
        CommonUtil.ShowErrorAlert(error.error);
        this.loading = false;
      });
  }
}
