import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { RequestService, UserService, EmailService } from '../_services/index';
import { appConfig } from '../app.config';
import { CommonUtil } from '../app.util';

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
  constructor(private requestService: RequestService,
    private userService: UserService,
    private emailService: EmailService) { }

  ngOnInit() {
    debugger;
    this.getAllPanelList();
  }

  getAllPanelList() {
    this.userService.getAllUsersByRole("panel").subscribe(result => {
      console.log(result);
      this.allPanel = result;
     var abc= this.allPanel.AddedBy;
     debugger;
     console.log(abc);
    }, err => {
      console.log("error : " + err);
    });
  }
  SkillAlert(data) {
    var devstr = data.map(x => x.itemName).join(',');
    debugger;
    var title = 'Panel Skill';
    var htmlContent = CommonUtil.GetTabularData(devstr, 4, title);
    CommonUtil.ShowInfoAlert('Panel Skills', htmlContent);
  }
}
