import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { HomeComponent } from "../home/home.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";
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

  constructor(private userService: UserService, private requestService: RequestService) {

  }

  ngOnInit() {
    
    this.ShowRequestDetails();
  }
  ShowRequestDetails() {
    debugger;
     console.log('In Request Detail Method')
    this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));

    });
    
  }

  ShowRequestList1() {
    debugger;
    this.messageEvent.emit({ ActivateTab: 'HOME' });
  }

}
