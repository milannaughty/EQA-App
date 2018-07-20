import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard.component";
import { UserService } from "../_services/user.service";
import { RequestService } from "../_services/request.service";

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
  isSkillLoaded: boolean = false;

  constructor(private userService: UserService, private requestService: RequestService) {

  }

  ngOnInit() {
    /* this.userBySkills = this.userService.GetPanelBySkills(this.currentRequestData.skillSet);
    console.log("users : "+this.userBySkills);
    */
    this.ShowRequestDetails();
  }
  ShowRequestDetails() {
    console.log(this.isSkillLoaded)
    this.userService.getPanelBySkills(this.currentRequestData.skillSet, this.currentRequestData.qaSkillSet).subscribe(result => {
      this.isSkillLoaded = true
      var r = result as Object[];
      this.qaSkillSetPanel = r.filter(x => x['panelType'] == 'QA').map((x, i) => ({ id: x["_id"], itemName: x["username"] }));
      this.devSkillSetPanel = r.filter(x => x['panelType'] == 'Dev').map(x => ({ id: x["_id"], itemName: x["username"] }));


      this.devDropdownSettings = {
        singleSelection: false,
        text: "Select Panel",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
      };

      this.qaDropdownSettings = {
        singleSelection: false,
        text: "Select Panel",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true
      };
    });
  }
  ShowRequestList() {
    debugger;
    this.messageEvent.emit({ ActivateTab: 'HOME' });
  }

  //  getPanelUserBySkills(){
  //    debugger;
  //     this.userService.getPanelBySkills(this.currentRequestData.skillSet).subscribe(result => {
  //       this.userBySkills = result;
  //       // this.loading = false;
  //       // this.NewRequest = result;
  //     });
  //     //  this.userBySkills = this.userService.GetPanelBySkills(this.currentRequestData.skillSet);
  //     //  return this.userBySkills;
  //  }  

  assignSelectedUsers() {
    console.log('In assignSelectedUsers start');
    debugger;
    var testObj = new Array('1', '2');
    // this.requestService.sendMail(testObj).subscribe(
    //   res => {
    //     console.log('Updated requested completed.');
    //     this.ShowRequestList()
    //   },
    //   err => {
    //     console.log('Updated requested completed with error.');
    //     console.log(err)
    //     this.ShowRequestList()
    //   }
    // );
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
        this.ShowRequestList()
      },
      err => {
        console.log('Updated requested completed with error.');
        console.log(err)
        this.ShowRequestList()
      }
    );
  }


}
